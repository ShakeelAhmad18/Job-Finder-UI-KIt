import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  Share,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";

const SavedJobsScreen = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const router=useRouter();
  const navigation = useNavigation();

  // Mock data - in a real app, this would come from your backend/API
  useEffect(() => {
    // Simulate loading saved jobs
    const mockSavedJobs = [
      {
        id: "1",
        title: "UI/UX Designer",
        company: "Google inc",
        location: "California, USA",
        category: "Design",
        type: "Full time",
        level: "Senior designer",
        timePosted: "25 minute ago",
        salary: "$15K/Mo",
        logo: "https://logo.clearbit.com/google.com",
      },
      {
        id: "2",
        title: "Lead Designer",
        company: "Dribbble inc",
        location: "California, USA",
        category: "Design",
        type: "Full time",
        level: "Senior designer",
        timePosted: "25 minute ago",
        salary: "$20K/Mo",
        logo: "https://logo.clearbit.com/dribbble.com",
      },
      {
        id: "3",
        title: "UX Researcher",
        company: "Twitter inc",
        location: "California, USA",
        category: "Design",
        type: "Full time",
        level: "Senior designer",
        timePosted: "25 minute ago",
        salary: "$12K/Mo",
        logo: "https://logo.clearbit.com/twitter.com",
      },
    ];
    setSavedJobs(mockSavedJobs);
  }, []);

  const handleDeleteAll = () => {
    Alert.alert(
      "Delete All Saved Jobs",
      "Are you sure you want to delete all saved jobs?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => setSavedJobs([]),
        },
      ]
    );
  };

  const handleDeleteJob = (jobId) => {
    setSavedJobs(savedJobs.filter((job) => job.id !== jobId));
    setModalVisible(false);
  };

  const handleShareJob = async (job) => {
    try {
      await Share.share({
        message: `Check out this job: ${job.title} at ${job.company} - ${job.location}`,
      });
      setModalVisible(false);
    } catch (error) {
      Alert.alert("Error", "Failed to share job");
    }
  };

  const handleApply = (job) => {
    // In a real app, this would navigate to application screen
    Alert.alert("Application", `Applying for ${job.title} at ${job.company}`);
    setModalVisible(false);
  };

  const handleSendMessage = (job) => {
    // In a real app, this would navigate to messaging screen
    Alert.alert("Message", `Messaging about ${job.title} at ${job.company}`);
    setModalVisible(false);
  };

  const renderJobItem = ({ item }) => (
    <View style={styles.jobCard}>
      <View style={styles.jobHeader}>
        {item.logo ? (
          <Image source={{ uri: item.logo }} style={styles.companyLogo} />
        ) : (
          <View style={[styles.companyLogo, styles.logoFallback]}>
            <Text style={styles.logoFallbackText}>
              {item.company.charAt(0)}
            </Text>
          </View>
        )}
        <View style={styles.jobInfo}>
          <Text style={styles.jobTitle}>{item.title}</Text>
          <Text style={styles.companyName}>
            {item.company} · {item.location}
          </Text>
          <View style={styles.jobMeta}>
            <Text style={styles.jobMetaText}>{item.category}</Text>
            <Text style={styles.jobMetaText}>{item.type}</Text>
            <Text style={styles.jobMetaText}>{item.level}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.optionsButton}
          onPress={() => {
            setSelectedJob(item);
            setModalVisible(true);
          }}
        >
          <Ionicons name="ellipsis-vertical" size={20} color="#666" />
        </TouchableOpacity>
      </View>
      <View style={styles.jobFooter}>
        <Text style={styles.timePosted}>{item.timePosted}</Text>
        <Text style={styles.salary}>{item.salary}</Text>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIllustration}>
        <Feather name="bookmark" size={60} color="#ccc" />
      </View>
      <Text style={styles.emptyTitle}>No Savings</Text>
      <Text style={styles.emptyText}>
        You don't have any jobs saved, please find it in search to save jobs
      </Text>
      <TouchableOpacity
        style={styles.findJobButton}
        onPress={() => router.back()}
      >
        <Text style={styles.findJobButtonText}>FIND A JOB</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Save Job</Text>
        {savedJobs.length > 0 && (
          <TouchableOpacity onPress={handleDeleteAll}>
            <Text style={styles.headerAction}>Delete all</Text>
          </TouchableOpacity>
        )}
      </View>

      {savedJobs.length > 0 ? (
        <FlatList
          data={savedJobs}
          renderItem={renderJobItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        renderEmptyState()
      )}

      {/* Options Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleShareJob(selectedJob)}
            >
              <Feather name="share-2" size={20} color="#333" />
              <Text style={styles.modalOptionText}>Shared</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleDeleteJob(selectedJob.id)}
            >
              <MaterialIcons name="delete-outline" size={20} color="#ff4444" />
              <Text style={[styles.modalOptionText, { color: "#ff4444" }]}>
                Delete
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleApply(selectedJob)}
            >
              <Feather name="send" size={20} color="#333" />
              <Text style={styles.modalOptionText}>Apply</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleSendMessage(selectedJob)}
            >
              <Feather name="message-square" size={20} color="#333" />
              <Text style={styles.modalOptionText}>Send message</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  headerAction: {
    fontSize: 16,
    color: "#ff4444",
    fontWeight: "500",
  },
  listContainer: {
    padding: 15,
  },
  jobCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  jobHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  companyLogo: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  logoFallback: {
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  logoFallbackText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#666",
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  companyName: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },
  jobMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  jobMetaText: {
    fontSize: 12,
    color: "#666",
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  optionsButton: {
    padding: 8,
    marginLeft: 8,
  },
  jobFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
  },
  timePosted: {
    fontSize: 12,
    color: "#999",
  },
  salary: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIllustration: {
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  findJobButton: {
    backgroundColor: "#4a90e2",
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  findJobButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: "80%",
    paddingVertical: 8,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  modalOptionText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 16,
  },
});

export default SavedJobsScreen;
