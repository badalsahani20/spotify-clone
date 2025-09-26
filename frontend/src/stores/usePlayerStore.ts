import { create } from 'zustand';
import type { Song } from '@/types';
import { useChatStore } from './useChatStore';

interface PlayerStore {
    currentSong: Song | null;
    isPlaying: boolean;
    queue: Song[];
    currentIndex: number;
    
    initializeQueue: (song: Song[]) => void;
    playAlbum: (songs: Song[], startIndex?: number) => void;
    setCurrentSong: (song: Song | null) => void;
    togglePlay: () => void;
    playNext: () => void;
    playPrevious: () => void;
    updateActivity: (activity: string) => void
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
    currentSong: null,
    isPlaying: false,
    queue: [],
    currentIndex: -1,

    updateActivity: (activity: string) => {
        const socket = useChatStore.getState().socket;
        if (socket.auth) {
            socket.emit("update_activity", {
                activity
            });
        }
    },
    

    initializeQueue:(songs: Song[]) => {
        set({
            queue: songs,
            currentSong: get().currentSong || songs[0],
            currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
        })
    },

    playAlbum:(songs:Song[], startIndex=0) => {
        if(songs.length === 0)  return;
        const song = songs[startIndex];

        
        set({
            queue: songs,
            currentSong: song,
            currentIndex: startIndex,
            isPlaying: true
        })

        get().updateActivity(`Playing ${song.title} by ${song.artist}`);
    },
    setCurrentSong(song:Song | null) {
        if(!song) return;

    
        const songIndex = get().queue.findIndex((s) => s._id === song._id);
        set({
            currentSong: song,
            isPlaying: true,
            currentIndex: songIndex !== -1 ? songIndex: get().currentIndex,
        })
        get().updateActivity(`Playing ${song.title} by ${song.artist}`);
    },

        togglePlay() {
        const willStartPlaying = !get().isPlaying;

        const currentSong = get().currentSong;
        set({
            isPlaying: willStartPlaying,
        });
        get().updateActivity(
            willStartPlaying && currentSong ? `Playing ${currentSong.title} by ${currentSong.artist}` : "Idle"
        );
        },
    playNext() {
        const { currentIndex , queue } = get();
        const nextIndex = (currentIndex + 1)
        
        // if there is a next song to play, let's play it
        if(nextIndex < queue.length) {
            const nextSong = queue[nextIndex];
            set({
                currentSong: nextSong,
                currentIndex: nextIndex,
                isPlaying: true
            });

            get().updateActivity(`Playing ${nextSong.title} by ${nextSong.artist}`);
        }else {
            // no next song
            set({
                currentSong: null,
                currentIndex: -1,
                isPlaying: false
            });
            get().updateActivity("Idle");
        }

    },

    playPrevious() {
        const { currentIndex, queue } = get();
        const prevSongIndex = currentIndex - 1;
        if(prevSongIndex >= 0) {
            const prevSong = queue[prevSongIndex];
            set({
                currentSong: prevSong,
                currentIndex: prevSongIndex,
                isPlaying: true
            });
            get().updateActivity(`Playing ${prevSong.title} by ${prevSong.artist}`);
        }else {
            set({
                currentSong: null,
                currentIndex: -1,
                isPlaying: false
            })
            get().updateActivity("Idle");
        }
    },
}));