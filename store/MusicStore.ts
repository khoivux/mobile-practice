import { create } from 'zustand';

export interface Music {
  id: string;
  name: string;
  description: string;
  avatar: any;
}

interface MusicState {
  songs: Music[];
  addSong: (song: Omit<Music, 'id'>) => void;
  removeSong: (id: string) => void;
  filteredSongs: (searchText: string) => Music[];
}

export const useMusicStore = create<MusicState>((set, get) => ({
  songs: [
    {
      id: '1',
      name: 'No Name',
      description: 'No Description',
      avatar: require('../assets/images/music_logo1.png'),
    },
    {
      id: '2',
      name: 'No Name 2',
      description: 'No Description 2',
      avatar: require('../assets/images/music_logo2.png'),
    },
  ],
  addSong: (songData) =>
    set((state) => ({
      songs: [
        ...state.songs,
        {
          ...songData,
          id: Date.now().toString(),
        },
      ],
    })),
  removeSong: (id) =>
    set((state) => ({
      songs: state.songs.filter((s) => s.id !== id),
    })),
  filteredSongs: (searchText) => {
    const { songs } = get();
    if (!searchText.trim()) return songs;
    return songs.filter((s) =>
      s.name.toLowerCase().includes(searchText.toLowerCase())
    );
  },
}));
