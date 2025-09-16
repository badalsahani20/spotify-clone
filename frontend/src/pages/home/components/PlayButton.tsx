import { Button } from '@/components/ui/button';
import { usePlayerStore } from '@/stores/usePlayerStore'
import type { Song } from '@/types'
import { Pause, Play } from 'lucide-react';


const PlayButton = ({song}: {song:Song}) => {
    const { currentSong, isPlaying, setCurrentSong, togglePlay } = usePlayerStore();
    const isCurrentSong = currentSong?._id === song._id;
    const handlePlay = () => {
        if(isCurrentSong) togglePlay();
        else setCurrentSong(song);
    }


  return (
    <div>
    <Button
    size={"icon"}
  onClick={handlePlay}
  className={`absolute bottom-3 right-2 rounded-full bg-green-500 hover:bg-green-400 hover:scale-105 transition-all group-hover:translate-y-0
    ${isCurrentSong ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
>
  {isCurrentSong && isPlaying ? (
    <Pause className="size-5 text-black" />
  ) : (
    <Play className="size-5 text-black" />
  )}
</Button>
    </div>
  )
}

export default PlayButton
