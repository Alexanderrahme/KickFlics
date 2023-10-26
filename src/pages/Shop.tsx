import React from "react";
import {useNavigation} from "@react-navigation/native";
import {View, Image, Text, StyleSheet, SafeAreaView, Pressable} from "react-native";
import StoreCard from "../components/StoreCard";
import ShoeInfo from "./ShoeInfo";
import ShopNavigator from "../../ShopNavigator";

const Shop: React.FC = () => {
  const nav = useNavigation();
  
  const handleCardPress = (shoe: any) => {
    (nav.navigate as any)("ShoeInfo", {shoe});
  };

  return (
        <View>
          <StoreCard handleCardPress={handleCardPress} />
        </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Shop;