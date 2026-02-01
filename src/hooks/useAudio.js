import { useState, useCallback, useMemo, useRef, useEffect } from 'react';

/**
 * useAudio Hook
 * 
 * Manages HTML5 Audio element and Web Audio API for playback control, equalization, and visualization.
 * 
 * @param {number} initialVolume Starting volume (0-1)
 * @param {Function} onEndedCallback Callback when song finishes
 * @returns {Object} Audio state and controls
 */
const useAudio = (initialVolume = 0.5, onEndedCallback) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0); // Only updated on pause/seek for sync
    const [duration, setDuration] = useState(0);
    const [volume, setVolumeState] = useState(initialVolume);
    const [isReady, setIsReady] = useState(false);

    // Equalizer State
    const [presets, setPresets] = useState({
        bass: 0,
        mid: 0,
        treble: 0,
        name: 'Flat'
    });

    // Persistent native Audio object
    const audioRef = useRef(new Audio());

    // Web Audio API Nodes
    const audioContextRef = useRef(null);
    const sourceNodeRef = useRef(null);
    const bassNodeRef = useRef(null);
    const midNodeRef = useRef(null);
    const trebleNodeRef = useRef(null);
    const analyserNodeRef = useRef(null);

    // Initialize Web Audio API
    const initAudioContext = useCallback(() => {
        if (!audioContextRef.current) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;

            const ctx = new AudioContext();
            audioContextRef.current = ctx;

            const source = ctx.createMediaElementSource(audioRef.current);
            sourceNodeRef.current = source;

            // Biquad Filters
            const bass = ctx.createBiquadFilter();
            bass.type = 'lowshelf';
            bass.frequency.value = 320;
            bassNodeRef.current = bass;

            const mid = ctx.createBiquadFilter();
            mid.type = 'peaking';
            mid.frequency.value = 1000;
            mid.Q.value = 0.5;
            midNodeRef.current = mid;

            const treble = ctx.createBiquadFilter();
            treble.type = 'highshelf';
            treble.frequency.value = 3200;
            trebleNodeRef.current = treble;

            const analyser = ctx.createAnalyser();
            analyser.fftSize = 64;
            analyserNodeRef.current = analyser;

            // Connect Chain
            source.connect(bass);
            bass.connect(mid);
            mid.connect(treble);
            treble.connect(analyser);
            analyser.connect(ctx.destination);

            // Set initial values
            bass.gain.value = presets.bass;
            mid.gain.value = presets.mid;
            treble.gain.value = presets.treble;
        } else if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }
    }, [presets]);

    // Update Equalizer Gains
    const setEqualizer = useCallback((newPresets) => {
        setPresets(newPresets);

        if (bassNodeRef.current && midNodeRef.current && trebleNodeRef.current) {
            const now = audioContextRef.current.currentTime;
            bassNodeRef.current.gain.setTargetAtTime(newPresets.bass, now, 0.1);
            midNodeRef.current.gain.setTargetAtTime(newPresets.mid, now, 0.1);
            trebleNodeRef.current.gain.setTargetAtTime(newPresets.treble, now, 0.1);
        }
    }, []);

    const togglePlay = useCallback(() => {
        initAudioContext();

        if (isPlaying) {
            audioRef.current.pause();
            // Sync state on pause
            setCurrentTime(audioRef.current.currentTime);
        } else {
            audioRef.current.play().catch(err => console.error("Playback failed:", err));
        }
        setIsPlaying(prev => !prev);
    }, [isPlaying, initAudioContext]);

    const seek = useCallback((time) => {
        if (Number.isFinite(time)) {
            audioRef.current.currentTime = time;
            setCurrentTime(time); // Update state immediately on seek
        }
    }, []);

    const setVolume = useCallback((val) => {
        const newVolume = Math.min(1, Math.max(0, val));
        audioRef.current.volume = newVolume;
        setVolumeState(newVolume);
    }, []);

    const loadSong = useCallback((src, autoPlay = true) => {
        if (!src) return;

        setIsReady(false);
        setCurrentTime(0); // Reset time
        audioRef.current.crossOrigin = "anonymous";
        audioRef.current.src = src;
        audioRef.current.load();

        if (autoPlay) {
            initAudioContext();
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(err => {
                    console.error("Autoplay failed:", err);
                    setIsPlaying(false);
                });
        } else {
            setIsPlaying(false);
        }
    }, [initAudioContext]);

    useEffect(() => {
        const audio = audioRef.current;
        audio.volume = volume;

        // Optimized: Don't update state on every tick to prevent re-renders
        // Consumers should use audioRef or a local animation loop for smooth progress bars
        /* const handleTimeUpdate = () => setCurrentTime(audio.currentTime); */

        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
            setIsReady(true);
        };
        const handleEnded = () => {
            setIsPlaying(false);
            if (onEndedCallback) onEndedCallback();
        };
        const handleError = (e) => {
            console.error("Audio Error:", e);
            setIsPlaying(false);
            setIsReady(false);
        };

        // audio.addEventListener('timeupdate', handleTimeUpdate); // Removed for performance
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('error', handleError);

        return () => {
            // audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('error', handleError);
        };
    }, [onEndedCallback, volume]);

    return useMemo(() => ({
        audioRef, // Exposed for direct access
        isPlaying,
        currentTime, // Now only updates on significant events, not constantly
        duration,
        volume,
        isReady,
        togglePlay,
        seek,
        setVolume,
        loadSong,
        setIsPlaying,
        setSpeed: (rate) => {
            audioRef.current.playbackRate = rate;
        },
        equalizer: presets,
        setEqualizer,
        analyser: analyserNodeRef.current
    }), [
        isPlaying,
        currentTime,
        duration,
        volume,
        isReady,
        togglePlay,
        seek,
        setVolume,
        loadSong,
        presets,
        setEqualizer
    ]);
};

export default useAudio;
