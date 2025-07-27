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
import ApiService from "../services/api";
import { Violation } from "../types";

export default function ViolationLogs() {
  const [violations, setViolations] = useState<Violation[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadViolations();
  }, []);

  const loadViolations = async () => {
    try {
      const data = await ApiService.getViolations();
      setViolations(data);
    } catch (error) {
      console.error("Failed to load violations:", error);
      Alert.alert("Error", "Failed to load violations");
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadViolations();
    setRefreshing(false);
  };

  const acknowledgeViolation = async (violation: Violation) => {
    try {
      await ApiService.acknowledgeViolation(violation.id);
      loadViolations();
      Alert.alert("Success", "Violation acknowledged");
    } catch (error) {
      Alert.alert("Error", "Failed to acknowledge violation");
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleString();
  };

  const renderViolation = ({ item }: { item: Violation }) => (
    <View style={styles.violationItem}>
      <View style={styles.violationHeader}>
        <Text style={styles.violationId}>Violation #{item.id}</Text>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: item.status === "active" ? "#F44336" : "#4CAF50",
            },
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <Text style={styles.violationDetail}>
        📍 Location: {item.location_id}
      </Text>
      <Text style={styles.violationDetail}>
        🕒 Detected: {formatDate(item.detected_at)}
      </Text>

      {item.duration_seconds && (
        <Text style={styles.violationDetail}>
          ⏱️ Duration: {Math.round(item.duration_seconds)}s
        </Text>
      )}

      {item.confidence_score && (
        <Text style={styles.violationDetail}>
          📊 Confidence: {Math.round(item.confidence_score * 100)}%
        </Text>
      )}

      {item.status === "active" && (
        <TouchableOpacity
          style={styles.acknowledgeButton}
          onPress={() => acknowledgeViolation(item)}
        >
          <Text style={styles.acknowledgeButtonText}>✅ Acknowledge</Text>
        </TouchableOpacity>
      )}

      {item.acknowledged_at && (
        <Text style={styles.acknowledgedText}>
          ✅ Acknowledged: {formatDate(item.acknowledged_at)}
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Violation Logs</Text>
        <Text style={styles.subtitle}>
          Total: {violations.length} violations
        </Text>
      </View>

      <FlatList
        data={violations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderViolation}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No violations recorded yet</Text>
            <Text style={styles.emptySubtext}>
              Violations will appear here when detected
            </Text>
          </View>
        }
        contentContainerStyle={
          violations.length === 0 ? styles.emptyListContainer : undefined
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
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  violationItem: {
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
  violationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  violationId: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
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
  violationDetail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  acknowledgeButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  acknowledgeButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  acknowledgedText: {
    fontSize: 12,
    color: "#4CAF50",
    marginTop: 10,
    fontStyle: "italic",
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
    marginBottom: 10,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});
