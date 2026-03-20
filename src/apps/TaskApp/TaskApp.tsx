import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image, // Import Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTaskStore, Task } from '../../../store/TaskStore'; // Adjusted import path

export default function TaskApp() { // Renamed from App to TaskApp
  // Use the Task Store
  const { 
    tasks, 
    searchText, 
    setSearchText, 
    addTask, 
    editTask, 
    deleteTask,
    filteredTasks
  } = useTaskStore();

  // States for search and modal
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // States for form inputs
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [gender, setGender] = useState<'Nam' | 'Nữ'>('Nam');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // List to display (get from the store's computed method)
  const taskList = filteredTasks();

  // Handle opening modal for Add
  const openAddModal = () => {
    setName('');
    setContent('');
    setGender('Nam');
    setDate(new Date());
    setIsEditing(false);
    setModalVisible(true);
  };

  // Handle opening modal for Edit
  const openEditModal = (task: Task) => {
    setEditingId(task.id);
    setName(task.name);
    setContent(task.content);
    setGender(task.gender);
    setDate(new Date(task.date));
    setIsEditing(true);
    setModalVisible(true);
  };

  // Validation function
  const validate = () => {
    if (!name.trim()) {
      Alert.alert('Lỗi', 'Tên công việc không được để trống');
      return false;
    }
    if (!content.trim()) {
      Alert.alert('Lỗi', 'Nội dung công việc không được để trống');
      return false;
    }
    return true;
  };

  // Save task (Add or Edit)
  const handleSave = () => {
    if (!validate()) return;

    const taskData: Omit<Task, 'id'> = { name, content, gender, date };

    if (isEditing && editingId) {
      editTask(editingId, taskData);
    } else {
      addTask(taskData);
    }
    setModalVisible(false);
  };

  // Delete task
  const handleDelete = (id: string) => {
    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn xóa công việc này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => deleteTask(id),
      },
    ]);
  };

  // Format date for display (DD/MM/YYYY)
  const formatDate = (date: Date) => {
    const d = date.getDate();
    const m = date.getMonth() + 1;
    const y = date.getFullYear();
    return `${d < 10 ? '0' + d : d}/${m < 10 ? '0' + m : m}/${y}`;
  };

  // Date picker handler
  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  // Render individual task item
  const renderTaskItem = ({ item }: { item: Task }) => (
    <TouchableOpacity 
      style={styles.taskItem} 
      onPress={() => openEditModal(item)}
      activeOpacity={0.7}
      key={item.id}
    >
      <View style={styles.taskIconContainer}>
        <Image 
          source={item.gender === 'Nam' ? require('../../../assets/images/male.png') : require('../../../assets/images/female.png')} 
          style={styles.taskAvatar} 
          resizeMode="cover"
        />
      </View>
      <View style={styles.taskInfo}>
        <View style={styles.taskHeaderRow}>
          <Text style={styles.taskTitle}>{item.name}</Text>
          <Text style={styles.taskDate}>{formatDate(item.date)}</Text>
        </View>
        <Text style={styles.taskContent} numberOfLines={1}>{item.content}</Text>
        <Text style={[styles.genderTag, { color: item.gender === 'Nam' ? '#4A90E2' : '#E91E63' }]}>
          {item.gender}
        </Text>
      </View>
      <View style={styles.taskActions}>
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
          <Ionicons name="trash" size={20} color="#FF5252" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>QUẢN LÝ CÔNG VIỆC</Text>
        <Text style={styles.headerSubtitle}>Tổ chức cuộc sống của bạn (Store version)</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#AAA" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm tên công việc..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#AAA"
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <Ionicons name="close-circle" size={20} color="#CCC" />
          </TouchableOpacity>
        )}
      </View>

      {/* List (TaskList) */}
      <FlatList
        data={taskList}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="clipboard-outline" size={80} color="#DDD" />
            <Text style={styles.emptyText}>Chưa có công việc nào.</Text>
          </View>
        }
      />

      {/* Floating Add Button */}
      <TouchableOpacity style={styles.fab} onPress={openAddModal}>
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      {/* Add/Edit Modal */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.modalContent}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isEditing ? 'Cập nhật Công việc' : 'Thêm Công việc mới'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tên công việc</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập tên..."
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nội dung chi tiết</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Nhập nội dung..."
                value={content}
                onChangeText={setContent}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Gender Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Đối tượng thực hiện</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={[styles.radioButton, gender === 'Nam' && styles.radioActiveNam]}
                  onPress={() => setGender('Nam')}
                >
                  <Ionicons 
                    name={gender === 'Nam' ? "radio-button-on" : "radio-button-off"} 
                    size={20} 
                    color={gender === 'Nam' ? "#fff" : "#4A90E2"} 
                  />
                  <Text style={[styles.radioLabel, gender === 'Nam' && styles.radioLabelActive]}>Nam</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.radioButton, gender === 'Nữ' && styles.radioActiveNu]}
                  onPress={() => setGender('Nữ')}
                >
                  <Ionicons 
                    name={gender === 'Nữ' ? "radio-button-on" : "radio-button-off"} 
                    size={20} 
                    color={gender === 'Nữ' ? "#fff" : "#E91E63"} 
                  />
                  <Text style={[styles.radioLabel, gender === 'Nữ' && styles.radioLabelActive]}>Nữ</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Date Picker Button */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Ngày hoàn thành</Text>
              <TouchableOpacity
                style={styles.datePickerBtn}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar" size={20} color="#4A90E2" />
                <Text style={styles.datePickerText}>{formatDate(date)}</Text>
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === 'android' ? 'default' : 'spinner'}
                onChange={onDateChange}
              />
            )}

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSave}
            >
              <Text style={styles.saveBtnText}>
                {isEditing ? 'LƯU THAY ĐỔI' : 'THÊM CÔNG VIỆC'}
              </Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 50 : 20,
    paddingBottom: 15,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#2D3436',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#636E72',
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 10,
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2D3436',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 100,
  },
  taskItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F3F5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  taskIconContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  taskAvatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  taskInfo: {
    flex: 1,
  },
  taskHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  taskTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2D3436',
  },
  taskDate: {
    fontSize: 12,
    color: '#636E72',
    fontWeight: '500',
  },
  taskContent: {
    fontSize: 14,
    color: '#636E72',
    marginBottom: 6,
  },
  genderTag: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  taskActions: {
    marginLeft: 10,
  },
  deleteBtn: {
    padding: 8,
    backgroundColor: '#FFF5F5',
    borderRadius: 10,
  },
  fab: {
    position: 'absolute',
    right: 25,
    bottom: 30,
    backgroundColor: '#2D3436',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    color: '#B2BEC3',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    minHeight: '60%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2D3436',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#636E72',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2D3436',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0.48,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    backgroundColor: '#F8F9FA',
  },
  radioActiveNam: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  radioActiveNu: {
    backgroundColor: '#E91E63',
    borderColor: '#E91E63',
  },
  radioLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#636E72',
    marginLeft: 10,
  },
  radioLabelActive: {
    color: '#fff',
  },
  datePickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  datePickerText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#2D3436',
    fontWeight: '500',
  },
  saveBtn: {
    backgroundColor: '#2D3436',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
