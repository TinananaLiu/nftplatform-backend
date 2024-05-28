import {Storage} from "@google-cloud/storage";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const credentials = JSON.parse(process.env.GCS_CREDENTIALS_JSON);
// console.log(credentials)
const storage = new Storage({
    credentials: credentials
});
// const bucket = storage.bucket("nftplatform_avatar");

export function uploadUserImage (req, res, next){
    const bucket = storage.bucket("personachain-user-image");
    const file = req.file;

    //If no file
    if(!file){
        req.filename = null;
        return next();
    }

    //抓副檔名出來
    const extension = file.originalname.slice(file.originalname.lastIndexOf('.')+1);
    //為了避免檔名重複，所以將檔名改成一段隨機碼+副檔名
    const newFilename = `${crypto.randomUUID()}.${extension}`;
    const blob = bucket.file(newFilename);
    const blobStream = blob.createWriteStream();
    
    //開啟監聽，上傳過程有出錯就回傳error
    blobStream.on('error', error=>{
        return res.status(500).json({message: "upload to GCS failed"});
    });

    //開啟監聽，上傳成功就結束，帶著參數往下一層執行
    blobStream.on('finish', () =>{
        req.filename = blob.name;
        next();
    });
    blobStream.end(file.buffer);

}


export function uploadNFTFile(req, res, next){
    const bucket = storage.bucket("personachain-nft-image");
    const files = req.files;
    let promises = []
    console.log(files)
    for(const[fileType, fileList] of Object.entries(files)){
        const file = fileList[0]
        //抓副檔名出來
        if(file.size !== 0){
            const extension = file.originalname.slice(file.originalname.lastIndexOf('.')+1);
            //為了避免檔名重複，所以將檔名改成一段隨機碼+副檔名
            const newFilename = `${crypto.randomUUID()}.${extension}`;
            const blob = bucket.file(newFilename);
            const blobStream = blob.createWriteStream();
    
            //開啟監聽，上傳過程有出錯就回傳error
            blobStream.on('error', error=>{
                return res.status(500).json({message: "upload to GCS failed"});
            });
    
            blobStream.end(file.buffer);
            promises.push(new Promise((resolve,reject)=>{
                blobStream.on('finish', () =>{
                    req[fileType] = blob.name;
                    resolve()
                })
            }))
        }
        else{
            req[fileType] = null
        }
        
        
        
    }
    Promise.all(promises).then(()=>next())
    
    //If no file
    // if(!files){
    //     req.filename = null;
    //     return next();
    // }

    
}