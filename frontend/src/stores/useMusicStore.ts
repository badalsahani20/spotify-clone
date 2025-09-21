import { axiosInstance } from '@/lib/axios';
import type { Album, Song, Stats } from '@/types';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { create } from 'zustand';

interface MusicStore {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    songs: Song[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    albums: Album[],
    isLoadingSongs: boolean,
    isLoadingAlbums: boolean,
    isLoadingStats: boolean,
    isLoadingAlbumDetails: boolean,
    isLoadingFeaturedSongs: boolean,
    isLoadingMadeForYouSongs: boolean,
    isLoadingTrendingSongs: boolean,
    error: string | null,
    currentAlbum: Album | null,
    featuredSongs: Song[],
    madeForYouSongs: Song[],
    trendingSongs: Song[],
    stats: Stats;

    fetchAlbums: () => Promise<void>;
    fetchAlbumById: (id: string) => Promise<void>;
    fetchFeaturedSongs: () => Promise<void>;
    fetchMadeForYouSongs: () => Promise<void>;
    fetchTrendingSongs: () => Promise<void>;
    fetchStats: () => Promise<void>;
    fetchSongs: () => Promise<void>;
    deleteSong: (id: string) => Promise<void>;
    deleteAlbum: (id: string) => Promise<void>;
    addSong: (song: Song) => void;
    addAlbum: (album: Album) => void;
}

export const useMusicStore = create<MusicStore>((set) => ({
    albums: [],
    songs: [],
    isLoadingSongs: false,
    isLoadingAlbums: false,
    isLoadingStats: false,
    isLoadingAlbumDetails: false,
    isLoadingFeaturedSongs: false,
    isLoadingMadeForYouSongs: false,
    isLoadingTrendingSongs: false,
    error: null,
    currentAlbum: null,
    featuredSongs: [],
    madeForYouSongs: [],
    trendingSongs: [],
    stats: {
        totalSongs: 0,
        totalAlbums: 0,
        totalUsers: 0,
        totalArtists: 0,
        totalListeningMinutes: 0,
        totalListeningHours: "0.0",
    },

    addAlbum: (album) => set((state) => ({
        albums: [...state.albums, album],
    })),
    
    addSong: (song) => set((state) => ({
        songs: [...state.songs, song],
    })),

    deleteAlbum: async (id) => {
    set({ isLoadingAlbums: true, error: null });
    try {
        await axiosInstance.delete(`/admin/album/${id}`);
        set((state) => ({
            albums: state.albums.filter((album) => album._id !== id),
            songs: state.songs.map((song) =>
                song.albumId === id ? { ...song, album: null } : song
            ),
        }));
        toast.success("Album deleted successfully");
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data?.message || "Failed to delete album");
            set({
                error: error.response?.data?.message || "Failed to delete album",
            });
        }
    } finally {
        set({ isLoadingAlbums: false });
    }
    },
    deleteSong: async (id) => {
        set({ isLoadingSongs: true, error: null });
        try {
            await axiosInstance.delete(`/admin/songs/${id}`);
            set( state => ({
                songs: state.songs.filter(song => song._id !== id),
            }))
            toast.success("Song deleted successfully");
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.message || "Failed to delete song");
                set({ error: error.response?.data?.message || "Failed to delete song" });
            }
        } finally {
            set({ isLoadingSongs: false });
        }
    },

    fetchSongs: async () => {
        set({ isLoadingSongs:true, error: null});
        try {
            const response = await axiosInstance.get("/songs");
            set({songs: response.data});
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                set({ error: error.response?.data?.message || "Failed to fetch songs" });
            }
        }finally {
            set({isLoadingSongs: false});
        }
    },

    fetchStats: async () => {
        set({ isLoadingStats: true, error: null });
        try {
            const response = await axiosInstance.get("/stats");
            console.log("Stats fetched from backend:", response.data);
            set({stats: response.data});
        } catch (error: unknown) {
            if(error instanceof AxiosError) {
                set({ error: error.response?.data?.message || "Failed to fetch stats" });
            }
        }finally{
            set({isLoadingStats: false});
        }
    },



    fetchAlbums: async () => {
        set({
            isLoadingAlbums: true,
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
            set({isLoadingAlbums: false});
        }
    },

    fetchAlbumById: async (id) => {
        set({ isLoadingAlbumDetails: true, error: null });
        try {
            const response =  await axiosInstance.get(`/album/${id}`);
            set({ currentAlbum: response.data});
            return response.data
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                set({ error: error.response?.data?.message || "Failed to fetch album" });
            }
        } finally {
            set({ isLoadingAlbumDetails: false });
        }
    },

    fetchFeaturedSongs: async() => {
        set({ isLoadingFeaturedSongs:true, error: null });
        try {
            const response = await axiosInstance.get("/songs/featured");
            set({ featuredSongs: response.data });
        } catch (error) {
            if (error instanceof AxiosError) {
                set({ error: error.response?.data?.message || "Failed to fetch featured songs" });
            }
        }finally{
            set({ isLoadingFeaturedSongs: false });
        }
    },
    fetchMadeForYouSongs: async() => {
        set({isLoadingMadeForYouSongs: true, error: null});
        try {
            const response = await axiosInstance.get("/songs/made-for-you");
            set({ madeForYouSongs: response.data });
        } catch (error) {
            if (error instanceof AxiosError) {
                set({ error: error.response?.data?.message || "Failed to fetch trending made for you songs" });
            }
        }finally{
            set({ isLoadingMadeForYouSongs: false });
        }
    },
    fetchTrendingSongs: async() => {
        set({ isLoadingTrendingSongs: true, error:null});
        try {
            const response = await axiosInstance.get("/songs/trending");
            set({ trendingSongs: response.data });
        } catch (error) {
            if(error instanceof AxiosError) {
                set({ error: error.response?.data?.message || "Failed to fetch trending songs" });
            }
        }finally{
            set({ isLoadingTrendingSongs: false });
        }
    },
}))