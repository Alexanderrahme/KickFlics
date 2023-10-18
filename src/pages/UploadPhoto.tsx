import React, { useRef, useState, useEffect } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image, Alert, Pressable} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Asset } from 'expo-asset';
import * as tf from '@tensorflow/tfjs';
import { decodeJpeg } from '@tensorflow/tfjs-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import labels from '../model/labels.json';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {useNavigation} from "@react-navigation/native";
import Results from "./Results";
import ResultsNavigator from "../../ResultsNavigator";
import * as ImageManipulator from 'expo-image-manipulator';
import axios from 'axios';




const UploadPhoto: React.FC = () => {
  const nav = useNavigation();

  // Set up relevant variables
  const [TfReady, setTfReady] = useState(false);
  const [result, setResult] = useState('');
  const [pickedImage, setPickedImage] = useState('');
  const [shoe, setShoe] = useState('');
  // Initialise tensorflow
  useEffect(() => {
    const initTFLite = async () => {
      await tf.ready();

      setTfReady(true);
    };

    initTFLite();
  }, []);

  // Allows a user to upload an image from their camera roll
  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true
      // with base64 we can skip some of the pre-processing later on
    });
  
    // Pass selected image to ML function and view
    if (result.assets && result.assets.length > 0) {
      const imagePath = result.assets[0].uri;
      setPickedImage(imagePath)

      const base64Data = result.assets[0].base64;
      

      if (base64Data) {
        classifyPhoto(base64Data);
      } else {
        console.error('Error line 57');
      }
  }
  };


  // Sends image data to cloud
  const classifyPhoto = async (base64Data: string) => {
    try {      
      let url = 'https://australia-southeast1-global-bridge-402207.cloudfunctions.net/api_predict';
      const imageData = {
        image: base64Data,
      };
  
      console.log("Sending data")
      const response = await axios.post(url, imageData);
      console.log(response.data);
  
    } catch (err) {
      console.log(err);
    }
  };

 // Tests communicating with cloud
// const classifyPhoto = async (imagePath: string) => {
//   try {
//     console.log("Pre processing data");

//       const jsonData = {
//         name: 'Oliver', 
//     };
//     let testUrl = 'https://australia-southeast1-global-bridge-402207.cloudfunctions.net/TestReact';
//     const response = await axios.post(testUrl, jsonData);
//     console.log(response.data);

//   } catch (err) {
//     console.log(err);
//   }
// };

 // Tests communicating with cloud
// const classifyPhoto = async (imagePath: string) => {
//   try {
//     console.log("Pre processing data");

//       const jsonData = {
//         name: 'Oliver', 
//     };
//     let testUrl = 'https://australia-southeast1-global-bridge-402207.cloudfunctions.net/TestReact';
//     const response = await axios.post(testUrl, jsonData);
//     console.log(response.data);

//   } catch (err) {
//     console.log(err);
//   }
// };

  const resultsButtonPress = () => {
    nav.navigate("Your Flic", {shoe: shoe, pickedImage: pickedImage});
  };
  return (
    <SafeAreaView style={styles.container}>
          <View
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
       justifyContent: 'center',
      }}
    >
      {pickedImage !== '' && (
        <Image
          source={{ uri: pickedImage }}
          style={{ width: 350, height: 350, margin: 40 }}
        />
      )}
      {TfReady && <Button
        title="Pick an image"
        onPress={selectImage}
      /> }
      <View style={{ width: '100%', height: 20 }} />
      {!TfReady && <Text>Loading model</Text>}
     {TfReady && result === '' && <Text>Upload and classify shoe</Text>}
      {result !== '' && <Text>{result}</Text> && (
      <TouchableOpacity onPress={resultsButtonPress} style={styles.button}>
        <Text style={styles.buttonText}>See Potential Matches</Text>
      </TouchableOpacity>)}
      </View>
      
      <StatusBar style="auto" />
    </SafeAreaView>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9df9ef',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18
  }
});

export default UploadPhoto;
