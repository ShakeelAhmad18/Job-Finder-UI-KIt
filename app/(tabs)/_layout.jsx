import React, { useState, useCallback } from "react";
import { Tabs } from "expo-router";
import { useRouter } from "expo-router";
import TabBar from "../../components/TabBar";
import AddContentModal from "../../components/AddContentModal"; 

export default function TabLayout() {
  const router = useRouter();
  const [isModalVisible, setModalVisible] = useState(false); 

  const handlePlusButtonPress = useCallback(() => {
    setModalVisible(true); 
  }, []);

  // Function to close the modal
  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const handleAddPostAction = useCallback(() => {
    setModalVisible(false); 
    router.push("/AddPost/CreatePost");
  }, [router]);

  const handleMakeJobAction = useCallback(() => {
    setModalVisible(false); 
    router.push("/AddJob/CreateJob");
  }, [router]);

  return (
    <>
      <Tabs
        tabBar={(props) => (
          <TabBar {...props} onPlusButtonPress={handlePlusButtonPress} />
        )}
      >
        <Tabs.Screen
          name="index" // Corresponds to app/(tabs)/index.js
          options={{
            title: "Home",
            tabBarLabel: "Home",
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="Posting" 
          options={{
            title: "Posting",
            tabBarLabel: "Posting",
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="CreatePost" 
          options={{
            title: "Create Post", 
            tabBarLabel: "Create Post", 
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="Message" 
          options={{
            title: "Messages",
            tabBarLabel: "Messages",
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="SaveJob" 
          options={{
            title: "Saved Job",
            tabBarLabel: "Saved Job",
            headerShown: false,
          }}
        />
      </Tabs>
      <AddContentModal
        visible={isModalVisible}
        onClose={handleCloseModal}
        onPost={handleAddPostAction}
        onMakeJob={handleMakeJobAction}
      />
    </>
  );
}


