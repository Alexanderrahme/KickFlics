import React from "react";
import {useNavigation} from "@react-navigation/native";
import {View, Image, Text, StyleSheet, SafeAreaView, Pressable} from "react-native";


const RecentlySearched: React.FC = () => {
    const nav = useNavigation();
    
    return (
      <View style={styles.container}>
        <Text>This is the recently searched page</Text>
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

export default RecentlySearched;