import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Dropdown } from 'react-native-element-dropdown';
import { useMusicStore, Music } from '../../../store/MusicStore';

const musicLogos = [
  require('../../../assets/images/music_logo1.png'),
  require('../../../assets/images/music_logo2.png'),
  require('../../../assets/images/cat1.png'), // Using cat images for more variation
  require('../../../assets/images/cat2.png'),
];

export default function MusicApp() {
  const { songs, addSong, removeSong, filteredSongs } = useMusicStore();
  
  const [activeTab, setActiveTab] = useState<'ADD' | 'SEARCH'>('ADD');
  
  // States for Add tab
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [logoIndex, setLogoIndex] = useState(0);
  
  // State for Search tab
  const [searchText, setSearchText] = useState('');

  const dropdownData = musicLogos.map((img, index) => ({
    label: `Logo ${index + 1}`,
    value: index.toString(),
    image: img,
  }));

  const handleAdd = () => {
    if (!name.trim() || !description.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên và mô tả');
      return;
    }
    
    addSong({
      name,
      description,
      avatar: musicLogos[logoIndex],
    });
    
    // Reset
    setName('');
    setDescription('');
    setLogoIndex(0);
  };

  const handleRemove = (id: string) => {
    Alert.alert('Xác nhận', 'Bạn muốn xóa bản nhạc này?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa', style: 'destructive', onPress: () => removeSong(id) },
    ]);
  };

  const renderDropdownItem = (item: any) => (
    <View style={styles.dropdownItem}>
      <Image source={item.image} style={styles.dropdownThumb} />
      <Text style={styles.dropdownLabel}>{item.label}</Text>
    </View>
  );

  const renderSongItem = ({ item }: { item: Music }) => (
    <View style={styles.songCard}>
      <View style={styles.songInfoRow}>
        <Image source={item.avatar} style={styles.songLogo} />
        <View style={styles.songTextContainer}>
          <Text style={styles.songName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.songDescription} numberOfLines={2}>{item.description}</Text>
        </View>
        {activeTab === 'ADD' && (
          <TouchableOpacity 
            style={styles.removeBtn} 
            onPress={() => handleRemove(item.id)}
          >
            <Text style={styles.removeText}>Remove</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tabItem, activeTab === 'ADD' && styles.activeTabItem]} 
          onPress={() => setActiveTab('ADD')}
        >
          <Ionicons name="add" size={24} color={activeTab === 'ADD' ? '#00D4C5' : '#888'} />
          <Text style={[styles.tabText, activeTab === 'ADD' && styles.activeTabText]}>ADD MUSIC</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabItem, activeTab === 'SEARCH' && styles.activeTabItem]} 
          onPress={() => setActiveTab('SEARCH')}
        >
          <Ionicons name="search" size={24} color={activeTab === 'SEARCH' ? '#00D4C5' : '#888'} />
          <Text style={[styles.tabText, activeTab === 'SEARCH' && styles.activeTabText]}>SEARCH</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        {activeTab === 'ADD' ? (
          <View style={styles.screenContainer}>
            <View style={styles.inputSection}>
              {/* Dropdown for Logo Selection */}
              <Dropdown
                style={styles.dropdown}
                data={dropdownData}
                labelField="label"
                valueField="value"
                placeholder="Chọn logo"
                value={logoIndex.toString()}
                onChange={item => setLogoIndex(parseInt(item.value))}
                renderItem={renderDropdownItem}
                renderRightIcon={() => (
                  <Ionicons name="caret-down" size={16} color="#333" />
                )}
              />
              
              <TextInput 
                style={styles.inputField} 
                placeholder="Music Name" 
                value={name}
                onChangeText={setName}
              />
              <TextInput 
                style={styles.inputField} 
                placeholder="Description" 
                value={description}
                onChangeText={setDescription}
              />
              
              <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
                <Text style={styles.addBtnText}>ADD MUSIC</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={songs}
              renderItem={renderSongItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          </View>
        ) : (
          <View style={styles.screenContainer}>
            <View style={styles.searchBar}>
              <TextInput 
                style={styles.searchInput} 
                placeholder="Music Name" 
                value={searchText}
                onChangeText={setSearchText}
              />
              <Ionicons name="search" size={30} color="#333" style={{ marginLeft: 10 }} />
            </View>
            
            <FlatList
              data={filteredSongs(searchText)}
              renderItem={renderSongItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabBar: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginTop: Platform.OS === 'android' ? 30 : 0,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    borderBottomWidth: 4,
    borderBottomColor: 'transparent',
  },
  activeTabItem: {
    borderBottomColor: '#6200EE',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#888',
    marginTop: 4,
  },
  activeTabText: {
    color: '#00D4C5',
  },
  screenContainer: {
    flex: 1,
    padding: 15,
  },
  inputSection: {
    marginBottom: 20,
  },
  inputField: {
    height: 55,
    borderWidth: 1.5,
    borderColor: '#333',
    borderRadius: 12,
    paddingHorizontal: 20,
    fontSize: 18,
    marginBottom: 15,
    color: '#333',
  },
  dropdown: {
    height: 55,
    borderWidth: 1.5,
    borderColor: 'transparent', // Custom border if needed, but in screenshot it's empty
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  dropdownThumb: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 4,
  },
  dropdownLabel: {
    fontSize: 16,
  },
  addBtn: {
    backgroundColor: '#00D4C5',
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 55,
    borderWidth: 1.5,
    borderColor: '#333',
    borderRadius: 12,
    paddingHorizontal: 20,
    fontSize: 18,
  },
  listContainer: {
    paddingBottom: 20,
  },
  songCard: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    borderRadius: 15,
    marginBottom: 5,
    // Add shadow/border like in screenshot
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 1,
  },
  songInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  songLogo: {
    width: 65,
    height: 65,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  songTextContainer: {
    flex: 1,
    marginLeft: 20,
  },
  songName: {
    fontSize: 19,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  songDescription: {
    fontSize: 15,
    color: '#666',
  },
  removeBtn: {
    backgroundColor: '#6200EE',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
  },
  removeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});
