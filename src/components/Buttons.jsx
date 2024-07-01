/* eslint-disable jsx-quotes */
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Buttons = ({navigation}) => {
  return (
    <View>
          <Button style={styles.button}onPress={() => (navigation.navigate("Courses", {
              courseId: 123,
          }))} title='course1'/>
    </View>
  )
}

export default Buttons

const styles = StyleSheet.create({
    button: {
        backgroundColor: 'white',
    }
})