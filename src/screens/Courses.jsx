/* eslint-disable no-trailing-spaces */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable eol-last */
/* eslint-disable semi */
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */

import {
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  FlatList,
  Animated,
} from "react-native";
import React, {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Modal, PaperProvider, Portal} from "react-native-paper";

const Courses = props => {
  const [studentData, setStudentData] = useState([]);
  const {name, id, year, type, electiveType, section, session} = props.route.params;
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
              const existingStudentData = await AsyncStorage.getItem(
                "studentData",
              );
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
              const existingAttendanceData = await AsyncStorage.getItem(
                "AttendanceData",
              );
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

  const navigateToAttendance = () => navigation.navigate("Attendance", props.route.params);
  const navigateToAttendanceOE = () => navigation.navigate("AttendanceOE", props.route.params);

  const navigateToGenerateReport = () => navigation.navigate("GenerateReport", props.route.params);
  const navigateToGenerateReportOE = () => navigation.navigate("GenerateReportOE", props.route.params);

  const navigateToPreviousRecord = () => navigation.navigate("PreviousRecord", props.route.params);
  const navigateToPreviousRecordOE = () => navigation.navigate("PreviousRecordOE", props.route.params);

  const renderItem = ({item}) => {
    if (item.type === "course") {
      return (
        <View style={styles.courseContainer}>
          <Text style={styles.courseItem}>Course Name: {name}</Text>
          <Text style={styles.courseItem}>Course Code: {id}</Text>
          <Text style={styles.courseItem}>Year: {year}</Text>
          <Text style={styles.courseItem}>Session: {session}</Text>
          <Text style={styles.courseItem}>Type: {type}</Text>
          {electiveType && <Text style={styles.courseItem}>Elective-Type: {electiveType}</Text>}
          {type === "core" && (
            <Text style={styles.courseItem}>Section: {section}</Text>
          )}
        </View>
      );
    } else if (item.type === "button") {
      return (
        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <Button
              color="#00ADB5"
              title={"View Student Data"}
              onPress={showModal}
            />
          </View>
          <View style={styles.button}>
            <Button
              color="#00ADB5"
              title="Take Attendance"
              onPress={electiveType === "OE" ? navigateToAttendanceOE : navigateToAttendance}
            />
          </View>
          <View style={styles.button}>
            <Button
              color="#00ADB5"
              title="Previous Records"
              onPress={electiveType === "OE" ? navigateToPreviousRecordOE : navigateToPreviousRecord}
            />
          </View>
          <View style={styles.button}>
            <Button
              color="#00ADB5"
              title="Generate Report"
              onPress={electiveType === "OE" ? navigateToGenerateReportOE : navigateToGenerateReport}
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

  const data = [{type: "course"}, {type: "button"}];

  const [visible, setVisible] = useState(false);
  const opacity = useState(new Animated.Value(0))[0];

  // Reduce animation duration to improve UX speed
const animationDuration = 10; // Set duration to 150ms for faster animations

const showModal = () => {
  setVisible(true);
  Animated.timing(opacity, {
    toValue: 1,
    duration: animationDuration,
    useNativeDriver: true,
  }).start();
};

const hideModal = () => {
  // setVisible(false);
  Animated.timing(opacity, {
    toValue: 0,
    duration: animationDuration,
    useNativeDriver: true,
  }).start(() => setVisible(false));
};
  
  const containerStyle = {
    backgroundColor: "white",
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 20,
    opacity: opacity, // Link opacity to Animated View
  };

  return (
    <PaperProvider>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={containerStyle}
        >
          <View>
            <Text style={styles.headingText}>Student Data of {name}</Text>
            <FlatList
              data={studentData}
              renderItem={({item}) => (
                <View style={styles.row}>
                  {electiveType === "OE" && <Text style={styles.cell}>{item.Department}</Text>}
                  <Text style={styles.cell}>{item.RollNumber}</Text>
                  <Text style={styles.cell}>{item.Name}</Text>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </Modal>
      </Portal>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.scrollView}
      />
    </PaperProvider>
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
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
  },
  courseItem: {
    fontSize: 20,
    marginBottom: 5,
    color: "#000",
  },
  studentDataContainer: {
    marginTop: 10,
    padding: 15,
    backgroundColor: "#e8e8e8",
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  tableContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  tableElement: {
    fontSize: 16,
    color: "#000",
  },
  table: {
    flex: 1,
    padding: 10,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  cell: {
    flex: 1,
    padding: 5,
    textAlign: "center",
    color: "#000",
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    marginBottom: 10,
  },
  headingText: {
    fontSize: 18,
    color: "#000",
    textAlign: "center",
    margin: 5,
  },
});
