import React, { useRef, useState, useEffect } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image, Alert } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Asset } from 'expo-asset';
import * as tf from '@tensorflow/tfjs';
import { decodeJpeg } from '@tensorflow/tfjs-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import labels from '../model/labels.json';
<<<<<<< Updated upstream
=======
import * as ImageManipulator from 'expo-image-manipulator';
import TensorflowLite from "@switt/react-native-tensorflow-lite";
// import Tflite from 'tflite-react-native';



>>>>>>> Stashed changes



const UploadPhoto: React.FC = () => {
  
  // Set up relevant variables
  const [TfReady, setTfReady] = useState(false);
  const [result, setResult] = useState('');
  const [pickedImage, setPickedImage] = useState('');

  // Initialise tensorflow
  useEffect(() => {
    const initTFLite = async () => {
      const modelAsset = Asset.fromModule(require('/Users/oliverscott/PycharmProjects/KickFlics/assets/model/model.tflite'));
      await modelAsset.downloadAsync();
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
      //   base64: true
      // with base64 we can skip some of the pre-processing later on
      // incorporate this later
    });
  
    // Pass selected image to ML function and view
    if (result.assets && result.assets.length > 0) {
      const imagePath = result.assets[0].uri;
      setPickedImage(imagePath);
      classifyPhoto(imagePath);
  }
  };


  // interface with tensorflow model
  const classifyPhoto = async (imagePath: string) => {
    try {
      console.log("Starting Model");
<<<<<<< Updated upstream
      // Load in model
      const model = await tf.loadLayersModel('file:///src/model/model.json');
      setTfReady(true);
=======

      // Ensure the image path is in an array as required by runModelWithFiles
      const imageUris: string[] = [imagePath];
  
>>>>>>> Stashed changes

      const modelAsset = Asset.fromModule(require('/Users/oliverscott/PycharmProjects/KickFlics/assets/model/model.tflite'));
      await modelAsset.downloadAsync();
      console.log("test")

      // Run the model with the specified files
      const results = await TensorflowLite.runModelWithFiles({
        model: modelAsset.localUri!,  // Using the model asset downloaded earlier
        files: imageUris
      });

      console.log('Results: ', results);

      // Assuming results are returned in a similar structure to the previous implementation
      // Extracting and processing results might need adjustments based on the actual output of the TensorFlow Lite model
      let modelPrediction;
      if (Array.isArray(results)) {
        modelPrediction = results[0];
      } else {
        modelPrediction = results;
      }

      // Assuming the prediction values are accessible in a similar way
      const predictionValues = results[0];
      console.log("Prediction Values: ", predictionValues);

      const flattenedPredictionValues = predictionValues[0] as unknown as number[];
      console.log("Flattened Prediction Values: ",flattenedPredictionValues);

      const largestIndex = flattenedPredictionValues.indexOf(Math.max(...flattenedPredictionValues));
      console.log('MaxIndex: ', largestIndex);

      const predictedLabel = labels[largestIndex];
      console.log("Predicted label: ",  predictedLabel);

      setResult(`Predicted category: ${[predictedLabel]} with probability: ${flattenedPredictionValues[largestIndex]}`);

    } catch (err) {
      console.log(err);
    }
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
      {result !== '' && <Text>{result}</Text>}
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
});

export default UploadPhoto;
