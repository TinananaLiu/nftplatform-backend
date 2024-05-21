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


//更改頭像
export const updateImage = (user_id, image) => {

}

//更新token數量
export const updateToken = async (user_id, token_name) => {
    const result = await db.any(
        `
        update user_account
        set $2=$2 + 1
        where user_id=$1
        RETURNING *;
        `
        , [user_id, token_name]
    );
    return result;
}

//少一個jwt欄位