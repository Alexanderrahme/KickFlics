import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import {useNavigation, useRoute} from "@react-navigation/native";
import shoeDatabase from '../data/dummyStoreData';
import axios from 'axios';
import { Linking } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ResultsNavigator from '../../ResultsNavigator';

const MatchDetails = () => {
    const nav = useNavigation();
    const route = useRoute();
    const [googleSearchLink, setGoogleSearchLink] = useState('');
    const image = route.params?.image || "";
    const price = route.params?.price || "";
    const shoe = route.params?.shoe || "";
    const link = route.params?.link || "";
  
    const shoeImages = {
        'Air Jordan 1': require('../../assets/images/Air_Jordan_1s.png'),
        'Under Armour Ripple 2.0 Sneaker': require('../../assets/images/Under_Armour_Ripple.png'),
        'Converse Distrito 2.0 Canvas Low Sneaker': require('../../assets/images/Converse_Distrito_2.0.png'),
        'Adidas Continental 80 Sneaker': require('../../assets/images/adidas_continental.png'),
        'Nike Low Dunk Black and White': require('../../assets/images/Nike_low_dunk_black_and_white.png'),
        'Nike Low Dunk Medium Curry': require('../../assets/images/Nike_low_dunk_medium_curry.png'),
        'Converse Chuck Taylor High Top Black': require('../../assets/images/Converse_Chuck_taylor_High_Top_Black.png'),
        'Adidas Forum Low Talc Sesame' : require('../../assets/images/Adidas_Forum_Low_Talc_Sesame.png'),
        'Other Shoe Brand': require('../../assets/images/placeholderShoe.png'), // Default image
      };

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image source={shoeImages[shoe]} style={styles.image} />
            </View>
            <View style={styles.nameContainer}>
                <Text style={styles.name}>{shoe}</Text>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.price}>Price: ${price} AUD</Text>
                <TouchableOpacity onPress={() => Linking.openURL(link)}>
                    {link ? <Text style={styles.link}>{link}</Text> : null}
                </TouchableOpacity>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 20,
    },
    imageContainer: {
        width: 350,
        height: 250,
        borderColor: 'black', // Set the border color to black
        borderWidth: 2, // Set the border width
        borderRadius: 20, // Add border radius for curved corners
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden', 
        marginBottom: 10,
    },
    image: {
        width: '85%',
        height: '85%',
        resizeMode: 'cover',
    },
    textContainer: {
        flex: 1,
        alignItems: 'flex-start',
    },
    nameContainer: {
        width: 350,
        backgroundColor: 'black',
        padding: 10,
        borderRadius: 5, 
        alignItems: 'center',      
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white', 
        marginVertical: 10,
        textAlign: 'left',
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'left',
        marginVertical: 10,
    },
    link: {
        fontSize: 16,
        color: 'blue',
        textDecorationLine: 'underline',
        textAlign: 'left',
        marginVertical: 10,
    },
  });
export default MatchDetails;
