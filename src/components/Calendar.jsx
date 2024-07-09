/* eslint-disable prettier/prettier */
/* eslint-disable eol-last */
/* eslint-disable semi */

/* eslint-disable no-trailing-spaces */
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Icon from "react-native-vector-icons/Ionicons";

const Calendar = () => {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
  
    const currentDate = new Date();
    const [selectedDate, setSelectedDate] = useState(currentDate);
    const [showMonthView, setShowMonthView] = useState(false);
  
    const currentDay = selectedDate.getDay();
    const currentDateNum = selectedDate.getDate();
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();
    const startOfWeek = new Date(
      selectedDate.setDate(currentDateNum - currentDay),
    );
  
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDates.push({
        day: daysOfWeek[date.getDay()],
        date: date.getDate(),
        fullDate: date,
      });
    }
  
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const monthDates = [];
    for (let i = 1; i <= daysInMonth; i++) {
      monthDates.push({
        day: daysOfWeek[new Date(currentYear, currentMonth, i).getDay()],
        date: i,
        fullDate: new Date(currentYear, currentMonth, i),
      });
    }
  
    const handleDateSelect = date => {
      setSelectedDate(date);
      setShowMonthView(false);
    };
  
    const handlePreviousMonth = () => {
      const previousMonthDate = new Date(currentYear, currentMonth - 1, 1);
      setSelectedDate(previousMonthDate);
    };
  
    const handleNextMonth = () => {
      const nextMonthDate = new Date(currentYear, currentMonth + 1, 1);
      setSelectedDate(nextMonthDate);
    };

  return (
    <View style={styles.appBarContainer}>
      <ScrollView horizontal style={styles.weekContainer}>
        {weekDates.map((day, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleDateSelect(day.fullDate)}
          >
            <View style={[styles.dayContainer]}>
              <Text
                style={[
                  styles.dayText,
                  day.fullDate.toDateString() === new Date().toDateString() &&
                    styles.highlighted,
                ]}
              >
                {day.day}
              </Text>
              <Text
                style={[
                  styles.dateText,
                  day.fullDate.toDateString() === new Date().toDateString() &&
                    styles.highlighted,
                ]}
              >
                {day.date}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.dateContainer}>
        <Text style={styles.fullDateText}>
          {daysOfWeek[currentDay]}, {currentDateNum} {months[currentMonth]}{" "}
          {currentYear}
        </Text>
        <TouchableOpacity onPress={() => setShowMonthView(!showMonthView)}>
          <Icon name="calendar" size={28} color="#000"/>
        </TouchableOpacity>
      </View>
      {showMonthView && (
        <View style={styles.monthView}>
          <ScrollView contentContainerStyle={styles.monthContainer}>
            {monthDates.map((day, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleDateSelect(day.fullDate)}
              >
                <View
                  style={[
                    styles.monthDayContainer,
                    day.fullDate.toDateString() === new Date().toDateString() &&
                      styles.highlighted,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      day.fullDate.toDateString() ===
                        new Date().toDateString() && styles.highlighted,
                    ]}
                  >
                    {day.day}
                  </Text>
                  <Text
                    style={[
                      styles.dateText,
                      day.fullDate.toDateString() ===
                        new Date().toDateString() && styles.highlighted,
                    ]}
                  >
                    {day.date}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={handlePreviousMonth}>
                <Icon
                  name="arrow-back"
                  size={24}
                  color="#000"
                  style={styles.arrowIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleNextMonth}>
                <Icon
                  name="arrow-forward"
                  size={24}
                  color="#000"
                  style={styles.arrowIcon}
                />
              </TouchableOpacity>
            </View>
        </View>
      )}
    </View>
  )
}

export default Calendar

const styles = StyleSheet.create({
    appBarContainer: {
      backgroundColor: "#FFF",
      padding: 10,
      elevation: 4,
    },
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    headerText: {
      marginLeft: 10,
      fontSize: 18,
      fontWeight: 800,
    },
    weekContainer: {
      flexDirection: "row",
      marginTop: 10,
    },
    dayContainer: {
      alignItems: "center",
      marginHorizontal: 3,
      padding: 5,
      borderRadius: 5,
    },
    monthDayContainer: {
      alignItems: "center",
      marginHorizontal: 3,
      padding: 5,
      borderRadius: 5,
    },
    dayText: {
      fontSize: 16,
      color: "#222831",
      fontWeight: 500,
    },
    dateText: {
      fontSize: 16,
      color: "#222831",
    },
    dateContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 10,
    },
    fullDateText: {
      fontSize: 16,
      color: "#000",
    },
    highlighted: {
      color: "#00ADB5",
      fontWeight: 800,
    },
    monthView: {
      flexDirection: "col",
      alignItems: "center",
    },
    arrowIcon: {
      paddingHorizontal: 10,
    },
    monthContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
    },
    buttonContainer: {
      alignContent: "space-around",
      flexDirection: "row",
      marginTop: 10,
    },
  })