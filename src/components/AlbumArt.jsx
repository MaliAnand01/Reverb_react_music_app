import { motion } from 'framer-motion';

const AlbumArt = ({ image, isPlaying }) => {
    return (
        <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="relative w-64 h-64 flex items-center justify-center mx-auto"
        >
            {/* Spinning Disc Effect */}
            <div className={`absolute w-full h-full rounded-full bg-gradient-to-tr from-gray-900 to-black shadow-2xl flex items-center justify-center ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`} 
                 style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}>
                <div className="w-[98%] h-[98%] rounded-full border border-gray-800 flex items-center justify-center bg-[url('/img/disc.png')] bg-cover bg-center">
                    {/* We can use a CSS radial gradient to simulate vinyl if image missing */}
                </div>
            </div>

            {/* Release Art */}
             <motion.img 
                key={image} // Trigger animation on image change
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                src={image || "/img/default.png"}
                alt="Album Art"
                className={`absolute w-40 h-40 rounded-full object-cover shadow-lg z-10 ${isPlaying ? 'animate-[spin_10s_linear_infinite]' : ''}`}
                style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
            />
            {/* Center Hole */}
            <div className="absolute w-8 h-8 bg-zinc-900 rounded-full z-20 border border-gray-700"></div>
        </motion.div>
    );
}

export default AlbumArt;
