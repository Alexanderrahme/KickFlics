import React from "react";
import {useNavigation} from "@react-navigation/native";
import {createDrawerNavigator} from '@react-navigation/drawer';
import {View, Image, ImageBackground, Text, StyleSheet, SafeAreaView, Pressable, Button} from "react-native";


const Home: React.FC = () => {
    const nav = useNavigation();


    return (
    <View style={styles.container}>
        <ImageBackground style={styles.backgroundImage} source={require('../../assets/images/sneakerCollection.jpeg')}>
            <Text style={styles.heading}>KickFlics</Text>
            <View style={styles.buttonContainer}>
                <Pressable onPress={() => nav.navigate("TakePhoto.tsx")} style={styles.aboutButton}>
                    <Text style={styles.buttonText}>Capture</Text>
                </Pressable> 
                <Pressable style={styles.aboutButton}>
                    <Text style={styles.buttonText}>Upload</Text>
                </Pressable> 
            </View>
        </ImageBackground>    
    </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
    },
    backgroundImage: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContainer:{
        marginTop: 10,
        height: 70,
        flexDirection: "column",
        justifyContent: 'space-between'
    },
    heading:{
        fontSize: 50,
        fontWeight: 'bold',
        color: 'white',
    },
    aboutButton:{
        width: 180,
        height: 40,
        backgroundColor: '#90CCED',
        borderRadius: 15,
        border: true,
        borderWidth: 1,
        borderColor: '000000',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    buttonText:{
        fontWeight: 'bold',
    },
  });  

export default Home;