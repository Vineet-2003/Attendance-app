/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line prettier/prettier
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */

/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import React, {useEffect, useState, useCallback} from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  Platform,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import XLSX from "xlsx";
import RNFS from "react-native-fs";
import {Modal, PaperProvider, Portal} from "react-native-paper";

const GenerateReportOE = ({route}) => {
  const {name, id} = route.params;
  const [studentData, setStudentData] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [totalDays, setTotalDays] = useState(0);
  const [displayData, setDisplayData] = useState([]);
  const [originalData, setOriginalData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch attendance data from AsyncStorage
        const existingAttendanceData = await AsyncStorage.getItem(
          "AttendanceData",
        );
        if (existingAttendanceData) {
          const parsedAttendanceData = JSON.parse(existingAttendanceData);
          const filteredAttendanceData = parsedAttendanceData.filter(
            course => course.id === id,
          );
          if (filteredAttendanceData.length > 0) {
            const AttendanceData = filteredAttendanceData[0].studentAttendance;
            setAttendanceData(AttendanceData);
            setTotalDays(Object.keys(AttendanceData).length - 1); // Subtracting 1 for the 'count' key
          } else {
            console.log(`No data found with ID ${id}`);
          }
        } else {
          console.log(`No data found for course`);
        }

        // Fetch student data from AsyncStorage
        const studentsJson = await AsyncStorage.getItem("studentData");
        if (studentsJson) {
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
      } catch (error) {
        console.error("Error retrieving data:", error);
      }
    };

    fetchData();
  }, [id]);

  const calculateAttendanceData = useCallback(() => {
    const dates = Object.keys(attendanceData).filter(date => date !== "count");
    return studentData.map((student, index) => {
      const rollNumber = student.RollNumber;
      const attendanceRecords = [];
      let attendedDays = 0;

      dates.forEach(date => {
        const isPresent = attendanceData[date][index] || false;
        attendanceRecords.push(isPresent ? "P" : "A");
        if (isPresent) {
          attendedDays++;
        }
      });

      const percentage =
        totalDays === 0 ? 0 : ((attendedDays / totalDays) * 100).toFixed(2);

      return {
        RollNumber: student.RollNumber,
        Name: student.Name,
        ...Object.fromEntries(
          attendanceRecords.map((record, i) => [`${dates[i]}`, record]),
        ),
        "Total Attendance": `${percentage}%`,
      };
    });
  }, [studentData, attendanceData, totalDays]);

  useEffect(() => {
    const mergedData = calculateAttendanceData();
    setOriginalData(mergedData);
    setDisplayData(mergedData);
  }, [calculateAttendanceData]);

  const saveExcel = async () => {
    const fileName = `Attendance_${name}.xlsx`;

    // Determine the appropriate directory based on platform
    let path = "";
    if (Platform.OS === "ios") {
      path = `${RNFS.DocumentDirectoryPath}/${fileName}`;
    } else if (Platform.OS === "android") {
      path = `${RNFS.DownloadDirectoryPath}/${fileName}`;
    } else {
      Alert.alert(
        "Unsupported Platform",
        "Saving Excel files is not supported on this platform.",
        [{text: "OK"}],
      );
      return;
    }

    // Prepare data in the format required by xlsx library
    const dates = Object.keys(attendanceData).filter(date => date !== "count");
    const formattedDates = dates.map(date => {
      return convertToDate(date);
    }); // Convert and format dates

    const header = [
      "Roll Number",
      "Name",
      ...formattedDates,
      "Total Attendance",
    ];
    const data = displayData.map(student => ({
      "Roll Number": student.RollNumber,
      Name: student.Name,
      ...Object.fromEntries(
        formattedDates.map((date, i) => [formattedDates[i], student[dates[i]]]),
      ), // Map formatted dates to student data
      "Total Attendance": student["Total Attendance"],
    }));

    // Create a new workbook and add a worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

    // Write the workbook to a file
    try {
      const excelBuffer = XLSX.write(workbook, {
        type: "base64",
        bookType: "xlsx",
      });
      await RNFS.writeFile(path, excelBuffer, "base64");
      Alert.alert("Completed", `Excel file saved successfully at ${path}`, [
        {text: "OK"},
        {
          text: "Cancel",
          style: "cancel",
        },
      ]);
    } catch (error) {
      console.error("Error saving Excel file:", error);
      Alert.alert("Error", "Failed to save Excel file", [{text: "OK"}]);
    }
  };

  const filterData = (min, max) => {
    const filteredData = originalData.filter(student => {
      const attendancePercentage = parseFloat(student["Total Attendance"]);
      return attendancePercentage >= min && attendancePercentage <= max;
    });
    setDisplayData(filteredData);
  };

  // handle model
  const [visible, setVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const showModal = student => {
    setSelectedStudent(student);
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
    setSelectedStudent(null);
  };

  const containerStyle = {backgroundColor: "white", padding: 20, marginHorizontal: 10,};
  function isKey(value) {
    const regex = /^\d{8}_\d$/;
    if(regex.test(value)){
      return (selectedStudent[value] === "A");
    }
    return false;
  }
  function convertToDate(date){
    const [datePart, classNumber] = date.split("_");
    const day = datePart.slice(0, 2);
    const month = datePart.slice(2, 4);
    const year = datePart.slice(4, 8);
    const formattedDate = `${day}/${month}/${year}`;

    return `${formattedDate} (Class ${classNumber})`;
  }

  return (
    <PaperProvider>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={containerStyle}
        >
          <View>
            {selectedStudent && (
              <>
                <Text style={styles.modelTitle}>
                  Roll Number: {selectedStudent.RollNumber}
                </Text>
                <Text style={styles.modelTitle}>Dates of Absentees:</Text>
                <Text style={styles.modelContent}>{Object.keys(selectedStudent).filter(key => isKey(key)).map(date => convertToDate(date)).join(',\n ')}</Text>
              </>
            )}
          </View>
        </Modal>
      </Portal>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Attendance for {name}</Text>
        <Text style={styles.subtitle}>Total Classes Recorded: {totalDays}</Text>
        <View style={styles.buttonContainer}>
          <Button
            title="All"
            onPress={() => setDisplayData(calculateAttendanceData())}
            style={styles.button}
          />
          <Button
            title=">= 75%"
            onPress={() => filterData(75, 100)}
            style={styles.button}
          />
          <Button
            title="65% - 74%"
            onPress={() => filterData(65, 74)}
            style={styles.button}
          />
          <Button
            title="50% - 64%"
            onPress={() => filterData(50, 64)}
            style={styles.button}
          />
          <Button
            title="< 50%"
            onPress={() => filterData(0, 49)}
            style={styles.button}
          />
        </View>
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Roll Number</Text>
            <Text style={styles.tableHeaderText}>Name</Text>
            <Text style={styles.tableHeaderText}>Total Attendance</Text>
          </View>
          {displayData.length > 0 ? (
            displayData.map((student, index) => (
              <TouchableOpacity key={index} onPress={() => showModal(student)}>
                <View style={styles.row}>
                  <Text style={styles.rowText}>{student.RollNumber}</Text>
                  <Text style={styles.rowText}>{student.Name}</Text>
                  <Text style={styles.rowText}>
                    {student["Total Attendance"]}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noDataText}>No student data available</Text>
          )}
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Save as Excel" onPress={saveExcel} />
        </View>
      </ScrollView>
    </PaperProvider>
  );
};

export default GenerateReportOE;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00ADB5",
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 12,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 16,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f4f4f4",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
  },
  row: {
    flexDirection: "row",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  rowText: {
    flex: 1,
    textAlign: "center",
    color: "#000",
  },
  noDataText: {
    textAlign: "center",
    padding: 16,
    color: "#999",
  },
  modelTitle:{
    fontSize: 18,
    color: '#000',
  },
  modelContent: {
    fontSize: 14,
    marginLeft: 10,
    color: '#000',
  },
});
