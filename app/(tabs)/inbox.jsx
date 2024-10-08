import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/FireBaseConfig";
import { useUser } from "@clerk/clerk-expo";
import UserItem from "../../components/Inbox/UserItem";
import Colors from "../../constants/Colors";

const Inbox = () => {
  const { user } = useUser();
  const [userList, setUserList] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    user && getUserList();
  }, [user]);
  // Get User List Depends on User Emails
  const getUserList = async () => {
    setLoader(true);
    setUserList([]);
    const q = query(
      collection(db, "Chat"),
      where(
        "userIds",
        "array-contains",
        user?.primaryEmailAddress?.emailAddress
      )
    );

    const querySnapShot = await getDocs(q);
    querySnapShot.forEach((doc) => {
      setUserList((prevList) => [...prevList, doc.data()]);
    });
    setLoader(false);
  };

  // Filter out the list of Other User in one state
  const mapOtherUserList = () => {
    const list = [];
    userList.forEach((record) => {
      const otherUser = record.users?.filter(
        (user) => user?.email != user?.primaryEmailAddressr?.emailAddress
      );
      const result = {
        docId: record.id,
        ...otherUser[1],
      };
      list.push(result);
    });
    return list;
  };
  return (
    <View style={{ padding: 20, marginTop: 20 }}>
      <Text
        style={{
          fontFamily: "outfit-medium",
          fontSize: 30,
        }}
      >
        Inbox
      </Text>
      <View style={{ borderWidth: 1, borderColor: "Black" }}></View>
      <FlatList
        data={mapOtherUserList()}
        refreshing={loader}
        onRefresh={getUserList}
        style={{ marginTop: 20 }}
        renderItem={({ item, index }) => (
          <UserItem userInfo={item} key={index} />
        )}
      />
    </View>
  );
};

export default Inbox;
