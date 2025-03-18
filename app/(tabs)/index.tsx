import { View, Text } from 'react-native'
import React from 'react'
import { useAuth } from '@clerk/clerk-expo'

export default function Index() {
 const { signOut } = useAuth()
  return (
    <View>
      <Text>Feed screen in tabs</Text>
      <Text onPress={()=>signOut()}>signout</Text>
    </View>
  )
}