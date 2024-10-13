import { Text, View, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { Stack } from "expo-router";
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

export default function Index() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>();
  const [currentPage, setCurrentPage] = useState<"Sign-In" | "Home" | "Error">("Sign-In"); // Initialize with "Sign-In"

  const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
    console.log('onAuthStateChanged', user);
    setUser(user);
    if (initializing) {
      setInitializing(false);
    }
    // Set currentPage based on user authentication status
    if (user) {
      setCurrentPage("Sign-In"); // Change to "Home" if user is authenticated
    } else {
      setCurrentPage("Home"); // Keep it as "Sign-In" if not authenticated
    }
  }

  useEffect(() => {
    const sub = auth().onAuthStateChanged(onAuthStateChanged);
    return sub;
  })

  if (initializing) {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flex:1,
        }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (currentPage === "Sign-In") {
    return (
      <Stack>
        <Stack.Screen name="index" />
      </Stack>
    );

  } else if (currentPage === "Home") {
    return (
      <Stack>
        <Stack.Screen name="home" />
      </Stack>
    );
  }
  
}