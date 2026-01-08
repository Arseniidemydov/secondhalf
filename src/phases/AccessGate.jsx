import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AccessGate = ({ onComplete }) => {
    // ... keep existing state/logic ...
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [isEmailValid, setIsEmailValid] = useState(false);

    const validateEmail = (val) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(val);
    };

    const handleEmailChange = (e) => {
        const val = e.target.value;
        setEmail(val);
        setIsEmailValid(validateEmail(val));
    };

    const isFormValid = name.trim().length > 0 && isEmailValid;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isFormValid) {
            onComplete({ name, email });
        }
    };

    return (
        <section className="flex flex-col items-center justify-center w-full h-full p-4">
            <div className="w-full max-w-md relative">
                <form onSubmit={handleSubmit} className="relative space-y-4">
                    <input
                        type="text"
                        placeholder="Your name..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300 backdrop-blur-xl shadow-2xl"
                    />
                    <div className="relative">
                        <input
                            type="email"
                            placeholder="Your email address..."
                            value={email}
                            onChange={handleEmailChange}
                            className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300 backdrop-blur-xl shadow-2xl"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!isFormValid}
                        className={`w-full py-4 rounded-full font-medium text-lg transition-all duration-300 flex items-center justify-center gap-2 ${isFormValid
                            ? "bg-[#C9886E] text-black shadow-[0_0_20px_rgba(201,136,110,0.3)] hover:shadow-[0_0_30px_rgba(201,136,110,0.5)] cursor-pointer scale-100 opacity-100"
                            : "bg-white/10 text-white/30 cursor-not-allowed opacity-50"
                            }`}
                    >
                        Start a Journey
                    </button>
                </form>
            </div>
        </section>
    );
};

export default AccessGate;
