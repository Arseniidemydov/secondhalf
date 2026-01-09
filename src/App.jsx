import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Landing from "./phases/Landing";
import AccessGate from "./phases/AccessGate";
import CoachingChat from "./phases/CoachingChat";
import BackgroundParticles from "./components/BackgroundParticles";

function App() {
  const [phase, setPhase] = useState("LANDING"); // 'LANDING', 'ACCESS_GATE', 'CHAT'
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");

  const handleAccessGranted = ({ name, email }) => {
    setUserEmail(email);
    setUserName(name);
    setPhase("CHAT");
  };

  return (
    <main className="relative w-screen h-screen bg-gradient-to-t from-[#435E4F] to-[#050505] text-white font-inter overflow-hidden">
      <BackgroundParticles />
      <img
        src="/logo_1.png"
        alt="Second | Half"
        className="absolute top-8 left-8 w-48 z-50 pointer-events-none select-none opacity-90"
      />
      <AnimatePresence mode="wait">
        {phase === "LANDING" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full flex justify-center items-center"
          >
            <Landing onStart={() => setPhase("ACCESS_GATE")} />
          </motion.div>
        )}
        {phase === "ACCESS_GATE" && (
          <motion.div
            key="access-gate"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full flex justify-center items-center"
          >
            <AccessGate onComplete={handleAccessGranted} />
          </motion.div>
        )}
        {phase === "CHAT" && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full flex justify-center items-center"
          >
            <CoachingChat userEmail={userEmail} userName={userName} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default App;
