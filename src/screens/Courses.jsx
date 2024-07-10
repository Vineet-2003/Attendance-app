/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable eol-last */
/* eslint-disable semi */
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */

import {StyleSheet, Text, View, Button, Alert, ScrollView, FlatList} from "react-native";
import React, {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Title} from "react-native-paper";

const Courses = props => {
  const [studentData, setStudentData] = useState([]);
  const [flag, setFlag] = useState(false);
  const {name, id, year, type, section} = props.route.params;
  const navigation = props.navigation;

  useEffect(() => {
    AsyncStorage.getItem("studentData")
      .then(studentsJson => {
        if (studentsJson !== null) {
          // Data found, parse JSON string back to array
          const parsedData = JSON.parse(studentsJson);
          const filteredCourse = parsedData.filter(course => course.id === id);
          if (filteredCourse.length > 0) {
            const data = filteredCourse[0].studentData;
            setStudentData(data);
            console.log(`Student data for ${id}:`, data[0].name);
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

  const deleteCourse = async courseId => {
    Alert.alert(
      "Delete Course",
      "Are you sure you want to delete this course?",
      [
        {text: "Cancel", style: "cancel"},
        {
          text: "Delete",
          onPress: async () => {
            try {
              const existingCourses = await AsyncStorage.getItem("courses");
              const parsedCourses = existingCourses
                ? JSON.parse(existingCourses)
                : [];
              const updatedCourses = parsedCourses.filter(
                course => course.id !== courseId,
              );
              await AsyncStorage.setItem(
                "courses",
                JSON.stringify(updatedCourses),
              );
            } catch (error) {
              console.error("Error deleting course:", error);
            }
            try {
              const existingStudentData = await AsyncStorage.getItem("studentData");
              const parsedStudentData = existingStudentData
                ? JSON.parse(existingStudentData)
                : [];
              const updatedStudentData = parsedStudentData.filter(
                course => course.id !== courseId,
              );
              await AsyncStorage.setItem(
                "studentData",
                JSON.stringify(updatedStudentData),
              );
            } catch (error) {
              console.error("Error deleting studentData:", error);
            }
            try {
              const existingAttendanceData = await AsyncStorage.getItem("AttendanceData");
              const parsedAttendanceData = existingAttendanceData
                ? JSON.parse(existingAttendanceData)
                : [];
              const updatedAttendanceData = parsedAttendanceData.filter(
                course => course.id !== courseId,
              );
              await AsyncStorage.setItem(
                "AttendanceData",
                JSON.stringify(updatedAttendanceData),
              );
              navigation.navigate("CourseList");
            } catch (error) {
              console.error("Error deleting AttendanceData:", error);
            }
          },
        },
      ],
    );
  };

  const viewStudentData = () => {
    const bool = flag;
    console.log(bool);
    setFlag(!bool);
  };

  const renderItem = ({ item }) => {
    if (item.type === 'course') {
      return (
        <View style={styles.courseContainer}>
          <Text style={styles.courseItem}>Course Name: {name}</Text>
          <Text style={styles.courseItem}>Course Code: {id}</Text>
          <Text style={styles.courseItem}>Year: {year}</Text>
          <Text style={styles.courseItem}>Type: {type}</Text>
          {type === "elective" && (<Text style={styles.courseItem}>Section: {section}</Text>)}
        </View>
      );
    } else if (item.type === 'student') {
      return (
        <View style={styles.row}>
          <Text style={styles.cell}>{item.RollNumber}</Text>
          <Text style={styles.cell}>{item.Name}</Text>
        </View>
      );
    } else if (item.type === 'button') {
      return (
        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <Button
              color="#00ADB5"
              title={flag ? "Remove Student Data" : "View Student Data"}
              onPress={viewStudentData}
            />
          </View>
          <View style={styles.button}>
            <Button
              color="#00ADB5"
              title="Take Attendance"
              onPress={() => navigation.navigate("Attendance", props.route.params)}
            />
          </View>
          <View style={styles.button}>
            <Button
              color="#00ADB5"
              title="View Attendance"
              onPress={() => navigation.navigate("ViewAttendance", props.route.params)}
            />
          </View>
          <View style={styles.button}>
            <Button
              color="#FF2E63"
              title="Delete Course"
              onPress={() => deleteCourse(id)}
            />
          </View>
        </View>
      );
    }
  };

  const data = [
    { type: 'course' },
    ...flag ? studentData.map((item) => ({ ...item, type: 'student' })) : [],
    { type: 'button' },
  ];

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={styles.scrollView}
    />
  );
};

export default Courses;

const styles = StyleSheet.create({
  scrollView: {
    padding: 20,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  courseContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
  },
  courseItem: {
    fontSize: 20,
    marginBottom: 5,
    color: '#000',
  },
  studentDataContainer: {
    marginTop: 10,
    padding: 15,
    backgroundColor: '#e8e8e8',
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tableContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  tableElement: {
    fontSize: 16,
    color: '#000',
  },
  table: {
    flex: 1,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cell: {
    flex: 1,
    padding: 5,
    textAlign: 'center',
    color: '#000'
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    marginBottom: 10,
  },
});