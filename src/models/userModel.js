import db from "./db_connection.js";


export const getUserByUserId = async (user_id) => {
    const result = await db.any(
        `
        SELECT *
        FROM user_account
        WHERE user_id = $1;
        `
        , [user_id]
    );
    return result;
};

export const getUserByEmail = async (email) => {
    const result = await db.any(
        `
        SELECT *
        FROM user_account
        WHERE email = $1;
        `
        , [email]
    );

    return result;
};

export const createUser = async (user_name, email, password) => {
    const result = await db.any(
        `
        INSERT INTO user_account (user_name, email, password, token_academic, token_professional, token_collaboration, token_creativity, pwd_change)
        VALUES($1, $2, $3, 0, 0, 0, 0, false)
        RETURNING *;
        `
        , [user_name,email,password]
    );
    return result;
}

export const updatePasswordAndUsername = async (user_id, password, username) => {
    const result = await db.any(
        `
        UPDATE user_account
        SET password=$1, user_name=$2, pwd_change=true
        WHERE user_id=$3
        RETURNING *;
        `
        , [password, username, user_id]
    );

    const {user_name, image} = result[0];

    return {
        user_name,
        image,
    };
}

export const updateBio = async (user_id, user_bio) => {
    const result = await db.any(
        `
        update user_account
        set bio=$2
        where user_id=$1
        RETURNING *;
        `
        , [user_id, user_bio]
    );
    return result;
}

export const getRank = async(user_id) => {
    return await db.one(
        `
        select ranking.rank 
        from (SELECT user_id, COALESCE(SUM(likes),0) AS total_likes,Dense_rank() OVER (
            ORDER BY COALESCE(SUM(likes),0) desc ) as rank FROM nft GROUP BY user_id) as ranking
        where ranking.user_id = $1
        `, [user_id]
    )
}

//更改頭像
export const updateImage = (user_id, image) => {

}

//更新token數量
export const updateToken = async (user_id, token_name, amount) => {

    const result = await db.any(
        `
        update user_account
        set ${token_name} = ${token_name} + $2
        where user_id=$1
        RETURNING *;
        `
        , [user_id, amount]
    );
    return result;
}



export const getUserWithNFT = async () => {
    const result = await db.any(
        `select ua.*, n2.* from user_account as ua
        JOIN (Select n1.user_id, max(n1.image) as cover from nft as n1 where n1.hidden=false group by (n1.user_id)) as n2 on ua.user_id = n2.user_id
        where ua.user_id  in (select n3.user_id from nft as n3 where hidden = $1) `
        ,[false]
    );
    return result;

}

//更新image和user_name
export const updateImageAndUsername = async (user_id, image, username) => {
    const result = await db.any(
        `
        UPDATE user_account
        SET image=$1, user_name=$2
        WHERE user_id=$3
        RETURNING *;
        `
        , [image, username, user_id]
    );
    return result;
}

export const updateUsername = async (user_id, username) => {
    const result = await db.any(
        `
        UPDATE user_account
        SET user_name=$2
        WHERE user_id=$3
        RETURNING *;
        `
        , [username, user_id]
    );
    return result;
}