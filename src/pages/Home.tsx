import React from "react";
import {useNavigation} from "@react-navigation/native";
import {createDrawerNavigator} from '@react-navigation/drawer';
import {View, Image, ImageBackground, Text, StyleSheet, SafeAreaView, Pressable} from "react-native";


const Home: React.FC = () => {
    const nav = useNavigation();


    return (
    <View style={styles.container}>
        <ImageBackground style={styles.backgroundImage} source={require('../../assets/images/sneakerCollection.jpeg')}>
            <Text style={styles.heading}>Software Innovation Studio</Text>
            <View style={styles.buttonContainer}>
                <Pressable onPress={() => nav.navigate("TakePhoto")} style={styles.aboutButton}>
                    <Text>Take a Photo!</Text>
                </Pressable> 
            </View>
        </ImageBackground>    
    </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      //backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    backgroundImage: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContainer:{
        marginTop: 50,
        height: 50,
    },
    heading:{
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white',
    },
    aboutButton:{
        width: 110,
        height: 30,
        backgroundColor: '#E27373',
        borderRadius: 15,
        border: true,
        borderWidth: 1,
        borderColor: '000000',
        alignItems: 'center',
        justifyContent: 'center',
    },
  });  

export default Home;