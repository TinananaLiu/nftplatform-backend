import { addLike, delLike } from '../models/nftLikeModel.js';
import { 
    getNftId,
    getNftItemByUserId,
    createNftItem,
    hiddenNftItem,
    updateNftLikesNum,
    getAllNftsByUserId,
    getAllMyNftsByUserId
} from '../models/nftModel.js';

import { updateToken } from '../models/userModel.js';

import dotenv from "dotenv";

dotenv.config();

export  const getNftInfo = async (req, res) => {
    const {nftId} = req.params;
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

// export const getNftByUser = async (req, res) => {
//     const userId = req.user;

//     try{
//         const result = await getNftItemByUserId(userId);
//         return res.status(200).json(result);
//     }catch(error){
//         return res.status(500).json({ message: error.message});
//     }
// }

export const getAllNftsByUser = async (req, res) => {
    const {userId} = req.params;
    try{
        console.log(userId)
        const result = await getAllNftsByUserId(userId);
        return res.status(200).json(result);
    }catch(error){
        return res.status(500).json({ message: error.message});
    }
}


const parseNull = (a) => {
    if(a) {
        return 1
    } else {
        return 0
    }
}


export const uploadNft = async (req, res) => { //userId會從前端得到？
    const {userId} = req.user
    const {title, category, institution, tag1, tag2, description } = req.body;
    const file = req.file;
    const image = req.image;
    const verify1 = req.verify1;
    const verify2 = req.verify2;
    const verify3 = req.verify3;


    if(!title||!category||!institution||!description||!image||!file||!tag1||!tag2){
        return res.status(404).json({ message: [title,category,institution,description,image,file,tag1,tag2]}); 
    }

    try{
        const result = await createNftItem(title, category, institution, tag1, tag2, description, verify1, verify2, verify3, image, file, userId);
        console.log(result)
        if (!result){
            return res.status(400).json(result);
        }
        if (parseNull(verify1) + parseNull(verify2) + parseNull(verify3) >= 1){ //要改成判斷傳了幾個verify 才給幾個token
            const token_name = "token_" + category;
            updateToken(userId, token_name, parseNull(verify1) + parseNull(verify2) + parseNull(verify3)); // need not await!
        }
        return res.status(201).json(result); 
    }catch(error){
        console.log(error)
        return res.status(500).json({ message: error.message});
    }
}

export const hiddenNft = async (req, res) => {
    const {nftId, hiddenState} = req.body;
    const {userId} = req.user
    console.log(hiddenState)
    if (!nftId) {
        return res.status(400).json({ error: 'NFT ID is required' });
    }
    const {nft_user_id} = await (await getNftId(nftId)).at(0)
    if (nft_user_id!==userId){
        return res.status(400).json({ message: 'Wrong user'})
    }
    try{
        const result = await hiddenNftItem(nftId, hiddenState);
        return res.status(200).json({ message: 'NFT hidden successfully'}); 

    }catch(error){
        return res.status(500).json({ message: error.message});
    }
    
}

export const updateNftLikes = async (req, res) => {
    const {nftId, like_status} = req.body;
    const {userId} = req.user

    if (!nftId) {
        return res.status(400).json({ error: 'Missing NftId' });
    }

    try{
        if(like_status){
            try{
                await addLike(userId,nftId)
            }
            catch(error){
                return res.status(400).json({ message: "Duplicate like" })
            }
            const result = await updateNftLikesNum(nftId);
            return res.status(200).json(result);
        }
        else{
            try{
                await delLike(userId,nftId)
            }
            catch(error){
                return res.status(400).json({ message: "Like Not Found" })
            }
            const result = await updateNftLikesNum(nftId);
            return res.status(200).json(result);
        }
         

    }catch(error){
        return res.status(500).json({ message: error.message});
    }

} //找不到nft id要怎麼寫 有需要寫一個getnftid在model嗎