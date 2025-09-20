import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useMusicStore } from "@/stores/useMusicStore";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Plus, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { useAuth } from "@clerk/clerk-react";


interface NewSong {
    title: string;
    artist: string;
    album: string;
    duration: string;
}
const AddSongDialog = () => {

    const {albums} = useMusicStore();
    const [songDialogOpen, setSongDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [newSong, setNewSong] = useState<NewSong>({
        title: "",
        artist: "",
        album: "",
        duration: "0"
    });

    const [files, setFiles] = useState<{ audio: File | null; image: File | null}>({
        audio: null,
        image: null
    });

    const audioInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const getAudioDuration = (file: File, callback: (duration: number) => void) => {
        const audioEl = document.createElement("audio");
        audioEl.src = URL.createObjectURL(file);
        audioEl.onloadedmetadata = () => {
        const seconds = Math.floor(audioEl.duration);
        callback(seconds);
  };
};


    console.log(axiosInstance.defaults.headers.common);
    const { getToken } = useAuth();
    const handleSubmit = async () => {
  setIsLoading(true);

  try {
    if (!files.audio || !files.image) return alert("Please upload all files");

    const token = await getToken(); // ⚡ fresh token every time
    const formData = new FormData();
    formData.append("title", newSong.title);
    formData.append("artist", newSong.artist);
    formData.append("duration", newSong.duration);
    if (newSong.album && newSong.album !== "none") {
      formData.append("albumId", newSong.album);
    }
    formData.append("audioFile", files.audio);
    formData.append("imageFile", files.image);

    await axiosInstance.post("/admin/songs", formData, {
      headers: {
        // "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`, // fresh token
      } as Record<string, string>,
    });

    setNewSong({ title: "", artist: "", album: "", duration: "0" });
    setFiles({ audio: null, image: null });
    toast.success("Song added successfully");

  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const message = error.response?.data?.message || "Failed to add song";
      toast.error(message);
    } else {
      console.error("Unexpected error:", error);
      toast.error("Something went wrong");
    }
  } finally {
    setIsLoading(false);
    setSongDialogOpen(false);
  }
};

  return <Dialog open={songDialogOpen} onOpenChange={setSongDialogOpen}>
    <DialogTrigger asChild>
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-black">
            <Plus className="mr-2 h-4 w-4" />
            Add Song
        </Button>
    </DialogTrigger>

    <DialogContent className="bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-auto">
        <DialogHeader>
            <DialogTitle>Add New Song</DialogTitle>
            <DialogDescription>Add a new song to your music library</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
            <input
            type="file"
            accept="audio/*"
            hidden
            ref={audioInputRef}
            onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
            setFiles((prev) => ({ ...prev, audio: file }));

            // Call helper
            getAudioDuration(file, (seconds) => {
            setNewSong((prev) => ({ ...prev, duration: seconds.toString() }));
    });
  }
}}
             />

             <input
             type="file"
             hidden
             accept="image/*"
             ref={imageInputRef}
             onChange={(e) => setFiles((prev) => ({...prev, image: e.target.files![0] }))}
              />

              {/* image upload area */}

              <div className="flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer" onClick={() => imageInputRef.current?.click()}>
                    <div className="text-center">
                        {files.image ? (
                            <div className="space-y-2">
                                <div className="text-sm text-emerald-500">
                                    Image Selected:
                                </div>
                                <div className="text-xs text-zinc-400">
                                    {files.image.name.slice(0, 20)}
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="p-3 bg-zinc-800 rounded-full inline-block mb-2">
                                    <Upload className="size-6 text-zinc-400" />
                                </div>
                                <div className="text-sm text-zinc-400 mb-2">
                                    Upload artwork
                                </div>
                                <Button variant={"outline"} size={'sm'} className="text-xs">
                                    Choose File
                                </Button>
                            </>
                        )}
                    </div>
                </div>
                        
                        {/* Audio upload area */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Audio File</label>
                    <div className="flex items-center gap-2">
                        <Button variant={'outline'} onClick={() => audioInputRef.current?.click()} className="w-full">
                            {files.audio ? files.audio.name.slice(0, 20) : "Choose File"}
                        </Button>
                    </div>
                </div>

                        {/* Song details */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <Input
                        value={newSong.title}
                        onChange={(e) => setNewSong({...newSong, title: e.target.value })}
                        className="bg-zinc-800 border-zinc-700" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Artist</label>
                    <Input
                        value={newSong.artist}
                        onChange={(e) => setNewSong({...newSong, artist: e.target.value })}
                        className="bg-zinc-800 border-zinc-700" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Duration</label>
                    <Input
                        value={newSong.duration}
                        disabled
                        onChange={(e) => setNewSong({...newSong, duration: (e.target.value) || "0" })}
                        className="bg-zinc-800 border-zinc-700" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Album (Optional)</label>
                    <Select value={newSong.album} onValueChange={(value) => setNewSong({...newSong, album: value })}>
                        <SelectTrigger className="bg-zinc-800 border-zinc-700">
                            <SelectValue placeholder="Select an album" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-zinc-700">
                            <SelectItem value="none">
                                No Album (Single)
                            </SelectItem>
                            {albums.map((album) => (
                                <SelectItem key={album._id} value={album._id}>
                                    {album.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <DialogFooter>
                <Button variant={'outline'} onClick={() => setSongDialogOpen(false)} disabled = {isLoading}>
                    Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? "Uploading..." : "Upload"}
                </Button>
            </DialogFooter>
    </DialogContent>
        
  </Dialog>
}

export default AddSongDialog