import { axiosInstance } from '@/lib/axios';
import { AxiosError } from 'axios';
import { create } from 'zustand';
import type { Message } from '@/types';

interface ChatStore {
    users: unknown[];
    isLoading: boolean;
    error: string|null;
    socket: unknown;
    isConnected: boolean;
    onlineUsers: Set<string>;
    userActivities: Map<string, string>;
    messages: Message[];

    fetchUsers: () => Promise<void>;
    initSocket: (userId: string) => void;
    disConnectSocket: () => void;
    sendMessage: (receiverId: string, senderId: string, content:string) => void;
}

export const useChatStore = create<ChatStore> ((set) => ({
    users: [],
    isLoading: false,
    error: null,
    socket: null,
    isConnected: false,
    onlineUsers: new Set(),
    userActivities: new Map(),
    messages: [],

    fetchUsers : async() => {
    set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get("/users");
            set({users: response.data });
        } catch (error:unknown) {
            if (error instanceof AxiosError) {
                set({ error: error.response?.data?.message || "Failed to fetch users" });
            }
        } finally{
            set({ isLoading: false });
        }
    },
    initSocket: async() => {},

    disConnectSocket: async() => {},

    sendMessage: async() => {}
}))