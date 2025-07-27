import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Dashboard from "../screens/Dashboard";
import LocationList from "../screens/LocationList";
import AddLocation from "../screens/AddLocation";
import ViolationLogs from "../screens/ViolationLogs";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Dashboard"
        screenOptions={{
          headerStyle: { backgroundColor: "#007AFF" },
          headerTintColor: "white",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{ title: "Parking Monitor" }}
        />
        <Stack.Screen
          name="LocationList"
          component={LocationList}
          options={{ title: "Locations" }}
        />
        <Stack.Screen
          name="AddLocation"
          component={AddLocation}
          options={{ title: "Add Location" }}
        />
        <Stack.Screen
          name="EditLocation"
          component={AddLocation}
          options={{ title: "Edit Location" }}
        />
        <Stack.Screen
          name="ViolationLogs"
          component={ViolationLogs}
          options={{ title: "Violations" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
