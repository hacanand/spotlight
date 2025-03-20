import { Id } from './_generated/dataModel'
import { mutation, MutationCtx, query, QueryCtx } from './_generated/server'
import { v } from 'convex/values'

export const createUser = mutation({
    args:
    {
        username: v.string(),
        fullname: v.string(),
        email: v.string(),
        bio: v.optional(v.string()),
        image: v.string(),
        clerkId: v.string(),
    },
    handler: async (ctx, args) => {
        const existingUser = await ctx.db.query('users')
            .withIndex("by_clerk_id", (q) => q.eq('clerkId', args.clerkId)).first()
        if (existingUser) 
           return
       
        //create a user in db
        await ctx.db.insert("users", {
            username: args.username,
            fullname: args.fullname,
            email: args.email, 
            bio: args.bio,
            image: args.image,
            clerkId: args.clerkId, 
            followers: 0,
            following: 0,
            posts: 0,
        })
    }
})

export const getUserByClerkId = query({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db.query('users').withIndex('by_clerk_id', (q) => q.eq('clerkId', args.clerkId)).unique();
        return user;
    }
})
export const updateProfile = mutation({
    args: {
        fullname: v.string(),
        bio:v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const currentUser = await getAuthenticatedUser(ctx);
        await ctx.db.patch(currentUser._id, {
            fullname: args.fullname,
            bio: args.bio
        })
    }
})

export const getUserProfile = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");
    return user;
  },
});

export const isFollowing = query({
  args: { followingId: v.id("users") },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);
    const follow = await ctx.db
      .query("follows")
      .withIndex("by_both", (q) =>
        q.eq("followersId", currentUser._id).eq("followingId", args.followingId)
      )
      .first();
    return !!follow;
  },
});
export const toggleFollow = mutation({
  args: { followingId: v.id("users") },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);
    const existing = await ctx.db
      .query("follows")
      .withIndex("by_both", (q) =>
        q.eq("followersId", currentUser._id).eq("followingId", args.followingId)
      )
      .first();
    if (existing) {
      await ctx.db.delete(existing._id);
      await updateFollowCounts(ctx, currentUser._id, args.followingId, false);
    } else {
      await ctx.db.insert("follows", {
        followersId: currentUser._id,
        followingId: args.followingId,
      });
      await updateFollowCounts(ctx, currentUser._id, args.followingId, true);
      //create a notification
      await ctx.db.insert("notifications", {
        receiverId: args.followingId,
        senderId: currentUser._id,
        type: "follow",
      });
    }
  },
});

async function updateFollowCounts(
  ctx: MutationCtx,
  followersId: Id<"users">,
  followingId: Id<"users">,
  isFollow: boolean
) {
  const followers = await ctx.db.get(followersId);
  const following = await ctx.db.get(followingId);
  if (!followers || !following) return;
  await ctx.db.patch(followersId, {
    following: isFollow
      ? followers.following + 1
      : Math.max(0, followers.following - 1),
  });
  await ctx.db.patch(followingId, {
    followers: isFollow
      ? following.followers + 1
      : Math.max(0, following.followers - 1),
  });
}


export async function getAuthenticatedUser(ctx:QueryCtx| MutationCtx
) {
    
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }
        const currentUser = await ctx.db.query('users').withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject)).first();
        if (!currentUser) {
            throw new Error("User not found");
        }
        return currentUser
       
}

