import { useState, useEffect } from "react";
import { motion } from "framer-motion";

function Particle({ delay, duration, size, startX, startY }) {
    return (
        <div
            className="absolute rounded-full bg-gradient-to-b from-zinc-500 to-transparent opacity-20 pointer-events-none"
            style={{
                width: size,
                height: size,
                left: `${startX}%`,
                top: `${startY}%`,
                animation: `float ${duration}s ease-in-out ${delay}s infinite`,
            }}
        />
    );
}

const BackgroundParticles = () => {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        const generated = [...Array(120)].map((_, i) => ({
            id: i,
            delay: Math.random() * 5,
            duration: 8 + Math.random() * 12,
            size: 2 + Math.random() * 4,
            startX: Math.random() * 100,
            startY: Math.random() * 100,
        }));
        setParticles(generated);
    }, []);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {particles.map((particle) => (
                <Particle
                    key={particle.id}
                    delay={particle.delay}
                    duration={particle.duration}
                    size={particle.size}
                    startX={particle.startX}
                    startY={particle.startY}
                />
            ))}
        </div>
    );
};

export default BackgroundParticles;
