import React from "react";
import {useNavigation} from "@react-navigation/native";
import {View, Image, Text, StyleSheet, SafeAreaView, Pressable} from "react-native";


const About: React.FC = () => {
    const nav = useNavigation();
    
    return (
      <View style={styles.container}>
        <Text>This is the about page</Text>
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

export default About;