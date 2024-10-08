// import { useUser } from "@clerk/clerk-expo";
// import { Link, Redirect, useRootNavigationState } from "expo-router";
// import { useEffect } from "react";
// import { Pressable, Text, View } from "react-native";

// export default function Index() {
//   const { user } = useUser();
//   const rootNavigationState = useRootNavigationState();

//   useEffect(() => {
//     CheckNavLoaded();
//     console.log(user);
//   }, []);

//   const CheckNavLoaded = () => {
//     if (!rootNavigationState.key) return null;
//   };
//   return (
//     user && (
//       <View style={{ flex: 1 }}>
//         <Text>{user?.fullName}</Text>
//         {user ? (
//           <Redirect href={"/(tabs)/home"} />
//         ) : (
//           <Redirect href={"/login/index"} />
//         )}
//       </View>
//     )
//   );
// }

import { useUser } from "@clerk/clerk-expo";
import { Link, Redirect, useRootNavigationState } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View, ActivityIndicator } from "react-native";

export default function Index() {
  const { user, isLoaded } = useUser(); // isLoaded tells if user is fully fetched
  const rootNavigationState = useRootNavigationState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    CheckNavLoaded();
    if (isLoaded) {
      setLoading(false); // Once user is loaded, stop loading
    }
  }, [isLoaded]);

  const CheckNavLoaded = () => {
    if (!rootNavigationState.key) return null;
  };

  if (loading) {
    // Show a loading indicator while user is being fetched
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    user && (
      <View style={{ flex: 1 }}>
        {user ? (
          <>
            <Text>{user?.fullName}</Text>
            <Redirect href={"/(tabs)/home"} />
          </>
        ) : (
          <Redirect href={"/login"} />
        )}
      </View>
    )
  );
}
