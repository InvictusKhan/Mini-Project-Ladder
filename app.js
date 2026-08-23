import express from "express"
import cookieParser from "cookie-parser";
import router from './routes/router.js';
import logger from './middleware/logger.js';
import helmet from 'helmet';
import cors from "cors";
import limiter from "./middleware/rateLimiter.js"
const PORT = process.env.PORT;

const app = express();

app.use(logger);
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(limiter);
app.use(cors({
  origin: "http://127.0.0.1:5500", // wherever you serve your frontend from
  credentials: true // only strictly needed for /api/refresh and /api/logOut
}));
app.use('/', router);

app.listen(PORT, () =>{
    console.log(`Server is live on port ${PORT}`);
})