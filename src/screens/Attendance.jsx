/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
// /* eslint-disable prettier/prettier */
// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'

// const Attendance = () => {
//   return (
//     <View className="m-8">
//       <Text className="text-3xl text-cyan-300">Attendance</Text>
//     </View>
//   )
// }

// export default Attendance

// const styles = StyleSheet.create({})

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const CalendarScreen = () => {
  const totalStudents = 50; // Assuming 30 students
  const [attendance, setAttendance] = useState(Array(totalStudents).fill(true));

  const handlePress = (index) => {
    const updatedAttendance = [...attendance];
    updatedAttendance[index] = !updatedAttendance[index];
    setAttendance(updatedAttendance);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {attendance.map((isPresent, index) => (
        (index % 2 !== 0) &&
            (<TouchableOpacity
            key={index}
            style={[styles.rollNumber, { backgroundColor: isPresent ? 'green' : 'red' }]}
            onPress={() => handlePress(index)}
            >
            <Text style={styles.rollNumberText}>{index + 1}</Text>
            </TouchableOpacity>)
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 20,
  },
  rollNumber: {
    width: 50,
    height: 50,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  rollNumberText: {
    color: 'white',
    fontSize: 16,
  },
});

export default CalendarScreen