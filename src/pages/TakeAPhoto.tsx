import React, { useEffect, useRef } from "react";
import {useNavigation} from "@react-navigation/native";
import {View, Image, Text, StyleSheet, SafeAreaView, Pressable, Linking} from "react-native";
import {Camera, useCameraDevices} from 'react-native-vision-camera';

const TakeAPhoto: React.FC = () => {
    
    const camera = useRef<Camera>(null);
    const devices = useCameraDevices();
    const device = devices.back;

    useEffect(() => {
        async function getPermission() {
            const permission = await Camera.requestCameraPermission();
            console.log('Camera persmission status: ${permission}');
            if (permission === 'denied') {
                await Linking.openSettings();
            };
        }
        getPermission();
    }, []);
    
    const capturePhoto = async () => {
        // if (camera.current !== null){
        //     const photo = await camera.current.takePhoto({});
        //     setImageSource(photo.path);
        //     setShowCamera(false);
        //     console.log(photo.path);
        // }
    };
    
    return (
        <View>

        </View>
    );
};

export default TakeAPhoto;