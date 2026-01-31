import { useMusic } from '../context/MusicContext';
import { useAuth } from '../context/AuthContext';
import { Play } from 'lucide-react';
import UserBadge from '../components/UserBadge';

const HomeView = ({ setCurrentView }) => {
    const { playlist, playSong } = useMusic();
    const { user } = useAuth();
    
    // Get greeting based on time
    const hour = new Date().getHours();
    let greeting = "Good morning";
    if (hour >= 12 && hour < 17) greeting = "Good afternoon";
    if (hour >= 17 && hour < 21) greeting = "Good evening";
    if (hour >= 21 || hour < 5) greeting = "Good night";

    return (
        <div className="space-y-6 md:space-y-8 pb-24">
            <div className="flex items-center justify-between mb-6 md:mb-8">
                <h1 className="text-3xl md:text-4xl font-bold py-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 drop-shadow-sm leading-tight">
                    {greeting}
                    {user?.name && <span className="font-['Space_Grotesk'] font-medium text-white ml-2 tracking-tight">, {user.name.split(' ')[0]}</span>}
                </h1>
                <div className="md:hidden">
                    <UserBadge setCurrentView={setCurrentView} collapsed={true} />
                </div>
            </div>

            {/* Recent Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
                {playlist.slice(0, 6).map((song, index) => (
                    <div 
                        key={song.id}
                        onClick={() => playSong(index)} 
                        className="flex items-center gap-2 md:gap-3 bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 backdrop-blur-sm transition-all rounded-lg md:rounded-xl overflow-hidden cursor-pointer group pr-2 md:pr-4 shadow-lg hover:shadow-2xl hover:scale-[1.02]"
                    >
                        <img src={song.image} alt={song.name} className="w-14 h-14 md:w-20 md:h-20 object-cover shadow-2xl" />
                        <span className="font-bold text-[11px] md:text-sm truncate text-white/90 group-hover:text-white">{song.name}</span>
                        
                        <div className="ml-auto hidden md:flex opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity bg-cyan-400 rounded-full p-2.5 shadow-xl shadow-black/20 scale-100 md:scale-90 md:group-hover:scale-100 hover:scale-110">
                             <Play size={20} fill="black" stroke="black" className="ml-0.5" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Section: 'Made for You' */}
            <div>
                 <div className="flex justify-between items-end mb-6">
                    <h2 className="text-2xl font-bold hover:underline cursor-pointer text-white/90 decoration-cyan-400">Made for You</h2>
                    <span 
                        onClick={() => setCurrentView && setCurrentView('library')}
                        className="text-xs font-bold text-zinc-400 hover:text-white cursor-pointer tracking-wider uppercase transition-colors"
                    >
                        Show all
                    </span>
                 </div>
                 
                 <div className="flex md:grid md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
                    {playlist.slice(0, 6).map((song, i) => (
                         <div 
                            key={song.id} 
                            onClick={() => playSong(i)}
                            className="flex-shrink-0 w-40 md:w-auto bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 p-4 md:p-5 rounded-2xl transition-all cursor-pointer group hover:scale-[1.03] backdrop-blur-md shadow-lg"
                         >
                            <div className="relative mb-3 md:mb-4">
                                <img src={song.image} alt={song.name} className="w-full aspect-square object-cover rounded-xl shadow-2xl group-hover:shadow-2xl transition-all duration-500" />
                                <div className="absolute bottom-2 right-2 translate-y-0 opacity-100 md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-300">
                                    <div className="bg-cyan-400 rounded-full p-2.5 md:p-3.5 shadow-xl hover:scale-105 hover:bg-cyan-300 shadow-black/30">
                                        <Play size={20} fill="black" stroke="black" className="ml-0.5" />
                                    </div>
                                </div>
                            </div>
                            <h3 className="font-bold truncate mb-1 text-sm md:text-base text-white group-hover:text-cyan-400 transition-colors">{song.name}</h3>
                            <p className="text-xs md:text-sm text-zinc-400 truncate line-clamp-1 md:line-clamp-2">{song.artist}</p>
                         </div>
                    ))}
                 </div>
            </div>
        </div>
    );
};

export default HomeView;
