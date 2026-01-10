import { motion } from "framer-motion";

const Landing = ({ onStart }) => {
    return (
        <section className="flex flex-col items-center justify-center w-full h-full text-center p-4">
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="text-5xl md:text-7xl font-semibold tracking-tighter mb-12"
            >
                <span className="bg-gradient-to-br from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
                    Ready to craft your Career Story?
                </span>
            </motion.h1>

            <motion.button
                onClick={onStart}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.02, 1] }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 px-12 py-5 text-2xl font-medium text-black bg-[#C9886E] rounded-full shadow-[0_0_20px_rgba(201,136,110,0.3)] hover:shadow-[0_0_30px_rgba(201,136,110,0.5)] transition-all duration-300"
            >
                Start
            </motion.button>
        </section>
    );
};


export default Landing;
