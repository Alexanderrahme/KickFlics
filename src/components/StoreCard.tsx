import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import shoeDatabase from '../data/dummyStoreData';
import { TouchableOpacity } from 'react-native-gesture-handler';

const StoreCard = () => {
  return (
    <ScrollView>
      {shoeDatabase.map((shoe) => (
        <TouchableOpacity key={shoe.id} style={styles.card}>
          <Image source={shoe.image} style={styles.cardImage}/>
          <View style={styles.infoContainer}>
            <Text style={styles.name}>Name: {shoe.name}</Text>
            <Text style={styles.price}>Price: ${shoe.price} AUD</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {},
    card: {
        backgroundColor: 'white',
        borderRadius: 15,
        shadowOpacity: 0.25,
        shadowRadius: 4,
        shadowColor: 'black',
        shadowOffset: { height: 0, width: 0 },
        elevation: 1,
        marginVertical: 20,
        padding: 10,
        margin: 5,
        height: 300,
        width: 370,
    },
    cardImage: {
        width: '100%',
        height: 200,
    },
    infoContainer: {
        padding: 10,
    },
    name:{
        fontSize: 20,
        fontWeight: 'bold',
    },
    price:{
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
    },
});

export default StoreCard;
