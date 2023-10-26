import React, { useRef, useState, useEffect } from "react";
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from "@react-navigation/native";
import { Camera } from 'expo-camera';
import { StyleSheet, Text, View, Button, Image, Alert } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as tf from '@tensorflow/tfjs';
import { decodeJpeg } from '@tensorflow/tfjs-react-native';
import CameraNavigator from "../../CameraNavigator";
import labels from '../model/labels.json';
import CamResults from "./CamResults";
import axios from 'axios';
import * as ImageManipulator from 'expo-image-manipulator';


interface PhotoType {
  uri: string;
  base64?: string;
}

const TakePhoto: React.FC = () => {
  const cameraRef = useRef<Camera | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | undefined>(undefined);
  const [hasMediaLibraryPermissions, setHasMediaLibraryPermission] = useState<boolean | undefined>(undefined);
  const [photo, setPhoto] = useState<PhotoType | undefined>(undefined);
  const [isLoading, setisLoading] = useState(false);
  const [result, setResult] = useState('');
  const [prob, setProb] = useState('');
  const [shoe, setShoe] = useState('');
  const nav = useNavigation();
  const [TfReady, setTfReady] = useState(false);
  const [tempShoe, setTempShoe] = useState('');




  
  useEffect(() => {
    (async () => {
      try {
        const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
        setHasCameraPermission(cameraStatus === "granted");
        
        const { status: mediaLibraryStatus } = await MediaLibrary.requestPermissionsAsync();
        setHasMediaLibraryPermission(mediaLibraryStatus === "granted");
      } catch (error) {
        console.error("Error requesting permissions", error);
        Alert.alert("Error", "Unable to get permissions.");
      }
    })();
  }, []);

  if (hasCameraPermission === false) {
    return <Text>Permission for camera not granted. Please change this in settings</Text>;
  }

  const takePicture = async () => {
    try {
      if (cameraRef.current) {
        const options = {
          quality: 1,
          base64: true,
          exif: false
        };
        const picture = await cameraRef.current.takePictureAsync(options);
  
        // Convert the captured image to JPEG
        const jpegImg = await ImageManipulator.manipulateAsync(
          picture.uri,
          [],
          { format: ImageManipulator.SaveFormat.JPEG, base64: true }
        );
  
        setPhoto(jpegImg); // Store the JPEG image
  
        if (jpegImg.base64) {
          //classifyPhoto(jpegImg.base64);
          setTempShoe(jpegImg.base64 || "");
        } else {
          console.error('Error converting image to JPEG');
        }
      }
    } catch (error) {
      console.error("Error taking picture", error);
    }
  };

  // Sends image data to cloud
  const classifyPhoto = async () => {
    setisLoading(true);
    try {     
      let url = 'https://australia-southeast1-global-bridge-402207.cloudfunctions.net/api_predict-savePhoto' 
      const imageData = {
        image: tempShoe,
      };
  
      console.log("Sending data")
      const response = await axios.post(url, imageData);
      //console.log(response.data);
      let array = response.data["prediction"]
  
      const flattenedPredictionValues = array[0] as unknown as number[];
      console.log("Flattened Prediction Values: ", flattenedPredictionValues);
  
        // Get the highest value index
        const largestIndex = flattenedPredictionValues.indexOf(Math.max(...flattenedPredictionValues));
        //console.log('MaxIndex: ', largestIndex);
        // Set the probability value
        setProb((flattenedPredictionValues[largestIndex] * 100).toFixed(2) + '%');
  
      // Find corresponding label
      const predictedLabel = labels[largestIndex];
      console.log("Predicted label: ", predictedLabel);
  
      setResult(`Predicted category: ${[predictedLabel]} with probability: ${flattenedPredictionValues[largestIndex]}`);
      setShoe(predictedLabel);
      setisLoading(false);
  
    } catch (err) {
      console.log(err);
    }
  };

  const getPhotoUri = (photo: PhotoType | undefined): string | undefined => {
    return photo?.uri || undefined;
  };

  const pickedImage = getPhotoUri(photo);

  const resultsButtonPress = () => {
    (nav.navigate as any)("Your Flic", {shoe: shoe, pickedImage: pickedImage});

  };

  const savePhoto = async () => {
    if (photo?.uri) {
      try {
        await MediaLibrary.saveToLibraryAsync(photo.uri);
        Alert.alert("Alert", "Scanning yo shoes.");
        setPhoto(undefined);
      } catch (error) {
        console.error("Error saving photo", error);
        Alert.alert("Error", "Unable to save photo to gallery.");
      }
    }
  };


  if (photo) {
    return (
        <SafeAreaView style={styles.photo}>
            <Image style={styles.photo} source={{ uri: photo.uri }} />

            <TouchableOpacity style={styles.chooseButton} onPress={classifyPhoto}>
                <Text style={styles.chooseButtonTxt}>Classify Photo</Text>
            </TouchableOpacity>

            {!isLoading && pickedImage !== '' && (
                <TouchableOpacity style={styles.chooseButton} onPress={() => resultsButtonPress()}>
                    <Text style={styles.chooseButtonTxt}>See Results</Text>
                </TouchableOpacity>
            )}
            
            <TouchableOpacity style={styles.chooseButton} onPress={() => setPhoto(undefined)}>
                <Text style={styles.chooseButtonTxt}>Retry</Text>
            </TouchableOpacity>
            
            {hasMediaLibraryPermissions && 
                <TouchableOpacity style={styles.chooseButton} onPress={savePhoto}>
                    <Text style={styles.chooseButtonTxt}>Save to camera roll</Text>
                </TouchableOpacity>
            }

        </SafeAreaView>
    );
}



return (
  <Camera ref={cameraRef} style={styles.container}>
      <TouchableOpacity 
          style={[styles.chooseButton, { marginBottom: 50 }]} 
          onPress={takePicture}
      >
          <Text style={styles.chooseButtonTxt}>Take Picture</Text>
      </TouchableOpacity>
      <StatusBar style='auto' />
  </Camera>
);




};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  buttonContainer: {
    marginBottom: '10%',
    marginTop: '10%',
    alignSelf: 'center',
  },
  miniButtonContainer: {
    marginBottom: '10%',
    marginTop: '10%',
    alignSelf: 'center',
  },
  button: {
    marginTop: 20,
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
    photo: {
    flex: 1,
    alignItems: 'center',
    marginBottom: '10%',
  },
  
});

export default TakePhoto;
