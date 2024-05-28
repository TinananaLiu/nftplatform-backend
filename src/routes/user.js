import {
    getUserInfo,
    getUserByJwt,  
    userLogin, 
    updateUserBio,
    updateUserInfo,
    updateImgAndName,
    getTotalLikes,
    getAllMyNfts,
    getUserBio,
    getALLUserWithNFT
} from "../controllers/user.js";
import express from "express";
import authJWT from "../middleware/authAPI.js"
import multer from "multer"
import { uploadUserImage } from "../middleware/imageUpload.js";

const router = express.Router();
const upload = multer({storage: multer.memoryStorage()});

router.get("/autologin", authJWT, getUserByJwt)
router.get("/likes", authJWT, getTotalLikes);
router.get("/allnfts", authJWT, getAllMyNfts);
router.get("/allusernfts", getALLUserWithNFT);


//router.post("/", registerUser);
router.post("/login", userLogin);

router.get("/bio", authJWT, getUserBio);
router.put("/bio", authJWT, updateUserBio);
router.put("/info", authJWT, updateUserInfo);
router.put("/imgname", authJWT, upload.single("image"), uploadUserImage, updateImgAndName);
router.get("/:userId", authJWT, getUserInfo);

export default router;

