import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { MusicProvider } from './context/MusicContext';
import MainLayout from './components/MainLayout';
import HomeView from './pages/HomeView';
import SearchView from './pages/SearchView';
import ProfileView from './pages/ProfileView';
import LibraryView from './pages/LibraryView';
import LikedSongsView from './pages/LikedSongsView';

function App() {
  const [currentView, setCurrentView] = useState('home');

  return (
    <AuthProvider>
        <MusicProvider>
            <MainLayout currentView={currentView} setCurrentView={setCurrentView}>
                {currentView === 'home' && <HomeView setCurrentView={setCurrentView} />}
                {currentView === 'search' && <SearchView />}
                {currentView === 'profile' && <ProfileView />}
                {currentView === 'library' && <LibraryView />}
                {currentView === 'liked' && <LikedSongsView />}
            </MainLayout>
        </MusicProvider>
    </AuthProvider>
  );
}

export default App;
