import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import ApiService from "../services/api";
import { Location } from "../types";

export default function LocationList() {
  const navigation = useNavigation();
  const [locations, setLocations] = useState<Location[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadLocations();
    }, [])
  );

  const loadLocations = async () => {
    try {
      const data = await ApiService.getLocations();
      setLocations(data);
    } catch (error) {
      console.error("Failed to load locations:", error);
      Alert.alert("Error", "Failed to load locations");
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLocations();
    setRefreshing(false);
  };

  const handleDeleteLocation = async (location: Location) => {
    Alert.alert(
      "Delete Location",
      `Are you sure you want to delete "${location.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await ApiService.deleteLocation(location.id);
              loadLocations();
              Alert.alert("Success", "Location deleted successfully");
            } catch (error) {
              Alert.alert("Error", "Failed to delete location");
            }
          },
        },
      ]
    );
  };

  const toggleLocationStatus = async (location: Location) => {
    try {
      const newStatus = location.status === "active" ? "inactive" : "active";
      await ApiService.updateLocation(location.id, { status: newStatus });
      loadLocations();
    } catch (error) {
      Alert.alert("Error", "Failed to update location status");
    }
  };

  const renderLocation = ({ item }: { item: Location }) => (
    <View style={styles.locationItem}>
      <View style={styles.locationHeader}>
        <Text style={styles.locationName}>{item.name}</Text>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: item.status === "active" ? "#4CAF50" : "#9E9E9E",
            },
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      {item.description && (
        <Text style={styles.locationDescription}>{item.description}</Text>
      )}

      {item.video_source && (
        <Text style={styles.videoSource}>📹 {item.video_source}</Text>
      )}

      <View style={styles.locationActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteLocation(item)}
        >
          <Text style={styles.actionButtonText}>🗑️ Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddLocation" as never)}
        >
          <Text style={styles.addButtonText}>➕ Add Location</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={locations}
        keyExtractor={(item) => item.id}
        renderItem={renderLocation}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No locations added yet</Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate("AddLocation" as never)}
            >
              <Text style={styles.buttonText}>Add Your First Location</Text>
            </TouchableOpacity>
          </View>
        }
        contentContainerStyle={
          locations.length === 0 ? styles.emptyListContainer : undefined
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "white",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  addButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  locationItem: {
    backgroundColor: "white",
    margin: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  locationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  locationName: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  locationDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  videoSource: {
    fontSize: 12,
    color: "#888",
    marginBottom: 12,
  },
  locationActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
    marginHorizontal: 2,
  },
  toggleButton: {
    backgroundColor: "#4CAF50",
  },
  editButton: {
    backgroundColor: "#FF9500",
  },
  deleteButton: {
    backgroundColor: "#F44336",
  },
  actionButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  emptyListContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  primaryButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
