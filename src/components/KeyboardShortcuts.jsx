import { useEffect } from 'react';
import { useMusic } from '../context/MusicContext';

const KeyboardShortcuts = () => {
    const { togglePlay, handleNext, handlePrev, volume, setVolume } = useMusic();

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ignore if typing in an input or textarea
            if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName) || document.activeElement.isContentEditable) {
                return;
            }

            switch (e.code) {
                case 'Space':
                    e.preventDefault(); // Prevent scrolling
                    togglePlay();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    handleNext();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    handlePrev();
                    break;
                case 'KeyM':
                    e.preventDefault();
                    // Toggle Mute logic: if volume > 0, save it and set to 0. If 0, restore to default 0.5 or 1
                    if (volume > 0) {
                        setVolume(0);
                    } else {
                        setVolume(0.5); // Restore to 50% if unmuting
                    }
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [togglePlay, handleNext, handlePrev, volume, setVolume]);

    return null; // Logic only component
};

export default KeyboardShortcuts;
