import type { Component } from 'solid-js';

type HeaderProps = {
    onClear: () => void;
};

const Header: Component<HeaderProps> = (props) => {
    return (
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
                    onClick={props.onClear}
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
    );
};

export default Header;
