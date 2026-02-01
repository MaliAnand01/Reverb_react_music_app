import { useEffect, useRef } from 'react';
import { useMusic } from '../context/MusicContext';

const Visualizer = ({ height = 100, barColor = 'cyan' }) => {
    const { analyser, isPlaying } = useMusic();
    const canvasRef = useRef(null);
    const animationRef = useRef(null);

    useEffect(() => {
        if (!analyser || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            // If not playing, we can still animate (flat line) or stop. 
            // For smoother UX, we keep drawing but maybe check isPlaying to optimize.
            // But we want to see the decay if paused.
            
            animationRef.current = requestAnimationFrame(draw);

            analyser.getByteFrequencyData(dataArray);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const width = canvas.width;
            const h = canvas.height;
            const barWidth = (width / bufferLength) * 2.5;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const barHeight = (dataArray[i] / 255) * h;
                
                // Dynamic Color: Spectrum Cycle based on index
                // Uses HSL to create a rainbow effect across the bars
                const hue = (i / bufferLength) * 360;
                ctx.fillStyle = `hsla(${hue}, 100%, 50%, 0.8)`;
                
                // Rounded tops for bars
                ctx.beginPath();
                ctx.roundRect(x, h - barHeight, barWidth - 2, barHeight, [4, 4, 0, 0]);
                ctx.fill();

                x += barWidth + 1;
            }
        };

        draw();

        return () => {
            cancelAnimationFrame(animationRef.current);
        };
    }, [analyser, isPlaying]);

    return (
        <canvas 
            ref={canvasRef} 
            width={300} 
            height={height} 
            className="w-full h-full opacity-60"
        />
    );
};

export default Visualizer;
