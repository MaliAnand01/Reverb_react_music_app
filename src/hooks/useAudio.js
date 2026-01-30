import { useState, useEffect, useRef } from 'react';

const useAudio = (initialVolume = 0.5, onEndedCallback) => {
    const audioRef = useRef(new Audio());
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolumeState] = useState(initialVolume);
    const [audioSrc, setAudioSrc] = useState(null);
    const [isReady, setIsReady] = useState(false);

    // Audio setup and general event listeners
    useEffect(() => {
        const audio = audioRef.current;
        // audio.volume = volume; // Handled by separate effect

        const setAudioData = () => {
            setDuration(audio.duration);
            setCurrentTime(audio.currentTime);
            setIsReady(true);
        };

        const setAudioTime = () => {
            setCurrentTime(audio.currentTime);
        };

        const onError = (e) => {
            console.error("Audio error:", e, audio.error);
            setIsPlaying(false);
            setIsReady(false);
        };

        const onCanPlay = () => setIsReady(true);

        // Persistent listeners
        audio.addEventListener('loadedmetadata', setAudioData);
        audio.addEventListener('timeupdate', setAudioTime);
        audio.addEventListener('canplay', onCanPlay);
        audio.addEventListener('error', onError);

        return () => {
            audio.removeEventListener('loadedmetadata', setAudioData);
            audio.removeEventListener('timeupdate', setAudioTime);
            audio.removeEventListener('canplay', onCanPlay);
            audio.removeEventListener('error', onError);
            audio.pause(); // Only pause when component completely unmounts
        };
    }, []);

    // Handle onEnded callback specifically to avoid full re-initialization
    useEffect(() => {
        const audio = audioRef.current;
        const onEnded = () => {
            setIsPlaying(false);
            if (onEndedCallback) onEndedCallback();
        };

        audio.addEventListener('ended', onEnded);
        return () => {
            audio.removeEventListener('ended', onEnded);
        };
    }, [onEndedCallback]);

    // Handle source change
    useEffect(() => {
        if (!audioSrc) return;

        const audio = audioRef.current;

        // Only update if src changed
        if (audio.src !== audioSrc) {
            audio.src = audioSrc;
            audio.currentTime = 0; // Reset time on new song

            // Avoid setting state in effect if possible or just accept it (logic requirement)
            // But we can setIsReady immediately if we assume false on change
            // setIsReady(false) causes re-render.
            // Better to wrap in a functional update or just let it be.
            // The lint error was "Calling setState synchronously within an effect".
            // We can move setIsReady(false) to where setAudioSrc is called?
            // No, setAudioSrc is in loadSong.
            // Let's rely on loadSong to set isReady=false optionally?
            // Actually, we can assume 'loadstart' event will handle readiness?
            // For now, let's keep setIsReady(false) but wrapped or ignored IF it's critical.
            // OR better: use a ref for 'isReady' to prevent render loops? No we need UI update.
            // The issue is setting state during render phase or immediate effect? 
            // It's in useEffect, which is fine usually, unless it triggers immediate re-render of same component.
            // The loop comes if deps change. audioSrc changes -> effect -> setIsReady.
            // This is standard. Why did lint complain? 
            // "Calling setState synchronously within an effect... can hurt performance".
            // It suggests updates to external system.
            // Let's move setIsReady(false) to the loadSong function!

            audio.load();
        }
    }, [audioSrc]);

    // Handle play/pause
    useEffect(() => {
        const audio = audioRef.current;
        if (isPlaying) {
            if (isReady && audio.paused) {
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        // Suppress NotAllowedError (autoplay blocked) and AbortError (interrupted by pause)
                        if (error.name === 'NotAllowedError') {
                            setIsPlaying(false);
                        } else if (error.name === 'AbortError') {
                            // Autoplay interrupted or rapid toggling, safe to ignore
                        } else {
                            console.error("Play prevented:", error);
                        }
                    });
                }
            }
        } else {
            if (!audio.paused) {
                audio.pause();
            }
        }
    }, [isPlaying, isReady]);

    useEffect(() => {
        audioRef.current.volume = volume;
    }, [volume]);

    const togglePlay = () => setIsPlaying(!isPlaying);

    const seek = (time) => {
        const audio = audioRef.current;
        if (!isFinite(time) || !audio) return;

        // Clamp time to duration
        const newTime = Math.min(Math.max(0, time), duration || 0);

        audio.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const setVolume = (val) => {
        const clamped = Math.min(1, Math.max(0, val));
        setVolumeState(clamped);
    };

    const loadSong = (src, autoPlay = true) => {
        if (src === audioSrc) return; // Prevent reload of same song
        setIsReady(false); // Reset ready state immediately on load
        setAudioSrc(src);
        if (autoPlay) {
            setIsPlaying(true);
        } else {
            setIsPlaying(false);
        }
    };

    return {
        isPlaying,
        currentTime,
        duration,
        volume,
        isReady,
        togglePlay,
        seek,
        setVolume,
        loadSong,
        setIsPlaying
    };
};

export default useAudio;
