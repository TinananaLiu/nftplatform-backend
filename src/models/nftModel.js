import db from "./db_connection.js";



export const getNftId = async (nft_id) => {
    const result = await db.any(
        `
        SELECT *
        FROM nft
        WHERE nft_id = $1;
        `
        , [nft_id]
    );
    return result;
};

export const getNftItemByUserId = async (user_id) => {
    const result = await db.any(
        `
        SELECT * 
        FROM nft
        WHERE user_id = $1
        `
        , [user_id]
    )
    return result;
}

export const createNftItem = async (title, category, institution, tag1, tag2, description, verification, image, file, user_id) => {
    const now = new Date(); 
    const result = await db.any(
        `
        INSERT INTO nft (title, category, institution, tag1, tag2, description, verification, image, file, user_id, date, likes)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 0)
        RETURNING *;
        `
        , [title, category, institution, tag1, tag2, description, verification, image, file, user_id, now]
    );
    return result;
}

//要改成hidden ，DB少了一個欄位 hidden
export const hiddenNftItem = async (nft_id) => {
    const result = await db.any(
        `
            UPDATE nft
            SET hidden = true
            WHERE nft_id = $1
            RETURNING *;
        `
        , [nft_id]
    );
    return result;
}
// export const deleteNftItem = async (nft_id) => {
//     const result = await db.any(
//         `
//         DELETE FROM nft
//         WHERE nft_id = $1;
//         RETURNING *
//         `
//         , [nft_id]
//     );
//     return result;
// }

export const updateNftLikesNum = async (nft_id, likes) => {
    const result = await db.any(
        `
        update nft
        set likes=$2
        where nft_id=$1
        RETURNING *;
        `
        , [nft_id, likes]
    );
    return result;
}

export const getTotalLikesByUserId = async (user_id) => {
    const result = await db.any(
        `
        SELECT user_id, SUM(likes) AS total_likes
        FROM nft
        WHERE user_id = $1
        GROUP BY user_id;
        `
        , [user_id]
    );
    return result;
}

export const getAllNftsByUserId = async (user_id) => {
    const result = await db.any(
        `
        SELECT nft_id, image
        FROM nft
        WHERE user_id = $1
        `
        , [user_id]
    );
    return result;
}

