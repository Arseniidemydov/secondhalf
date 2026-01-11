import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Calendar, ArrowUpRight } from "lucide-react";
import clsx from "clsx";

import { sendMessage as sendToWebhook } from "../utils/chatUtils";
import ReactMarkdown from "react-markdown";
import aiJohan from "../assets/ai-johan.png";

const CoachingChat = ({ userEmail, userName }) => {
    // ... existing state ...
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const [sessionId] = useState(`session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

    // ... existing useEffects ...
    // Initial greeting
    useEffect(() => {
        setIsTyping(true);
        const timer = setTimeout(() => {
            setMessages([
                {
                    id: 1,
                    type: "ai",
                    content: `A career story is a narrative that links your past experiences to where you are now — and helps you make sense of what might come next, even if it’s still unclear.

It’s useful in any transition, and especially in midlife. After years on one path, it’s normal to feel uneasy about leaving an identity behind, and to struggle to describe yourself in a way that feels true today.

This exercise will help you reflect on your journey, notice patterns in how you’ve evolved, and begin articulating a story for your next chapter — without needing to know the destination yet.

I’ll help you reflect on your journey via nine questions and shape it into a clear, authentic career story.

**How this works:**
* I will ask you 9 questions, one by one.
* If you get stuck, just ask for "examples."
* If you don't want to answer a specific question, just type "skip."

Take your time. There are no right answers. This is a discovery process, not a performance.

When you’re ready, just say: “Ready.”`,
                },
            ]);
            setIsTyping(false);
        }, 1500);
    }, [userEmail]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSendMessage = async (text) => {
        // ... existing handleSendMessage logic ...
        const newUserMsg = { id: Date.now(), type: "user", content: text };
        setMessages((prev) => [...prev, newUserMsg]);
        setInputValue("");
        setIsTyping(true);

        // Prepare history for API (simplified for now, just text content)
        const history = messages.map(m => ({ role: m.type === 'user' ? 'user' : 'assistant', content: m.content }));

        try {
            const response = await sendToWebhook(text, history, sessionId, userEmail, userName);

            if (response.success && response.data) {
                // Assuming n8n returns something like { output: "AI response text" } or stays consistent
                // Adjust based on expected webhook response structure. 
                // Detailed response structure wasn't provided, so I'll assume a standard 'output' or 'text' field or just the whole body string if it's simple.
                // NOTE: The user said "wait for response", usually n8n returns a JSON. 
                // Let's assume the key is 'output' or 'response'. If not, I'll dump the whole JSON to see.
                // For safety, let's look for a likely key or use a default.

                const aiText = response.data.output || response.data.response || response.data.message || response.data.text || JSON.stringify(response.data);

                const aiResponse = {
                    id: Date.now() + 1,
                    type: "ai",
                    content: aiText
                };
                setMessages((prev) => [...prev, aiResponse]);
            } else {
                const aiResponse = {
                    id: Date.now() + 1,
                    type: "ai",
                    content: "I'm having trouble connecting right now. Please try again."
                };
                setMessages((prev) => [...prev, aiResponse]);
            }
        } catch (err) {
            const aiResponse = {
                id: Date.now() + 1,
                type: "ai",
                content: "Sorry, something went wrong. Please check your connection."
            };
            setMessages((prev) => [...prev, aiResponse]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e) => {
        // ... existing handleKeyDown logic ...
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (inputValue.trim()) handleSendMessage(inputValue.trim());
        }
    };

    return (
        <section className="flex flex-col w-full max-w-[1074px] h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 pb-2">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10">
                    <img src={aiJohan} alt="AI Johan" className="w-full h-full object-cover" />
                </div>
                <span className="text-white font-medium text-lg">AI Johan</span>
            </div>

            {/* Chat Area */}
            {/* Chat Area */}
            <div
                className="flex-1 overflow-y-auto p-4 pt-8 no-scrollbar flex flex-col"
                style={{
                    maskImage: "linear-gradient(to bottom, transparent 0px, black 40px)",
                    WebkitMaskImage: "linear-gradient(to bottom, transparent 0px, black 40px)"
                }}
            >
                <div className="space-y-6 w-full">
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={clsx(
                                "flex flex-col w-full",
                                msg.type === "user" ? "items-end" : "items-start"
                            )}
                        >
                            <div
                                className={clsx(
                                    "max-w-[85%] p-6 text-base leading-relaxed backdrop-blur-2xl shadow-lg border transition-all duration-300 ease-out",
                                    msg.type === "user"
                                        ? "bg-black/40 text-white rounded-2xl border-white/10"
                                        : "bg-white/5 text-white/90 rounded-2xl border-white/5"
                                )}
                            >
                                {msg.content.includes("[OFFER_CALL]") ? (
                                    <div>
                                        <p className="mb-4">
                                            {msg.content.replace("[OFFER_CALL]", "")}
                                        </p>
                                        <a
                                            href="https://calendly.com" // Placeholder
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-gray-100 transition-colors shadow-lg"
                                        >
                                            <Calendar size={18} />
                                            Schedule Strategy Call
                                        </a>
                                    </div>
                                ) : (
                                    <div className="font-light leading-relaxed">
                                        <ReactMarkdown components={{
                                            strong: ({ node, ...props }) => <span className="font-semibold text-white" {...props} />,
                                            h1: ({ node, ...props }) => <h3 className="text-xl font-semibold my-1 text-white" {...props} />,
                                            h2: ({ node, ...props }) => <h4 className="text-lg font-medium my-1 text-white" {...props} />,
                                            h3: ({ node, ...props }) => <h5 className="text-base font-medium my-1 text-white" {...props} />,
                                            p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                            ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                                            ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                                            a: ({ node, ...props }) => <a className="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer" {...props} />,
                                        }}>
                                            {msg.content.replace("[THE NARRATIVE]", "")}
                                        </ReactMarkdown>
                                    </div>
                                )}
                            </div>

                            {msg.type === "ai" && msg.content.includes("[THE NARRATIVE]") && (
                                <motion.button
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="mt-4 px-6 py-3 bg-[#C9886E] text-black rounded-full font-medium flex items-center gap-2 hover:shadow-[0_0_20px_rgba(201,136,110,0.3)] transition-all cursor-pointer"
                                    onClick={() => window.open('https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ23U7DmY1NDBWOliLomjX-6ck9CEWrYdFWS5hdgeKhiy9o9XYht2AEAurVNackl3DrlHmGuU1PY', '_blank')}
                                >
                                    Need more clarity? Book free consultation with Johan
                                    <ArrowUpRight size={20} />
                                </motion.button>
                            )}
                        </motion.div>
                    ))}

                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="self-start text-white/50 text-sm flex items-center gap-1 pl-2"
                        >
                            <span>Typing</span>
                            <motion.span
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                            >
                                .
                            </motion.span>
                            <motion.span
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.2 }}
                            >
                                .
                            </motion.span>
                            <motion.span
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.4 }}
                            >
                                .
                            </motion.span>
                        </motion.div>
                    )}
                </div>
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message..."
                        className="w-full bg-black/20 text-white placeholder-white/30 rounded-xl pl-4 pr-12 py-4 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
                    />
                    <button
                        onClick={() => inputValue.trim() && handleSendMessage(inputValue.trim())}
                        disabled={!inputValue.trim()}
                        className="absolute right-2 p-2 text-white/70 hover:text-white disabled:opacity-30 disabled:hover:text-white/70 transition-colors"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 747 617"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="transform ml-1"
                        >
                            <path
                                d="M682.854 5.44534C584.422 46.2133 162.358 221.037 45.7423 268.685C-32.4657 299.205 13.3183 327.821 13.3183 327.821C13.3183 327.821 80.0783 350.709 137.31 367.877C194.534 385.045 225.054 365.973 225.054 365.973L494.014 184.757C589.39 119.901 566.502 173.309 543.606 196.205C494.014 245.805 411.99 324.005 343.318 386.957C312.798 413.661 328.054 436.549 341.414 447.997C391.006 489.965 526.446 575.805 534.07 581.525C574.366 610.053 653.63 651.117 665.686 564.357L713.374 264.877C728.638 163.781 743.894 70.3093 745.798 43.6053C751.526 -21.2587 682.854 5.44534 682.854 5.44534Z"
                                fill="currentColor"
                                fillOpacity="0.77"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CoachingChat;
