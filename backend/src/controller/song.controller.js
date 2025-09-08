import { Song } from "../models/song.model.js"
export const getAllSongs = async(req, res, next) => {
    try {
        // -1 Stands for Descending order which means newest to oldest
        const songs = await Song.find().sott({ createdAt: -1});
        res.json(songs);
    } catch (error) {
        next(error);
    }
};

export const getFeaturedSongs = async(req, res, next) => {
    try {
        // Fetch 6 random songs using mongodb's aggregation pipeline
        const songs = await Song.aggregate([
            {
                $sample: {size:6}
            },
            {
                $project:{
                    title:1,
                    artist:1,
                    imageUrl:1,
                    audioUrl:1
                }
            }
        ])
        res.json(songs);
    } catch (error) {
        next(error);
    }
}

export const getTrendingSongs = async(req, res, next) => {
   try {
        const songs = await Songs.aggregate([
            {$sample: {size: 4}},
            {
                $project:{
                    title:1,
                    artist:1,
                    imageUrl:1,
                    audioUrl:1
                }
             }
        ])
        res.json(songs);
    } catch (error) {
        next(error);
    }
}
export const getMadeForYouSongs = async(req, res, next) => {
    try {
        const songs = await Songs.aggregate([
            {$sample: {size: 4}},
            {
                $project:{
                    title:1,
                    artist:1,
                    imageUrl:1,
                    audioUrl:1
                }
             }
        ])
        res.json(songs);
    } catch (error) {
        next(error);
    }
}