import React, { Component, FC, useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import LottieView from 'lottie-react-native';

// Functional Component
const About: FC = () => {
  const nav = useNavigation();
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    animationRef.current?.play();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <LottieView
         source={require('../../assets/animation_hand.json')}
         ref={animationRef}
         autoPlay={true}
         loop={true}
         speed={1}
         style={styles.animation}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  animation:{
    width: 350,
    height: 350,
    marginLeft: 10,
    marginTop: 70,
  },
});

export default About;
