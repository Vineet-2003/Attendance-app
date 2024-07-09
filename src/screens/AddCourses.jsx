/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable quotes */
/* eslint-disable semi */
/* eslint-disable prettier/prettier */
import React, {useState} from "react";
import {ScrollView, StyleSheet, Text, View, Button, Alert, Platform, PermissionsAndroid, Linking} from "react-native";
import {
  RadioButton,
  TextInput,
  Provider as PaperProvider,
  Card,
  Button as PaperButton,
  Title,
} from "react-native-paper";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReadExcelFile from "../components/ReadExcelFile";
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import XLSX from 'xlsx';

const AddCourses = ({navigation}) => {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [year, setYear] = useState("first");
  const [section, setSection] = useState("A");
  const [data, setData] = useState([]);

  const handleSubmit = async () => {
    if (name.trim() && id.trim() && year && section && data) {
      const courseData = {
        id: id,
        name: name,
        section: section,
        year: year,
      };
      const studentData = {
        id: id,
        studentData: data,
      };
      try {
        // Get existing courses from AsyncStorage
        const existingCourses = await AsyncStorage.getItem('courses');
        const existingStudentData = await AsyncStorage.getItem('studentData');
        const parsedCourses = existingCourses ? JSON.parse(existingCourses) : [];
        const parsedStudentData = existingStudentData ? JSON.parse(existingStudentData) : [];
        console.log(parsedCourses);
        const exists = parsedCourses.some(obj => obj.id === id);
        if (exists) {
          Alert.alert(`Course with ${id} already exists.`);
        } else {
          // Add new course data
          parsedCourses.push(courseData);
          parsedStudentData.push(studentData);
          // Save updated courses back to AsyncStorage
          await AsyncStorage.setItem('courses', JSON.stringify(parsedCourses));
          await AsyncStorage.setItem('studentData', JSON.stringify(parsedStudentData));

          // Reset form fields
          setName('');
          setId('');
          setYear('');
          setSection('');

          // Navigate back to course list
          Alert.alert('Course is added successfully!!');
          navigation.goBack();
        }
      } catch (error) {
        console.log('Error saving course:', error);
        Alert.alert('Error', 'Failed to save course. Please try again.');
      }
    } else {
      Alert.alert('Error', 'Please enter course name, code, and select a year.');
    }
  };

  //handle excel file data

  const requestAndroidPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        {
          title: 'External Storage Read Permission',
          message: 'App needs access to read from external storage',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Storage permission granted');
      } else {
        console.log('Storage permission denied');
        Alert.alert('Permission Denied', 'Storage permission is required to access files.');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const pickAndReadExcel = async () => {
    if (Platform.OS === 'android') {
      await requestAndroidPermissions();
    }

    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      // console.log(res[0]);
      const fileUri = res[0].uri;
      const fileName = res[0].name;

      console.log('File URI: ', fileUri);
      console.log('File Name: ', fileName);

      const file = await RNFS.readFile(fileUri, 'base64');
      const workbook = XLSX.read(file, { type: 'base64' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const sheetData = XLSX.utils.sheet_to_json(sheet);
      setData(sheetData);
      console.log(data);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User canceled the picker');
      } else {
        console.error('Unknown error: ', err);
      }
    }
  };

  return (
    <ScrollView style={styles.formContainer}>
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
      <Text style={styles.label}>Which Year</Text>
      <View style={styles.radio}>
        <RadioButton
          value="I"
          status={year === "I" ? "checked" : "unchecked"}
          onPress={() => setYear("I")}
        />
        <Text style={styles.label}>I</Text>
      </View>
      <View style={styles.radio}>
        <RadioButton
          value="II"
          status={year === "II" ? "checked" : "unchecked"}
          onPress={() => setYear("II")}
        />
        <Text style={styles.label}>II</Text>
      </View>
      <View style={styles.radio}>
        <RadioButton
          value="III"
          status={year === "III" ? "checked" : "unchecked"}
          onPress={() => setYear("III")}
        />
        <Text style={styles.label}>III</Text>
      </View>
      <View style={styles.radio}>
        <RadioButton
          value="IV"
          status={year === "IV" ? "checked" : "unchecked"}
          onPress={() => setYear("IV")}
        />
        <Text style={styles.label}>IV</Text>
      </View>
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
      <PaperProvider>
        <View style={styles.upload}>
          <Text style={styles.uploadLabel}>Upload Excel Sheet:</Text>
          <Card.Actions>
            <PaperButton onPress={pickAndReadExcel}>
              Pick Excel File
            </PaperButton>
          </Card.Actions>
        </View>
      </PaperProvider>
      <View style={{marginTop: 10}}>
        {data.length > 0 && (
          <View>
            <Title>Data from Excel:</Title>
            {data.map((item, index) => (
              <View key={index} style={styles.tableContainer}>
                <Text style={styles.tableElement}>{item.RollNumber}</Text>
                <Text style={styles.tableElement}>{item.Name}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
      <ReadExcelFile />
      <Button title="Submit" color="#BE9FE1" onPress={handleSubmit}/>
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
  label: {
    fontSize: 16,
    color: "#222831",
    fontWeight: "bold",
    marginBottom: 12,
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
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginVertical: 30,
  },
  uploadLabel: {
    fontSize: 15,
    color: "#222831",
    fontWeight: "bold",
  },
  tableContainer:{
    flex:1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  tableElement: {
    fontSize: 16,
    color: '#000',
  },
});
