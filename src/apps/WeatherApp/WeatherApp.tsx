import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  SafeAreaView,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWeatherStore, ForecastDay, WeatherNotification } from '../../../store/WeatherStore';

export default function WeatherApp() {
  const { city, location, temperature, condition, date, details, forecast, notifications } = useWeatherStore();
  const [activeTab, setActiveTab] = useState<'HOME' | 'DETAIL' | 'NOTIFICATION'>('HOME');
  const [searchText, setSearchText] = useState('');

  const renderForecastItem = ({ item }: { item: ForecastDay }) => (
    <View style={styles.forecastCard}>
      <Text style={styles.forecastDay}>{item.day}</Text>
      <Ionicons 
        name={item.condition === 'sunny' ? "sunny-outline" : item.condition === 'cloudy' ? "cloud-outline" : "rainy-outline"} 
        size={32} 
        color="#fff" 
        style={styles.forecastIcon}
      />
      <Text style={styles.forecastTemp}>{item.temp}</Text>
    </View>
  );

  const renderNotificationItem = ({ item }: { item: WeatherNotification }) => (
    <View style={styles.notificationCard}>
      <Text style={styles.notifDate}>{item.date}</Text>
      <Text style={styles.notifTitle}>{item.title}</Text>
      <Text style={styles.notifContent}>{item.content}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HeaderTitle */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Weather Forecast</Text>
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'HOME' && styles.activeTabButton]} 
          onPress={() => setActiveTab('HOME')}
        >
          <Text style={styles.tabButtonText}>HOME</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'DETAIL' && styles.activeTabButton]} 
          onPress={() => setActiveTab('DETAIL')}
        >
          <Text style={styles.tabButtonText}>DETAIL</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'NOTIFICATION' && styles.activeTabButton]} 
          onPress={() => setActiveTab('NOTIFICATION')}
        >
          <Text style={styles.tabButtonText}>NOTIFICATION</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>
        {activeTab === 'HOME' && (
          <ScrollView style={styles.screenContainer} showsVerticalScrollIndicator={false}>
            {/* Search Bar */}
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color="#fff" style={styles.searchIcon} />
              <TextInput 
                style={styles.searchInput} 
                placeholder="Enter city" 
                placeholderTextColor="#fff"
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>

            {/* Main Weather Display */}
            <View style={styles.mainWeather}>
              <Ionicons name="sunny-outline" size={80} color="#F1C40F" />
              <View style={styles.mainWeatherText}>
                <Text style={styles.mainTemp}>{temperature}</Text>
                <Text style={styles.mainLocation}>{location}</Text>
              </View>
            </View>

            {/* Forecast Row */}
            <FlatList
              horizontal
              data={forecast}
              renderItem={renderForecastItem}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.forecastContainer}
            />

            {/* Additional Information */}
            <View style={styles.detailsContainer}>
              <Text style={styles.detailsTitle}>Additional information</Text>
              <View style={styles.detailsGrid}>
                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Wind</Text>
                    <Text style={styles.detailValue}>{details.wind}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Humidity</Text>
                    <Text style={styles.detailValue}>{details.humidity}</Text>
                  </View>
                </View>
                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Visibility</Text>
                    <Text style={styles.detailValue}>{details.visibility}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>UV</Text>
                    <Text style={styles.detailValue}>{details.uv}</Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        )}

        {activeTab === 'DETAIL' && (
          <ScrollView style={styles.screenContainer}>
            {/* Main Weather Display Detail */}
            <View style={styles.mainWeatherDetail}>
              <Ionicons name="sunny-outline" size={80} color="#F1C40F" />
              <View style={styles.mainWeatherTextDetail}>
                <Text style={styles.mainTempDetail}>{temperature}</Text>
                <Text style={styles.mainDateDetail}>{date}</Text>
              </View>
            </View>

            {/* Forecast Row - reuse same list */}
            <FlatList
              horizontal
              data={forecast}
              renderItem={renderForecastItem}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[styles.forecastContainer, { marginTop: 30 }]}
            />
          </ScrollView>
        )}

        {activeTab === 'NOTIFICATION' && (
          <View style={[styles.screenContainer, { paddingHorizontal: 15 }]}>
            <FlatList
              data={notifications}
              renderItem={renderNotificationItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingVertical: 20 }}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingVertical: 35,
    backgroundColor: '#2C1D7C', // matches user screen deep violet
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 50 : 20,
  },
  headerText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#E77A7A', // light red/pink from user image
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#34495E', // dark blue-gray
    padding: 8,
    marginHorizontal: 15,
    borderRadius: 15,
    marginTop: -15,
    elevation: 4,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
  },
  activeTabButton: {
    backgroundColor: '#E77A7A', // highlight color
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  screenContainer: {
    flex: 1,
    paddingTop: 15,
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#8E44AD99', // transparent purple
    marginHorizontal: 20,
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 45,
    alignItems: 'center',
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
  },
  mainWeather: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  mainWeatherText: {
    marginLeft: 20,
  },
  mainTemp: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#E67E22', // orange from user image
  },
  mainLocation: {
    fontSize: 18,
    color: '#9B59B6', // purple from user image
  },
  forecastContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  forecastCard: {
    width: 90,
    backgroundColor: '#34495E',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5,
    elevation: 2,
  },
  forecastDay: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  forecastIcon: {
    marginVertical: 10,
  },
  forecastTemp: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  detailsContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#636E72',
    marginBottom: 15,
  },
  detailsGrid: {
    paddingBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  detailItem: {
    flex: 0.45,
  },
  detailLabel: {
    fontSize: 16,
    color: '#636E72',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    color: '#E77A7A',
    fontWeight: '600',
    marginTop: 5,
  },
  mainWeatherDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  mainWeatherTextDetail: {
    marginLeft: 20,
  },
  mainTempDetail: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#E67E22',
  },
  mainDateDetail: {
    fontSize: 14,
    color: '#9B59B6',
    marginTop: 5,
  },
  notificationCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  notifDate: {
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
  },
  notifTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34495E',
    marginBottom: 5,
  },
  notifContent: {
    fontSize: 14,
    color: '#636E72',
    lineHeight: 20,
  },
});
