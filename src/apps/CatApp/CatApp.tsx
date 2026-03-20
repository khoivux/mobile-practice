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
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Dropdown } from 'react-native-element-dropdown';
import { useCatStore, Cat } from '../../../store/CatStore';

const catImages = [
  require('../../../assets/images/cat1.png'),
  require('../../../assets/images/cat2.png'),
  require('../../../assets/images/cat3.png'),
  require('../../../assets/images/cat4.png'),
  require('../../../assets/images/cat5.png'),
];

export default function CatApp() {
  const { cats, addCat, updateCat, removeCat } = useCatStore();

  // Selected avatar index (0 to 4)
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  
  // To track if we are editing an existing cat
  const [editingId, setEditingId] = useState<string | null>(null);

  const dropdownData = catImages.map((img, index) => ({
    label: `Mèo ${index + 1}`,
    value: index.toString(),
    image: img,
  }));

  const handleAdd = () => {
    if (!name.trim() || !price.trim() || !description.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }
    
    addCat({
      name,
      price,
      description,
      avatar: catImages[avatarIndex],
    });
    
    // Reset form
    resetForm();
  };

  const handleUpdate = () => {
    if (editingId) {
      if (!name.trim() || !price.trim() || !description.trim()) {
        Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
        return;
      }
      
      updateCat(editingId, {
        name,
        price,
        description,
        avatar: catImages[avatarIndex],
      });
      
      resetForm();
    }
  };

  const handleSelectItem = (cat: Cat) => {
    setEditingId(cat.id);
    setName(cat.name);
    setPrice(cat.price);
    setDescription(cat.description);
    
    // Find back the index of the avatar if possible, or just default to current
    const idx = catImages.findIndex(img => img === cat.avatar);
    if (idx !== -1) setAvatarIndex(idx);
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setPrice('');
    setDescription('');
    setAvatarIndex(0);
  };

  const handleRemove = (id: string) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa con mèo này không?',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xóa', 
          style: 'destructive', 
          onPress: () => removeCat(id) 
        },
      ]
    );
  };

  const renderDropdownItem = (item: any) => {
    return (
      <View style={styles.dropdownItem}>
        <Image source={item.image} style={styles.dropdownThumb} />
        <Text style={styles.dropdownLabel}>{item.label}</Text>
      </View>
    );
  };

  const renderCatItem = ({ item }: { item: Cat }) => (
    <TouchableOpacity 
      style={styles.catItem} 
      onPress={() => handleSelectItem(item)}
      activeOpacity={0.8}
    >
      <Image source={item.avatar} style={styles.listAvatar} />
      <View style={styles.catInfo}>
        <Text style={styles.catName}>{item.name}</Text>
        <Text style={styles.catPrice}>{item.price}</Text>
        <Text style={styles.catDescription} numberOfLines={2}>{item.description}</Text>
      </View>
      <TouchableOpacity 
        style={styles.removeBtn} 
        onPress={() => handleRemove(item.id)}
      >
        <Text style={styles.removeBtnText}>REMOVE</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.mainContainer}>
          {/* Input Section */}
          <View style={styles.inputSection}>
            <Text style={styles.inputTitle}>Input a new cat</Text>
            
            <View style={styles.avatarRow}>
              <View style={styles.avatarSelectionContainer}>
                <Image source={catImages[avatarIndex]} style={styles.inputAvatar} />
                
                <Dropdown
                  style={styles.dropdown}
                  data={dropdownData}
                  labelField="label"
                  valueField="value"
                  placeholder="Chọn ảnh mèo"
                  value={avatarIndex.toString()}
                  onChange={item => {
                    setAvatarIndex(parseInt(item.value));
                  }}
                  renderItem={renderDropdownItem}
                  renderRightIcon={() => (
                    <Ionicons name="caret-down" size={16} color="#333" />
                  )}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <TextInput 
                placeholder="enter name" 
                style={styles.input} 
                value={name}
                onChangeText={setName}
              />
              <TextInput 
                placeholder="enter price" 
                style={styles.input} 
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
              />
              <TextInput 
                placeholder="enter describe" 
                style={styles.input} 
                value={description}
                onChangeText={setDescription}
              />
            </View>

            <View style={styles.btnRow}>
              <TouchableOpacity 
                style={[styles.actionBtn, { backgroundColor: editingId ? '#ccc' : '#6200EE' }]} 
                onPress={handleAdd}
                disabled={!!editingId}
              >
                <Text style={styles.btnText}>ADD</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionBtn, { backgroundColor: editingId ? '#6200EE' : '#ccc' }]} 
                onPress={handleUpdate}
                disabled={!editingId}
              >
                <Text style={styles.btnText}>UPDATE</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* List Section */}
          <View style={styles.listSection}>
            <FlatList
              data={cats}
              renderItem={renderCatItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false} // Since we're inside a ScrollView
              contentContainerStyle={styles.flatListContent}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 70,
    backgroundColor: '#6200EE',
    justifyContent: 'center',
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    paddingTop: 0,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  mainContainer: {
    flex: 1,
  },
  inputSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  inputTitle: {
    fontSize: 22,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
    marginTop: 10,
  },
  avatarSelectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
  },
  dropdown: {
    height: 50,
    flex: 1,
    marginLeft: 20,
    borderBottomWidth: 1.5,
    borderBottomColor: '#ccc',
  },
  dropdownItem: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownThumb: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 4,
  },
  dropdownLabel: {
    fontSize: 16,
    color: '#333',
  },
  inputAvatar: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  inputGroup: {
    marginTop: 0,
  },
  input: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 15,
  },
  actionBtn: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 4,
    minWidth: 110,
    alignItems: 'center',
    marginRight: 15,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  listSection: {
    padding: 0,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  catItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  listAvatar: {
    width: 80,
    height: 90,
    backgroundColor: '#eee',
    resizeMode: 'cover',
  },
  catInfo: {
    flex: 1,
    marginLeft: 15,
  },
  catName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  catPrice: {
    fontSize: 14,
    color: '#666',
    marginVertical: 2,
  },
  catDescription: {
    fontSize: 14,
    color: '#888',
  },
  removeBtn: {
    backgroundColor: '#6200EE',
    paddingVertical: 11,
    paddingHorizontal: 15,
    borderRadius: 4,
  },
  removeBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
