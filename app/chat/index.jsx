import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../config/FireBaseConfig";
import { useUser } from "@clerk/clerk-expo";
import { GiftedChat } from "react-native-gifted-chat";
import moment from "moment";

export default function ChatScreen() {
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  useEffect(() => {
    getUserDetails();
    const unsubscribe = onSnapshot(
      collection(db, "Chat", params?.id, "Messages"),
      (snapshot) => {
        const messageData = snapshot.docs.map((doc) => ({
          _id: doc.id,
          ...doc.data(),
        }));
        setMessages(messageData);
      }
    );
    return () => unsubscribe();
  }, []);
  const getUserDetails = async () => {
    const docRef = doc(db, "Chat", params?.id);
    const docSnapShot = await getDoc(docRef);
    const result = docSnapShot.data();
    const otherUser = result?.users.filter(
      (item) => item.email != user?.primaryEmailAddress.emailAddress
    );
    navigation.setOptions({
      headerTitle: otherUser[0].name,
    });
  };
  const onSend = async (newMessage) => {
    setMessages((previousMessage) =>
      GiftedChat.append(previousMessage, newMessage)
    );
    newMessage[0].createdAt = moment().format("MM-DD-YYYY HH:mm:ss");
    await addDoc(collection(db, "Chat", params.id, "Messages"), newMessage[0]);
  };
  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      showUserAvatar={true}
      user={{
        _id: user?.primaryEmailAddress?.emailAddress,
        name: user?.fullName,
        avatar: user?.imageUrl,
      }}
    />
  );
}
// import { View, Text } from "react-native";
// import React, { useEffect, useState } from "react";
// import { useLocalSearchParams, useNavigation } from "expo-router";
// import {
//   addDoc,
//   collection,
//   doc,
//   getDoc,
//   onSnapshot,
//   query,
//   orderBy,
// } from "firebase/firestore";
// import { db } from "../../config/FireBaseConfig";
// import { useUser } from "@clerk/clerk-expo";
// import { GiftedChat } from "react-native-gifted-chat";
// import moment from "moment-timezone"; // ייבוא moment-timezone
// import { serverTimestamp } from "firebase/firestore"; // ייבוא serverTimestamp

// export default function ChatScreen() {
//   const { user } = useUser();
//   const [messages, setMessages] = useState([]);
//   const params = useLocalSearchParams();
//   const navigation = useNavigation();

//   useEffect(() => {
//     getUserDetails();

//     const q = query(
//       collection(db, "Chat", params?.id, "Messages"),
//       orderBy("createdAt", "desc")
//     );

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const messageData = snapshot.docs.map((doc) => {
//         const data = doc.data();
//         return {
//           _id: doc.id,
//           ...data,
//           // שימוש ב-moment להמרה לאזור הזמן המקומי
//           createdAt: data.createdAt?.toDate
//             ? moment(data.createdAt.toDate()).tz("Asia/Jerusalem").toDate()
//             : new Date(),
//         };
//       });
//       setMessages(messageData);
//     });

//     return () => unsubscribe();
//   }, []);

//   const getUserDetails = async () => {
//     const docRef = doc(db, "Chat", params?.id);
//     const docSnapShot = await getDoc(docRef);
//     const result = docSnapShot.data();
//     const otherUser = result?.users.filter(
//       (item) => item.email != user?.primaryEmailAddress.emailAddress
//     );
//     navigation.setOptions({
//       headerTitle: otherUser[0]?.name || "Chat",
//     });
//   };

//   const onSend = async (newMessage) => {
//     // שימוש ב-moment כדי להציג את השעה המקומית בצ'אט
//     const localTime = moment().tz("Asia/Jerusalem").toDate();

//     // הוספת ההודעה ל-state עם הזמן המקומי שנוצר על ידי moment
//     setMessages((previousMessage) =>
//       GiftedChat.append(previousMessage, [
//         {
//           ...newMessage[0],
//           createdAt: localTime, // שימוש בזמן מקומי
//         },
//       ])
//     );

//     // שמירת ההודעה ב-Firebase עם serverTimestamp
//     const messageToSave = {
//       ...newMessage[0],
//       createdAt: serverTimestamp(), // שמירת זמן השרת בפועל
//     };

//     await addDoc(collection(db, "Chat", params.id, "Messages"), messageToSave);
//   };

//   return (
//     <GiftedChat
//       messages={messages}
//       onSend={(messages) => onSend(messages)}
//       showUserAvatar={true}
//       user={{
//         _id: user?.primaryEmailAddress?.emailAddress,
//         name: user?.fullName,
//         avatar: user?.imageUrl,
//       }}
//     />
//   );
// }
