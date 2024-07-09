/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View, Text, Button, Platform, PermissionsAndroid, Linking, StyleSheet, Alert } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import XLSX from 'xlsx';

const ReadExcelFile = () => {
    const [data, setData] = useState([]);

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
    <View>
      <Button title="Pick Excel File" onPress={pickAndReadExcel} />
      {data.map((item, index) => {
        console.log(item);
        return (<Text style={styles.text} key={index}>{JSON.stringify(item)}</Text>);
      })}
    </View>
  );
}

export default ReadExcelFile

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: '#000',
  }
})