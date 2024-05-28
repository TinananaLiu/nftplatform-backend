import {
    getNftInfo,
    uploadNft,
    hiddenNft,
    updateNftLikes,
    getAllNftsByUser
} from "../controllers/nft.js";
import express from "express";
import authJWT from "../middleware/authAPI.js"
import multer from "multer";
import { uploadNFTFile } from "../middleware/imageUpload.js";

const router = express.Router();
const upload = multer({storage: multer.memoryStorage()});

router.get("/:nftId", authJWT, getNftInfo);
router.post("/", authJWT, upload.fields([
    { name: 'file', maxCount: 1},
    { name: 'image', maxCount: 1},
    { name: 'verify1', maxCount: 1},
    { name: 'verify2', maxCount: 1},
    { name: 'verify3', maxCount: 1}
]), uploadNFTFile, uploadNft);

router.put("/", authJWT, hiddenNft)
router.put("/likes", authJWT, updateNftLikes)
router.get("/allnfts/:userId", authJWT, getAllNftsByUser);

export default router;

