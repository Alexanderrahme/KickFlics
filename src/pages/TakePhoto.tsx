import React, { useRef, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Camera } from 'expo-camera';
import { StyleSheet, Text, View, Button, Image, Alert, Pressable } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { SafeAreaView } from "react-native-safe-area-context";
import labels from '../model/labels.json';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons'; 
import { TouchableOpacity } from "react-native-gesture-handler";


interface PhotoType {
  uri: string;
  base64?: string;
}

enum CameraType{
  back = 'back',
  front = 'front',
}

const TakePhoto: React.FC = () => {
  const cameraRef = useRef<Camera | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | undefined>(undefined);
  const [hasMediaLibraryPermissions, setHasMediaLibraryPermission] = useState<boolean | undefined>(undefined);
  const [photo, setPhoto] = useState<PhotoType | undefined>(undefined);
  const [type, setType] = useState(CameraType.back);
  const [isLoading, setIsLoading] = useState(false);
  const [isResult, setIsResult] = useState(false);

  const nav = useNavigation();
  
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
    return <Text>Permission for camera not granted.</Text>;
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
        setPhoto(picture);

        if (picture.base64) {
          classifyPhoto(picture.base64);
        } else {
          console.error("Fail on line 64");
        }
      }
    } catch (error) {
      console.error("Error taking picture", error);
    }
  };


  // Sends image data to cloud
  const classifyPhoto = async (base64Data: string) => {
    setIsLoading(true);
    try {      
      let url = 'https://australia-southeast1-global-bridge-402207.cloudfunctions.net/api_predict';
      const imageData = {
        image: base64Data,
      };
  
      console.log("Sending data")
      const response = await axios.post(url, imageData);
      console.log(response.data);
      let array = response.data["prediction"]

      const flattenedPredictionValues = array[0] as unknown as number[];
      console.log("Flattened Prediction Values: ",flattenedPredictionValues);

        // Get the highest value index
      const largestIndex = flattenedPredictionValues.indexOf(Math.max(...flattenedPredictionValues));
      console.log('MaxIndex: ', largestIndex);

      // Find corresponding label
      const predictedLabel = labels[largestIndex];
      console.log("Predicted label: ",  predictedLabel);
      setIsLoading(false);
      setIsResult(true);
      
    } catch (err) {
      console.log(err);
    }
  };






  
  const switchCamera = () => {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    console.log(type);
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

  const cancelButton = () => {
    (nav.navigate as any)("Home");
  }

  if (photo) {
    return (
      <SafeAreaView style={styles.container}>
        <Image 
          style={styles.photo} 
          source={photo} 
        />
        {hasMediaLibraryPermissions && <TouchableOpacity
          onPress={savePhoto}
          style={styles.button} 
        >
          <Text style={styles.chooseButtonTxt}>Use this Photo</Text>
        </TouchableOpacity>}
        
        <TouchableOpacity style={styles.button} onPress={() => setPhoto(undefined)}>
          <Text style={styles.chooseButtonTxt}>Retry</Text>
        </TouchableOpacity>

        {!isLoading && <Text style={styles.loadingText}>Loading...</Text>}
      </SafeAreaView>
    );
  }

  return (
    <Camera ref={cameraRef} style={styles.container} type={type}>
        <View style={styles.topContainer}>

        </View>
        <View style={styles.bottomContainer}>
          <Pressable onPress={cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
          <Pressable 
            style={styles.takePictureButton}
            onPress={takePicture} 
          />
          <Pressable onPress={switchCamera}>
            <Ionicons name="camera-reverse-outline" size={24} color="white" />
        </Pressable>
        </View>
    </Camera>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    marginBottom: '10%',
    alignSelf: 'center',
  },
  photo: {
    width: 350, 
    height: 350, 
    borderRadius: 5, 
  },
  loadingText:{
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40,
  },
  button: {
    width: 350,
    height: 50,
    backgroundColor: '#004494',
    marginTop: 20,
    borderRadius: 15,
  },
  topContainer:{
    backgroundColor: '#171717',
    width: '100%',
    height: '15%',
    marginBottom: 450,
  },
  takePictureButton: {
    backgroundColor: 'white',
    marginBottom: '15%',
    // alignSelf: 'center',
    height: 70,
    width: 70, 
    borderRadius: 50,
    marginTop: 50, 
  },
  cancelText:{
    color: 'white',
    fontSize: 16,
  },
  bottomContainer:{
    backgroundColor: '#171717',
    width: '100%',
    height: '25%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: "space-around",
  },
  chooseButtonTxt: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 15,
  },
});

export default TakePhoto;
