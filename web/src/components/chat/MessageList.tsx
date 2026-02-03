import type { Component } from 'solid-js';
import { For, Show } from 'solid-js';
import EmptyState from './EmptyState';
import MessageItem, { type Message } from './MessageItem';
import TypingIndicator from './TypingIndicator';

type MessageListProps = {
    messages: Message[];
    isTyping: boolean;
    suggestions: string[];
    onSelectSuggestion: (suggestion: string) => void;
    messagesEndRef: (el: HTMLDivElement) => void;
};

const MessageList: Component<MessageListProps> = (props) => {
    return (
        <div class="flex-1 overflow-y-auto px-4 md:px-6 py-6 flex flex-col gap-6 scroll-smooth">
            <Show
                when={props.messages.length > 0}
                fallback={
                    <EmptyState
                        suggestions={props.suggestions}
                        onSelectSuggestion={props.onSelectSuggestion}
                    />
                }
            >
                <For each={props.messages}>
                    {(message) => <MessageItem message={message} />}
                </For>
            </Show>

            <Show when={props.isTyping}>
                <TypingIndicator />
            </Show>

            <div ref={props.messagesEndRef}></div>
        </div>
    );
};

export default MessageList;
