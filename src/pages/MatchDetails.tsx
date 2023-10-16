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
    const { shoe, image, link } = route.params;
    const [googleSearchLink, setGoogleSearchLink] = useState('');

    
    return (
        <View style={styles.container}>
            <Image source={require('../../assets/images/placeholderShoe.png') as any} style={styles.image} />
            <View style={styles.textContainer}>
                <Text style={styles.name}>{shoe}</Text>
                <Text style={styles.price}>Price: $119 AUD</Text>
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
    image: {
        width: '100%',
        height: '20%',
        resizeMode: 'cover',
    },
    textContainer: {
        flex: 1,
        alignItems: 'flex-start',
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
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
