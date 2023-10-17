import React, { useRef, useState, useEffect } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import * as tf from '@tensorflow/tfjs';
import { decodeJpeg } from '@tensorflow/tfjs-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import labels from '../model/labels.json';
import * as ImageManipulator from 'expo-image-manipulator';
import LottieView from 'lottie-react-native';




const UploadPhoto: React.FC = () => {
  
  // Set up relevant variables
  const [TfReady, setTfReady] = useState(false);
  const [result, setResult] = useState('');
  const [pickedImage, setPickedImage] = useState('');
  const [isLoading, setLoading] = useState(false);

  // Initialise tensorflow
  useEffect(() => {
    const initTF = async () => {
      await tf.ready();
      setTfReady(true);
    };

    initTF();
  }, []);

  // Allows a user to upload an image from their camera roll
  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result.assets && result.assets.length > 0) {
      const imagePath = result.assets[0].uri;

      // Convert the image to jpg format
      const jpegImg = await ImageManipulator.manipulateAsync(
        imagePath,
        [],
        { format: ImageManipulator.SaveFormat.JPEG }
      );

      setPickedImage(jpegImg.uri);
    }
};

  // interface with tensorflow model
  const classifyPhoto = async (imagePath: string) => {
    try {
      console.log("Starting Model");
      // Load in model which is hosted on github
      const model = await tf.loadLayersModel('https://raw.githubusercontent.com/Alexanderrahme/KickFlics/main/src/model/model.json');

      setTfReady(true);
      setLoading(true);

      // Pre-process image
      const image = await FileSystem.readAsStringAsync(imagePath, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const imageBuffer = tf.util.encodeString(image, 'base64').buffer;
      const rawDataArray = new Uint8Array(imageBuffer);
      let imageTensor = decodeJpeg(rawDataArray);
      
      // Resize, normalise and reshape to same values the model was trained on
      imageTensor = tf.image.resizeBilinear(imageTensor, [224, 224]);
      imageTensor = tf.div(imageTensor, tf.scalar(255.0));
      let processedImageTensor = tf.reshape(imageTensor, [1, 224, 224, 3]);

      // Send tensor to model
      const prediction = await model.predict(processedImageTensor);      
      
      // To negate errors
      let modelPrediction;
      if (Array.isArray(prediction)) {
        modelPrediction = prediction[0];
      } else {
        modelPrediction = prediction;
      }

      // Get relevant info from predictionTensor
      const predictionValues = modelPrediction.arraySync() as number[][][0];
      console.log("Prediction Values: ", predictionValues);

      // 2D -> 1D array
      const flattenedPredictionValues = predictionValues[0] as unknown as number[];
      console.log("Flattened Prediction Values: ",flattenedPredictionValues);

      // Get the highest value index
      const largestIndex = flattenedPredictionValues.indexOf(Math.max(...flattenedPredictionValues));
      console.log('MaxIndex: ', largestIndex);

      // Find corresponding label
      const predictedLabel = labels[largestIndex];
      console.log("Predicted label: ",  predictedLabel);
      setLoading(false);

      // Set the results
      setResult(`Predicted category: ${[predictedLabel]} with probability: ${flattenedPredictionValues[largestIndex]}`);
      

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.firstView}>
          
          {pickedImage === '' && (
            <View style={styles.imagePlaceholder}/>
          )}
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
          {!isLoading && pickedImage !== '' && (
          <TouchableOpacity
            style={styles.chooseButton}
            onPress={() => classifyPhoto(pickedImage)}
            > 
              <Text style={styles.chooseButtonTxt}>Search</Text>
          </TouchableOpacity>
          )}
        </View>
      }

      {isLoading && <LottieView
        source={require('../../assets/animation_hand.json')}
        autoPlay
        loop
        style={{ width: 300, height: 300 }}
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
  firstView:{
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholder:{
    width: 350, 
    height: 350, 
    borderRadius: 5, 
    backgroundColor: '#eee',
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
