import { create } from 'zustand';

export interface ForecastDay {
  id: string;
  day: string;
  temp: string;
  condition: 'sunny' | 'cloudy' | 'rainy';
}

export interface WeatherNotification {
  id: string;
  date: string;
  title: string;
  content: string;
}

interface WeatherState {
  city: string;
  location: string;
  temperature: string;
  condition: 'sunny' | 'cloudy' | 'rainy';
  date: string;
  details: {
    wind: string;
    humidity: string;
    visibility: string;
    uv: string;
  };
  forecast: ForecastDay[];
  notifications: WeatherNotification[];
  setCity: (city: string) => void;
}

export const useWeatherStore = create<WeatherState>((set) => ({
  city: 'Ha Noi',
  location: 'Ha Noi, Viet Nam',
  temperature: '30°C',
  condition: 'sunny',
  date: 'Thu April 8, 2021',
  details: {
    wind: '13 km/h',
    humidity: '80%',
    visibility: '10 km',
    uv: '1014 mb', // matching the placeholder in user's image
  },
  forecast: [
    { id: '1', day: 'Mon', temp: '30°C', condition: 'sunny' },
    { id: '2', day: 'Tue', temp: '27°C', condition: 'sunny' },
    { id: '3', day: 'Wed', temp: '25°C', condition: 'sunny' },
    { id: '4', day: 'Thu', temp: '28°C', condition: 'cloudy' },
    { id: '5', day: 'Fri', temp: '26°C', condition: 'rainy' },
  ],
  notifications: [
    {
      id: '1',
      date: '04/01/2021',
      title: 'Thoi tiet Ha Noi',
      content: 'Hom nay mua to lam ban oi nho mang theo o nhe!',
    },
    {
      id: '2',
      date: '06/01/2021',
      title: 'Thoi tiet Ha Noi',
      content: 'Hom nay mua to lam ban oi nho mang theo o nhe!',
    },
    {
      id: '3',
      date: '24/01/2021',
      title: 'Thoi tiet Ha Noi',
      content: 'Hom nay mua to lam ban oi nho mang theo o nhe!',
    },
  ],
  setCity: (city) => set({ city }),
}));
