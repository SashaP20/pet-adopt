import { View, Text, Image, Pressable } from "react-native";
import React from "react";
import Colors from "../../constants/Colors";
import * as WebBrowser from "expo-web-browser";

import { Link } from "expo-router";
import { useOAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { useCallback } from "react";
export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    // Warm up the android browser to improve UX
    // https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

const Login = () => {
  useWarmUpBrowser();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onPress = useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow({
          redirectUrl: Linking.createURL("/(tabs)/home", { scheme: "myapp" }),
        });

      if (createdSessionId) {
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);

  return (
    <View
      style={{
        backgroundColor: Colors.WHITE,
        height: "100%",
      }}
    >
      <Image
        source={require("../../assets/images/login.png")}
        style={{ width: "100%", height: 500 }}
      />
      <View style={{ padding: 20, display: "flex", alignItems: "center" }}>
        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 30,
          }}
        >
          Ready to make a new friend?
        </Text>
        <Text
          style={{
            fontFamily: "outfit-regular",
            fontSize: 18,
            textAlign: "center",
            color: Colors.GRAY,
          }}
        >
          let's adopt the pet which you like and make there life happy again
        </Text>
      </View>

      <Pressable
        onPress={onPress}
        style={{
          padding: 14,
          margin: 20,
          marginTop: 100,
          backgroundColor: Colors.PRIMARY,
          width: "90%",
          borderRadius: 14,
        }}
      >
        <Text
          style={{
            fontFamily: "outfit-medium",
            fontSize: 30,
            textAlign: "center",
          }}
        >
          Get Started
        </Text>
      </Pressable>
    </View>
  );
};

export default Login;
