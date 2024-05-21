import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import userRouter from "./routes/user.js";
import nftRouter from "./routes/nft.js";

dotenv.config();

//<initialize>---------------------------------------------------------------------
export const app = express();

//<賦予app什麼功能>-----------------------------------------------------------------
app.use(express.json());
app.use(cors({
  origin: "*",
  credentials: true,
}));

//API Routes
//-----------------------------------------
app.get("/", (req, res) => {
    res.send("Hello World!");
  });

app.use("/api/user/", userRouter);
app.use("/api/nft/", nftRouter);
//---------------------------------------------------------------------------------

const port = process.env.PORT || 3001;
app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`),
);