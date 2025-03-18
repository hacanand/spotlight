import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";
 
const  http = httpRouter();
http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error("Missing webhook secret");
    }
    //check header
    const svix_id = request.headers.get("svix-id");
    const svix_timestamp = request.headers.get("svix-timestamp");
    const svix_signature = request.headers.get("svix-signature");
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response("Missing headers", { status: 400 });
    }

    const payload = await request.json();
    const body = JSON.stringify(payload);
    const wh = new Webhook(webhookSecret);
    let evt: any;
    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as any;
    } catch (e) {
      console.error(e);
      return new Response("Invalid signature", { status: 400 });
    }
    const eventType = evt.type;
    if (eventType === "user.created") {
      const { id, email_addresses, first_name, last_name, image_url } =
        evt.data;
      const email = email_addresses[0].email_address;
      const fullname = `${first_name || ""} ${last_name || ""}`.trim();
        try {
            
          await ctx.runMutation(api.users.createUser, {
              email:email,
              fullname:fullname,
              image: image_url,
              clerkId: id,
              username: email.split('@')[0]
            })
        return new Response("User created", { status: 200 });
      } catch (error) {
        return new Response("Failed to create user", { status: 500 });
      }
    }
    return new Response("webhook processed successfully", { status: 200 });
  }),
});

export default http;