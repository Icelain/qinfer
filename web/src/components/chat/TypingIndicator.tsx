import type { Component } from 'solid-js';

const TypingIndicator: Component = () => {
    return (
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
    );
};

export default TypingIndicator;
