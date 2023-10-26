import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import {useNavigation, useRoute} from "@react-navigation/native";
import shoeDatabase from '../data/dummyStoreData';
import axios from 'axios';
import { Linking } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FlipLeftRight } from '@tensorflow/tfjs';
import ResultsNavigator from '../../ResultsNavigator';

// Define a map of shoes to image sources
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
  
  
  const Results = () => {
      const nav = useNavigation();
      const route = useRoute();
      const pickedImage = route.params?.pickedImage || "";
      const shoe = route.params?.shoe || "";
      const prob = route.params?.prob || "";
      const [googleSearchLinks, setGoogleSearchLinks] = useState(['', '', '', '']);
      const [resultsData, setResultsData] = useState([]);
  
      useEffect(() => {
          const apiKey: string = 'AIzaSyCncv7v2o2S-8nNLEwiVs28pTBTYVdxE5g'; 
          const cx: string = 'a259cb0bd727843c2'; 
          const query = encodeURIComponent(`${shoe} sneakers`);
  
          const apiUrl: string = `https://www.googleapis.com/customsearch/v1?q=${query}&cx=${cx}&key=${apiKey}`;
          
          axios.get(apiUrl).then((response) => {
              // Extract and set the first search result link
              if (response.data && response.data.items && response.data.items.length >= 4) {
                  const firstFourResults = response.data.items.slice(0, 4); // Get the first 4 items from the API response
            
                  const links = firstFourResults.map(item => item.link); // Extract links from the first 4 items
                  setGoogleSearchLinks(links); 
  
                  const updatedResultsData = firstFourResults.map((item, index) => ({
                      id: index + 1,
                      image: item.image?.thumbnailLink || '',
                      link: item.link, // Use the link as text, you can customize this property as needed
                      
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
                  style={styles.circularImage}
              />
              <View style = {styles.headerContainer}>
                  <Text style={styles.headerText}>Potential Matches</Text>
              </View>
              <ScrollView style={styles.scrollView}>
              {resultsData.map((box) => (
                      <TouchableOpacity key={box.id} style={styles.boxContainer} onPress={() => handleMatchPress(shoe, box.image, box.link )}>
                          <Image
                              source={shoeImages[shoe] || shoeImages['Other Shoe Brand']}
                              style={styles.boxImage}
                          />
                          <View style={styles.boxTextContainer}>
                              <Text style={styles.shoeNameText}>{shoe}</Text>
                              <Text style={styles.probabilityText}>{prob}</Text>
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
          fontSize: 18,
          fontWeight: 'bold',
          marginVertical: 0,
          paddingVertical: 0,
          
      },
      scrollView: {
          flex: 1,
          width: '100%',
          paddingHorizontal: 20,
          marginTop: 8,
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
      circularImage: {
          width: 150,
          height: 150,
          resizeMode: 'cover',
          borderRadius: 75,
          marginTop: 20,
          marginBottom: 20, 
      }
    });
  export default Results;
  