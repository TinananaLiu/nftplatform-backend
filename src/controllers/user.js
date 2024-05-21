import { 
    getUserByUserId, 
    getUserByEmail,
    createUser, 
    updatePasswordAndUsername, 
    updateBio
} from '../models/userModel.js';
import { getTotalLikesByUserId, getAllNftsByUserId } from '../models/nftModel.js';
import dotenv from "dotenv";
import pkg from "jsonwebtoken";

const { sign } = pkg;

dotenv.config();

export const getUserInfo = async (req, res) => {
    console.log('!', req.user);
    const {userId} = req.user; //這樣的寫法{變數名稱}要跟params一樣才會解構附值
    try{
        const result = await getUserByUserId(userId);
        if (result === 0){
            return res.status(404).json({ message: "No user found"});
        }
        return res.status(200).json(result); 
    }catch(error){
        return res.status(500).json({ message: error.message});
    }
};

export const userLogin = async (req, res) => {
    console.log('有人想 LOGIN!')
    const {email, password} = req.body;
    try{
        // try get user
        const users = await getUserByEmail(email);

        // no user match
        if (users.length === 0){
            return res.status(401).json({message: 'Not existing user'})
        }

        // wrong password
        const user = users[0]
        if (user.password !== password.toString()){
            return res.status(401).json({message: 'Invalid username or password'});
        }

        // return token, 前端要存起來
        //sign()是加密的function, process.env.JWT_SECRET是加密的key
        var token = sign({
            userId: user.user_id, 
            // username: user.user_name,
            //email: user.email
            }, process.env.JWT_SECRET);
        // token = "jwt=" + token

        return res.status(200).json({
            jwt: token,
            user_name: user.user_name,
            image: user.image,
            pwd_change: user.pwd_change
        });
    }
    catch(error){
        return res.status(500).json({ message: error.message});
    }
}

export const getUserBio = async (req, res) => {
    const {userId} = req.user;

    const users = await getUserByUserId(userId);
    if(users.length === 0){
        return res.status(401).json({message: 'Not existing user'})
    }

    const user = users[0]

    return res.status(200).json({
        bio: user.bio
    });
}

export const updateUserBio = async (req, res) => {
    const {userId} = req.user;
    const {userBio} = req.body;
    try{
        
        if (userBio.toString().length > 30 ){
            return res.status(400).json({message: 'Bio content too long'});
        };

        //判斷有無該user存在
        const users = await getUserByUserId(userId);
        if(users.length === 0){
            return res.status(401).json({message: 'Not existing user'})
        }

        const result = await updateBio(userId, userBio);
        return res.status(200).json(result);
    }
    catch(error){
        return res.status(500).json({ message: error.message});
    }
}

export const updateUserInfo = async (req, res) => {


    const {userId} = req.user;
    const {oldPassword, newPassword, userName} = req.body;

    try{
        const users = await getUserByUserId(userId);
        if (users.length === 0){
            return res.status(401).json({message: 'Not existing user'});
        }

        const user = users[0];
        
        if(user.pwd_change){
            return res.status(401).json({message: 'Already updated'});
        }

        if (oldPassword !== user.password){
            return res.status(401).json({message: 'Wrong oldPassword'});
        }

        const result = await updatePasswordAndUsername(userId, newPassword, userName);
        console.log(result)
        return res.status(200).json(result);
    }catch(error){
        return res.status(500).json({ message: error.message});
    }
}

export const getTotalLikes = async (req, res) => {
    const {userId} = req.user;
    try{
        const result = await getTotalLikesByUserId(userId);
        return res.status(200).json(result);
    }catch(error){
        return res.status(500).json({ message: error.message});
    }
}

export const getAllNfts = async (req, res) => {
    const {nftId} = req.body;
    try{
        const result = await getAllNftsByUserId(nftId);
        return res.status(200).json(result);
    }catch(error){
        return res.status(500).json({ message: error.message});
    }
}

export const getUserByJwt = async (req, res) => {
    const { userId } = req.user;

    try {
        const users = await getUserByUserId(userId);
        if (users.length === 0){
            return res.status(401).json({message: 'Not existing user'});
        }
        const user = users[0]

        const {user_name, image} = user

        return res.status(200).json({
            user_name,
            image
        })
    } catch (e) {
        return res.status(500).json({ message: error.message});
    }
    
}










// ------------------------------------------------------------------------------------------------
export const registerUser = async (req, res) => {
    const {userName, email, password} = req.body;

    if(!userName||!email||!password){
        return res.status(404).json({ message: "Username, email and password can not be empty"}); 
    }

    try{
        const result = await createUser({userName,email,password});
        if (result === 0){
            return res.status(404).json({ message: "No user found"});
        }
        return res.status(200).json(result); 
    }catch(error){
        return res.status(500).json({ message: error.message});
    }
}