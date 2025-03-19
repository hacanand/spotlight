import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React from "react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Loader from "@/components/loader";
import { styles } from "@/styles/notifications.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { Link } from "expo-router";
import { Image } from "expo-image";

const Notifications = () => {
  const notifications = useQuery(api.notifications.getNotifications);
  if (notifications === undefined) {
    return <Loader />;
  }
  if (notifications.length === 0) {
    return <NoNotificationsFound />;
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>
      <FlatList
        data={notifications}
        renderItem={({ item }) => <NotificationItem notification={item} />}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

type NotificationItemProps = {
  notification: {
    _id: string;
    sender: {
      _id: string;
      username: string;           
      image: string;
    };
    type: string;
    postId: string;
    commentId: string;
  };
};
function NotificationItem({ notification }: any) {
  return (
    <View style={styles.notificationItem}>
      <View style={styles.notificationContent}>
        <Link href={"/notifications"} asChild>
          <TouchableOpacity style={styles.avatarContainer}>
            <Image
              source={{ uri: notification.sender.image }}
              style={styles.avatar}
              contentFit="cover"
              transition={200}
              cachePolicy="memory-disk"
            />
            <View style={styles.iconBadge}>
              {notification.type === "like" ? (
                <Ionicons name="heart" size={14} color={COLORS.primary} />
              ) : notification.type === "follow" ? (
                <Ionicons name="person-add" size={14} color="#8B5CF6" />
              ) : (
                <Ionicons name="chatbubble" size={14} color="#3B82f6" />
              )}
            </View>
          </TouchableOpacity>
        </Link>
        <View style={styles.notificationInfo}>
          <Link href={`/notifications`} asChild>
            <TouchableOpacity>
              <Text style={styles.username}>{notification.sender.username }</Text>
            </TouchableOpacity>
          </Link>
          <Text style={styles.action}>
            {notification.type === 'follow'
              ? 'started following you'
              : notification.type === 'like'
              ? 'liked your post'
              : 'commented : ' + notification.comment}
          </Text>
        </View>
      </View>
    </View>
  );
}

function NoNotificationsFound() {
  return (
    <View style={[styles.container, styles.centered]}>
      <Ionicons name="notifications-outline" size={48} color={COLORS.primary} />

      <Text style={{ fontSize: 20, color: COLORS.white }}>
        No notifications yet
      </Text>
    </View>
  );
}
export default Notifications;
