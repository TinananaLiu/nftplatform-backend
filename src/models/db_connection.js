import pgPromise from "pg-promise"; //和pgSQL連線的套件
import dotenv from "dotenv";

dotenv.config();

const pgp = pgPromise(); //initialize
const db = pgp({
    host: process.env.HOST,
    port: process.env.DB_PORT,
    database: process.env.DB,
    user: process.env.USER_NAME,
    password: process.env.PASSWORD
}); //加config進來

export default db;