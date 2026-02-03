import type { Component } from 'solid-js';

type InputAreaProps = {
    input: string;
    onInput: (value: string) => void;
    onKeyDown: (event: KeyboardEvent) => void;
    onSend: () => void;
};

const InputArea: Component<InputAreaProps> = (props) => {
    return (
        <div class="border-t border-[#151515] px-4 md:px-6 py-5 bg-[#101010] relative group">
            <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FFCFA8] to-transparent opacity-0 transition-opacity duration-300 group-focus-within:opacity-100"></div>
            <div class="flex gap-3 max-w-4xl mx-auto">
                <textarea
                    class="flex-1 bg-[#151515] border border-[#151515] text-white px-4 py-3 text-sm resize-none max-h-[200px] transition-all duration-200 focus:outline-none focus:border-[#FFCFA8] focus:bg-[#1a1a1a] placeholder-[#65737E]"
                    placeholder="Type your message..."
                    value={props.input}
                    onInput={(event) => props.onInput(event.currentTarget.value)}
                    onKeyDown={props.onKeyDown}
                    rows="1"
                />
                <button
                    onClick={props.onSend}
                    disabled={!props.input.trim()}
                    class="bg-[#FFCFA8] text-[#101010] px-5 md:px-6 py-3 text-xs font-medium transition-all duration-200 relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#e0b08a] hover:-translate-y-0.5 active:translate-y-0 group/btn"
                >
                    <div class="absolute top-1/2 left-1/2 w-0 h-0 rounded-full bg-white/20 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 group-hover/btn:w-[300px] group-hover/btn:h-[300px]"></div>
                    <span class="relative z-10">send</span>
                </button>
            </div>
        </div>
    );
};

export default InputArea;
