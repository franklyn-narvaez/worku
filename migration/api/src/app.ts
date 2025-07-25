import express, { Router } from 'express';
import morgan from 'morgan';
import authRouter from './modules/auth/controller.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';



export async function createApp() {
    const app = express();


    app.use(morgan('dev'))
    app.use(express.json());
    app.use(cookieParser());
    app.use(cors({
        origin: 'http://localhost:5173',
        credentials: true // si usas cookies o headers autenticados
    }));


    app.use('/ping', (req, res) => {
        res.send('pong');
    });

    app.use('/api/auth', authRouter)

    const routes = Router();


    return app;
}