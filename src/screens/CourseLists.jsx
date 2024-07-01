/* eslint-disable no-trailing-spaces */
/* eslint-disable quotes */
// eslint-disable-next-line prettier/prettier
/* eslint-disable jsx-quotes */
/* eslint-disable prettier/prettier */
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React from "react";

const CourseLists = ({navigation}) => {
  const courses = [
    "Power electronics",
    "DC machines",
    "Power System Analysis",
    "power electronics",
    "DC machines",
    "power System Analysis",
    "power electronics",
    "DC machines",
    "power System Analysis",
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View className="my-6 mx-2 flex flex-col space-y-4">
          {courses.map((courseName, index) => (
            <Pressable
              key={index++}
              onPress={() =>
                navigation.navigate("Courses", {
                  courseId: 124,
                })
              }
            >
              <View
                className="border-gray-600 flex-1 justify-center"
                style={styles.ButtonContainer}
              >
                <Text className="text-xl px-4" style={styles.text}>
                  {courseName}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate("AddCourses")}
      >
        <Text className="text-7xl text-gray-300">+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CourseLists;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  floatingButton: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#222831",
    justifyContent: "center",
    alignItems: "center",
    bottom: 20,
    right: 150,
    elevation: 8, // This adds shadow for Android
    shadowColor: "#000", // This adds shadow for iOS
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  ButtonContainer: {
    height: 60,
    borderRadius: 8,
    backgroundColor: "#fff",
    elevation: 4,
  },
  text: {
    color: "#393E46",
  },
});
