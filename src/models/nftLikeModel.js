import db from "./db_connection.js"

export const addLike = (user_id,nft_id) => {
    return db.any(`
        INSERT INTO nft_like (user_id,nft_id) values ($1,$2)
    `,[user_id,nft_id]
    )
}

export const delLike = (user_id,nft_id) => {
    return db.any(
        `DELETE FROM nft_like where user_id = $1 and nft_id = $2 `,
        [user_id,nft_id]
    )
}