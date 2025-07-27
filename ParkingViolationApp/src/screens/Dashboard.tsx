import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ApiService from "../services/api";
import SocketService from "../services/socket";
import { Location } from "../types";

export default function Dashboard() {
  const navigation = useNavigation();
  const [locations, setLocations] = useState<Location[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalLocations: 0,
    activeLocations: 0,
    violations: 0,
  });

  useEffect(() => {
    loadDashboardData();
    setupWebSocket();

    return () => {
      SocketService.disconnect();
    };
  }, []);

  const setupWebSocket = () => {
    SocketService.connect();

    SocketService.on("connection_status", (data: { connected: boolean }) => {
      setIsConnected(data.connected);
    });

    SocketService.on("violation_alert", (data: any) => {
      Alert.alert(
        "Violation Alert",
        `New violation detected at ${data.location_id}`
      );
      loadDashboardData(); // Refresh data
    });
  };

  const loadDashboardData = async () => {
    try {
      const locationsData = await ApiService.getLocations();
      setLocations(locationsData);

      const totalLocations = locationsData.length;
      const activeLocations = locationsData.filter(
        (loc: Location) => loc.status === "active"
      ).length;

      setStats({
        totalLocations,
        activeLocations,
        violations: 0, // Will be updated when violations API is ready
      });
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      Alert.alert("Error", "Failed to load dashboard data");
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const testConnection = async () => {
    try {
      const response = await ApiService.healthCheck();
      Alert.alert(
        "Connection Test",
        `Status: ${response.status}\n${response.message}`
      );
    } catch (error) {
      Alert.alert("Connection Error", "Failed to connect to server");
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Parking Violation Monitor</Text>
        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: isConnected ? "#4CAF50" : "#F44336" },
          ]}
        >
          <Text style={styles.statusText}>
            {isConnected ? "Connected" : "Disconnected"}
          </Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalLocations}</Text>
          <Text style={styles.statLabel}>Total Locations</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.activeLocations}</Text>
          <Text style={styles.statLabel}>Active Monitoring</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.violations}</Text>
          <Text style={styles.statLabel}>Active Violations</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("LocationList" as never)}
        >
          <Text style={styles.buttonText}>📍 Manage Locations</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("AddLocation" as never)}
        >
          <Text style={styles.buttonText}>➕ Add New Location</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("ViolationLogs" as never)}
        >
          <Text style={styles.buttonText}>📋 View Violations</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.testButton} onPress={testConnection}>
          <Text style={styles.buttonText}>🔧 Test Connection</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#007AFF",
    padding: 20,
    paddingTop: 50,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  statusIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    backgroundColor: "white",
    marginTop: -10,
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statCard: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007AFF",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 5,
  },
  buttonContainer: {
    padding: 20,
  },
  primaryButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: "#34C759",
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    alignItems: "center",
  },
  testButton: {
    backgroundColor: "#FF9500",
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
