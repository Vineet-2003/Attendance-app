/* eslint-disable no-trailing-spaces */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
// PreviousRecord
import React, {useEffect, useState} from "react";
import {
  StyleSheet,
  View,
  Text,
  LayoutAnimation,
  UIManager,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import {Calendar} from "react-native-calendars";
import {FAB} from "react-native-paper";
import moment from "moment";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Enable LayoutAnimation on Android
if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const classes = [
  {title: "First Class"},
  {title: "Second Class"},
  {title: "Third Class"},
  {title: "Fourth Class"},
];

const PreviousRecord = ({navigation, route}) => {
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD"),
  );
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [currentClass, SetCurrentClass] = useState(1);

  // Attendance
  const {name, id} = route.params;
  const [studentData, setStudentData] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [attendance, setAttendance] = useState([]);
  const [isDataPresent, SetIsDataPresent] = useState(false);
  const [isUpdate, SetIsUpdate] = useState(false);
  useEffect(() => {
    // get student data
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

    // get attendance data

    const dateObject = new Date(selectedDate);

    const year = dateObject.getFullYear();
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero if needed
    const day = dateObject.getDate().toString().padStart(2, '0'); // Add leading zero if needed
    let attendanceId = `${day}${month}${year}_${currentClass}`;
    // console.log(attendanceId);

    AsyncStorage.getItem("AttendanceData").then(attendanceJson => {
      if (attendanceJson !== null) {
        const parsedAttendanceData = JSON.parse(attendanceJson);
        const filteredAttendanceData = parsedAttendanceData.filter(
          course => course.id === id,
        );
        if (filteredAttendanceData.length > 0) {
          const AttendanceData = filteredAttendanceData[0].studentAttendance;
          if (AttendanceData.hasOwnProperty(attendanceId)) {
            SetIsDataPresent(true);
            setAttendance(AttendanceData[attendanceId]);
          } else {
            SetIsDataPresent(false);
          }
        } else {
          console.log("No data is available");
        }
      } else {
        console.log("No data is available in AttendanceData in localStorage");
      }
    });
  }, [selectedDate, currentClass]);

  const handleDayPress = day => {
    setSelectedDate(day.dateString);
    setIsCalendarVisible(false); // Close calendar on date select
  };

  const toggleCalendarVisibility = () => {
    if (isCalendarVisible) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    } else {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    setIsCalendarVisible(!isCalendarVisible);
  };

  // Attendance
  const setUpdate = () => {
    SetIsUpdate(true);
  };

  const handleToggleAttendance = index => {
    const updatedAttendance = [...attendance];
    updatedAttendance[index] = !updatedAttendance[index];
    setAttendance(updatedAttendance);
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Attendance !!",
      `Are you sure you want to delete Attendance of ${selectedDate} of ${classes[currentClass-1].title} ?`,
      [
        {text: "Cancel", style: "cancel"},
        {
          text: "Delete",
          onPress: () => {
            // get attendance data
            const dateObject = new Date(selectedDate);

            const year = dateObject.getFullYear();
            const month = (dateObject.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero if needed
            const day = dateObject.getDate().toString().padStart(2, '0'); // Add leading zero if needed
            let attendanceId = `${day}${month}${year}_${currentClass}`;
            // console.log(attendanceId);

            AsyncStorage.getItem("AttendanceData").then(
              async attendanceJson => {
                if (attendanceJson !== null) {
                  const parsedAttendanceData = JSON.parse(attendanceJson);
                  const filteredAttendanceData = parsedAttendanceData.filter(
                    course => course.id === id,
                  );
                  if (filteredAttendanceData.length > 0) {
                    const AttendanceData = filteredAttendanceData[0].studentAttendance;
                    for (let index = 0; index < AttendanceData.count.length; index++) {
                      if (AttendanceData[`${attendanceId}`][index] === true) {
                        AttendanceData.count[index]--;
                      }
                    }
                    delete AttendanceData[attendanceId];
                    await AsyncStorage.setItem(
                      "AttendanceData",
                      JSON.stringify(parsedAttendanceData),
                    );
                    SetIsDataPresent(false);
                  } else {
                    console.log("No data is available");
                  }
                } else {
                  console.log(
                    "No data is available in AttendanceData in localStorage",
                  );
                }
              },
            );
          },
        },
      ],
    );
  };

  const saveHandle = () => {
    Alert.alert(
      "Save Attendance !!",
      `Are you sure you want to Save Attendance of ${selectedDate} ?`,
      [
        {text: "Cancel", style: "cancel"},
        {
          text: "Save",
          onPress: () => {
            // get attendance data
            const dateObject = new Date(selectedDate);

            const year = dateObject.getFullYear();
            const month = (dateObject.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero if needed
            const day = dateObject.getDate().toString().padStart(2, '0'); // Add leading zero if needed
            let attendanceId = `${day}${month}${year}_${currentClass}`;
            // console.log(attendanceId);

            AsyncStorage.getItem("AttendanceData").then(
              async attendanceJson => {
                if (attendanceJson !== null) {
                  const parsedAttendanceData = JSON.parse(attendanceJson);
                  const filteredAttendanceData = parsedAttendanceData.filter(
                    course => course.id === id,
                  );
                  if (filteredAttendanceData.length > 0) {
                    const AttendanceData = filteredAttendanceData[0].studentAttendance;
                    for (let index = 0; index < AttendanceData.count.length; index++) {
                      if (AttendanceData[`${attendanceId}`][index] === true) {
                        AttendanceData.count[index]--;
                      }
                    }
                    for (let index = 0; index < AttendanceData.count.length; index++) {
                      if (attendance[index] === true) {
                        AttendanceData.count[index]++;
                      }
                    }
                    AttendanceData[attendanceId] = attendance;

                    await AsyncStorage.setItem("AttendanceData", JSON.stringify(parsedAttendanceData),);
                    SetIsUpdate(false);
                    SetIsDataPresent(true);
                  } else {
                    console.log("No data is available");
                  }
                } else {
                  console.log(
                    "No data is available in AttendanceData in localStorage",
                  );
                }
              },
            );
          },
        },
      ],
    );
  };

  const presentCount = attendance.filter(status => status).length;
  const absentCount = totalStudents - presentCount;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.dateText}>
          {moment(selectedDate).format("ddd, D MMM YY")}
        </Text>
        <FAB
          style={styles.fab}
          icon="calendar"
          color="#000"
          onPress={toggleCalendarVisibility}
        />
      </View>
      {isCalendarVisible && (
        <Calendar
          onDayPress={handleDayPress}
          markedDates={{
            [selectedDate]: {
              selected: true,
              marked: true,
              selectedColor: "#00ADB5",
            },
          }}
          theme={{
            todayTextColor: "#00ADB5",
            arrowColor: "#000",
          }}
          style={styles.calendar}
        />
      )}
      <View>
        <SelectDropdown
          data={classes}
          onSelect={(selectedItem, index) => {
            SetCurrentClass(index+1);
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
                <Icon name={item.icon} style={styles.dropdownItemIconStyle} />
                <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
          dropdownStyle={styles.dropdownMenuStyle}
        />
      </View>
      <View>
        {isDataPresent === true ? (
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <View style={styles.attendanceSummary}>
                <Icon name="person" size={28} color="#000" />
                <Text style={styles.presentText}>{presentCount}</Text>
                <Icon name="person" size={28} color="#000" />
                <Text style={styles.absentText}>{absentCount}</Text>
              </View>
            </View>
            <ScrollView contentContainerStyle={styles.attendanceContainer}>
              {attendance.length > 0 &&
                attendance.map((isPresent, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() =>
                        isUpdate ? handleToggleAttendance(index) : ""
                      }
                    >
                      <View
                        style={[
                          styles.attendanceItem,
                          isPresent ? styles.present : styles.absent,
                        ]}
                      >
                        <Text style={styles.attendanceText}>
                          {studentData[index].RollNumber % 1000}
                        </Text>
                        <Icon
                          name={isPresent ? "checkmark" : "close"}
                          size={24}
                          color={isPresent ? "green" : "red"}
                        />
                      </View>
                    </TouchableOpacity>
                  );
                })}
            </ScrollView>
            <View style={styles.floatingButtonContainer}>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDelete}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={setUpdate}>
                <Text style={styles.buttonText}>Update</Text>
              </TouchableOpacity>
              {isUpdate && (
                <TouchableOpacity style={styles.button} onPress={saveHandle}>
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>{`No Records for ${moment(
              selectedDate,
            ).format("ddd, D MMM YY")}`}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    elevation: 5,
  },
  dateText: {
    fontSize: 18,
    color: "#000",
  },
  fab: {
    backgroundColor: "#00ADB5",
  },
  calendar: {
    // marginTop: 10,
    // elevation: 5,
  },
  dropdownButtonStyle: {
    width: "90%",
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
  subContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFF",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
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
  attendanceContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    flexWrap: "wrap",
    marginTop: 20,
  },
  attendanceItem: {
    marginHorizontal: 10,
    marginBottom: 20,
    alignItems: "center",
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
  },
  floatingButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#00ADB5",
    padding: 5,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    width: 90,
    height: 60,
    elevation: 4,
  },
  deleteButton: {
    backgroundColor: "#FF2E63",
    padding: 5,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    width: 90,
    height: 60,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  messageContainer: {
    marginTop: 100,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  messageText: {
    color: "#000",
    fontSize: 18,
  },
});

export default PreviousRecord;
