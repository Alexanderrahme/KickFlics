import React from "react";
import {useNavigation} from "@react-navigation/native";
import {createDrawerNavigator} from '@react-navigation/drawer';
import {View, Image, ImageBackground, Text, StyleSheet, SafeAreaView, Pressable, TouchableOpacity} from "react-native";


const Home: React.FC = () => {
    const nav = useNavigation();

    return (
    <View style={styles.container}>
        <Text style={styles.heading}>KickFlics</Text>
        <View style={styles.logoContainer}>
            <Image
                source={require('../../assets/images/img_0.png')}
                style={styles.logo2}   
            />
            <Image
                source={require('../../assets/images/img_1.png')}
                style={styles.logo1}
            />
        </View>
        <View style={styles.buttonContainer}>
            <TouchableOpacity
                style={styles.Button}
                onPress={() => nav.navigate('Upload a Photo')}
                > 
                <Text style={styles.ButtonText}>Upload a Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.Button}
                onPress={() => nav.navigate('Take a Photo')}
                > 
                <Text style={styles.ButtonText}>Take a Photo</Text>
            </TouchableOpacity>
        </View>
   </View>
        
    );
  }

  const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
    },
    logo1: {
        width: 350,
        height: 350,
        position: 'absolute',
        zIndex: 1,
    },
    logo2: {
        width: 350,
        height: 350,
        position: 'absolute',
        zIndex: 2,
    },

    heading:{
        fontSize: 50,
        fontWeight: 'bold',
        color: 'black',
        marginTop: 50,
    },
    buttonContainer: {
        marginTop: 350,
        alignItems: 'center',
    },
    Button: {
        width: 350,
        height: 50,
        backgroundColor: '#004494',
        marginTop: 20,
        borderRadius: 15,
      },

    ButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 15,
    },
  });  

  export default Home;