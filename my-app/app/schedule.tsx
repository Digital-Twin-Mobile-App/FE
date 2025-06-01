import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Modal, TextInput, StyleSheet, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function Schedule() {
  const [selectedDate, setSelectedDate] = useState('');
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [newTask, setNewTask] = useState({
    taskName: '',
    plantName: '',
    time: new Date(),
  });

  // Mock data for scheduled tasks
  const scheduledTasks = [
    {
      id: '1',
      plantName: 'Japanese Maple',
      task: 'Watering',
      time: '09:00 AM',
      status: 'pending',
    },
    {
      id: '2',
      plantName: 'Bonsai',
      task: 'Fertilizing',
      time: '02:00 PM',
      status: 'completed',
    },
    {
      id: '3',
      plantName: 'Monstera',
      task: 'Pruning',
      time: '04:00 PM',
      status: 'pending',
    },
  ];

  const handleAddTask = () => {
    // TODO: Implement task creation logic
    console.log('New task:', newTask);
    setShowAddTaskModal(false);
    setNewTask({
      taskName: '',
      plantName: '',
      time: new Date(),
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen 
        options={{
          title: 'Care Schedule',
          headerStyle: { backgroundColor: '#4CAF50' },
          headerTintColor: '#fff',
        }} 
      />
      
      <ScrollView className="flex-1">
        {/* Calendar */}
        <View className="p-4">
          <Calendar
            onDayPress={(day: {dateString: string}) => setSelectedDate(day.dateString)}
            markedDates={{
              [selectedDate]: { selected: true, selectedColor: '#4CAF50' }
            }}
            theme={{
              selectedDayBackgroundColor: '#4CAF50',
              todayTextColor: '#4CAF50',
              arrowColor: '#4CAF50',
            }}
          />
        </View>

        {/* Scheduled Tasks */}
        <View className="p-6">
          <Text className="text-xl font-semibold text-[#2B5329] mb-4">Today's Tasks</Text>
          <View className="space-y-4">
            {scheduledTasks.map((task) => (
              <TouchableOpacity 
                key={task.id}
                className="bg-white rounded-xl p-4 flex-row items-center shadow-sm border border-gray-100"
              >
                <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${
                  task.status === 'completed' ? 'bg-green-100' : 'bg-orange-100'
                }`}>
                  <Ionicons 
                    name={task.status === 'completed' ? 'checkmark' : 'time'} 
                    size={24} 
                    color={task.status === 'completed' ? '#4CAF50' : '#FF9800'} 
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-medium text-[#2B5329]">{task.plantName}</Text>
                  <Text className="text-sm text-gray-600">{task.task}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-sm font-medium text-[#2B5329]">{task.time}</Text>
                  <Text className={`text-xs ${
                    task.status === 'completed' ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {task.status === 'completed' ? 'Completed' : 'Pending'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Add Task Button */}
          <TouchableOpacity 
            onPress={() => setShowAddTaskModal(true)}
            className="bg-[#4CAF50] rounded-xl py-4 mt-6 flex-row items-center justify-center"
          >
            <Ionicons name="add-circle" size={24} color="white" />
            <Text className="text-white font-semibold text-lg ml-2">
              Add New Task
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Add Task Modal */}
      <Modal
        visible={showAddTaskModal}
        animationType="slide"
        transparent={true}
      >
        <View className="flex-1 bg-white">
          <View className="p-4 border-b border-gray-200 flex-row justify-between items-center">
            <Text className="text-xl font-semibold text-[#2B5329]">Add New Task</Text>
            <TouchableOpacity onPress={() => setShowAddTaskModal(false)}>
              <Ionicons name="close" size={24} color="#9E9E9E" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 p-6">
            {/* Task Name */}
            <View className="mb-6">
              <Text className="text-lg font-semibold text-[#2B5329] mb-2">Task Name</Text>
              <TextInput
                value={newTask.taskName}
                onChangeText={(text) => setNewTask(prev => ({ ...prev, taskName: text }))}
                placeholder="Enter task name"
                className="bg-gray-50 rounded-xl p-4 text-base"
                placeholderTextColor="#9E9E9E"
              />
            </View>

            {/* Plant Name */}
            <View className="mb-6">
              <Text className="text-lg font-semibold text-[#2B5329] mb-2">Plant Name</Text>
              <TextInput
                value={newTask.plantName}
                onChangeText={(text) => setNewTask(prev => ({ ...prev, plantName: text }))}
                placeholder="Enter plant name"
                className="bg-gray-50 rounded-xl p-4 text-base"
                placeholderTextColor="#9E9E9E"
              />
            </View>

            {/* Time */}
            <View className="mb-6">
              <Text className="text-lg font-semibold text-[#2B5329] mb-2">Time</Text>
              <TouchableOpacity 
                onPress={() => setShowTimePicker(true)}
                className="bg-gray-50 rounded-xl p-4 flex-row justify-between items-center"
              >
                <Text className="text-[#2B5329]">{formatTime(newTask.time)}</Text>
                <Ionicons name="time-outline" size={20} color="#9E9E9E" />
              </TouchableOpacity>
            </View>

            {/* Submit Button */}
            <TouchableOpacity 
              onPress={handleAddTask}
              className="bg-[#4CAF50] rounded-xl py-4 mt-4"
            >
              <Text className="text-white text-center font-semibold text-lg">
                Add Task
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Time Picker */}
      {showTimePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={newTask.time}
          mode="time"
          is24Hour={false}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event: any, selectedTime?: Date) => {
            setShowTimePicker(false);
            if (selectedTime) {
              setNewTask(prev => ({ ...prev, time: selectedTime }));
            }
          }}
        />
      )}
    </SafeAreaView>
  );
} 