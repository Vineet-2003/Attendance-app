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
import GenerateReport from './src/screens/GenerateReport';
import PreviousRecord from './src/screens/PreviousRecord';
import AttendanceOE from './src/screens/AttendanceOE';
import GenerateReportOE from './src/screens/GenerateReportOE';
import PreviousRecordOE from './src/screens/PreviousRecordOE';
const Stack = createNativeStackNavigator();


function App(){
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
          options={ ({ navigation }) => ({ 
          title: 'Attendance',
          headerStyle: {
            backgroundColor: '#222831',
          },
          headerTitleStyle: {
              fontSize: 20,
              color: '#fff',
          },
          headerTintColor: '#fff',
        })}
        />
        <Stack.Screen name='AddCourses' component={AddCourses} />
        <Stack.Screen name="PreviousRecord" component={PreviousRecord} />
        <Stack.Screen name='GenerateReport' component={GenerateReport} />
        <Stack.Screen name='AttendanceOE' component={AttendanceOE} />
        <Stack.Screen name='GenerateReportOE' component={GenerateReportOE} />
        <Stack.Screen name='PreviousRecordOE' component={PreviousRecordOE} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
