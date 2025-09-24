import { axiosInstance } from '@/lib/axios';
import { AxiosError } from 'axios';
import { create } from 'zustand';
import type { Message } from '@/types';
import {io} from "socket.io-client";

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

const baseURL = "http://localhost:5000";
const socket = io(baseURL, {
    autoConnect: false,
    withCredentials: true,
});

export const useChatStore = create<ChatStore> ((set, get) => ({
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
    initSocket: async(userId:string) => {
        if(!get().isConnected){
            socket.auth = { userId };
            socket.connect();
            socket.emit("user_connected", userId);

            socket.on("user_online", (users:string[]) => {
                set({
                    onlineUsers: new Set(users)
                });

                socket.on("activities", (activities: [string, string][]) => {
                    set({
                        userActivities: new Map(activities)
                    });
                });

                socket.on("users_connected", (userId: string) => {
                    set((state) => ({
                        onlineUsers: new Set([...state.onlineUsers, userId])
                    }));
                });

                socket.on("receive_message", (message:Message) => {
                    set((state) => ({
                        messages: [...state.messages, message]
                    }));
                });

                socket.on("message_sent", (message:Message) => {
                    set((state) => ({
                        messages: [...state.messages, message]
                    }));
                });

                socket.on("activity_updated", ({ userId, activity}) => {
                    set((state) => {
                        const newActivities = new Map(state.userActivities);
                        newActivities.set(userId, activity);
                        return { userActivities: newActivities}
                    })
                })
            })
        }
    },

    disConnectSocket: async() => {},

    sendMessage: async() => {}
}))