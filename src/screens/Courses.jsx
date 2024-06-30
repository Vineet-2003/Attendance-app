/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Courses = (props) => {
  const {courseId} = props.route.params;
  console.log(courseId);

  
  return (
    <View className="m-8">
      <Text className="text-3xl text-red-500">Courses {courseId}</Text>
      <View className="my-8">
        <Button title="Exam schedule"/>
      </View>
      <View>
        <Button title="Take attendance" onPress={() => (props.navigation.navigate("Attendance"))}/>
      </View>
    </View>
  )
}

export default Courses;

const styles = StyleSheet.create({});