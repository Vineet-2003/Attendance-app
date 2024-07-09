/* eslint-disable no-unused-vars */
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
// navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// components import
import CourseLists from './src/screens/CourseLists';
import Courses from './src/screens/Courses';
import Attendance from './src/screens/Attendance';
import AddCourses from './src/screens/AddCourses';
import ViewAttendance from './src/screens/ViewAttendance';
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
        <Stack.Screen name='Attendance' component={Attendance} 
          options={{ 
          title: 'Attendance',
          headerStyle: {
            backgroundColor: '#222831',
          },
          headerTitleStyle: {
              fontSize: 20,
              color: '#fff',
          },
          headerTintColor: '#fff',
        }}
        />
        <Stack.Screen name='AddCourses' component={AddCourses} />
        <Stack.Screen name='ViewAttendance' component={ViewAttendance} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
