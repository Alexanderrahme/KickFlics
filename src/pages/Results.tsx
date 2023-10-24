import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import {useNavigation, useRoute} from "@react-navigation/native";
import shoeDatabase from '../data/dummyStoreData';
import axios from 'axios';
import { Linking } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FlipLeftRight } from '@tensorflow/tfjs';
import ResultsNavigator from '../../ResultsNavigator';
const Results = () => {
    const nav = useNavigation();
    const route = useRoute();
    const pickedImage = route.params?.pickedImage || "";
    const shoe = route.params?.shoe || "";
    const [googleSearchLinks, setGoogleSearchLinks] = useState(['', '', '', '']);
    const [resultsData, setResultsData] = useState([]);

    useEffect(() => {
        const apiKey: string = 'AIzaSyCncv7v2o2S-8nNLEwiVs28pTBTYVdxE5g'; 
        const cx: string = 'a259cb0bd727843c2'; 
        const query = encodeURIComponent(`buy ${shoe} sneakers`);

        const apiUrl: string = `https://www.googleapis.com/customsearch/v1?q=${query}&cx=${cx}&key=${apiKey}`;
        
        axios.get(apiUrl).then((response) => {
            if (response.data && response.data.items && response.data.items.length >= 4) {
                const uniqueLinks = new Set();

                for (let i = 0; i < response.data.items.length; i++) {
                    const object = response.data.items[i];
                    const dotIndex1 = object.link.indexOf('.');
                    const dotIndex2 = object.link.indexOf('.', dotIndex1 + 1);
                    if (dotIndex2 !== -1) {
                        const substring = object.link.substring(0, dotIndex2);
        
                        let isUnique = true;
                        for (const link of uniqueLinks) {
                            const existingDotIndex2 = link.indexOf('.', link.indexOf('.') + 1);
                            const existingSubstring = link.substring(0, existingDotIndex2);
                            if (substring === existingSubstring) {
                                isUnique = false;
                                break;
                            }
                        }
        
                        if (isUnique && uniqueLinks.size < 4) {
                            uniqueLinks.add(object.link);
                        } else if (uniqueLinks.size >= 4) {
                            break; // Break the loop if uniqueLinks size is 4 or more
                        }
                    }
                }

                const updatedResultsData = Array.from(uniqueLinks).map((link, index) => ({
                    id: index + 1,
                    image: '', 
                    link: link,
                }));

                setResultsData(updatedResultsData);
            }
        });
    }, [shoe]);
    
    const handleLinkPress = (url) => {
        Linking.openURL(url);
        
    }
    const handleMatchPress = (shoe, image, link) => {
        nav.navigate("Match Details", { shoe, image, link: link });
    }
  return (
    <View style={styles.container}>
            <Image
                source={{ uri: pickedImage }}
                style={styles.image}
            />
            <View style = {styles.headerContainer}>
                <Text style={styles.headerText}>Potential Matches</Text>
            </View>
            <ScrollView style={styles.scrollView}>
            {resultsData.map((box) => (
                    <TouchableOpacity key={box.id} style={styles.boxContainer} onPress={() => handleMatchPress(shoe, box.image, box.link )}>
                        
                        <Image
                            source={require('../../assets/images/placeholderShoe.png') as any} 
                            style={styles.boxImage}
                        />
                        <View style={styles.boxTextContainer}>
                            <Text style={styles.shoeNameText}>Under Armour</Text>
                            <Text style={styles.probabilityText}>1hunnit% Match</Text>
                            <Text style={styles.priceText}>$119 AUD</Text>
                            <TouchableOpacity onPress={() => handleLinkPress(box.link)}>
                                <Text style={styles.link}>Link</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
  
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start', // Aligns content at the top of the screen
        padding: 0, 
        margin: 0,
    },
    image: {
        width: 350,
        height: 350,
        resizeMode: 'contain',
        marginVertical: 0, 
        paddingVertical: 0,
    },
    headerContainer: {
        alignSelf: 'flex-start', // Align the header to the left
        marginLeft: 20, // Add left margin for spacing
        
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 0,
        paddingVertical: 0,
        
    },
    scrollView: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 20,
        marginTop: 20,
    },
    boxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        borderWidth: 1, // Add border width
        borderColor: 'black', // Set border color to black
        borderRadius: 5, // Optional: Add border radius for rounded corners
        paddingHorizontal: 10, // Optional: Add padding inside the boxes
        paddingVertical: 0,
    },
    boxImage: {
        width: '40%',
        height: '80%',
        resizeMode: 'contain',
        marginRight: 10,
    },
    boxTextContainer: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
        alignItems: 'flex-end',
        padding: 0,
        margin: 0,
        //flexDirection: 'row',
        
    },
    
    shoeNameText: {
        fontSize: 16,
        textDecorationLine: 'underline', 
        paddingTop: 7, 
        paddingBottom: 5, 
    },
    
    probabilityText:{
        paddingBottom: 3, 
    },
    priceText:{
        paddingBottom: 3, 
    },
    link: {
        color: 'blue',
        textDecorationLine: 'underline',
        alignItems: 'flex-end',
        paddingBottom: 35, 
    },
  });
export default Results;
