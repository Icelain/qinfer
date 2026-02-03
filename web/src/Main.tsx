import { createSignal, For, Show } from 'solid-js';

export default () => {
    const [messages, setMessages] = createSignal([]);
    const [input, setInput] = createSignal('');
    const [isTyping, setIsTyping] = createSignal(false);
    let messagesEndRef;

    const suggestions = [
        "Explain quantum computing in simple terms",
        "Write a Python function to sort a list",
        "What are the latest trends in AI?",
        "Help me debug this code"
    ];

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const formatTime = () => {
        const now = new Date();
        return now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit'
        });
    };

    const simulateResponse = async (userMessage) => {
        setIsTyping(true);
        scrollToBottom();

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

        const responses = [
            "I'm a demo chat interface. In a real implementation, I would connect to an LLM API like OpenAI, Anthropic Claude, or a local model using Ollama.",
            `You asked: "${userMessage}". This is where the AI response would appear. The interface is built with SolidJS for reactive updates.`,
            "This chat UI features a dark minimal aesthetic with Tailwind CSS. It includes smooth animations, typing indicators, and responsive design.",
            "To integrate a real LLM, you would replace this function with an API call to your chosen provider. The UI will seamlessly display the streaming responses."
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];

        setIsTyping(false);
        setMessages(prev => [...prev, {
            role: 'assistant',
            content: randomResponse,
            time: formatTime()
        }]);
        scrollToBottom();
    };

    const handleSend = async () => {
        const message = input().trim();
        if (!message) return;

        setMessages(prev => [...prev, {
            role: 'user',
            content: message,
            time: formatTime()
        }]);

        setInput('');
        scrollToBottom();

        await simulateResponse(message);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleSuggestion = (suggestion) => {
        setInput(suggestion);
    };

    const clearChat = () => {
        setMessages([]);
    };

    return (
        <div class="h-screen flex flex-col bg-[#101010] text-white font-sans">
            {/* Header */}
            <div class="border-b border-[#151515] px-6 py-4 flex items-center justify-between bg-[#101010] relative animate-[slideDown_0.5s_ease-out]">
                <div class="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFCFA8] animate-[expandBorder_0.8s_ease-out_forwards]"></div>
                <div class="flex items-center gap-3">
                    <div class="text-base font-medium text-[#FFCFA8] tracking-tight">llm.chat</div>
                    <div class="flex items-center gap-2 text-[#65737E] text-xs">
                        <div class="w-1.5 h-1.5 rounded-full bg-[#FFCFA8] animate-pulse"></div>
                        <span>ready</span>
                    </div>
                </div>
                <div class="flex gap-2 max-md:hidden">
                    <button 
                        onClick={clearChat}
                        class="bg-transparent border border-[#151515] text-[#65737E] px-3 py-1.5 text-xs font-mono transition-all duration-200 hover:bg-[#FFCFA8] hover:text-[#101010] hover:border-[#FFCFA8] hover:-translate-y-0.5"
                    >
                        clear
                    </button>
                    <button 
                        class="bg-transparent border border-[#151515] text-[#65737E] px-3 py-1.5 text-xs font-mono transition-all duration-200 hover:bg-[#FFCFA8] hover:text-[#101010] hover:border-[#FFCFA8] hover:-translate-y-0.5"
                    >
                        settings
                    </button>
                </div>
            </div>

            {/* Messages Container */}
            <div class="flex-1 overflow-y-auto px-4 md:px-6 py-6 flex flex-col gap-6 scroll-smooth">
                <Show
                    when={messages().length > 0}
                    fallback={
                        <div class="flex-1 flex flex-col items-center justify-center gap-4 opacity-0 animate-[fadeIn_0.6s_ease-out_0.3s_forwards]">
                            <div class="text-5xl text-[#65737E] font-mono">◐</div>
                            <div class="text-[#A0A0A0] text-sm text-center">
                                Start a conversation with the AI
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6 max-w-2xl w-full">
                                <For each={suggestions}>
                                    {(suggestion) => (
                                        <div 
                                            onClick={() => handleSuggestion(suggestion)}
                                            class="bg-[#151515] border border-[#151515] p-4 cursor-pointer transition-all duration-200 relative overflow-hidden group hover:bg-[#1a1a1a] hover:border-[#FFCFA8] hover:translate-x-1"
                                        >
                                            <div class="absolute left-0 top-0 w-0.5 h-0 bg-[#FFCFA8] transition-all duration-200 group-hover:h-full"></div>
                                            <div class="text-[#A0A0A0] text-xs">{suggestion}</div>
                                        </div>
                                    )}
                                </For>
                            </div>
                        </div>
                    }
                >
                    <For each={messages()}>
                        {(message) => (
                            <div class={`flex gap-4 opacity-0 translate-y-2 animate-[slideUp_0.4s_ease-out_forwards]`}>
                                <div class={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium font-mono flex-shrink-0 ${
                                    message.role === 'user' 
                                        ? 'bg-[#FFCFA8] text-[#101010]' 
                                        : 'bg-[#151515] text-[#FFCFA8] border border-[#151515]'
                                }`}>
                                    {message.role === 'user' ? 'U' : 'AI'}
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center gap-2 mb-1.5">
                                        <span class="font-medium text-xs text-[#FFCFA8]">
                                            {message.role === 'user' ? 'You' : 'Assistant'}
                                        </span>
                                        <span class="text-[11px] text-[#65737E] font-mono">{message.time}</span>
                                    </div>
                                    <div class="text-sm leading-relaxed break-words">
                                        {message.content}
                                    </div>
                                </div>
                            </div>
                        )}
                    </For>
                </Show>

                <Show when={isTyping()}>
                    <div class="flex gap-4 opacity-0 animate-[slideUp_0.4s_ease-out_forwards]">
                        <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium font-mono flex-shrink-0 bg-[#151515] text-[#FFCFA8] border border-[#151515]">
                            AI
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center gap-2 mb-1.5">
                                <span class="font-medium text-xs text-[#FFCFA8]">Assistant</span>
                            </div>
                            <div class="flex gap-1 py-3">
                                <div class="w-1.5 h-1.5 rounded-full bg-[#65737E] animate-[typingDot_1.4s_infinite]"></div>
                                <div class="w-1.5 h-1.5 rounded-full bg-[#65737E] animate-[typingDot_1.4s_infinite_0.2s]"></div>
                                <div class="w-1.5 h-1.5 rounded-full bg-[#65737E] animate-[typingDot_1.4s_infinite_0.4s]"></div>
                            </div>
                        </div>
                    </div>
                </Show>

                <div ref={messagesEndRef}></div>
            </div>

            {/* Input Area */}
            <div class="border-t border-[#151515] px-4 md:px-6 py-5 bg-[#101010] relative group">
                <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FFCFA8] to-transparent opacity-0 transition-opacity duration-300 group-focus-within:opacity-100"></div>
                <div class="flex gap-3 max-w-4xl mx-auto">
                    <textarea
                        class="flex-1 bg-[#151515] border border-[#151515] text-white px-4 py-3 text-sm resize-none max-h-[200px] transition-all duration-200 focus:outline-none focus:border-[#FFCFA8] focus:bg-[#1a1a1a] placeholder-[#65737E]"
                        placeholder="Type your message..."
                        value={input()}
                        onInput={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        rows="1"
                    />
                    <button 
                        onClick={handleSend}
                        disabled={!input().trim()}
                        class="bg-[#FFCFA8] text-[#101010] px-5 md:px-6 py-3 text-xs font-medium transition-all duration-200 relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#e0b08a] hover:-translate-y-0.5 active:translate-y-0 group/btn"
                    >
                        <div class="absolute top-1/2 left-1/2 w-0 h-0 rounded-full bg-white/20 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 group-hover/btn:w-[300px] group-hover/btn:h-[300px]"></div>
                        <span class="relative z-10">send</span>
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes expandBorder {
                    to {
                        width: 100%;
                    }
                }

                @keyframes fadeIn {
                    to {
                        opacity: 1;
                    }
                }

                @keyframes slideUp {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes typingDot {
                    0%, 60%, 100% {
                        transform: translateY(0);
                        opacity: 0.4;
                    }
                    30% {
                        transform: translateY(-8px);
                        opacity: 1;
                    }
                }

                /* Custom scrollbar */
                .overflow-y-auto::-webkit-scrollbar {
                    width: 8px;
                }

                .overflow-y-auto::-webkit-scrollbar-track {
                    background: #101010;
                }

                .overflow-y-auto::-webkit-scrollbar-thumb {
                    background: #151515;
                    border-radius: 4px;
                }

                .overflow-y-auto::-webkit-scrollbar-thumb:hover {
                    background: #65737E;
                }
            `}</style>
        </div>
    );
};