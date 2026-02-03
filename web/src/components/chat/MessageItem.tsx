import type { Component } from 'solid-js';

export type Message = {
    role: 'user' | 'assistant';
    content: string;
    time: string;
};

type MessageItemProps = {
    message: Message;
};

const MessageItem: Component<MessageItemProps> = (props) => {
    return (
        <div class="flex gap-4 opacity-0 translate-y-2 animate-[slideUp_0.4s_ease-out_forwards]">
            <div class={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium font-mono flex-shrink-0 ${
                props.message.role === 'user'
                    ? 'bg-[#FFCFA8] text-[#101010]'
                    : 'bg-[#151515] text-[#FFCFA8] border border-[#151515]'
            }`}>
                {props.message.role === 'user' ? 'U' : 'AI'}
            </div>
            <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1.5">
                    <span class="font-medium text-xs text-[#FFCFA8]">
                        {props.message.role === 'user' ? 'You' : 'Assistant'}
                    </span>
                    <span class="text-[11px] text-[#65737E] font-mono">{props.message.time}</span>
                </div>
                <div class="text-sm leading-relaxed break-words">
                    {props.message.content}
                </div>
            </div>
        </div>
    );
};

export default MessageItem;
