import { create } from 'zustand';

// Task Interface definition
export interface Task {
  id: string;
  name: string;
  content: string;
  gender: 'Nam' | 'Nữ';
  date: Date;
}

// State for TaskStore
interface TaskState {
  tasks: Task[];
  searchText: string;
  filteredTasks: () => Task[];
  setSearchText: (text: string) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  editTask: (id: string, updatedTask: Omit<Task, 'id'>) => void;
  deleteTask: (id: string) => void;
}

// Create the TaskStore using Zustand
export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [
    {
      id: '1',
      name: 'Lau nhà',
      content: 'Dọn dẹp phòng khách và lau sàn bằng nước lau sàn',
      gender: 'Nam',
      date: new Date(2022, 2, 16),
    },
    {
      id: '2',
      name: 'Nấu cơm',
      content: 'Chuẩn bị bữa tối cho cả gia đình (3 món)',
      gender: 'Nữ',
      date: new Date(2022, 3, 20),
    },
    {
      id: '3',
      name: 'Giặt đồ',
      content: 'Giặt và phơi quần áo, chăn mền',
      gender: 'Nữ',
      date: new Date(2022, 5, 12),
    },
  ],
  searchText: '',

  // Computed: Get filtered list of tasks
  filteredTasks: () => {
    const { tasks, searchText } = get();
    if (!searchText.trim()) return tasks;
    return tasks.filter((t) =>
      t.name.toLowerCase().includes(searchText.toLowerCase())
    );
  },

  setSearchText: (text) => set({ searchText: text }),

  addTask: (taskData) =>
    set((state) => ({
      tasks: [
        ...state.tasks,
        {
          ...taskData,
          id: Date.now().toString(),
        },
      ],
    })),

  editTask: (id, updatedTask) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...updatedTask, id } : t
      ),
    })),

  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    })),
}));
