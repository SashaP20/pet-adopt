import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { db } from "../../config/FireBaseConfig";
import { useNavigation } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import {
  getDocs,
  query,
  where,
  collection,
  deleteDoc,
  doc,
} from "firebase/firestore";
import PetListItem from "../../components/Home/PetListItem";
import Colors from "../../constants/Colors";

export default function UserPost() {
  const { user } = useUser();
  const [userPost, setUserPost] = useState([]);
  const navigation = useNavigation();
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    navigation.setOptions({ headerTitle: "User Post" });
    user && getUserPost();
  }, [user]);
  const getUserPost = async () => {
    setLoader(true);
    setUserPost([]);
    const q = query(
      collection(db, "Pets"),
      where("userEmail", "==", user?.primaryEmailAddress?.emailAddress)
    );
    const querySnapShot = await getDocs(q);
    querySnapShot.forEach((doc) => {
      setUserPost((prev) => [...prev, doc.data()]);
    });
    setLoader(false);
  };

  const onDeletePost = (docId) => {
    console.log(docId);
    Alert.alert(
      "Do you want to delete?",
      "Do you really want to delete this post?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Click"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => deletePost(docId),
        },
      ]
    );
  };

  const deletePost = async (docId) => {
    await deleteDoc(doc(db, "Pets", docId));
    getUserPost();
  };
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontFamily: "outfit-medium", fontSize: 30 }}>
        UserPost
      </Text>
      <FlatList
        data={userPost}
        numColumns={2}
        refreshing={loader}
        onRefresh={getUserPost}
        renderItem={({ item, index }) => (
          <View>
            <PetListItem pet={item} />
            <Pressable
              onPress={() => onDeletePost(item?.id)}
              style={styles.deleteButton}
            >
              <Text
                style={{
                  fontFamily: "outfit-medium",
                  textAlign: "center",
                  fontSize: 15,
                }}
              >
                Delete
              </Text>
            </Pressable>
          </View>
        )}
      />
      {userPost?.length == 0 && (
        <Text style={{ fontSize: 20 }}>No Post Found</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  deleteButton: {
    backgroundColor: Colors.LIGHT_PRIMARY,
    padding: 5,
    borderRadius: 7,
    marginTop: 5,
    marginRight: 10,
  },
});
