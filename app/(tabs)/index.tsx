import { View, Text, TouchableOpacity, ScrollView, FlatList } from 'react-native'
import React from 'react'
import { useAuth } from '@clerk/clerk-expo'
import { styles } from '@/styles/feed.styles'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants/theme'
import { STORIES } from '@/constants/mock-data'
import Story from '@/components/story'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import Loader from '@/components/loader'
import Post from '@/components/post'

export default function Index() {
  const { signOut } = useAuth()
  const posts = useQuery(api.posts.getFeedPosts)
  if (posts === undefined) return <Loader />
  // if(posts.length === 0) return  <NoPostFound />
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
          ListHeaderComponent={<StoriesSection/>}
        />
   
    </View>
  );
}
const NoPostFound = () => {
  <View style={{
    flex: 1, backgroundColor: COLORS.background,
    justifyContent: 'center', alignItems: 'center'
  }}>
    <Text style={{ color: COLORS.primary, fontSize: 20 }}>No posts found</Text>
  
  </View>
}
const StoriesSection = () => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.storiesContainer}
    >
      {STORIES.map((story) => (
        <Story key={story.id} story={story} />
      ))}
    </ScrollView>
  )
}