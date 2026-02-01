import { X, Sliders } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMusic } from '../context/MusicContext';

const PRESETS = {
    Flat: { bass: 0, mid: 0, treble: 0, name: 'Flat' },
    BassBoost: { bass: 10, mid: 2, treble: -2, name: 'Bass Boost' },
    Pop: { bass: 4, mid: 6, treble: 4, name: 'Pop' },
    Rock: { bass: 6, mid: 0, treble: 8, name: 'Rock' },
    Jazz: { bass: 4, mid: 2, treble: 8, name: 'Jazz' },
    Vocal: { bass: -4, mid: 8, treble: 2, name: 'Vocal' }
};

const EqualizerModal = ({ isOpen, onClose }) => {
    const { equalizer, setEqualizer } = useMusic();

    if (!isOpen) return null;

    const handlePresetChange = (presetName) => {
        if (PRESETS[presetName]) {
            setEqualizer(PRESETS[presetName]);
        }
    };

    const handleManualChange = (band, value) => {
        setEqualizer({ ...equalizer, [band]: Number(value), name: 'Custom' });
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-sm bg-zinc-900 border border-white/10 rounded-3xl p-6 shadow-2xl"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <Sliders className="text-cyan-400" size={24} />
                            <h2 className="text-xl font-bold text-white">Equalizer</h2>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-zinc-400 transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Presets */}
                    <div className="grid grid-cols-3 gap-2 mb-8">
                        {Object.keys(PRESETS).map(key => (
                            <button
                                key={key}
                                onClick={() => handlePresetChange(key)}
                                className={`px-2 py-2 rounded-xl text-xs font-bold transition-all border ${
                                    equalizer.name === PRESETS[key].name 
                                    ? 'bg-cyan-400 text-black border-cyan-400' 
                                    : 'bg-white/5 text-zinc-400 border-white/5 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                {PRESETS[key].name}
                            </button>
                        ))}
                    </div>

                    {/* Sliders */}
                    <div className="space-y-6">
                        {/* Bass */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-zinc-500">
                                <span>Bass (Low)</span>
                                <span className={equalizer.bass > 0 ? 'text-cyan-400' : ''}>{equalizer.bass > 0 ? '+' : ''}{equalizer.bass}dB</span>
                            </div>
                            <input 
                                type="range" 
                                min="-12" 
                                max="12" 
                                value={equalizer.bass} 
                                onChange={(e) => handleManualChange('bass', e.target.value)}
                                className="w-full accent-cyan-400 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        {/* Mid */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-zinc-500">
                                <span>Mid</span>
                                <span className={equalizer.mid > 0 ? 'text-cyan-400' : ''}>{equalizer.mid > 0 ? '+' : ''}{equalizer.mid}dB</span>
                            </div>
                            <input 
                                type="range" 
                                min="-12" 
                                max="12" 
                                value={equalizer.mid} 
                                onChange={(e) => handleManualChange('mid', e.target.value)}
                                className="w-full accent-cyan-400 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        {/* Treble */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-zinc-500">
                                <span>Treble (High)</span>
                                <span className={equalizer.treble > 0 ? 'text-cyan-400' : ''}>{equalizer.treble > 0 ? '+' : ''}{equalizer.treble}dB</span>
                            </div>
                            <input 
                                type="range" 
                                min="-12" 
                                max="12" 
                                value={equalizer.treble} 
                                onChange={(e) => handleManualChange('treble', e.target.value)}
                                className="w-full accent-cyan-400 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default EqualizerModal;
