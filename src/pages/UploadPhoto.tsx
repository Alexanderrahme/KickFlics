import React, { useRef, useState, useEffect } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image, Alert, Pressable} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Asset } from 'expo-asset';
import * as tf from '@tensorflow/tfjs';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import labels from '../model/labels.json';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {useNavigation} from "@react-navigation/native";
import Results from "./Results";
import ResultsNavigator from "../../ResultsNavigator";
import axios from 'axios';
import LottieView from 'lottie-react-native';
import * as ImageManipulator from 'expo-image-manipulator'; // SEE IF THIS CHANGES ANYTHING

const UploadPhoto: React.FC = () => {
  const nav = useNavigation();
  const animationRef = useRef<LottieView>(null);

  // Set up relevant variables
  const [TfReady, setTfReady] = useState(false);
  const [result, setResult] = useState('');
  const [isResult, setIsResult] = useState(false);
  const [pickedImage, setPickedImage] = useState('');
  const [shoe, setShoe] = useState('');
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    animationRef.current?.play();
  }, []);
  const [prob, setProb] = useState('');


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
    });

    // Pass selected image to ML function and view
    if (result.assets && result.assets.length > 0) {
      const imagePath = result.assets[0].uri;
  
      // Convert the image to JPEG
      const jpegImg = await ImageManipulator.manipulateAsync(
        imagePath,
        [],
        { format: ImageManipulator.SaveFormat.JPEG, base64: true }
      );
  
      setPickedImage(jpegImg.uri);
      
      if (jpegImg.base64) {
        classifyPhoto(jpegImg.base64);
      } else {
        console.error('Error converting image to JPEG');
      }
  }
  };


  // Sends image data to cloud
  const classifyPhoto = async (base64Data: string) => {
    setisLoading(true);
    try {      
      let url = 'https://australia-southeast1-global-bridge-402207.cloudfunctions.net/api_predict-savePhoto';
      const imageData = {
        image: base64Data,
      };
  
      console.log("Sending data")
      const response = await axios.post(url, imageData);
      //console.log(response.data);
      let array = response.data["prediction"]

      const flattenedPredictionValues = array[0] as unknown as number[];
      console.log("Flattened Prediction Values: ",flattenedPredictionValues);

        // Get the highest value index
        const largestIndex = flattenedPredictionValues.indexOf(Math.max(...flattenedPredictionValues));
        console.log('MaxIndex: ', largestIndex);
        // Set the probability value
        setProb((flattenedPredictionValues[largestIndex] * 100).toFixed(2) + '%');

      // Find corresponding label
      const predictedLabel = labels[largestIndex];
      console.log("Predicted label: ",  predictedLabel);

      setResult(`Predicted category: ${[predictedLabel]} with probability: ${flattenedPredictionValues[largestIndex]}`);
      setIsResult(true);
      setShoe(predictedLabel);
      setisLoading(false);
  
    } catch (err) {
      console.log(err);
    }

  };

  const resultsButtonPress = () => {
    (nav.navigate as any)("Your Flic", {shoe: shoe, prob: prob, pickedImage: pickedImage});
  };
  
  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.firstView}>
          
          {pickedImage !== '' && (
            <Image
              source={{ uri: pickedImage }}
              style={styles.image}
            />
          )}

         {TfReady && !isLoading && 
          <View>
            <TouchableOpacity
              style={styles.chooseButton}
              onPress={selectImage}
              > 
                <Text style={styles.chooseButtonTxt}>Pick an Image</Text>
            </TouchableOpacity>

            {!isLoading && isResult && (
            <TouchableOpacity
              style={styles.chooseButton}
              onPress={() => resultsButtonPress()}
              > 
                <Text style={styles.chooseButtonTxt}>See Results</Text>
            </TouchableOpacity>
            )}
          </View>
      }
      
      {isLoading && <Text style={styles.loadingText}>Loading...</Text>}

      {isLoading && <LottieView
        source={require('../../assets/animation_hand.json')}
        autoPlay
        loop
        style={{ paddingTop: 25, width: 300, height: 300}}
      />}  
  

    </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchFoundText:{
    fontSize: 20, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginTop: 20, 
    marginBottom: 20,
  },
  loadingText:{
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18
  },
  firstView:{
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // button: {
  //   backgroundColor: '#4CAF50',
  //   padding: 10,
  //   borderRadius: 5,
  // },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  imagePlaceholder:{
    width: 350, 
    height: 350, 
    borderRadius: 5, 
    //backgroundColor: '#eee',
  },
  image:{ 
    width: 350, 
    height: 350, 
    borderRadius: 5, 
  },
  chooseButton: {
    width: 350,
    height: 50,
    backgroundColor: '#004494',
    marginTop: 20,
    borderRadius: 15,
  },
  chooseButtonTxt: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 15,
  },

});


  export default UploadPhoto;
