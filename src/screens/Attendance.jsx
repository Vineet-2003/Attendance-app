/* eslint-disable no-shadow */
/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import React,{useEffect, useState}from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Calendar from "../components/Calendar";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Attendance = ({navigation, route}) => {
  const { name , id} = route.params;
  const [title, setTitle] = useState('Attendance');
  const [studentData, setStudentData] = useState([]);

  const [totalStudents, setTotalStudents] = useState(0);
  const [attendance, setAttendance] = useState([]);
  const [allPresent, setAllPresent] = useState(true);

  const [date, SetDate] = useState();

  const getDateFromCalendar = (data) => {
    SetDate(data);
  };
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
    navigation.setOptions({ title });
  }, [name, navigation, title]);

  // console.log(studentData);


  const handleToggleAttendance = (index) => {
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
    const month = DATE.getMonth() + 1; // getMonth() returns 0-11, so add 1
    const day = DATE.getDate();
    const attendanceId = `${day}${month}${year}`;
    
    try {
      const existingAttendanceData = await AsyncStorage.getItem('AttendanceData');
      const parsedAttendanceData = JSON.parse(existingAttendanceData);
      const filteredAttendanceData = parsedAttendanceData.filter(course => course.id === id);
      console.log(filteredAttendanceData);
      if (filteredAttendanceData.length > 0) {
        const AttendanceData = filteredAttendanceData[0].studentAttendance;
        if(AttendanceData.hasOwnProperty(attendanceId)){
          for (let index = 0; index < AttendanceData.count.length; index++) {
            if (AttendanceData[`${attendanceId}`][index] === true) {
              AttendanceData.count[index]--;
            }
          }
        }
        for (let index = 0; index < AttendanceData.count.length; index++) {
          if(attendance[index] === true){
            AttendanceData.count[index]++;
          }
        }
        AttendanceData[attendanceId] = attendance;
        await AsyncStorage.setItem('AttendanceData', JSON.stringify(parsedAttendanceData));
      }
    } catch (error) {
      console.log(`Save Attendance error: ${error}`);
    }

    Alert.alert(`Attendance Saved \n Present - ${presentCount} Absent - ${absentCount}\n`, `AT ${day}/${month}/${year}`);
    navigation.goBack();
  };

  const presentCount = attendance.filter(status => status).length;
  const absentCount = totalStudents - presentCount;

  return (
    <ScrollView>
      <Calendar onSendData = {getDateFromCalendar}/>
      <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>New Record</Text>
        <View style={styles.attendanceSummary}>
          <Icon name="person" size={28} color="#000" /><Text style={styles.presentText}>{presentCount}</Text>
          <Icon name="person" size={28} color="#000" /><Text style={styles.absentText}>{absentCount}</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.attendanceContainer}>
        {attendance.length > 0 && attendance.map((isPresent, index) => {
          return (
          <TouchableOpacity key={index} onPress={() => handleToggleAttendance(index)}>
            <View style={[styles.attendanceItem, isPresent ? styles.present : styles.absent]}>
              <Text style={styles.attendanceText}>{studentData[index].RollNumber % 1000}</Text>
              <Icon name={isPresent ? 'checkmark' : 'close'} size={24} color={isPresent ? 'green' : 'red'} />
            </View>
          </TouchableOpacity>);
        })}
      </ScrollView>
      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleAllAttendance}>
          <Icon name={allPresent ? 'person-remove' : 'person-add'} size={24} color="#FFF" />
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
    backgroundColor: '#FFF',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00ADB5',
  },
  attendanceSummary: {
    flexDirection: 'row',
  },
  presentText: {
    fontSize: 18,
    color: 'green',
    marginRight: 10,
  },
  absentText: {
    fontSize: 18,
    color: 'red',
  },
  attendanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
    marginTop: 20,
  },
  attendanceItem: {
    marginHorizontal: 10,
    marginBottom: 20,
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#EEEEEE',
  },
  present: {
    borderColor: 'green',
    borderWidth: 2,
  },
  absent: {
    borderColor: 'red',
    borderWidth: 2,
  },
  attendanceText: {
    fontSize: 18,
    color: '#000',
  },
  floatingButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#00ADB5',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
  },
});