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
    featuredSongs: Song[],
    madeForYouSongs: Song[],
    trendingSongs: Song[],

    fetchAlbums: () => Promise<void>;
    fetchAlbumById: (id: string) => Promise<void>;
    fetchFeaturedSongs: () => Promise<void>;
    fetchMadeForYouSongs: () => Promise<void>;
    fetchTrendingSongs: () => Promise<void>;
}

export const useMusicStore = create<MusicStore>((set) => ({
    albums: [],
    songs: [],
    isLoading: false,
    error: null,
    currentAlbum: null,
    featuredSongs: [],
    madeForYouSongs: [],
    trendingSongs: [],

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
                set({ error: error.response?.data?.message || "Failed to fetch albums" });
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
                set({ error: error.response?.data?.message || "Failed to fetch album" });
            }
        } finally {
            set({ isLoading: false });
        }
    },

    fetchFeaturedSongs: async() => {
        set({ isLoading:true, error: null });
        try {
            const response = await axiosInstance.get("/songs/featured");
            set({ featuredSongs: response.data });
        } catch (error) {
            if (error instanceof AxiosError) {
                set({ error: error.response?.data?.message || "Failed to fetch featured songs" });
            }
        }finally{
            set({ isLoading: false });
        }
    },
    fetchMadeForYouSongs: async() => {
        set({isLoading: true, error: null});
        try {
            const response = await axiosInstance.get("/songs/made-for-you");
            set({ madeForYouSongs: response.data });
        } catch (error) {
            if (error instanceof AxiosError) {
                set({ error: error.response?.data?.message || "Failed to fetch trending made for you songs" });
            }
        }finally{
            set({ isLoading: false });
        }
    },
    fetchTrendingSongs: async() => {
        set({ isLoading: true, error:null});
        try {
            const response = await axiosInstance.get("/songs/trending");
            set({ trendingSongs: response.data });
        } catch (error) {
            if(error instanceof AxiosError) {
                set({ error: error.response?.data?.message || "Failed to fetch trending songs" });
            }
        }finally{
            set({ isLoading: false });
        }
    },
}))