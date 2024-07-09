/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable eol-last */
/* eslint-disable semi */
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */

import {StyleSheet, Text, View, Button, Alert, ScrollView} from "react-native";
import React, {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Title} from "react-native-paper";

const Courses = props => {
  const [studentData, setStudentData] = useState([]);
  const [flag, setFlag] = useState(false);
  const {name, id, year, section} = props.route.params;
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
              navigation.navigate("CourseList");
            } catch (error) {
              console.error("Error deleting course:", error);
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

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.courseContainer}>
          <Text style={styles.courseItem}>Course Name: {name}</Text>
          <Text style={styles.courseItem}>Course Code: {id}</Text>
          <Text style={styles.courseItem}>Year: {year}</Text>
          <Text style={styles.courseItem}>Section: {section}</Text>
        </View>
        <View style={{marginTop: 10}}>
          {flag && studentData.length > 0 && (
            <ScrollView>
              <Title>Student Data</Title>
              {studentData.map((item, index) => {
                console.log(item.RollNumber);
                return (
                  <View key={index} style={styles.tableContainer}>
                    <Text style={styles.tableElement}>{item.RollNumber}</Text>
                    <Text style={styles.tableElement}>{item.Name}</Text>
                  </View>
                );
              })}
            </ScrollView>
          )}
        </View>
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
              onPress={() =>
                navigation.navigate("Attendance", props.route.params)
              }
            />
          </View>
          <View style={styles.button}>
            <Button color="#00ADB5" title="View Attendance" 
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
      </View>
    </ScrollView>
  );
};

export default Courses;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    flex: 1,
    justifyContent: "flex-start",
  },
  courseContainer: {
    alignItems: "left",
    paddingHorizontal: 12,
  },
  courseItem: {
    color: "#393E46",
    fontSize: 20,
    marginBottom: 10,
  },
  buttonContainer: {
    marginVertical: 50,
    flex: 1,
  },
  button: {
    marginBottom: 25,
  },
  tableContainer: {
    // flex:1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  tableElement: {
    fontSize: 18,
    color: "#000",
  },
});
