import React, { useState } from "react";
import { Box, Container, VStack, Heading, Text, Input, Button, List, ListItem, useToast } from "@chakra-ui/react";
import { FaDumbbell, FaRunning, FaWeight } from "react-icons/fa";

const Index = () => {
  const [workouts, setWorkouts] = useState([]);
  const [newWorkout, setNewWorkout] = useState("");
  const toast = useToast();

  const addWorkout = () => {
    if (newWorkout.trim() === "") {
      toast({
        title: "Error",
        description: "Please enter a workout",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    setWorkouts([...workouts, { id: Date.now(), name: newWorkout }]);
    setNewWorkout("");
    toast({
      title: "Workout added",
      description: "Your workout has been logged successfully",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading mb={2}>Fitness Tracker</Heading>
          <Text fontSize="xl">Log your workouts and stay fit!</Text>
        </Box>

        <Box>
          <Heading size="md" mb={4}>Add New Workout</Heading>
          <Input
            value={newWorkout}
            onChange={(e) => setNewWorkout(e.target.value)}
            placeholder="Enter workout (e.g., '30 min run')"
            mb={2}
          />
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
                <ListItem key={workout.id} p={2} bg="gray.100" borderRadius="md">
                  <Text>{workout.name}</Text>
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
      </VStack>
    </Container>
  );
};

export default Index;