import React from 'react';
import TaskApp from '../src/apps/TaskApp/TaskApp';
import CatApp from '../src/apps/CatApp/CatApp';
import MusicApp from '../src/apps/MusicApp/MusicApp';
import WeatherApp from '../src/apps/WeatherApp/WeatherApp';
import StudentManager from '../src/apps/StudentManager/StudentManager';
import StudentManagerRoom from '../src/apps/StudentManagerRoom/StudentManagerRoom'; // New ORM Version
import { AppConfig } from '../src/config/AppConfig';

export default function App() {
  // Dựa vào config để render app tương ứng
  switch (activeAppMode()) {
    case 'TASK':
      return <TaskApp />;
    case 'CAT':
      return <CatApp />;
    case 'MUSIC':
      return <MusicApp />;
    case 'WEATHER':
      return <WeatherApp />;
    case 'STUDENT_MANAGER':
      return <StudentManager />;
    case 'STUDENT_MANAGER_ROOM': // Handle the ORM version
      return <StudentManagerRoom />;
    default:
      return <WeatherApp />;
  }
}

function activeAppMode() {
  return AppConfig.activeApp;
}
