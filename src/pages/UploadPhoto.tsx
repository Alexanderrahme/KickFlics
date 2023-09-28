import React, { useRef, useState, useEffect } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image, Alert } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import * as tf from '@tensorflow/tfjs';
import { decodeJpeg } from '@tensorflow/tfjs-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import labels from '../model/labels.json';



const UploadPhoto: React.FC = () => {
  
  // Set up relevant variables
  const [TfReady, setTfReady] = useState(false);
  const [result, setResult] = useState('');
  const [pickedImage, setPickedImage] = useState('');

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
      // Load in model
      const model = await tf.loadLayersModel('file:///src/model/model.json');
      setTfReady(true);

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

      // Set the results
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
