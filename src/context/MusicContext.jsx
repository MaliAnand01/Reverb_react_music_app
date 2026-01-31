import { createContext, useContext, useState, useRef, useCallback, useEffect, useMemo } from 'react';
import useAudio from '../hooks/useAudio';
import { playlist } from '../data';

const MusicContext = createContext();

export const useMusic = () => {
    return useContext(MusicContext);
};

export const MusicProvider = ({ children }) => {
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
    const [isMobilePlayerOpen, setIsMobilePlayerOpen] = useState(false);
    const isFirstLoad = useRef(true);
    
    // Liked Songs Logic
    const [likedSongs, setLikedSongs] = useState(() => {
        const saved = localStorage.getItem('likedSongs');
        return saved ? JSON.parse(saved) : [];
    });

    const toggleLike = (songId) => {
        setLikedSongs(prev => {
            const newLiked = prev.includes(songId) 
                ? prev.filter(id => id !== songId)
                : [...prev, songId];
            return newLiked;
        });
    };

    useEffect(() => {
        localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
    }, [likedSongs]);

    // Derived state
    const currentSong = playlist[currentSongIndex];

    const handleNext = useCallback(() => {
        setCurrentSongIndex((prev) => (prev + 1) % playlist.length);
    }, []);

    const handlePrev = useCallback(() => {
        setCurrentSongIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    }, []);

    const playSong = (index) => {
        setCurrentSongIndex(index);
    };

    // Integrate audio hook
    // Pass handleNext as callback for auto-play when song ends
    const audio = useAudio(0.5, handleNext);

    const { loadSong } = audio;
    
    // We use a useEffect to watch currentSongIndex changes
    useEffect(() => {
        if (!currentSong) return;

        if (isFirstLoad.current) {
            loadSong(currentSong.audio, false);
            isFirstLoad.current = false;
        } else {
            loadSong(currentSong.audio, true);
        }
    }, [currentSongIndex, loadSong, currentSong]);

    const value = useMemo(() => ({
        ...audio, // isPlaying, togglePlay, etc.
        currentSong,
        currentSongIndex,
        playlist,
        likedSongs,
        toggleLike,
        handleNext,
        handlePrev,
        playSong,
        isPlaylistOpen,
        setIsPlaylistOpen,
        togglePlaylist: () => setIsPlaylistOpen(prev => !prev),
        isRightSidebarOpen,
        setIsRightSidebarOpen,
        toggleRightSidebar: () => setIsRightSidebarOpen(prev => !prev),
        isMobilePlayerOpen,
        setIsMobilePlayerOpen
    }), [
        audio,
        currentSong,
        currentSongIndex,
        likedSongs,
        handleNext,
        handlePrev,
        isPlaylistOpen,
        isRightSidebarOpen,
        isMobilePlayerOpen
    ]);

    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'likedSongs') {
                setLikedSongs(JSON.parse(e.newValue || '[]'));
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return (
        <MusicContext.Provider value={value}>
            {children}
        </MusicContext.Provider>
    );
};
