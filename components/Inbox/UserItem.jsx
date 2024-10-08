import { View, Text, Image } from "react-native";
import React from "react";
import { Link } from "expo-router";
import Colors from "../../constants/Colors";

export default function UserItem({ userInfo }) {
  return (
    <View>
      <Link href={"/chat?id=" + userInfo.docId}>
        <View
          style={{
            marginVertical: 7,
            display: "flex",
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
          }}
        >
          <Image
            source={{ uri: userInfo.imageUrl }}
            style={{ height: 50, width: 50, borderRadius: 99 }}
          />
          <Text style={{ fontFamily: "outfit-regular", fontSize: 20 }}>
            {userInfo.name}
          </Text>
        </View>
      </Link>
      <View
        style={{
          borderWidth: 0.2,
          marginVertical: 7,
          borderColor: Colors.GRAY,
        }}
      ></View>
    </View>
  );
}
