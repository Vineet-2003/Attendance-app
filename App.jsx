/* eslint-disable no-trailing-spaces */
/* eslint-disable quotes */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable jsx-quotes */
/* eslint-disable prettier/prettier */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {Text, View, Button} from 'react-native';

// navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// components import
import CourseLists from './src/screens/CourseLists';
import Courses from './src/screens/Courses';
import Attendance from './src/screens/Attendance';
import AddCourses from './src/screens/AddCourses';

const Stack = createNativeStackNavigator();


function App({navigation}){
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='CourseList'>
        <Stack.Screen 
        name='CourseList' 
        component={CourseLists} 
        options={{ 
          title: 'List of Courses',
          headerStyle: {
            backgroundColor: '#222831',
          },
          headerTitleStyle: {
              fontSize: 20,
              color: '#fff',
            },
        }}/>
        <Stack.Screen name='Courses' component={Courses} />
        <Stack.Screen name='Attendance' component={Attendance} />
        <Stack.Screen name='AddCourses' component={AddCourses} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
