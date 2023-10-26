import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ShoeInfo from './src/pages/ShoeInfo';
import TakePhoto from './src/pages/TakePhoto';
import CamResults from './src/pages/CamResults';
import MatchDetails from './src/pages/MatchDetails'

    

export default function CameraNavigator() {
    const Stack = createStackNavigator();
    
    return (
          
        <Stack.Navigator>
            <Stack.Screen name="Upload" component={TakePhoto} options={{ headerShown: false }}/>
            <Stack.Screen name="Your Flic" component={CamResults}/>
            <Stack.Screen name="Match Details" component={MatchDetails} />
            
        </Stack.Navigator>
        

    );
}

