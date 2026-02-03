import type { Component } from 'solid-js';
import { For } from 'solid-js';

type EmptyStateProps = {
    suggestions: string[];
    onSelectSuggestion: (suggestion: string) => void;
};

const EmptyState: Component<EmptyStateProps> = (props) => {
    return (
        <div class="flex-1 flex flex-col items-center justify-center gap-4 opacity-0 animate-[fadeIn_0.6s_ease-out_0.3s_forwards]">
            <div class="text-5xl text-[#65737E] font-mono">◐</div>
            <div class="text-[#A0A0A0] text-sm text-center">
                Start a conversation with the AI
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6 max-w-2xl w-full">
                <For each={props.suggestions}>
                    {(suggestion) => (
                        <div
                            onClick={() => props.onSelectSuggestion(suggestion)}
                            class="bg-[#151515] border border-[#151515] p-4 cursor-pointer transition-all duration-200 relative overflow-hidden group hover:bg-[#1a1a1a] hover:border-[#FFCFA8] hover:translate-x-1"
                        >
                            <div class="absolute left-0 top-0 w-0.5 h-0 bg-[#FFCFA8] transition-all duration-200 group-hover:h-full"></div>
                            <div class="text-[#A0A0A0] text-xs">{suggestion}</div>
                        </div>
                    )}
                </For>
            </div>
        </div>
    );
};

export default EmptyState;
