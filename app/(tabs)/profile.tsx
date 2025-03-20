 import {
   View,
   Text,
   TouchableOpacity,
   FlatList,
   Modal,
   TouchableWithoutFeedback,
   Keyboard,
   KeyboardAvoidingView,
   TextInput,
 } from "react-native";
 import React from "react";
 import { useAuth } from "@clerk/clerk-expo";
 import { useMutation, useQuery } from "convex/react";
 import { api } from "@/convex/_generated/api";
 import { Doc } from "@/convex/_generated/dataModel";
 import Loader from "@/components/loader";
 import { styles } from "@/styles/profile.styles";
 import { Ionicons } from "@expo/vector-icons";
 import { COLORS } from "@/constants/theme";
 import { Image } from "expo-image";

 export default function Profile() {
   const { signOut, userId } = useAuth();
   const [isEditModalVisible, setIsEditModalVisible] = React.useState(false);
   const currentUser = useQuery(
     api.users.getUserByClerkId,
     userId ? { clerkId: userId } : "skip"
   );
   const [editedProfile, setEditedProfile] = React.useState({
     fullname: currentUser?.fullname || "",
     bio: currentUser?.bio || "",
   });
   const [selectedPost, setSelectedPost] = React.useState<Doc<"posts"> | null>(
     null
   );
   const posts = useQuery(api.posts.getpostsByUser, {});
   const updateProfile = useMutation(api.users.updateProfile);

   const handleSaveProfile = async () => {
     await updateProfile(editedProfile);
     setIsEditModalVisible(false);
   };

   if (!currentUser || posts === undefined) return <Loader />;

   return (
     <View style={styles.container}>
       <FlatList
         data={posts}
         numColumns={3}
         ListHeaderComponent={
           <>
             <View style={styles.header}>
               <View style={styles.headerLeft}>
                 <Text style={styles.username}>{currentUser.username}</Text>
               </View>
               <View style={styles.headerRight}>
                 <TouchableOpacity
                   onPress={() => signOut()}
                   style={styles.headerIcon}
                 >
                   <Ionicons
                     name="log-out-outline"
                     size={24}
                     color={COLORS.white}
                   />
                 </TouchableOpacity>
               </View>
             </View>

             <View style={styles.profileInfo}>
               <View style={styles.avatarAndStats}>
                 <View style={styles.avatarContainer}>
                   <Image
                     source={currentUser.image}
                     style={styles.avatar}
                     contentFit="cover"
                     transition={200}
                   />
                 </View>
                 <View style={styles.statsContainer}>
                   <View style={styles.statItem}>
                     <Text style={styles.statNumber}>{currentUser.posts}</Text>
                     <Text style={styles.statLabel}>Posts</Text>
                   </View>
                   <View style={styles.statItem}>
                     <Text style={styles.statNumber}>
                       {currentUser.followers}
                     </Text>
                     <Text style={styles.statLabel}>Followers</Text>
                   </View>
                   <View style={styles.statItem}>
                     <Text style={styles.statNumber}>
                       {currentUser.following}
                     </Text>
                     <Text style={styles.statLabel}>Following</Text>
                   </View>
                 </View>
               </View>

               <Text style={styles.name}>{currentUser.fullname}</Text>
               {currentUser.bio && (
                 <Text style={styles.bio}>{currentUser.bio}</Text>
               )}

               <View style={styles.actionButtons}>
                 <TouchableOpacity
                   onPress={() => setIsEditModalVisible(true)}
                   style={styles.editButton}
                 >
                   <Text style={styles.editButtonText}>Edit Profile</Text>
                 </TouchableOpacity>
                 <TouchableOpacity style={styles.shareButton}>
                   <Ionicons
                     name="share-outline"
                     size={20}
                     color={COLORS.white}
                   />
                 </TouchableOpacity>
               </View>
             </View>
             {posts.length === 0 && <NoPostsFound />}
           </>
         }
         renderItem={({ item }) => (
           <TouchableOpacity
             onPress={() => setSelectedPost(item)}
             style={styles.gridItem}
           >
             <Image
               source={item.imageUrl}
               style={styles.gridImage}
               contentFit="cover"
               transition={200}
             />
           </TouchableOpacity>
         )}
         keyExtractor={(item) => item._id}
         nestedScrollEnabled={true} // ✅ Fixes nested VirtualizedLists warning
       />

       {/* Edit Profile Modal */}
       <Modal
         visible={isEditModalVisible}
         animationType="slide"
         transparent={true}
         onRequestClose={() => setIsEditModalVisible(false)}
       >
         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
           <KeyboardAvoidingView
             behavior="padding"
             style={styles.modalContainer}
           >
             <View style={styles.modalContent}>
               <View style={styles.modalHeader}>
                 <Text style={styles.modalTitle}>Edit Profile</Text>
                 <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                   <Ionicons name="close" size={24} color={COLORS.white} />
                 </TouchableOpacity>
               </View>

               <View style={styles.inputContainer}>
                 <Text style={styles.inputLabel}>Name</Text>
                 <TextInput
                   style={styles.input}
                   value={editedProfile.fullname}
                   onChangeText={(text) =>
                     setEditedProfile({ ...editedProfile, fullname: text })
                   }
                   placeholderTextColor={COLORS.grey}
                 />
               </View>

               <View style={styles.inputContainer}>
                 <Text style={styles.inputLabel}>Bio</Text>
                 <TextInput
                   style={[styles.input, styles.bioInput]}
                   value={editedProfile.bio}
                   onChangeText={(text) =>
                     setEditedProfile({ ...editedProfile, bio: text })
                   }
                   multiline
                   numberOfLines={4}
                   placeholderTextColor={COLORS.grey}
                 />
               </View>

               <TouchableOpacity
                 onPress={handleSaveProfile}
                 style={styles.saveButton}
               >
                 <Text style={styles.saveButtonText}>Save Changes</Text>
               </TouchableOpacity>
             </View>
           </KeyboardAvoidingView>
         </TouchableWithoutFeedback>
       </Modal>

       {/* Selected Post Modal */}
       <Modal
         visible={!!selectedPost}
         animationType="fade"
         transparent={true}
         onRequestClose={() => setSelectedPost(null)}
       >
         <View style={styles.modalBackdrop}>
           {selectedPost && (
             <View style={styles.postDetailContainer}>
               <View style={styles.postDetailHeader}>
                 <TouchableOpacity onPress={() => setSelectedPost(null)}>
                   <Ionicons name="close" size={24} color={COLORS.white} />
                 </TouchableOpacity>
               </View>
               <Image
                 source={selectedPost.imageUrl}
                 style={styles.postDetailImage}
                 contentFit="cover"
                 transition={200}
                 cachePolicy="memory-disk"
               />
             </View>
           )}
         </View>
       </Modal>
     </View>
   );
 }

 function NoPostsFound() {
   return (
     <View
       style={{
         height: "100%",
         backgroundColor: COLORS.background,
         justifyContent: "center",
         alignItems: "center",
       }}
     >
       <Ionicons name="images-outline" size={48} color={COLORS.primary} />
       <Text style={{ fontSize: 20, color: COLORS.white }}>No posts yet</Text>
     </View>
   );
 }
