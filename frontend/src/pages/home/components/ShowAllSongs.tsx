import { useMusicStore } from "@/stores/useMusicStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Clock, Pause, Play } from "lucide-react";

const ShowAllSongs = () => {
  const { isLoadingMadeForYouSongs, madeForYouSongs, fetchMadeForYouSongs } =
    useMusicStore();

  const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();
  const madeForYouPlaylist = madeForYouSongs;

  useEffect(() => {
    if (madeForYouSongs.length === 0) fetchMadeForYouSongs();
  }, [fetchMadeForYouSongs, madeForYouSongs.length]);

  if (isLoadingMadeForYouSongs) return null;

  const totalTime = useMemo(() => {
    const totalSeconds = madeForYouSongs.reduce(
      (acc, song) => acc + (song.duration || 0),
      0
    );
    const hrs = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hrs} hr ${minutes} min`;
  }, [madeForYouSongs]);

  const handlePlaySong = (index: number) => {
    if (!madeForYouPlaylist) return;
    playAlbum(madeForYouPlaylist, index);
  };

  const handlePlayPlaylist = () => {
    if (!madeForYouPlaylist || madeForYouPlaylist.length === 0) return;

    // Check if the playlist is currently playing
    const isCurrentPlaylistPlaying = madeForYouPlaylist.some(
      (song) => song._id === currentSong?._id
    );

    if (isCurrentPlaylistPlaying) {
      togglePlay(); // pause or resume
    } else {
      playAlbum(madeForYouPlaylist, 0); // start from first song
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="h-full">
      <ScrollArea className="h-full rounded-md">
        <div className="relative min-h-full">
          {/* bg gradient */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/80 to-zinc-900 pointer-events-none"
            aria-hidden="true"
          />
          {/* content */}
          <div className="relative z-10">
            <div className="flex p-6 gap-6 pb-8">
              <img
                src="/spotify.png"
                alt=""
                className="w-[240px] h-[240px] shadow-xl rounded"
              />
              <div className="flex flex-col justify-end">
                <h1 className="text-5xl font-bold my-4">Made for you</h1>
                <div className="flex items-center gap-2 text-sm text-zinc-100">
                  <span className="font-medium text-white">Various artists</span>
                  <span>• {madeForYouSongs.length} songs</span>
                  <span>• {totalTime} </span>
                </div>
              </div>
            </div>

            {/* Top Play Button */}
            <div className="px-6 pb-4 flex items-center gap-6">
              <Button
                onClick={handlePlayPlaylist}
                size={"icon"}
                className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 hover:scale-105 transition-all"
              >
                {isPlaying &&
                madeForYouPlaylist.some((song) => song._id === currentSong?._id) ? (
                  <Pause className="h-7 w-7 text-black" />
                ) : (
                  <Play className="h-7 w-7 text-black" />
                )}
              </Button>
            </div>

            {/* Table of songs */}
            <div className="bg-black/20 backdrop:blur-sm">
              <div className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm text-zinc-400 border-b border-white/5">
                <div>#</div>
                <div>Title</div>
                <div>Release Date</div>
                <div>
                  <Clock className="h-4 w-4" />
                </div>
              </div>

              <div className="px-6">
                <div className="space-y-2 py-4">
                  {madeForYouPlaylist.map((song, index) => {
                    const isCurrentSong = currentSong?._id === song._id;
                    return (
                      <div
                        key={song._id}
                        onClick={() => handlePlaySong(index)}
                        className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer"
                      >
                        <div className="flex items-center justify-center">
                          {isCurrentSong && isPlaying ? (
                            <div className="text-green-500">♬</div>
                          ) : (
                            <span className="group-hover:hidden">{index + 1}</span>
                          )}
                          {!isCurrentSong && (
                            <Play className="h-4 w-4 hidden group-hover:block" />
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <img
                            src={song.imageUrl}
                            alt={song.title}
                            className="w-10 h-10 rounded"
                          />
                          <div>
                            <div className="font-medium text-white">{song.title}</div>
                            <div>{song.artist}</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {song.createdAt.split("T")[0]}
                        </div>
                        <div className="flex items-center">{formatDuration(song.duration)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ShowAllSongs;
