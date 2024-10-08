import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  ToastAndroid,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import Colors from "../../constants/Colors";
import { Picker } from "@react-native-picker/picker";
import { db, storage } from "../../config/FireBaseConfig";
import { getDocs, collection, doc, setDoc } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useUser } from "@clerk/clerk-expo";

export default function AddNewPet() {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    category: "Dogs",
    sex: "male",
  });
  const [gender, setGender] = useState();
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [image, setImage] = useState();
  const [loader, setLoader] = useState(false);
  const { user } = useUser();
  const router = useRouter();
  useEffect(() => {
    navigation.setOptions({ headerTitle: "Add New Pet" });
    GetCategories();
  }, []);

  const GetCategories = async () => {
    setCategoryList([]);
    const snapshot = await getDocs(collection(db, "Category"));
    snapshot.forEach((doc) => {
      setCategoryList((categoryList) => [...categoryList, doc.data()]);
    });
  };
  const imagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  const handleInputChange = (fieldName, fieldValue) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };

  const onSubmit = () => {
    if (Object.keys(formData).length != 8) {
      Alert.alert("Error", "Enter All Details");
      return;
    }
    uploadImage();
  };

  const uploadImage = async () => {
    setLoader(true);
    const resp = await fetch(image);
    const blobImage = await resp.blob();
    const storageRef = ref(storage, Date.now() + ".jpg");
    uploadBytes(storageRef, blobImage)
      .then((snapshot) => {
        console.log("File Uploaded");
      })
      .then((resp) => {
        getDownloadURL(storageRef).then(async (downloadUrl) => {
          console.log(downloadUrl);
          saveFormData(downloadUrl);
        });
      });
  };

  const saveFormData = async (imageUrl) => {
    const docId = Date.now().toString();
    await setDoc(doc(db, "Pets", docId), {
      ...formData,
      imageUrl: imageUrl,
      username: user?.fullName,
      userEmail: user?.primaryEmailAddress.emailAddress,
      id: docId,
    });
    setLoader(false);
    router.replace("/(tabs)/home");
  };
  return (
    <ScrollView style={{ padding: 20 }}>
      <Text
        style={{
          fontFamily: "outfit-medium",
          fontSize: 20,
        }}
      >
        Add New Pet for adoption
      </Text>
      <Pressable onPress={imagePicker}>
        {!image ? (
          <Image
            source={require("../../assets/images/placeholder.png")}
            style={{
              width: 100,
              height: 100,
              borderRadius: 15,
              borderWidth: 1,
              borderColor: Colors.GRAY,
            }}
          />
        ) : (
          <Image
            source={{ uri: image }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 15,
              borderWidth: 1,
              borderColor: Colors.GRAY,
            }}
          />
        )}
      </Pressable>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Pet Name *</Text>
        <TextInput
          style={styles.input}
          onChangeText={(value) => handleInputChange("name", value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Breed *</Text>
        <TextInput
          style={styles.input}
          onChangeText={(value) => handleInputChange("breed", value)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Gender *</Text>

        <Picker
          selectedValue={selectedCategory}
          style={styles.input}
          onValueChange={(itemValue, itemIndex) => {
            setSelectedCategory(itemValue);
            handleInputChange("category", itemValue);
          }}
        >
          {categoryList.map((category, index) => (
            <Picker.Item
              key={index}
              label={category.name}
              value={category.name}
            />
          ))}
        </Picker>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Age *</Text>
        <TextInput
          keyboardType="number-pad"
          style={styles.input}
          onChangeText={(value) => handleInputChange("age", value)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Gender *</Text>

        <Picker
          selectedValue={gender}
          style={styles.input}
          onValueChange={(itemValue, itemIndex) => {
            setGender(itemValue);
            handleInputChange("sex", itemValue);
          }}
        >
          <Picker.Item label="Male" value="Male" />
          <Picker.Item label="Female" value="Female" />
        </Picker>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Weight *</Text>
        <TextInput
          keyboardType="number-pad"
          style={styles.input}
          onChangeText={(value) => {
            handleInputChange("weight", value);
          }}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Address *</Text>
        <TextInput
          style={styles.input}
          onChangeText={(value) => handleInputChange("address", value)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>About *</Text>
        <TextInput
          style={styles.input}
          numberOfLines={5}
          multiline={true}
          onChangeText={(value) => handleInputChange("about", value)}
        />
      </View>
      <TouchableOpacity
        disabled={loader}
        onPress={onSubmit}
        style={styles.button}
      >
        {loader ? (
          <ActivityIndicator size={"large"} />
        ) : (
          <Text style={{ textAlign: "center", fontFamily: "outfit-medium" }}>
            Submit
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 5,
  },
  input: { padding: 10, backgroundColor: Colors.WHITE, borderRadius: 7 },
  label: { marginVertical: 5, fontFamily: "outfit-regular" },
  button: {
    padding: 15,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 7,
    marginVertical: 10,
    marginBottom: 50,
  },
});
