import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ShoeInfo from './src/pages/ShoeInfo';
import UploadPhoto from './src/pages/UploadPhoto';
import Results from './src/pages/Results';
import MatchDetails from './src/pages/MatchDetails'

    

export default function ResultsNavigator() {
    const Stack = createStackNavigator();
    
    return (
          
        <Stack.Navigator>
            <Stack.Screen  name="Upload" component={UploadPhoto} options={{ headerShown: false }}/>
            <Stack.Screen name="Your Flic" component={Results}/>
            <Stack.Screen name="Match Details" component={MatchDetails} />
            
        </Stack.Navigator>
        

    );
}

