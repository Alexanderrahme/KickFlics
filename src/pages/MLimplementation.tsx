import React, { useRef, useState, useEffect } from "react";
import * as tf from '@tensorflow/tfjs-node';
import * as fs from 'fs';
import { importTFLiteModel } from '@tensorflow/tfjs-converter';

async function loadTFLiteModel(tflitePath: string) {
  try {
    // Convert the TFLite model to TensorFlow.js format
    const tfliteModel = await importTFLiteModel(tflitePath);
    
    // Save the converted model to a temporary directory
    const tmpDir = './tmp';
    await tfliteModel.save(`file://src/model/${tmpDir}`);
    
    // Load the TensorFlow.js model
    const model = await tf.loadLayersModel(`file://src/model/${tmpDir}/model.json`);
    
    // Clean up the temporary directory
    fs.rmdirSync(tmpDir, { recursive: true });

    return model;
  } catch (error) {
    console.error('Error during conversion and model loading:', error);
    return null;
  }
}

async function processImage(imagePath: string) { // can fuck this off
  const imgBuffer = await fs.promises.readFile(imagePath);
  const img = tf.node.decodeImage(imgBuffer);
  const processedImg = tf.image.resizeBilinear(img, [224, 224]);
  return processedImg;
} // expand the dimensions // remember to use the processing the alreadyu exists


function processPrediction(predictions: number[]): string {
  // Process the 5-number array to obtain a string result
  const resultString = predictions.join(', ');
  return resultString;
}

async function performInference(model: tf.LayersModel, imagePath: string) {
  const processedImg = await processImage(imagePath);
  const predictions = model.predict(processedImg) as tf.Tensor;
  const predictionArray = await predictions.array() as number[];
  // Process the 5-number array to obtain a string result
  const resultString = processPrediction(predictionArray);
  return resultString;
}

async function main() { // make the parameter the image path. also, save image temproarily
  const tflitePath = 'file://src/model/ResNet50_5_shoes.tflite';
  const imagePath = 'file://assets/images/Nike-Dunk-Low-Retro-White-Black-20212.JPEG';
  
  // Load the converted TensorFlow.js model
  const tfjsModel = await loadTFLiteModel(tflitePath);
  
  if (tfjsModel) {
    const resultString = await performInference(tfjsModel, imagePath);
    console.log('Result:', resultString);
  } else {
    console.log('Model loading failed.');
  }
}