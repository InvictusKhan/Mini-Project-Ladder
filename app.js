import express from "express"
import cookieParser from "cookie-parser";
import router from './routes/router.js';
import logger from './middleware/logger.js';
import helmet from 'helmet';
import limiter from "./middleware/rateLimiter.js"
const PORT = process.env.PORT;

const app = express();


app.use(logger);
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(limiter);
app.use('/', router);

app.listen(PORT, () =>{
    console.log(`Server is live on port ${PORT}`);
})