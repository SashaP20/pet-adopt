import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useEffect } from "react";
import {
  router,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import PetInfo from "../../components/PetDetails/PetInfo";
import PetSubInfo from "../../components/PetDetails/PetSubInfo";
import AboutPet from "../../components/PetDetails/AboutPet";
import OwnerInfo from "../../components/PetDetails/OwnerInfo";
import Colors from "../../constants/Colors";
import { useUser } from "@clerk/clerk-expo";
import {
  collection,
  getDocs,
  query,
  setDoc,
  where,
  doc,
} from "firebase/firestore";
import { db } from "../../config/FireBaseConfig";

export default function PetDetails() {
  const pet = useLocalSearchParams();
  const navigation = useNavigation();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "",
    });
  });
  const initateChat = async () => {
    // בדיקה אם המשתמש וה-pet מוגדרים לפני יצירת ה-docId
    if (!user?.primaryEmailAddress?.emailAddress || !pet?.userEmail) {
      console.error("Missing user or pet information");
      return;
    }

    const docId1 =
      user?.primaryEmailAddress?.emailAddress + "_" + pet?.userEmail;
    const docId2 =
      pet?.userEmail + "_" + user?.primaryEmailAddress?.emailAddress;

    const q = query(
      collection(db, "Chat"),
      where("id", "in", [docId1, docId2])
    );

    const querySnapShot = await getDocs(q);
    querySnapShot.forEach((doc) => {
      router.push({
        pathname: "/chat",
        params: { id: doc.id }, // שימוש ב-id שנמצא
      });
    });

    if (querySnapShot.empty) {
      await setDoc(doc(db, "Chat", docId1), {
        id: docId1,
        users: [
          {
            email: user?.primaryEmailAddress?.emailAddress,
            imageUrl: user?.imageUrl,
            name: user?.fullName,
          },
          {
            email: pet?.userEmail,
            imageUrl: pet?.userImage,
            name: pet?.userName,
          },
        ],
        userIds: [user?.primaryEmailAddress?.emailAddress, pet?.userEmail],
      });

      router.push({ pathname: "/chat", params: { id: docId1 } });
    }
  };
  return (
    <View>
      <ScrollView>
        {/* Pet Info */}
        <PetInfo pet={pet} />

        {/* Pet Sub Info */}
        <PetSubInfo pet={pet} />

        {/* About */}
        <AboutPet pet={pet} />

        {/* Owner Details */}
        <OwnerInfo pet={pet} />
        <View style={{ height: 70 }}></View>
      </ScrollView>
      <View style={styles.bottomContainer}>
        <TouchableOpacity onPressOut={initateChat} style={styles.adoptBtn}>
          <Text
            style={{
              textAlign: "center",
              fontFamily: "outfit-medium",
              fontSize: 20,
            }}
          >
            Adopt Me
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  adoptBtn: {
    padding: 15,
    backgroundColor: Colors.PRIMARY,
  },
  bottomContainer: {
    position: "absolute",
    width: "100%",
    bottom: 0,
  },
});
