/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
/* eslint-disable no-shadow */
/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import React, {useEffect, useRef, useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  UIManager,
  LayoutAnimation,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Calendar from "../components/Calendar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SelectDropdown from "react-native-select-dropdown";
import {DataTable} from "react-native-paper";

const Attendance = ({navigation, route}) => {
  const {name, id} = route.params;
  const [title, setTitle] = useState("Attendance");
  const [studentData, setStudentData] = useState([]);

  const [totalStudents, setTotalStudents] = useState(0);
  const [attendance, setAttendance] = useState([]);
  const [allPresent, setAllPresent] = useState(true);

  const [date, SetDate] = useState();
  const [currentClass, SetCurrentClass] = useState(1);

  const getDateFromCalendar = data => {
    SetDate(data);
  };

  if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    AsyncStorage.getItem("studentData")
      .then(studentsJson => {
        if (studentsJson !== null) {
          // Data found, parse JSON string back to array
          const parsedData = JSON.parse(studentsJson);
          const filteredCourse = parsedData.filter(course => course.id === id);
          if (filteredCourse.length > 0) {
            const data = filteredCourse[0].studentData;
            setStudentData(data);
            setTotalStudents(data.length);
            const initialAttendance = Array(data.length).fill(true); // true means present, false means absent
            setAttendance(initialAttendance);
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

  useEffect(() => {
    setTitle(name);
    navigation.setOptions({title});
  }, [name, navigation, title]);

  // console.log(studentData);

  const handleToggleAttendance = index => {
    const updatedAttendance = [...attendance];
    updatedAttendance[index] = !updatedAttendance[index];
    setAttendance(updatedAttendance);
  };

  const toggleAllAttendance = () => {
    const newAttendanceState = !allPresent;
    setAttendance(Array(totalStudents).fill(newAttendanceState));
    setAllPresent(newAttendanceState);
  };

  const resetAttendance = () => {
    const initialAttendance = Array(totalStudents).fill(true);
    setAttendance(initialAttendance);
    setAllPresent(true);
  };

  const saveAttendance = async () => {
    const DATE = new Date(date);

    const year = DATE.getFullYear();
    const month = (DATE.getMonth() + 1).toString().padStart(2, "0"); // Add leading zero if needed
    const day = DATE.getDate().toString().padStart(2, "0"); // Add leading zero if needed
    let attendanceId = `${day}${month}${year}_${currentClass}`;

    try {
      const existingAttendanceData = await AsyncStorage.getItem(
        "AttendanceData",
      );
      const parsedAttendanceData = existingAttendanceData
        ? JSON.parse(existingAttendanceData)
        : [];

      const filteredAttendanceData = parsedAttendanceData.filter(
        course => course.id === id,
      );

      if (filteredAttendanceData.length > 0) {
        const AttendanceData = filteredAttendanceData[0].studentAttendance;

        // If attendance data exists for the given date (attendanceId)
        if (AttendanceData.hasOwnProperty(attendanceId)) {
          Alert.alert(
            "Update Attendance",
            "Attendance for this class already exists. Do you want to update it?",
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Update",
                style: "default",
                onPress: async () => {
                  // Decrease the count for previously marked students
                  for (
                    let index = 0;
                    index < AttendanceData.count.length;
                    index++
                  ) {
                    if (AttendanceData[attendanceId][index] === true) {
                      AttendanceData.count[index]--;
                    }
                  }

                  // Update attendance count with the new data
                  for (
                    let index = 0;
                    index < AttendanceData.count.length;
                    index++
                  ) {
                    if (attendance[index] === true) {
                      AttendanceData.count[index]++;
                    }
                  }

                  // Update the attendance data for the specific day
                  AttendanceData[attendanceId] = attendance;
                  await AsyncStorage.setItem(
                    "AttendanceData",
                    JSON.stringify(parsedAttendanceData),
                  );
                  Alert.alert("Attendance is Updated");
                  navigation.goBack(); // Navigate back after update
                },
              },
            ],
          );
        } else {
          // Handle saving new attendance
          for (let index = 0; index < AttendanceData.count.length; index++) {
            if (attendance[index] === true) {
              AttendanceData.count[index]++;
            }
          }
          AttendanceData[attendanceId] = attendance;
          await AsyncStorage.setItem(
            "AttendanceData",
            JSON.stringify(parsedAttendanceData),
          );
          Alert.alert("Attendance is Saved");
          navigation.goBack(); // Navigate back after saving
        }
      }
    } catch (error) {
      console.log(`Save Attendance error: ${error}`);
    }
  };

  const presentCount = attendance.filter(status => status).length;
  const absentCount = totalStudents - presentCount;

  // handle select options
  const classes = [
    {title: "First Class"},
    {title: "Second Class"},
    {title: "Third Class"},
    {title: "Fourth Class"},
  ];

  return (
    <ScrollView>
      <Calendar onSendData={getDateFromCalendar} />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View>
            <SelectDropdown
              data={classes}
              onSelect={(selectedItem, index) => {
                SetCurrentClass(index + 1);
              }}
              renderButton={(selectedItem, isOpened) => {
                return (
                  <View style={styles.dropdownButtonStyle}>
                    {selectedItem && (
                      <Icon
                        name={selectedItem.icon}
                        style={styles.dropdownButtonIconStyle}
                      />
                    )}
                    <Text style={styles.dropdownButtonTxtStyle}>
                      {(selectedItem && selectedItem.title) || "First Class"}
                    </Text>
                    <Icon
                      name={isOpened ? "chevron-up" : "chevron-down"}
                      style={styles.dropdownButtonArrowStyle}
                    />
                  </View>
                );
              }}
              renderItem={(item, index, isSelected) => {
                return (
                  <View
                    style={{
                      ...styles.dropdownItemStyle,
                      ...(isSelected && {backgroundColor: "#D2D9DF"}),
                    }}
                  >
                    <Icon
                      name={item.icon}
                      style={styles.dropdownItemIconStyle}
                    />
                    <Text style={styles.dropdownItemTxtStyle}>
                      {item.title}
                    </Text>
                  </View>
                );
              }}
              showsVerticalScrollIndicator={false}
              dropdownStyle={styles.dropdownMenuStyle}
            />
          </View>
          <View style={styles.attendanceSummary}>
            <Icon name="person" size={28} color="#000" />
            <Text style={styles.presentText}>{presentCount}</Text>
            <Icon name="person" size={28} color="#000" />
            <Text style={styles.absentText}>{absentCount}</Text>
          </View>
        </View>
        <View style={styles.gridHeader}>
          <Text style={styles.gridHeaderText}>Department</Text>
          <Text style={styles.gridHeaderText}>Roll Number</Text>
          <Text style={styles.gridHeaderText}>Attendance</Text>
        </View>
        <ScrollView contentContainerStyle={styles.attendanceContainer}>
          {attendance.length > 0 && attendance.map((isPresent, index) => {
            return (
              <TouchableOpacity key={index} onPress={() => handleToggleAttendance(index)}>
                <View style={[styles.attendanceItem, isPresent ? styles.present : styles.absent]}>
                  <Text style={styles.attendanceText}>{studentData[index].Department}</Text>
                  <Text style={styles.attendanceText}>{studentData[index].RollNumber}</Text>
                  <Icon name={isPresent ? 'checkmark' : 'close'} size={24} color={isPresent ? 'green' : 'red'} />
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* <ScrollView contentContainerStyle={styles.attendanceContainer}>
          {attendance.length > 0 && attendance.map((isPresent, index) => {
            return (
              <TouchableOpacity key={index} onPress={() => handleToggleAttendance(index)}>
                <View style={[styles.attendanceItem, isPresent ? styles.present : styles.absent]}>
                  <Text style={styles.attendanceText}>{studentData[index].Department.split(" ")[0]}</Text>
                  <Text style={styles.attendanceText}>{studentData[index].RollNumber}</Text>
                  <Icon name={isPresent ? 'checkmark' : 'close'} size={24} color={isPresent ? 'green' : 'red'} />
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView> */}
        <View style={styles.floatingButtonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleAllAttendance}>
            <Icon
              name={allPresent ? "person-remove" : "person-add"}
              size={24}
              color="#FFF"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={resetAttendance}>
            <Icon name="refresh" size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={saveAttendance}>
            <Icon name="save" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Attendance;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFF",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  menuContainer: {
    position: "absolute",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00ADB5",
  },
  attendanceSummary: {
    flexDirection: "row",
  },
  presentText: {
    fontSize: 18,
    color: "green",
    marginRight: 10,
  },
  absentText: {
    fontSize: 18,
    color: "red",
  },
  gridHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    // paddingHorizontal: 20,
  },
  gridHeaderText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 5,
  },
  attendanceContainer: {
    flexDirection: "column",
    marginTop: 20,
  },
  attendanceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#EEEEEE",
  },
  present: {
    borderColor: "green",
    borderWidth: 2,
  },
  absent: {
    borderColor: "red",
    borderWidth: 2,
  },
  attendanceText: {
    fontSize: 18,
    color: "#000",
    marginRight: 10,
  },
  attendanceTextDept: {
    fontSize: 18,
    color: "#000",
    marginRight: 10,
    justifyItem: "flex-start",
  },
  floatingButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#00ADB5",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
  },
  dropdownButtonStyle: {
    width: 200,
    height: 50,
    backgroundColor: "#E9ECEF",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
    color: "#393E46",
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: "#E9ECEF",
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },

});
