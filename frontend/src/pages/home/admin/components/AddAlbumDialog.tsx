import { Button } from '@/components/ui/button';
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { axiosInstance } from '@/lib/axios';
import { useMusicStore } from '@/stores/useMusicStore'
import { AxiosError } from 'axios';
import { Plus, Upload } from 'lucide-react';
import { useRef, useState, type ChangeEvent } from 'react'
import toast from 'react-hot-toast';

const AddAlbumDialog = () => {
    const {addAlbum} = useMusicStore();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [newAlbum, setNewAlbum] = useState({
        title: "",
        artist: "",
        releaseYear: new Date().getFullYear(),
    });

    const[imageFile, setImageFile] = useState<File | null>(null);

    const handleImageSelect = (e:ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);

        try {
            // Check edge cases
            if(!imageFile) {
                return toast.error("Please select an image");
            }

            // Post to backend
            const formData = new FormData();
            console.log({
    title: newAlbum.title,
    artist: newAlbum.artist,
    releaseYear: newAlbum.releaseYear,
    imageFile,
});
            formData.append("title", newAlbum.title);
            formData.append("artist", newAlbum.artist);
            formData.append("releaseYear", newAlbum.releaseYear.toString());
            formData.append("imageFile", imageFile);

            const res = await axiosInstance.post("/admin/albums", formData);
            const createdAlbum = res.data;
            // update Zustand store
            addAlbum(createdAlbum);

            //Reset local state
            setNewAlbum({ title: "", artist: "", releaseYear: new Date().getFullYear() });
            setImageFile(null);
            toast.success("Album created successfully");
        } catch (error: unknown) {
            if(error instanceof AxiosError){
                const message = error.response?.data?.message || "Failed to add album";
                toast.error(message);
            }
        }finally{
            setIsLoading(false);
        }
    }


  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className='bg-violet-500 hover:bg-violet-600 text-white'>
            <Plus className='mr-2 h-4 w-4' />
            Add Album
        </Button>
      </DialogTrigger>
      <DialogContent className='bg-zinc-900 border-zinc-700'>
        <DialogHeader>
            <DialogTitle>
                Add New Album
            </DialogTitle>
            <DialogDescription>
                Add a new album to your collection
            </DialogDescription>
        </DialogHeader>
        <div className='space-y-4 py-4'>
            <input
                type='file'
                id="albumFile"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept='image/*'
                className='hidden'
                />

                <div onClick={() => fileInputRef.current?.click()} className='flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer'>
                    <div className='text-center'>
                        <div className='p-3 bg-zinc-800 rounded-full inline-block mb-2'>
                            <Upload className='h-6 w-6 text-zinc-400' />
                        </div>
                        <div className='text-sm text-zinc-400 mb-2'>
                            {imageFile ? imageFile.name : "Upload album artwork"}
                        </div>
                        <Button variant={'outline'} size={'sm'} className='text-xs'>
                            Choose File
                        </Button>
                    </div>
                </div>
                <div className='space-y-2'>
                    <label className='text-sm font-medium'>Album Title</label>
                    <Input
                        className='bg-zinc-800 border-zinc-700'
                        value={newAlbum.title}
                        onChange={(e) => setNewAlbum({...newAlbum, title: e.target.value})}
                        placeholder='Enter title'
                     />
                </div>
                <div className='space-y-2'>
                    <label className='text-sm font-medium'>Artist</label>
                    <Input
                        value={newAlbum.artist}
                        onChange={(e) => setNewAlbum({...newAlbum, artist: e.target.value})}
                        className='bg-zinc-800 border-zinc-700'
                        placeholder='Enter artist name'
                        />
                </div>
                <div className='space-y-2'>
                    <label className='text-sm font-medium'>Release Year</label>
                    <Input
                        type='number'
                        value={newAlbum.releaseYear}
                        onChange={(e) => setNewAlbum({...newAlbum, releaseYear: Number(e.target.value)})}
                        className='bg-zinc-800 border-zinc-700'
                        placeholder='Enter release year'
                        min={1900}
                        max={new Date().getFullYear()}
                        />
                </div>
        </div>
        <DialogFooter>
            <Button variant={'outline'} onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
                Cancel
            </Button>
            <Button onClick={handleSubmit} className='bg-violet-500 hover:bg-violet-600' disabled={isLoading || !imageFile || !newAlbum.title || !newAlbum.artist}>
                {isLoading ? "Creating" : "Add Album"}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddAlbumDialog
