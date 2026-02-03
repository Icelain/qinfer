import { createSignal } from 'solid-js';
import Header from './components/chat/Header';
import InputArea from './components/chat/InputArea';
import MessageList from './components/chat/MessageList';
import type { Message } from './components/chat/MessageItem';

export default () => {
    const [messages, setMessages] = createSignal<Message[]>([]);
    const [input, setInput] = createSignal('');
    const [isTyping, setIsTyping] = createSignal(false);
    let messagesEndRef: HTMLDivElement | undefined;

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

    const simulateResponse = async (userMessage: string) => {
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

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleSuggestion = (suggestion: string) => setInput(suggestion);

    const clearChat = () => {
        setMessages([]);
    };

    const setMessagesEndRef = (el: HTMLDivElement) => {
        messagesEndRef = el;
    };

    return (
        <div class="h-screen flex flex-col bg-[#101010] text-white font-sans">
            <Header onClear={clearChat} />

            <MessageList
                messages={messages()}
                isTyping={isTyping()}
                suggestions={suggestions}
                onSelectSuggestion={handleSuggestion}
                messagesEndRef={setMessagesEndRef}
            />

            <InputArea
                input={input()}
                onInput={setInput}
                onKeyDown={handleKeyDown}
                onSend={handleSend}
            />

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
