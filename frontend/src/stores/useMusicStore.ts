
import { axiosInstance } from '@/lib/axios';
import type { Album, Song } from '@/types';
import { AxiosError } from 'axios';
import { create } from 'zustand';

interface MusicStore {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    songs: Song[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    albums: Album[],
    isLoading: boolean,
    error: string | null,
    currentAlbum: Album | null,
    fetchAlbums: () => Promise<void>

    fetchAlbumById: (id: string) => Promise<void>;
}

export const useMusicStore = create<MusicStore>((set) => ({
    albums: [],
    songs: [],
    isLoading: false,
    error: null,
    currentAlbum: null,

    fetchAlbums: async () => {
        set({
            isLoading: true,
            error: null,
        });

        try {
            const response = await axiosInstance.get("/album");
            set({albums: response.data});
           
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                set({ error: error.response?.data?.message || "Something went wrong" });
            }
        }finally{
            set({isLoading: false});
        }
    },

    fetchAlbumById: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response =  await axiosInstance.get(`/album/${id}`);
            set({ currentAlbum: response.data});
            return response.data
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                set({ error: error.response?.data?.message || "Something went wrong" });
            }
        } finally {
            set({ isLoading: false });
        }
    }
}))