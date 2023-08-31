import React from "react";
import {useNavigation} from "@react-navigation/native";
import {View, Image, Text, StyleSheet, SafeAreaView, Pressable} from "react-native";
import StoreCard from "../components/StoreCard";


const Shop: React.FC = () => {
    const nav = useNavigation();
    
    return (
      <View style={styles.container}>
        <StoreCard/>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });  

export default Shop;