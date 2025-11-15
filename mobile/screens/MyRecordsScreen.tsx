import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyRecordsScreen = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecords = async () => {
      // In a real app, fetch from API
      // For now, show placeholder data
      const mockRecords = [
        { id: '1', type: 'Visit', date: '2024-11-10', doctor: 'Dr. Smith' },
        { id: '2', type: 'Lab Test', date: '2024-11-05', lab: 'Central Lab' },
      ];
      setRecords(mockRecords);
      setLoading(false);
    };
    loadRecords();
  }, []);

  const renderRecord = ({ item }: any) => (
    <View style={styles.recordItem}>
      <Text style={styles.recordType}>{item.type}</Text>
      <Text style={styles.recordDate}>{item.date}</Text>
      <Text style={styles.recordDetail}>{item.doctor || item.lab}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={records}
        renderItem={renderRecord}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          !loading && <Text style={styles.empty}>No records found</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  recordItem: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  recordType: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  recordDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  recordDetail: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
  empty: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
});

export default MyRecordsScreen;
