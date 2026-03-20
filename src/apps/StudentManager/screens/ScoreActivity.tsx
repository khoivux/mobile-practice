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
import { DBHelper } from '../dal/DBHelper';
import { Score } from '../models/StudentManagerTypes';

interface ScoreActivityProps {
  onLogout: () => void;
}

export default function ScoreActivity({ onLogout }: ScoreActivityProps) {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [username, setUsername] = useState('');

  const loadData = async () => {
    try {
      const loginData = await AsyncStorage.getItem('LOGIN');
      if (loginData) {
        setUsername(JSON.parse(loginData).username);
      }
      const data = await DBHelper.getScores();
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

  const renderScoreItem = ({ item }: { item: Score }) => (
    <View style={styles.scoreCard}>
      <View style={styles.scoreRow}>
        <View style={styles.studentIcon}>
          <Text style={styles.studentInitial}>{item.studentName?.charAt(0) || 'S'}</Text>
        </View>
        <View style={styles.scoreInfo}>
          <Text style={styles.studentName}>{item.studentName}</Text>
          <Text style={styles.subjectName}>{item.subject}</Text>
        </View>
        <View style={[styles.scoreBadge, { backgroundColor: item.score >= 5 ? '#E6F4EA' : '#FCE8E6' }]}>
          <Text style={[styles.scoreText, { color: item.score >= 5 ? '#1E8E3E' : '#D93025' }]}>
            {item.score.toFixed(1)}
          </Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1A1C1E" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Bảng điểm sinh viên</Text>
          <Text style={styles.headerSubtitle}>Chào mừng, {username}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#D93025" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={scores}
        renderItem={renderScoreItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1A1C1E" />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="documents-outline" size={60} color="#CCC" />
            <Text style={styles.emptyText}>Chưa có dữ liệu điểm</Text>
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
    backgroundColor: '#FCE8E6',
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
    backgroundColor: '#E8F0FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  studentInitial: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1967D2',
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
