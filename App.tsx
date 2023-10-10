import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React from "react";
import {NavigationContainer, useNavigation} from "@react-navigation/native";
import Home from "./src/pages/Home";
import About from "./src/pages/About";
import Shop from "./src/pages/Shop";
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import 'react-native-gesture-handler';
import TakePhoto from './src/pages/TakePhoto';
import UploadPhoto from './src/pages/UploadPhoto';
import ShopNavigator from './ShopNavigator';


export default function App() {
  
  const Drawer = createDrawerNavigator();

  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Home" component={Home}/>
        <Drawer.Screen name="Shop" component={ShopNavigator}/>
        <Drawer.Screen name="About" component={About}/>
        <Drawer.Screen name="Take a Photo" component={TakePhoto}/>
        <Drawer.Screen name="Upload a Photo" component={UploadPhoto}/>
        
      </Drawer.Navigator>
    </NavigationContainer>
  );
}


