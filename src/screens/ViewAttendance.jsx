/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

const ViewAttendance = ({route}) => {
  const { name , id} = route.params;
  const [studentData, setStudentData] = useState([]);
  const [attendanceCount, setAttendanceCount] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    AsyncStorage.getItem("AttendanceData")
      .then(existingAttendanceData => {
        if (existingAttendanceData !== null) {
          // Data found, parse JSON string back to array
          const parsedAttendanceData = JSON.parse(existingAttendanceData);
          const filteredAttendanceData = parsedAttendanceData.filter(course => course.id === id);
          console.log(filteredAttendanceData);
          if (filteredAttendanceData.length > 0) {
            const AttendanceData = filteredAttendanceData[0].studentAttendance;
            console.log(AttendanceData);
            setAttendanceCount(AttendanceData.count);
            setTotal(Object.keys(AttendanceData).length - 1);
          } else {
            console.log(`No data found with ID ${id}`);
          }
        } else {
          console.log(`No data found for course`);
        }
      })
      .catch(error => {
        console.error("Error retrieving data:", error);
      });

      AsyncStorage.getItem("studentData")
      .then(studentsJson => {
        if (studentsJson !== null) {
          // Data found, parse JSON string back to array
          const parsedData = JSON.parse(studentsJson);
          const filteredCourse = parsedData.filter(course => course.id === id);
          if (filteredCourse.length > 0) {
            const data = filteredCourse[0].studentData;
            setStudentData(data);
            // console.log(`Student data for ${id}:`, data[0].name);
          } else {
            console.log(`No course found with ID ${id}`);
          }
        } else {
          console.log(`No data found for course`);
        }
      })
      .catch(error => {
        console.error("Error retrieving data:", error);
      });

  }, []);


  return (
    <ScrollView style={styles.container}>
    <Text style={styles.title}>Attendance for {name}</Text>
    <Text style={styles.subtitle}>Total Classes Recorded: {total}</Text>
    <View style={styles.tableHeader}>
      <Text style={styles.tableHeaderText}>Roll Number</Text>
      <Text style={styles.tableHeaderText}>Name</Text>
      <Text style={styles.tableHeaderText}>Percentage</Text>
    </View>
    {studentData.map((student, index) => (
      <View key={index} style={styles.row}>
        <Text style={styles.rowText}>{student.RollNumber}</Text>
        <Text style={styles.rowText}>{student.Name}</Text>
        <Text style={styles.rowText}>{total === 0 ? 0 : ((attendanceCount[index] / total) * 100).toFixed(2)}%</Text>
      </View>
    ))}
  </ScrollView>

  )
}

export default ViewAttendance

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00ADB5',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tableHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    paddingVertical: 8,
  },
  rowText: {
    fontSize: 16,
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
});