import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import {useNavigation, useRoute} from "@react-navigation/native";
import shoeDatabase from '../data/dummyStoreData';
import axios from 'axios';
import { Linking } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const ShoeInfo = () => {
    const nav = useNavigation();
    const route = useRoute();
    const { shoe } = route.params as { shoe: Shoe };
    const [googleSearchLink, setGoogleSearchLink] = useState('');

    useEffect(() => {
        const apiKey: string = 'AIzaSyCncv7v2o2S-8nNLEwiVs28pTBTYVdxE5g'; 
        const cx: string = 'a259cb0bd727843c2'; 
        const query = encodeURIComponent(`${shoe.name} sneakers`); 

        const apiUrl: string = `https://www.googleapis.com/customsearch/v1?q=${query}&cx=${cx}&key=${apiKey}`;
        
        axios.get(apiUrl).then((response) => {
            // Extract and set the first search result link
            const firstResult = response.data.items[0];
            if (firstResult) {
              setGoogleSearchLink(firstResult.link);
            }
          });
        }, [shoe.name]);

    
    
    
  return (
    <View style={styles.container}>
        <Image source={shoe.image} style={styles.image} />
        <Text style={styles.name}>{shoe.name}</Text>
        <Text style={styles.price}>Price: ${shoe.price} AUD</Text>
        <Text style={styles.description}>{shoe.description}</Text>
        <TouchableOpacity onPress={() =>Linking.openURL(googleSearchLink)}>
            {googleSearchLink ? <Text style={styles.link}>{googleSearchLink}</Text> : null}
        </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      width: 200,
      height: 200,
      resizeMode: 'contain',
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      marginVertical: 10,
    },
    price: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    description: {
      fontSize: 16,
      textAlign: 'center',
      marginHorizontal: 20,
    },
    link: {
        fontSize: 14,
        color: 'blue',
        marginVertical: 10,
      },
  });
export default ShoeInfo;
