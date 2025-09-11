
import { axiosInstance } from '@/lib/axios';
import { AxiosError } from 'axios';
import { create } from 'zustand';

interface MusicStore {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    songs: any[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    albums: any[],
    isLoading: boolean,
    error: string | null,
    fetchAlbums: () => Promise<void>
}

export const useMusicStore = create<MusicStore>((set) => ({
    albums: [],
    songs: [],
    isLoading: false,
    error: null,

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
    }
}))