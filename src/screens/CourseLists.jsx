/* eslint-disable no-trailing-spaces */
/* eslint-disable quotes */
// eslint-disable-next-line prettier/prettier
/* eslint-disable jsx-quotes */
/* eslint-disable prettier/prettier */
import {StyleSheet, Text, View, Button, ScrollView} from 'react-native';
import React from 'react';

// import components
import Buttons from '../components/Buttons';


const CourseLists = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <View className='my-6 mx-2'>
        <Buttons />
      </View>
    </ScrollView>
  );
};

export default CourseLists;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EEEEEE',

  }
});
