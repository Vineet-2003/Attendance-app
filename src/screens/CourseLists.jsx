/* eslint-disable quotes */
// eslint-disable-next-line prettier/prettier
/* eslint-disable jsx-quotes */
/* eslint-disable prettier/prettier */
import {StyleSheet, Text, View, Button} from 'react-native';
import React from 'react';

// navigation


const CourseLists = ({ navigation }) => {
  return (
    <View>
      <View>
        <Text>List of Courses</Text>
      </View>
      <View className='m-8'>
        <View className='mx-3 my-5'>
          <Button onPress={() => (navigation.navigate("Courses", {
              courseId: 123,
          }))} title='course1'/>
        </View>
        <View className='mx-3 my-5'>
          <Button 
          onPress={() => (navigation.navigate("Courses", {
              courseId: 345,
          }))}
          title='course2'/>
        </View>
        <View className='mx-3 my-5'>
          <Button 
          onPress={() => (navigation.navigate("Courses", {
              courseId: 321,
          }))}
          title='course3'/>
        </View>
        <View className='mx-3 my-5'>
          <Button 
          onPress={() => (navigation.navigate("Courses", {
              courseId: 567,
          }))}
          title='course4'/>
        </View>
      </View>
    </View>
  );
};

export default CourseLists;

const styles = StyleSheet.create({});
