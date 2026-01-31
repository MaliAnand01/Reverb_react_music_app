import React, { useState, lazy, Suspense } from 'react';
import { AuthProvider } from './context/AuthContext';
import { MusicProvider } from './context/MusicContext';
import MainLayout from './components/MainLayout';

const HomeView = lazy(() => import('./pages/HomeView'));
const SearchView = lazy(() => import('./pages/SearchView'));
const ProfileView = lazy(() => import('./pages/ProfileView'));
const LibraryView = lazy(() => import('./pages/LibraryView'));
const LikedSongsView = lazy(() => import('./pages/LikedSongsView'));

function App() {
  const [currentView, setCurrentView] = useState('home');

  return (
    <AuthProvider>
        <MusicProvider>
            <MainLayout currentView={currentView} setCurrentView={setCurrentView}>
                <Suspense fallback={<div className="flex-1 flex items-center justify-center"><div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" /></div>}>
                    {currentView === 'home' && <HomeView setCurrentView={setCurrentView} />}
                    {currentView === 'search' && <SearchView />}
                    {currentView === 'profile' && <ProfileView />}
                    {currentView === 'library' && <LibraryView />}
                    {currentView === 'liked' && <LikedSongsView />}
                </Suspense>
            </MainLayout>
        </MusicProvider>
    </AuthProvider>
  );
}

export default App;
