import {
    getNftInfo,
    uploadNft,
    hiddenNft,
    updateNftLikes
} from "../controllers/nft.js";
import express from "express";
import authJWT from "../middleware/authAPI.js"

const router = express.Router();

router.get("/:nftId", authJWT, getNftInfo);
router.post("/", authJWT, uploadNft);
router.delete("/", authJWT, hiddenNft)
router.put("/likes", authJWT, updateNftLikes)

export default router;

