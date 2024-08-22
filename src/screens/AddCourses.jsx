/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable quotes */
/* eslint-disable semi */
/* eslint-disable prettier/prettier */
import React, {useState} from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  Platform,
  PermissionsAndroid,
  Animated,
  FlatList,
} from "react-native";
import {
  RadioButton,
  TextInput,
  Provider as PaperProvider,
  Card,
  Button as PaperButton,
  Title,
  Portal,
  Modal,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DocumentPicker from "react-native-document-picker";
import RNFS from "react-native-fs";
import XLSX from "xlsx";


const AddCourses = ({navigation}) => {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [yearStudy, setYearStudy] = useState("");
  const [year, setYear] = useState("first");
  const [type, setType] = useState("");
  const [electiveType, SetElectiveType] = useState("");
  const [section, setSection] = useState("");
  const [session, setSession] = useState("");
  const [data, setData] = useState([]);
  const [showData, SetShowData] = useState(false);


  const handleShowData = () => SetShowData(true);
  const handleRemoveData = () => SetShowData(false);

  const departmentAbbreviations = {
    'computer science and engineering': 'CSE',
    'chemical engineering': 'CHE',
    'instrumentation and control engineering': 'ICE',
    'electrical and electronics engineering': 'EEE',
    'electronics and communication engineering': 'ECE',
    'production engineering': 'PROD',
    'civil engineering': 'CE',
    'mechanical engineering': 'ME',
    'metallurgical and materials engineering': 'MME',
  };

  const handleSubmit = async () => {

    if (name.trim() && id.trim() && yearStudy.trim() && year && session && data) {
      const courseData = {
        id: id,
        name: name,
        yearStudy: yearStudy,
        section: section,
        type: type,
        electiveType: electiveType,
        year: year,
        session: session,
      };
      const studentData = {
        id: id,
        studentData: data,
      };
      try {
        // Get existing courses from AsyncStorage
        const existingCourses = await AsyncStorage.getItem("courses");
        const existingStudentData = await AsyncStorage.getItem("studentData");
        const existingAttendanceData = await AsyncStorage.getItem("AttendanceData");

        const parsedCourses = existingCourses ? JSON.parse(existingCourses) : [];
        const parsedStudentData = existingStudentData ? JSON.parse(existingStudentData) : [];
        const parsedAttendanceData = existingAttendanceData ? JSON.parse(existingAttendanceData) : [];

        const existsCourse = parsedCourses.some(obj => obj.id === id);
        const existsStudentData = parsedCourses.some(obj => obj.id === id);
        const existsAttendanceData = parsedCourses.some(obj => obj.id === id);

        if (existsCourse || existsStudentData || existsAttendanceData) {
          Alert.alert(`Course with ${id} already exists.`);
        } else {

          const AttendanceObject = {
            id: id,
            studentAttendance: {
              count: new Array(data.length).fill(0), // Adjust the length of the array as needed
            },
          };

          // Add new course data
          parsedCourses.push(courseData);
          parsedStudentData.push(studentData);
          parsedAttendanceData.push(AttendanceObject);
          // Save updated courses back to AsyncStorage
          await AsyncStorage.setItem("courses", JSON.stringify(parsedCourses));
          await AsyncStorage.setItem(
            "studentData",
            JSON.stringify(parsedStudentData),
          );
          await AsyncStorage.setItem(
            "AttendanceData",
            JSON.stringify(parsedAttendanceData),
          );

          // Reset form fields
          setName("");
          setId("");
          setYear("");
          setYear("");
          setSection("");
          setSession("");

          // Navigate back to course list
          Alert.alert("Course is added successfully!!");
          navigation.goBack();
        }
      } catch (error) {
        console.log("Error saving course:", error);
        Alert.alert("Error", "Failed to save course. Please try again.");
      }
    } else {
      Alert.alert(
        "Error",
        "Please enter course name, code, and select a year.",
      );
    }
  };

  //handle excel file data

  const requestAndroidPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        {
          title: "External Storage Read Permission",
          message: "App needs access to read from external storage",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // console.log("Storage permission granted");
      } else {
        // console.log("Storage permission denied");
        Alert.alert(
          "Permission Denied",
          "Storage permission is required to access files.",
        );
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const pickAndReadExcel = async () => {
    if (Platform.OS === "android") {
      await requestAndroidPermissions();
    }

    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      // console.log(res[0]);
      const fileUri = res[0].uri;
      const fileName = res[0].name;

      // console.log("File URI: ", fileUri);
      // console.log("File Name: ", fileName);

      const file = await RNFS.readFile(fileUri, "base64");
      const workbook = XLSX.read(file, {type: "base64"});
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const sheetData = XLSX.utils.sheet_to_json(sheet);
      // console.log(sheetData);
      if (section === "") {
        if(electiveType === "OE"){
          const processedData = sheetData.map(item => {
            const rollNumber = item.RollNumber.toString();
            const departmentFull = item.Department ? item.Department.toLowerCase() : '';
            const departmentAbbreviation = departmentAbbreviations[departmentFull] || departmentFull; // Default to full name if not found
    
            return {
              ...item,
              Department: departmentAbbreviation,
            };
          });
          setData(processedData);
        return;
        }
        setData(sheetData);
        return;
      }
      const filterSheetData = sheetData.filter(item =>
        section === "A" ? item.RollNumber % 2 !== 0 : item.RollNumber % 2 === 0,
      );
      setData(filterSheetData);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // console.log("User canceled the picker");
      } else {
        console.error("Unknown error: ", err);
      }
    }
  };

  const renderInstruction = () => {
    return (
      <View style={styles.instructionContainer}>
        <Text style={styles.instructionText}>
          1. If you have selected Core/PE, then column name should be RollNumber and Name.
        </Text>
        <Text style={styles.instructionText}>
          2. If you have selected OE, then column name should be Department, RollNumber, and Name.
        </Text>
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.formContainer}
      contentContainerStyle={styles.formChild}
    >
      <View style={styles.formElement}>
        <TextInput
          label="Course Name"
          mode="outlined"
          value={name}
          onChangeText={text => setName(text)}
          placeholder="Enter Course Name"
        />
      </View>
      <View style={styles.formElement}>
        <TextInput
          label="Course ID"
          mode="outlined"
          value={id}
          onChangeText={text => setId(text)}
          placeholder="Enter Course ID"
        />
      </View>
      <View style={styles.formElement}>
        <TextInput
          label="Year of Study"
          mode="outlined"
          value={yearStudy}
          onChangeText={text => setYearStudy(text)}
          placeholder="Enter Year of Study"
        />
      </View>
      <View style={styles.formElementContainer}>
        <Text style={styles.label}>Year of Student</Text>
        <View style={styles.radio}>
          <RadioButton
            value="I"
            status={year === "I" ? "checked" : "unchecked"}
            onPress={() => setYear("I")}
          />
          <Text style={styles.label}>I Year</Text>
        </View>
        <View style={styles.radio}>
          <RadioButton
            value="II"
            status={year === "II" ? "checked" : "unchecked"}
            onPress={() => setYear("II")}
          />
          <Text style={styles.label}>II Year</Text>
        </View>
        <View style={styles.radio}>
          <RadioButton
            value="III"
            status={year === "III" ? "checked" : "unchecked"}
            onPress={() => setYear("III")}
          />
          <Text style={styles.label}>III Year</Text>
        </View>
        <View style={styles.radio}>
          <RadioButton
            value="IV"
            status={year === "IV" ? "checked" : "unchecked"}
            onPress={() => setYear("IV")}
          />
          <Text style={styles.label}>IV Year</Text>
        </View>
      </View>
      <View style={styles.formElementContainer}>
        <Text style={styles.label}>Course Type</Text>
        <View style={styles.sectionSelected}>
          <View style={styles.radio}>
            <RadioButton
              value="core"
              status={type === "core" ? "checked" : "unchecked"}
              onPress={() => setType("core")}
            />
            <Text style={styles.label}>Core</Text>
          </View>
          <View style={styles.radio}>
            <RadioButton
              value="elective"
              status={type === "elective" ? "checked" : "unchecked"}
              onPress={() => setType("elective")}
            />
            <Text style={styles.label}>Elective</Text>
          </View>
        </View>
      </View>
      {type === "elective" && (
        <View style={styles.formElementContainer}>
          <Text style={styles.label}>Elective Type</Text>
          <View style={styles.sectionSelected}>
            <View style={styles.radio}>
              <RadioButton
                value="PE"
                status={electiveType === "PE" ? "checked" : "unchecked"}
                onPress={() => SetElectiveType("PE")}
              />
              <Text style={styles.label}>PE</Text>
            </View>
            <View style={styles.radio}>
              <RadioButton
                value="OE"
                status={electiveType === "OE" ? "checked" : "unchecked"}
                onPress={() => SetElectiveType("OE")}
              />
              <Text style={styles.label}>OE</Text>
            </View>
          </View>
        </View>
      )}
      {type === "core" && (
        <View style={styles.formElementContainer}>
          <Text style={styles.label}>Section</Text>
          <View style={styles.sectionSelected}>
            <View style={styles.radio}>
              <RadioButton
                value="A"
                status={section === "A" ? "checked" : "unchecked"}
                onPress={() => setSection("A")}
              />
              <Text style={styles.label}>A</Text>
            </View>
            <View style={styles.radio}>
              <RadioButton
                value="B"
                status={section === "B" ? "checked" : "unchecked"}
                onPress={() => setSection("B")}
              />
              <Text style={styles.label}>B</Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.formElementContainer}>
        <Text style={styles.label}>Session</Text>
        <View style={styles.sectionSelected}>
          <View style={styles.radio}>
            <RadioButton
              value="JAN"
              status={session === "JAN" ? "checked" : "unchecked"}
              onPress={() => setSession("JAN")}
            />
            <Text style={styles.label}>JAN</Text>
          </View>
          <View style={styles.radio}>
            <RadioButton
              value="JUL"
              status={session === "JUL" ? "checked" : "unchecked"}
              onPress={() => setSession("JUL")}
            />
            <Text style={styles.label}>JUL</Text>
          </View>
        </View>
      </View>
      <PaperProvider>
        <View style={styles.upload}>
          <Text style={styles.uploadLabel}>Upload Excel Sheet:</Text>
          <Card.Actions>
            <PaperButton onPress={pickAndReadExcel}>
              Pick Excel File
            </PaperButton>
          </Card.Actions>
        </View>
        <View>
        {renderInstruction()}
        </View>
      </PaperProvider>
      <View>
        <Button
          title="Show Student Data"
          style={styles.submitButton}
          color="#BE9FE1"
          onPress={showData === false ? handleShowData : handleRemoveData}
        />
      </View>
      {showData && <View style={{marginTop: 5}}>
        {data.length > 0 && (
          <View>
            <Title>Data from Excel:</Title>
            <View style={styles.table}>
              {data.map((item, index) => (
                <View key={index} style={styles.row}>
                  {electiveType === "OE" && (<Text style={styles.cell}>{item.Department}</Text>)}
                  <Text style={styles.cell}>{item.RollNumber}</Text>
                  <Text style={styles.cell}>{item.Name}</Text>
                </View>
              ))}
            </View>
          </View>
        )
        }
        </View>}
      <View style={styles.submitButtonContainer}>
        <Button
          title="Submit"
          style={styles.submitButton}
          color="#BE9FE1"
          onPress={handleSubmit}
        />
      </View>
    </ScrollView>
  );
};

export default AddCourses;

const styles = StyleSheet.create({
  formContainer: {
    padding: 16,
    flex: 1,
  },
  formElement: {
    marginBottom: 10,
  },
  formElementContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: "#222831",
    fontWeight: "bold",
    marginBottom: 10,
  },
  radio: {
    flex: 1,
    flexDirection: "row",
  },
  sectionSelected: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  upload: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginVertical: 10,
  },
  uploadLabel: {
    fontSize: 15,
    color: "#222831",
    fontWeight: "bold",
  },
  safeArea: {
    flex: 1,
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
  submitButtonContainer: {
    marginVertical: 40,
    elevation: 5,
  },
  instructionContainer:{
    marginBottom:18,
  },
  instructionText: {
    marginTop: 16,
    fontSize: 16,
    color: 'gray',
  },
});
