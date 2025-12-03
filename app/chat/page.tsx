'use client';

import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { Avatar, Button, Input } from '@/components/ui';

interface Message {
    id: string;
    roomId: string;
    senderId: string;
    content: string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    read: boolean;
    createdAt: string;
    sender?: {
        id: string;
        email: string;
        profile?: {
            firstName: string;
            lastName: string;
            avatar?: string;
        };
        businessProfile?: {
            companyName: string;
            logo?: string;
        };
    };
}

interface ChatRoom {
    id: string;
    userIds: string[];
    lastMessageAt: string;
    participants: {
        id: string;
        email: string;
        role: string;
        profile?: {
            firstName: string;
            lastName: string;
            avatar?: string;
        };
        businessProfile?: {
            companyName: string;
            logo?: string;
        };
    }[];
    lastMessage?: Message;
    unreadCount: number;
}

function ChatContent() {
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [rooms, setRooms] = useState<ChatRoom[]>([]);
    const [activeRoom, setActiveRoom] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Auto scroll to bottom
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    // Initialize Socket.io
    useEffect(() => {
        if (!session?.user?.id) return;

        const newSocket = io({
            path: '/api/socket',
            auth: {
                userId: session.user.id,
            },
        });

        newSocket.on('connect', () => {
            console.log('Socket connected');
        });

        newSocket.on('message', (message: Message) => {
            setMessages((prev) => [...prev, message]);
            // Update room's last message
            setRooms((prev) =>
                prev.map((room) =>
                    room.id === message.roomId
                        ? { ...room, lastMessage: message, lastMessageAt: message.createdAt }
                        : room
                )
            );
        });

        newSocket.on('room-created', (room: ChatRoom) => {
            setRooms((prev) => [room, ...prev]);
            setActiveRoom(room.id);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [session?.user?.id]);

    // Fetch chat rooms
    useEffect(() => {
        if (!session?.user?.id) return;

        const fetchRooms = async () => {
            try {
                const response = await fetch('/api/chat/rooms');
                if (response.ok) {
                    const data = await response.json();
                    setRooms(data);
                }
            } catch (error) {
                console.error('Error fetching rooms:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRooms();
    }, [session?.user?.id]);

    // Handle URL params for creating new chat
    useEffect(() => {
        const businessId = searchParams.get('businessId');
        const projectId = searchParams.get('projectId');

        if (businessId && session?.user?.id) {
            // Create or find existing room
            const createRoom = async () => {
                try {
                    const response = await fetch('/api/chat/rooms', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ participantId: businessId, projectId }),
                    });

                    if (response.ok) {
                        const room = await response.json();
                        setActiveRoom(room.id);
                        if (!rooms.find((r) => r.id === room.id)) {
                            setRooms((prev) => [room, ...prev]);
                        }
                    }
                } catch (error) {
                    console.error('Error creating room:', error);
                }
            };

            createRoom();
        }
    }, [searchParams, session?.user?.id, rooms]);

    // Fetch messages for active room
    useEffect(() => {
        if (!activeRoom) return;

        const fetchMessages = async () => {
            try {
                const response = await fetch(`/api/chat/rooms/${activeRoom}/messages`);
                if (response.ok) {
                    const data = await response.json();
                    setMessages(data);
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();

        // Join room via socket
        socket?.emit('join-room', activeRoom);

        return () => {
            socket?.emit('leave-room', activeRoom);
        };
    }, [activeRoom, socket]);

    const sendMessage = async () => {
        if (!newMessage.trim() || !activeRoom || !socket) return;

        setIsSending(true);
        try {
            const response = await fetch(`/api/chat/rooms/${activeRoom}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newMessage }),
            });

            if (response.ok) {
                const message = await response.json();
                socket.emit('message', message);
                setNewMessage('');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsSending(false);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !activeRoom) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`/api/chat/rooms/${activeRoom}/messages`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const message = await response.json();
                socket?.emit('message', message);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const getParticipantName = (room: ChatRoom) => {
        const other = room.participants?.find((p) => p.id !== session?.user?.id);
        if (!other) return '알 수 없음';
        if (other.businessProfile?.companyName) return other.businessProfile.companyName;
        if (other.profile) return `${other.profile.lastName}${other.profile.firstName}`;
        return other.email;
    };

    const getParticipantAvatar = (room: ChatRoom) => {
        const other = room.participants?.find((p) => p.id !== session?.user?.id);
        return other?.businessProfile?.logo || other?.profile?.avatar;
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) {
            return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
        } else if (days === 1) {
            return '어제';
        } else if (days < 7) {
            return `${days}일 전`;
        } else {
            return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-200px)] bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Room List */}
            <div className={`w-full md:w-80 border-r flex flex-col ${activeRoom ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-900">채팅</h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {rooms.length === 0 ? (
                        <div className="p-8 text-center">
                            <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <p className="text-gray-500">채팅방이 없습니다.</p>
                        </div>
                    ) : (
                        rooms.map((room) => (
                            <button
                                key={room.id}
                                onClick={() => setActiveRoom(room.id)}
                                className={`w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors ${
                                    activeRoom === room.id ? 'bg-primary-50' : ''
                                }`}
                            >
                                <Avatar
                                    src={getParticipantAvatar(room)}
                                    name={getParticipantName(room)}
                                    size="md"
                                />
                                <div className="flex-1 min-w-0 text-left">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-gray-900 truncate">
                                            {getParticipantName(room)}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {room.lastMessageAt && formatTime(room.lastMessageAt)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 truncate">
                                        {room.lastMessage?.content || '새 대화를 시작하세요'}
                                    </p>
                                </div>
                                {room.unreadCount > 0 && (
                                    <span className="w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                                        {room.unreadCount}
                                    </span>
                                )}
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 flex flex-col ${!activeRoom ? 'hidden md:flex' : 'flex'}`}>
                {activeRoom ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b flex items-center gap-3">
                            <button
                                onClick={() => setActiveRoom(null)}
                                className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <Avatar
                                src={getParticipantAvatar(rooms.find((r) => r.id === activeRoom)!)}
                                name={getParticipantName(rooms.find((r) => r.id === activeRoom)!)}
                                size="sm"
                            />
                            <div>
                                <h3 className="font-medium text-gray-900">
                                    {getParticipantName(rooms.find((r) => r.id === activeRoom)!)}
                                </h3>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((message) => {
                                const isOwn = message.senderId === session?.user?.id;
                                return (
                                    <div
                                        key={message.id}
                                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                                            {message.fileUrl ? (
                                                <a
                                                    href={message.fileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`block p-3 rounded-lg ${
                                                        isOwn ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-900'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                                        </svg>
                                                        <span className="text-sm">{message.fileName}</span>
                                                    </div>
                                                </a>
                                            ) : (
                                                <div
                                                    className={`px-4 py-2 rounded-2xl ${
                                                        isOwn
                                                            ? 'bg-primary-600 text-white rounded-br-sm'
                                                            : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                                                    }`}
                                                >
                                                    {message.content}
                                                </div>
                                            )}
                                            <div
                                                className={`text-xs text-gray-500 mt-1 ${
                                                    isOwn ? 'text-right' : 'text-left'
                                                }`}
                                            >
                                                {formatTime(message.createdAt)}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t">
                            <div className="flex items-center gap-2">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                    </svg>
                                </button>
                                <Input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                    placeholder="메시지를 입력하세요..."
                                    className="flex-1"
                                />
                                <Button onClick={sendMessage} isLoading={isSending}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <p className="text-gray-500">채팅방을 선택하세요</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ChatPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        }>
            <ChatContent />
        </Suspense>
    );
}
