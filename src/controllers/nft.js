import { 
    getNftId,
    getNftItemByUserId,
    createNftItem,
    hiddenNftItem,
    updateNftLikesNum
} from '../models/nftModel.js';

import { updateToken } from '../models/userModel.js';

import dotenv from "dotenv";

dotenv.config();

export  const getNftInfo = async (req, res) => {
    const {nftId} = req.body;
    try{
        const result = await getNftId(nftId);
        if (result === 0){
            return res.status(404).json({ message: "NFT item not exist"});
        }
        return res.status(200).json(result); 
    }catch(error){
        return res.status(500).json({ message: error.message});
    }
}

export const getNftByUser = async (req, res) => {
    const userId = req.user;

    try{
        const result = await getNftItemByUserId(userId);
        return res.status(200).json(result);
    }catch(error){
        return res.status(500).json({ message: error.message});
    }
}

export const uploadNft = async (req, res) => { //userId會從前端得到？
    const userId = req.user
    const {title, category, institution, tag1, tag2, description, verification, image, file} = req.body;

    if(!title||!category||!institution||!description||!image||!file){
        return res.status(404).json({ message: "NFT file or information can not be empty"}); 
    }

    try{
        const result = await createNftItem(title, category, institution, tag1, tag2, description, verification, image, file, userId);
        if (!result){
            return res.status(400).json(result);
        }
        if (verification){
            const token_name = "token_" + category;
            const token = await updateToken(userId, token_name);
        }
        return res.status(201).json(result); 
    }catch(error){
        return res.status(500).json({ message: error.message});
    }
}

export const hiddenNft = async (req, res) => {
    const {nftId} = req.body;

    if (!nftId) {
        return res.status(400).json({ error: 'NFT ID is required' });
    }

    try{
        const result = await hiddenNftItem(nftId);
        return res.status(200).json({ message: 'NFT hidden successfully'}); 

    }catch(error){
        return res.status(500).json({ message: error.message});
    }
    
}

export const updateNftLikes = async (req, res) => {
    const {nftId, likes_num} = req.body;

    if (!nftId||likes_num === 0) {
        return res.status(400).json({ error: 'Missing NftId or number of likes' });
    }

    if (likes_num < 0 || !Number.isInteger(likes_num)) {
        return res.status(400).json({ error: 'Number of likes must be a non-negative integer' });
    }

    try{
        const result = await updateNftLikesNum(nftId, likes_num);
        return res.status(200).json(result); 

    }catch(error){
        return res.status(500).json({ message: error.message});
    }

} //找不到nft id要怎麼寫 有需要寫一個getnftid在model嗎