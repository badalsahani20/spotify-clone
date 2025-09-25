import { axiosInstance } from '@/lib/axios';
import { AxiosError } from 'axios';
import { create } from 'zustand';
import type { Message, User } from '@/types';
import {io} from "socket.io-client";
import { Socket } from 'socket.io-client';
// import { User } from 'lucide-react';

interface ChatStore {
    users: User[];
    isLoading: boolean;
    error: string|null;
    socket: Socket | null;
    isConnected: boolean;
    onlineUsers: Set<string>;
    userActivities: Map<string, string>;
    messages: Message[];
    selectedUser: User | null;

    fetchUsers: () => Promise<void>;
    initSocket: (userId: string) => void;
    disConnectSocket: () => void;
    sendMessage: (receiverId: string, senderId: string, content:string) => void;
    fetchMessages: (userId: string) => Promise<void>;
    setSelectedUser: (user: User | null) => void;
}

const baseURL = "http://localhost:5000";
const socket = io(baseURL, {
    autoConnect: false,
    withCredentials: true,
});

export const useChatStore = create<ChatStore> ((set, get) => ({
    users: [],
    isLoading: false,
    error: null,
    socket: socket,
    isConnected: false,
    onlineUsers: new Set(),
    userActivities: new Map(),
    messages: [],
    selectedUser: null,

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
    initSocket: (userId) => {
		if (!get().isConnected) {
			socket.auth = { userId };
			socket.connect();

			socket.emit("user_connected", userId);

			socket.on("users_online", (users: string[]) => {
				set({ onlineUsers: new Set(users) });
			});

			socket.on("activities", (activities: [string, string][]) => {
				set({ userActivities: new Map(activities) });
			});

			socket.on("user_connected", (userId: string) => {
				set((state) => ({
					onlineUsers: new Set([...state.onlineUsers, userId]),
				}));
			});

			socket.on("user_disconnected", (userId: string) => {
				set((state) => {
					const newOnlineUsers = new Set(state.onlineUsers);
					newOnlineUsers.delete(userId);
					return { onlineUsers: newOnlineUsers };
				});
			});

			socket.on("receive_message", (message: Message) => {
				set((state) => ({
					messages: [...state.messages, message],
				}));
			});

			socket.on("message_sent", (message: Message) => {
				set((state) => ({
					messages: [...state.messages, message],
				}));
			});

			socket.on("activity_updated", ({ userId, activity }) => {
				set((state) => {
					const newActivities = new Map(state.userActivities);
					newActivities.set(userId, activity);
					return { userActivities: newActivities };
				});
			});

			set({ isConnected: true });
		}
	},

    disConnectSocket: async() => {
        // socket.disconnect();
        const socket = get().socket;
        if(socket && get().isConnected) {
        socket.disconnect();
        set({ isConnected: false });
        }
    },

    sendMessage: async(receiverId, senderId, content) => {
        const socket = get().socket;
        if(!socket) return;

        socket.emit("send-message", {receiverId, senderId, content});
    },

    fetchMessages: async(userId: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get(`/users/messages/${userId}`);
            set((state) => ({ messages: [...state.messages, ...response.data]}));
        } catch (error: unknown) {
            if(error instanceof AxiosError){
                set({ error: error.response?.data?.message || "Failed to fetch messages" });
            }
        }finally{
            set({ isLoading: false });
        }
    },

    setSelectedUser:  (user) => set({selectedUser: user})
}))