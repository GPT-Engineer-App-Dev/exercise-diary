import React, { useState, useEffect } from "react";
import { Box, Container, VStack, Heading, Text, Input, Button, List, ListItem, useToast, Textarea, Select, FormControl } from "@chakra-ui/react";
import { FaDumbbell, FaRunning, FaWeight } from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Index = () => {
  const [workouts, setWorkouts] = useState([]);
  const [newWorkout, setNewWorkout] = useState("");
  const [workoutType, setWorkoutType] = useState("");
  const [workoutDuration, setWorkoutDuration] = useState("");
  const [progressData, setProgressData] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const savedWorkouts = JSON.parse(localStorage.getItem("workouts")) || [];
    setWorkouts(savedWorkouts);
    
    // Calculate progress data
    const progressData = calculateProgressData(savedWorkouts);
    setProgressData(progressData);
  }, []);

  useEffect(() => {
    localStorage.setItem("workouts", JSON.stringify(workouts));
  }, [workouts]);

  const calculateProgressData = (workouts) => {
    const data = {};
    workouts.forEach(workout => {
      const date = new Date(workout.id).toLocaleDateString();
      if (!data[date]) {
        data[date] = { date, totalDuration: 0, workoutCount: 0 };
      }
      data[date].totalDuration += parseInt(workout.duration);
      data[date].workoutCount += 1;
    });
    return Object.values(data).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const addWorkout = () => {
    if (newWorkout.trim() === "" || workoutType.trim() === "" || workoutDuration.trim() === "") {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    const newWorkouts = [...workouts, { id: Date.now(), name: newWorkout, type: workoutType, duration: workoutDuration }];
    setWorkouts(newWorkouts);
    const newProgressData = calculateProgressData(newWorkouts);
    setProgressData(newProgressData);
    setNewWorkout("");
    setWorkoutType("");
    setWorkoutDuration("");
    toast({
      title: "Workout added",
      description: "Your workout has been logged successfully",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const deleteWorkout = (id) => {
    const updatedWorkouts = workouts.filter(workout => workout.id !== id);
    setWorkouts(updatedWorkouts);
    const newProgressData = calculateProgressData(updatedWorkouts);
    setProgressData(newProgressData);
    toast({
      title: "Workout deleted",
      description: "Your workout has been removed",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  const totalDuration = workouts.reduce((total, workout) => total + parseInt(workout.duration), 0);

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading mb={2}>Fitness Tracker</Heading>
          <Text fontSize="xl">Log your workouts and stay fit!</Text>
        </Box>

        <Box>
          <Heading size="md" mb={4}>Add New Workout</Heading>
          <FormControl mb={2}>
            <Select placeholder="Select workout type" value={workoutType} onChange={(e) => setWorkoutType(e.target.value)}>
              <option value="Cardio">Cardio</option>
              <option value="Strength">Strength</option>
              <option value="Flexibility">Flexibility</option>
            </Select>
          </FormControl>
          <FormControl mb={2}>
            <Input
              value={newWorkout}
              onChange={(e) => setNewWorkout(e.target.value)}
              placeholder="Enter workout name (e.g., '30 min run')"
            />
          </FormControl>
          <FormControl mb={2}>
            <Input
              value={workoutDuration}
              onChange={(e) => setWorkoutDuration(e.target.value)}
              placeholder="Enter duration (in minutes)"
            />
          </FormControl>
          <Button leftIcon={<FaDumbbell />} colorScheme="blue" onClick={addWorkout}>
            Log Workout
          </Button>
        </Box>

        <Box>
          <Heading size="md" mb={4}>Recent Workouts</Heading>
          {workouts.length === 0 ? (
            <Text>No workouts logged yet. Start by adding one above!</Text>
          ) : (
            <List spacing={3}>
              {workouts.map((workout) => (
                <ListItem key={workout.id} p={2} bg="gray.100" borderRadius="md" display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Text><strong>Type:</strong> {workout.type}</Text>
                    <Text><strong>Name:</strong> {workout.name}</Text>
                    <Text><strong>Duration:</strong> {workout.duration} min</Text>
                  </Box>
                  <Button colorScheme="red" size="sm" onClick={() => deleteWorkout(workout.id)}>Delete</Button>
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        <Box textAlign="center">
          <Text fontSize="lg" fontWeight="bold">Stay motivated!</Text>
          <Text>Regular exercise improves both physical and mental health.</Text>
        </Box>

        <Box display="flex" justifyContent="space-around">
          <FaRunning size="2em" />
          <FaDumbbell size="2em" />
          <FaWeight size="2em" />
        </Box>

        <Box textAlign="center" mt={4}>
          <Text fontSize="lg" fontWeight="bold">Statistics</Text>
          <Text>Total Workouts: {workouts.length}</Text>
          <Text>Total Duration: {totalDuration} min</Text>
        </Box>

        <Box mt={8}>
          <Heading size="md" mb={4}>Your Progress</Heading>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="totalDuration" stroke="#8884d8" name="Total Duration (min)" />
              <Line yAxisId="right" type="monotone" dataKey="workoutCount" stroke="#82ca9d" name="Workout Count" />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </VStack>
    </Container>
  );
};

export default Index;