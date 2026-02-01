import React, { useState, lazy, Suspense } from 'react';
import { AuthProvider } from './context/AuthContext';
import { MusicProvider, useMusic } from './context/MusicContext';
import MainLayout from './components/MainLayout';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import EqualizerModal from './components/EqualizerModal';

// Wrapper to consume context
const EqualizerModalManager = () => {
    const { isEqualizerOpen, closeEqualizer } = useMusic();
    return <EqualizerModal isOpen={isEqualizerOpen} onClose={closeEqualizer} />;
};

const HomeView = lazy(() => import('./pages/HomeView'));
const SearchView = lazy(() => import('./pages/SearchView'));
const ProfileView = lazy(() => import('./pages/ProfileView'));
const LibraryView = lazy(() => import('./pages/LibraryView'));
const LikedSongsView = lazy(() => import('./pages/LikedSongsView'));
const PlaylistDetailView = lazy(() => import('./pages/PlaylistDetailView'));

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  return (
    <AuthProvider>
        <MusicProvider>
            <MainLayout currentView={currentView} setCurrentView={setCurrentView}>
                <Suspense fallback={<div className="flex-1 flex items-center justify-center"><div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" /></div>}>
                    {currentView === 'home' && <HomeView setCurrentView={setCurrentView} />}
                    {currentView === 'search' && <SearchView />}
                    {currentView === 'profile' && <ProfileView />}
                    {currentView === 'library' && <LibraryView setCurrentView={setCurrentView} setSelectedPlaylist={setSelectedPlaylist} />}
                    {currentView === 'liked' && <LikedSongsView />}
                    {currentView === 'playlistDetail' && <PlaylistDetailView playlistId={selectedPlaylist} onBack={() => setCurrentView('library')} />}
                </Suspense>
            </MainLayout>
            <KeyboardShortcuts />
            <EqualizerModalManager />
        </MusicProvider>
    </AuthProvider>
  );
}

export default App;
