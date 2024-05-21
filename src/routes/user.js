import {
    getUserInfo,
    getUserByJwt,  
    userLogin, 
    updateUserBio,
    updateUserInfo,
    getTotalLikes,
    getAllNfts,
    getUserBioㄒ
} from "../controllers/user.js";
import express from "express";
import authJWT from "../middleware/authAPI.js"

const router = express.Router();

router.get("/autologin", authJWT, getUserByJwt)
router.get("/likes", authJWT, getTotalLikes);
router.get("/allnfts", getAllNfts);

//router.post("/", registerUser);
router.post("/login", userLogin);

router.get("/bio", authJWT, getUserBio);
router.put("/bio", authJWT, updateUserBio);
router.put("/info", authJWT, updateUserInfo);
router.get("/:userId", authJWT, getUserInfo);

export default router;

