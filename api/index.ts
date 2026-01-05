import express from "express";
import cors from "cors";
import router from "./routes/routes";
import nodemailer from "nodemailer";

const app = express();

//global middlewares
app.use(cors());
app.use(express.json());


//routes prefixed with api
app.use('/api', router)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server live on port ${PORT}`);
});

export default app;
