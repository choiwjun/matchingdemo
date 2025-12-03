'use client';

import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { io, Socket } from 'socket.io-client';

interface Message {
    id: string;
    roomId: string;
    senderId: string;
    content: string;
    createdAt: string;
}

export default function ChatPage() {
    const { data: session } = useSession();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [currentRoom, setCurrentRoom] = useState('demo-room');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initialize socket connection
        const socketInstance = io('http://localhost:3000');
        setSocket(socketInstance);

        socketInstance.on('connect', () => {
            console.log('Connected to socket server');
            socketInstance.emit('join-room', currentRoom);
        });

        socketInstance.on('receive-message', (message: Message) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            socketInstance.disconnect();
        };
    }, [currentRoom]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();

        if (!inputMessage.trim() || !socket || !session) return;

        socket.emit('send-message', {
            roomId: currentRoom,
            message: inputMessage,
            senderId: session.user.id,
        });

        setInputMessage('');
    };

    if (!session) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">로그인이 필요합니다.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <h1 className="text-xl font-bold text-primary-600">채팅</h1>
                        <a href="/dashboard" className="text-gray-700 hover:text-primary-600">
                            대시보드로 돌아가기
                        </a>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-4 py-8">
                <div className="grid md:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
                    {/* Chat List */}
                    <div className="md:col-span-1 card overflow-y-auto">
                        <h2 className="font-semibold mb-4">대화 목록</h2>
                        <div className="space-y-2">
                            <button
                                onClick={() => setCurrentRoom('demo-room')}
                                className={`w-full text-left p-3 rounded-lg transition-colors ${currentRoom === 'demo-room'
                                        ? 'bg-primary-100 text-primary-700'
                                        : 'hover:bg-gray-100'
                                    }`}
                            >
                                <div className="font-medium">데모 채팅방</div>
                                <div className="text-xs text-gray-500">실시간 채팅 테스트</div>
                            </button>
                        </div>
                    </div>

                    {/* Chat Window */}
                    <div className="md:col-span-3 card flex flex-col">
                        <div className="border-b pb-4 mb-4">
                            <h2 className="font-semibold">데모 채팅방</h2>
                            <p className="text-sm text-gray-500">실시간 메시징</p>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.senderId === session.user.id ? 'justify-end' : 'justify-start'
                                        }`}
                                >
                                    <div
                                        className={`max-w-[70%] rounded-lg px-4 py-2 ${message.senderId === session.user.id
                                                ? 'bg-primary-600 text-white'
                                                : 'bg-gray-200 text-gray-900'
                                            }`}
                                    >
                                        <p>{message.content}</p>
                                        <p className="text-xs mt-1 opacity-70">
                                            {new Date(message.createdAt).toLocaleTimeString('ko-KR')}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={sendMessage} className="flex gap-2">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                className="input flex-1"
                                placeholder="메시지를 입력하세요..."
                            />
                            <button type="submit" className="btn btn-primary">
                                전송
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
