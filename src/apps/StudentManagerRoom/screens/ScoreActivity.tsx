import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { DAO } from '../dal/DAO';
import { ScoreView } from '../entities/StudentEntities';

interface ScoreActivityProps {
  onLogout: () => void;
}

export default function ScoreActivity({ onLogout }: ScoreActivityProps) {
  const [scores, setScores] = useState<ScoreView[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [username, setUsername] = useState('');

  const loadData = async () => {
    try {
      const loginData = await AsyncStorage.getItem('LOGIN');
      if (loginData) {
        setUsername(JSON.parse(loginData).username);
      }
      
      // DAO call
      const data = await DAO.getScores();
      setScores(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('LOGIN');
    onLogout();
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const renderScoreItem = ({ item }: { item: ScoreView }) => (
    <View style={styles.scoreCard}>
      <View style={styles.scoreRow}>
        <View style={styles.studentIcon}>
          <Text style={styles.studentInitial}>{item.name?.charAt(0) || 'S'}</Text>
        </View>
        <View style={styles.scoreInfo}>
          <Text style={styles.studentName}>{item.name}</Text>
          <Text style={styles.subjectName}>{item.subject}</Text>
        </View>
        <View style={[styles.scoreBadge, { backgroundColor: item.score >= 5 ? '#F3E5F5' : '#FFEBEE' }]}>
          <Text style={[styles.scoreText, { color: item.score >= 5 ? '#7B1FA2' : '#C62828' }]}>
            {item.score.toFixed(1)}
          </Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Student Scores (ORM)</Text>
          <Text style={styles.headerSubtitle}>Logged in as {username}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#C62828" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={scores}
        renderItem={renderScoreItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6C63FF" />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="school-outline" size={60} color="#CCC" />
            <Text style={styles.emptyText}>Chưa có dữ liệu điểm (Room)</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1C1E',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  logoutButton: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#FFEBEE',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  scoreCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3E5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  studentInitial: {
    fontSize: 18,
    fontWeight: '700',
    color: '#7B1FA2',
  },
  scoreInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1C1E',
  },
  subjectName: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  scoreBadge: {
    width: 50,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '800',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#999',
    fontWeight: '500',
  },
});
