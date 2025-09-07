import { Router } from "express";

const router = Router();

router.get('/' , (req, res) => {
    res.send("Songs route with GET request");
})

export default router;