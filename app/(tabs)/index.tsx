import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/feed.styles";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { FlatList, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import Loader from "@/components/loader";
import Post from "@/components/post";
import StoriesSection from "@/components/stories";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export default function Index() {
  const { signOut } = useAuth();
  const [refreshing, setRefreshing] = React.useState(false);
  const posts = useQuery(api.posts.getFeedPosts);
  if (posts === undefined) return <Loader />;
  if (posts.length === 0) return <NoPostFound />
  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }
    , 2000);
   }

  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>spotlight</Text>
        <TouchableOpacity onPress={() => signOut()}>
          <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={posts}
        renderItem={({ item }) => <Post post={item} />}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
        ListHeaderComponent={<StoriesSection />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}
          tintColor={COLORS.primary}
        />
        }

      />
    </View>
  );
}
const NoPostFound = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: COLORS.primary, fontSize: 20 }}>
        No posts found
      </Text>
    </View>
  );
};
