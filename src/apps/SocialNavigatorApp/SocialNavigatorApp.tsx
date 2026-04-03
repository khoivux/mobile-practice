import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Animated,
  StatusBar,
  Platform,
  BackHandler,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, MaterialIcons, Feather } from '@expo/vector-icons';
// import * as Notifications from 'expo-notifications'; // Tạm đóng để khắc phục lỗi Unable to resolve
import DateTimePicker from '@react-native-community/datetimepicker';

// --- Notification Config ---
/* Tạm thời đóng để app không lỗi
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});
*/

const { width, height } = Dimensions.get('window');

// --- Mock Data ---
const posts = [
  {
    id: '1',
    user: 'Vaaaaaa',
    time: 'Hôm qua lúc 18:45',
    content: 'aaaaaaaa',
    image: 'https://picsum.photos/500/300?random=10',
  },
  {
    id: '2',
    user: 'aaaaaaaa',
    time: '2 giờ trước',
    content: 'aaaaaaaa',
    image: 'https://picsum.photos/500/300?random=11',
  }
];

// --- Fragments (Screens) ---
const FeedFragment = () => (
  <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>


    <View style={styles.divider} />

    {posts.map(post => (
      <View key={post.id} style={styles.postCard}>
        <View style={styles.postHeader}>
          <View style={styles.postUserAvatar} />
          <View style={styles.postHeaderText}>
            <Text style={styles.postUserName}>{post.user}</Text>
            <Text style={styles.postTime}>{post.time} • 🌐</Text>
          </View>
          <Ionicons name="ellipsis-horizontal" size={20} color="#65676B" />
        </View>
        <Text style={styles.postContent}>{post.content}</Text>
        <Image source={{ uri: post.image }} style={styles.postImage} />
        <View style={styles.postActions}>
          <View style={styles.postAction}>
            <Ionicons name="thumbs-up-outline" size={20} color="#65676B" />
            <Text style={styles.postActionText}>Thích</Text>
          </View>
          <View style={styles.postAction}>
            <Ionicons name="chatbubble-outline" size={20} color="#65676B" />
            <Text style={styles.postActionText}>Bình luận</Text>
          </View>
          <View style={styles.postAction}>
            <Ionicons name="share-social-outline" size={20} color="#65676B" />
            <Text style={styles.postActionText}>Chia sẻ</Text>
          </View>
        </View>
      </View>
    ))}
  </ScrollView>
);

const PlaceholderFragment = ({ title, icon }: { title: string, icon: any }) => (
  <View style={styles.centerFragment}>
    <Ionicons name={icon} size={80} color="#E4E6EB" />
    <Text style={styles.fragmentTitle}>{title}</Text>
    <Text style={styles.fragmentSubtitle}>Đang cập nhật nội dung cho phần này...</Text>
  </View>
);

export default function SocialNavigatorApp() {
  const [activeBottomTab, setActiveBottomTab] = useState('Home');
  const [activeTopTab, setActiveTopTab] = useState('Feed');
  const [navigationStack, setNavigationStack] = useState<{ bottom: string, top: string }[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(new Date());

  // Notification Content
  const [notifTitle, setNotifTitle] = useState('Nhắc nhở công việc');
  const [notifBody, setNotifBody] = useState('Đã đến giờ hẹn rồi!');

  const drawerAnimation = useRef(new Animated.Value(-width * 0.75)).current;

  // Request Permissions
  useEffect(() => {
    /* Tạm đóng permissions 
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Vui lòng bật thông báo để sử dụng tính năng đặt lịch!');
      }
    })();
    */
  }, []);

  const scheduleNotification = async (date: Date) => {
    // Luôn ghi log nội dung thông báo
    console.log(`Scheduling: Title=${notifTitle}, Body=${notifBody}, Time=${date.toLocaleTimeString()}`);

    /* 
    QUAN TRỌNG: Khi bạn đã khởi động lại metro bằng "npx expo start -c", 
    bạn có thể bỏ các dấu comment bên dưới để kích hoạt thông báo thực tế.
    */
    /*
    const trigger = date;
    await Notifications.scheduleNotificationAsync({
      content: {
        title: notifTitle,
        body: notifBody,
        data: { data: 'scheduled-task' },
      },
      trigger: date as any, 
    });
    */

    alert(`✅ Đã đặt lịch thành công!\n\nTiêu đề: ${notifTitle}\nNội dung: ${notifBody}\nThời gian: ${date.toLocaleTimeString()}`);
    setShowModal(false);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    // Check if user dismissed the picker
    if (event.type === 'dismissed') {
      setShowPicker(false);
      return;
    }

    setShowPicker(false);
    if (selectedDate) {
      setScheduledDate(selectedDate);
      scheduleNotification(selectedDate);
    }
  };

  // Handle Hardware Back Button
  useEffect(() => {
    const backAction = () => {
      if (isDrawerOpen) {
        toggleDrawer();
        return true;
      }
      if (navigationStack.length > 0) {
        const lastPos = navigationStack[navigationStack.length - 1];
        setActiveBottomTab(lastPos.bottom);
        setActiveTopTab(lastPos.top);
        setNavigationStack(prev => prev.slice(0, -1));
        return true;
      }
      return false; // App exits if stack is empty
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [navigationStack, isDrawerOpen]);

  const switchTab = (bottom: string, top: string) => {
    if (activeBottomTab === bottom && activeTopTab === top) return;

    // Save current position to stack
    setNavigationStack(prev => [...prev, { bottom: activeBottomTab, top: activeTopTab }]);

    setActiveBottomTab(bottom);
    setActiveTopTab(top);
  };

  const toggleDrawer = () => {
    if (isDrawerOpen) {
      Animated.timing(drawerAnimation, {
        toValue: -width * 0.75,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsDrawerOpen(false));
    } else {
      setIsDrawerOpen(true);
      Animated.timing(drawerAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={toggleDrawer}>
        <Ionicons name="menu" size={28} color="#1877F2" />
      </TouchableOpacity>
      <Text style={styles.logoText}>facebook</Text>
      <View style={styles.headerIcons}>
        <TouchableOpacity style={styles.iconCircle}>
          <Ionicons name="search" size={20} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconCircle}>
          <MaterialCommunityIcons name="facebook-messenger" size={20} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTopTabs = () => (
    <View style={styles.topTabs}>
      <TouchableOpacity style={styles.topTab} onPress={() => switchTab('Home', 'Feed')}>
        <Ionicons name="home" size={26} color={activeTopTab === 'Feed' ? '#1877F2' : '#65676B'} />
        {activeTopTab === 'Feed' && <View style={styles.activeLine} />}
      </TouchableOpacity>
      <TouchableOpacity style={styles.topTab} onPress={() => switchTab('Home', 'Groups')}>
        <Ionicons name="people-outline" size={26} color={activeTopTab === 'Groups' ? '#1877F2' : '#65676B'} />
        {activeTopTab === 'Groups' && <View style={styles.activeLine} />}
      </TouchableOpacity>
      <TouchableOpacity style={styles.topTab} onPress={() => switchTab('Home', 'Watch')}>
        <Ionicons name="play-circle-outline" size={26} color={activeTopTab === 'Watch' ? '#1877F2' : '#65676B'} />
        {activeTopTab === 'Watch' && <View style={styles.activeLine} />}
      </TouchableOpacity>
      <TouchableOpacity style={styles.topTab} onPress={() => switchTab('Home', 'Market')}>
        <Ionicons name="storefront-outline" size={26} color={activeTopTab === 'Market' ? '#1877F2' : '#65676B'} />
        {activeTopTab === 'Market' && <View style={styles.activeLine} />}
      </TouchableOpacity>
      <TouchableOpacity style={styles.topTab} onPress={() => switchTab('Home', 'Notify')}>
        <Ionicons name="notifications-outline" size={26} color={activeTopTab === 'Notify' ? '#1877F2' : '#65676B'} />
        {activeTopTab === 'Notify' && <View style={styles.activeLine} />}
      </TouchableOpacity>
      <TouchableOpacity style={styles.topTab} onPress={() => switchTab('Home', 'Menu')}>
        <Ionicons name="menu-outline" size={26} color={activeTopTab === 'Menu' ? '#1877F2' : '#65676B'} />
        {activeTopTab === 'Menu' && <View style={styles.activeLine} />}
      </TouchableOpacity>
    </View>
  );

  const activeFragment = () => {
    // Logic for Bottom Tabs
    if (activeBottomTab !== 'Home') {
      switch (activeBottomTab) {
        case 'Explore': return <PlaceholderFragment title="Explore Fragment" icon="compass-outline" />;
        case 'Subscriptions': return <PlaceholderFragment title="Subscriptions Fragment" icon="play-circle-outline" />;
        case 'Inbox': return <PlaceholderFragment title="Inbox Fragment" icon="mail-outline" />;
        case 'Library': return <PlaceholderFragment title="Library Fragment" icon="library-outline" />;
      }
    }

    // Logic for Top Tabs (when Bottom Tab is Home)
    switch (activeTopTab) {
      case 'Feed': return <FeedFragment />;
      case 'Groups': return <PlaceholderFragment title="Groups Fragment" icon="people-outline" />;
      case 'Watch': return <PlaceholderFragment title="Watch Fragment" icon="play-circle-outline" />;
      case 'Market': return <PlaceholderFragment title="Marketplace Fragment" icon="storefront-outline" />;
      case 'Notify': return <PlaceholderFragment title="Notifications Fragment" icon="notifications-outline" />;
      case 'Menu': return <PlaceholderFragment title="Menu Fragment" icon="menu-outline" />;
      default: return <FeedFragment />;
    }
  };

  const renderBottomNav = () => (
    <View style={styles.bottomNav}>
      <TouchableOpacity style={styles.navItem} onPress={() => switchTab('Home', activeTopTab)}>
        <Ionicons name="home" size={24} color={activeBottomTab === 'Home' ? '#000' : '#65676B'} />
        <Text style={[styles.navText, activeBottomTab === 'Home' && styles.activeNavText]}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => switchTab('Explore', 'Feed')}>
        <Ionicons name="compass-outline" size={24} color={activeBottomTab === 'Explore' ? '#000' : '#65676B'} />
        <Text style={[styles.navText, activeBottomTab === 'Explore' && styles.activeNavText]}>Explore</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => switchTab('Subscriptions', 'Feed')}>
        <MaterialIcons name="subscriptions" size={24} color={activeBottomTab === 'Subscriptions' ? '#000' : '#65676B'} />
        <Text style={[styles.navText, activeBottomTab === 'Subscriptions' && styles.activeNavText]}>Subscriptions</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => switchTab('Inbox', 'Feed')}>
        <View>
          <Ionicons name="mail-outline" size={24} color={activeBottomTab === 'Inbox' ? '#000' : '#65676B'} />
          <View style={styles.badge}><Text style={styles.badgeText}>5</Text></View>
        </View>
        <Text style={[styles.navText, activeBottomTab === 'Inbox' && styles.activeNavText]}>Inbox</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => switchTab('Library', 'Feed')}>
        <Ionicons name="library-outline" size={24} color={activeBottomTab === 'Library' ? '#000' : '#65676B'} />
        <Text style={[styles.navText, activeBottomTab === 'Library' && styles.activeNavText]}>Library</Text>
      </TouchableOpacity>
    </View>
  );

  const renderDrawer = () => (
    <>
      {isDrawerOpen && (
        <TouchableOpacity
          style={styles.drawerOverlay}
          activeOpacity={1}
          onPress={toggleDrawer}
        />
      )}
      <Animated.View style={[styles.drawer, { transform: [{ translateX: drawerAnimation }] }]}>
        <SafeAreaView style={styles.drawerContent}>
          <View style={styles.drawerHeader}>
            <Text style={styles.drawerTitle}><Text style={{ color: '#4285F4' }}>G</Text>oogle Drive</Text>
          </View>
          <View style={styles.drawerDivider} />
          <TouchableOpacity style={styles.drawerItem}>
            <Ionicons name="time-outline" size={22} color="#5F6368" />
            <Text style={styles.drawerItemText}>Recent</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem}>
            <Ionicons name="checkmark-circle-outline" size={22} color="#5F6368" />
            <Text style={styles.drawerItemText}>Offline</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem}>
            <Ionicons name="trash-outline" size={22} color="#5F6368" />
            <Text style={styles.drawerItemText}>Bin</Text>
          </TouchableOpacity>
          <View style={styles.drawerDivider} />
          <TouchableOpacity style={styles.drawerItem}>
            <Ionicons name="notifications-outline" size={22} color="#5F6368" />
            <Text style={styles.drawerItemText}>Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem}>
            <Ionicons name="cloud-upload-outline" size={22} color="#5F6368" />
            <Text style={styles.drawerItemText}>Backups</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem}>
            <Ionicons name="settings-outline" size={22} color="#5F6368" />
            <Text style={styles.drawerItemText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem}>
            <Ionicons name="help-circle-outline" size={22} color="#5F6368" />
            <Text style={styles.drawerItemText}>Help & feedback</Text>
          </TouchableOpacity>
          <View style={styles.drawerDivider} />
          <View style={styles.storageSection}>
            <View style={styles.storageHeader}>
              <Ionicons name="cloud-outline" size={20} color="#5F6368" />
              <Text style={styles.storageText}>Storage (17% full)</Text>
            </View>
            <View style={styles.storageBar}>
              <View style={[styles.storageProgress, { width: '17%' }]} />
            </View>
            <Text style={styles.storageDetail}>2.6 GB of 15.0 GB used</Text>
            <TouchableOpacity><Text style={styles.buyStorageText}>Buy storage</Text></TouchableOpacity>
          </View>
        </SafeAreaView>
      </Animated.View>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {renderHeader()}
      {renderTopTabs()}

      <View style={{ flex: 1 }}>
        {activeFragment()}
      </View>

      {renderBottomNav()}
      {renderDrawer()}

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowModal(true)}
      >
        <Ionicons name="notifications" size={32} color="#fff" />
      </TouchableOpacity>

      {/* Scheduling Modal */}
      {showModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>📝 Đặt lịch thông báo</Text>

            <Text style={styles.label}>Tiêu đề:</Text>
            <TextInput
              style={styles.modalInput}
              value={notifTitle}
              onChangeText={setNotifTitle}
              placeholder="Nhập tiêu đề..."
            />

            <Text style={styles.label}>Nội dung:</Text>
            <TextInput
              style={[styles.modalInput, { height: 80, textAlignVertical: 'top' }]}
              value={notifBody}
              onChangeText={setNotifBody}
              placeholder="Nhập nội dung..."
              multiline
            />

            <TouchableOpacity
              style={styles.timeSelectBtn}
              onPress={() => setShowPicker(true)}
            >
              <Ionicons name="time-outline" size={20} color="#fff" />
              <Text style={styles.timeSelectText}>
                {scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </TouchableOpacity>

            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setShowModal(false)} style={styles.cancelBtn}>
                <Text style={styles.cancelBtnText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => scheduleNotification(scheduledDate)} style={styles.confirmBtn}>
                <Text style={styles.confirmBtnText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Time Picker */}
      {showPicker && (
        <DateTimePicker
          value={scheduledDate}
          mode="time"
          is24Hour={true}
          display="spinner"
          onChange={(event, date) => {
            setShowPicker(false);
            if (date) setScheduledDate(date);
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1877F2',
    letterSpacing: -1,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F2F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  topTabs: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
    height: 48,
  },
  topTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeLine: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 2,
    backgroundColor: '#1877F2',
  },
  statusInput: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ddd',
  },
  inputBox: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginLeft: 10,
  },
  inputText: {
    color: '#000',
    fontSize: 15,
  },
  actionRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#ddd',
  },
  actionItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    marginLeft: 8,
    fontWeight: '600',
    color: '#65676B',
    fontSize: 13,
  },
  vDivider: {
    width: 0.5,
    height: '60%',
    backgroundColor: '#ddd',
    alignSelf: 'center',
  },
  divider: {
    height: 10,
    backgroundColor: '#F0F2F5',
  },
  postCard: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderBottomWidth: 8,
    borderBottomColor: '#F0F2F5',
  },
  postHeader: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  postUserAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1877F2',
  },
  postHeaderText: {
    flex: 1,
    marginLeft: 10,
  },
  postUserName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  postTime: {
    color: '#65676B',
    fontSize: 12,
  },
  postContent: {
    paddingHorizontal: 15,
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 10,
  },
  postImage: {
    width: '100%',
    height: 250,
    backgroundColor: '#eee',
  },
  postActions: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingTop: 10,
    justifyContent: 'space-between',
  },
  postAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postActionText: {
    marginLeft: 5,
    color: '#65676B',
    fontWeight: '600',
  },
  bottomNav: {
    flexDirection: 'row',
    height: 60,
    borderTopWidth: 0.5,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 10,
    color: '#65676B',
    marginTop: 2,
  },
  activeNavText: {
    color: '#000',
    fontWeight: 'bold',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#CC0000',
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  drawerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 99,
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: width * 0.75,
    backgroundColor: '#fff',
    zIndex: 100,
    elevation: 16,
  },
  drawerContent: {
    flex: 1,
  },
  drawerHeader: {
    padding: 20,
  },
  drawerTitle: {
    fontSize: 22,
    fontWeight: '500',
    color: '#5F6368',
  },
  drawerDivider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 8,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingLeft: 20,
  },
  drawerItemText: {
    marginLeft: 20,
    fontSize: 16,
    color: '#3C4043',
    fontWeight: '500',
  },
  storageSection: {
    padding: 20,
  },
  storageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  storageText: {
    marginLeft: 20,
    fontSize: 14,
    color: '#3C4043',
  },
  storageBar: {
    height: 4,
    backgroundColor: '#E8EAED',
    borderRadius: 2,
    marginBottom: 8,
  },
  storageProgress: {
    height: '100%',
    backgroundColor: '#1A73E8',
    borderRadius: 2,
  },
  storageDetail: {
    fontSize: 12,
    color: '#5F6368',
  },
  buyStorageText: {
    color: '#1A73E8',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 10,
  },
  centerFragment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 30,
  },
  fragmentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1E21',
    marginTop: 15,
  },
  fragmentSubtitle: {
    fontSize: 14,
    color: '#65676B',
    marginTop: 8,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1877F2',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 90,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    width: width * 0.85,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    elevation: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1C1E21',
  },
  label: {
    fontSize: 14,
    color: '#65676B',
    marginBottom: 6,
    fontWeight: '600',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 15,
    color: '#000',
  },
  timeSelectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#1877F2',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 30,
    marginBottom: 25,
  },
  timeSelectText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelBtn: {
    padding: 12,
    marginRight: 10,
  },
  cancelBtnText: {
    color: '#65676B',
    fontWeight: 'bold',
    fontSize: 16,
  },
  confirmBtn: {
    backgroundColor: '#1877F2',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 12,
  },
  confirmBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
