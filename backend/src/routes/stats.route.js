import { Router } from "express";

const router = Router();

router.get('/' , (req, res) => {
    res.send("Stats router with GET Method.")
})

export default router