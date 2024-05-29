import db from "./db_connection.js";



export const getNftId = async (nft_id) => {
    const result = await db.any(
        `
        SELECT nft.*, nft.user_id as nft_user_id, ua.user_name, ua.image as user_image, (select case
            when exists ( select nl.* from nft_like nl where ua.user_id=nl.user_id and nft.nft_id=nl.nft_id)
            then true 
            else false
        end) as like
        FROM nft
        JOIN user_account as ua on nft.user_id = ua.user_id
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
        WHERE user_id = $1 and hidden = $2
        `
        , [user_id, false]
    )
    return result;
}

export const createNftItem = async (title, category, institution, tag1, tag2, description, verify1, verify2, verify3, image, file, user_id) => {
    const now = new Date(); 
    const result = await db.query(
        `
        INSERT INTO nft (title, category, institution, tag1, tag2, description, verify1, verify2, verify3, image, hidden, file, user_id, date, likes,token_id,contract_address)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, false, $11, $12, $13, 0, $14,$15)
        RETURNING *;
        `
        , [title, category, institution, tag1, tag2, description, verify1, verify2, verify3, image, file, user_id, now,"",""]
    );  
    return result[0];
}


export const hiddenNftItem = async (nft_id, hidden_state) => {
    const result = await db.any(
        `
            UPDATE nft
            SET hidden = $2
            WHERE nft_id = $1
            RETURNING *;
        `
        , [nft_id, hidden_state]
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

export const updateNftLikesNum = async (nft_id) => {
    const result = await db.any(
        `
        update nft
        set likes=(select count(nl.user_id) 
                    from nft_like nl 
                    where nl.nft_id = $1)
        where nft_id=$1
        RETURNING *;
        `
        , [nft_id]
    );
    return result;
}

export const getTotalLikesByUserId = async (user_id) => {
    const result = await db.any(
        `
        SELECT user_id, COALESCE(SUM(likes),0) AS total_likes
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
        SELECT nft_id, title, image, category
        FROM nft
        WHERE user_id = $1 and hidden = $2
        `
        , [user_id, false]
    );
    return result;
}

export const getAllMyNftsByUserId = async (user_id) => {
    const result = await db.any(
        `
        SELECT nft_id, title, image, category
        FROM nft
        WHERE user_id = $1
        `
        , [user_id]
    );
    return result;
}

