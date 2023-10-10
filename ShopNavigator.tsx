import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ShoeInfo from './src/pages/ShoeInfo';
import Shop from './src/pages/Shop';



export default function ShopNavigator() {
    const Stack = createStackNavigator();
    return (
          
        <Stack.Navigator>
            <Stack.Screen  name="Shoes" component={Shop} />
            <Stack.Screen name="ShoeInfo" component={ShoeInfo}/>
            
            
        </Stack.Navigator>
        

    );
}

