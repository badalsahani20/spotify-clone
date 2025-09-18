import { Song } from "../models/song.model.js"
import { User } from "../models/user.model.js"
import { Album } from "../models/album.model.js"

export const getStats = async (req, res, next) => {
    try {
        const [ totalSongs, totalAlbums, totalUsers, totalArtists, timesListened ] = await Promise.all([
            Song.countDocuments(),
            Album.countDocuments(),
            User.countDocuments(),
            Song.distinct("artist").then((artists) => artists.length),
            Song.aggregate([
                { $group: { _id: null, total: { $sum: "$timesListened" } } }
            ]).then((res) => res[0]?.total || 0), //total seconds listened
            
        ]);

        res.json({
            totalSongs,
            totalAlbums,
            totalUsers,
            totalArtists,
            totalListeningMinutes: Math.floor(timesListened / 60),
            totalListeningHours: Math.floor(timesListened / 3600).toFixed(1),
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
}