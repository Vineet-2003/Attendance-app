/* eslint-disable react-native/no-inline-styles */
/* eslint-disable comma-dangle */
/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


const CourseLists = ({navigation}) => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const storedCourses = await AsyncStorage.getItem('courses');
        const parsedCourses = storedCourses ? JSON.parse(storedCourses) : [];
        setCourses(parsedCourses);
      } catch (error) {
        console.log(error);
        console.log('Failed to fetch courses from Storage');
      }
    };

    // Fetch courses on initial load and when screen focuses
    const unsubscribe = navigation.addListener('focus', () => {
      fetchCourses();
    });

    return unsubscribe;
  }, [navigation]);


  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.courseContainer}>
          {courses.map((course, index) => (
            <Pressable
              key={index}
              onPress={() =>
                navigation.navigate('Courses', course)
              }
            >
              <View style={styles.ButtonContainer}>
                <Text style={styles.text}>{course.name + ` (${course.session}'${course.yearStudy})`}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('AddCourses')}
      >
        <Text style={{fontSize:45}}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CourseLists;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  courseContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    margin: 10,
  },
  floatingButton: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: '#222831',
    // justifyContent: 'center',
    alignItems: 'center',
    bottom: 30,
    right: 150,
    elevation: 8, // This adds shadow for Android
    shadowColor: '#000', // This adds shadow for iOS
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  ButtonContainer: {
    height: 60,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 4,
    flex: 1,
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: 'grey',
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    paddingHorizontal: 16,
    color: '#393E46',
  },
});
