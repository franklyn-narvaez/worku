import express, { Router } from "express";
import morgan from "morgan";
import authRouter from "./modules/auth/controller";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./modules/users/controller";
import collegeRouter from "./modules/colleges/controller";
import roleRouter from "./modules/roles/controller";
import offerRouter from "./modules/offers/controller"; // Assuming you have an offerRouter defined
import offersDependenceRouter from "./modules/offersDepedence/controller"; // New import for offers dependence
import studentOfferRouter from "./modules/studentOffers/controller"; // New import for student offers
import path from 'path';

export async function createApp() {
	const app = express();

	app.use(morgan("dev"));
	app.use(express.json());
	app.use(cookieParser());
	app.use(
		cors({
			origin: "http://localhost:5173",
			credentials: true, // si usas cookies o headers autenticados
		}),
	);
  
      app.use('/uploads', (req, res, next) => {
        next();
    }, express.static(path.join(process.cwd(), 'uploads')));

	app.use("/ping", (req, res) => {
		res.send("pong");
	});

	app.use("/api/auth", authRouter);
	app.use("/api/user", userRouter);
	app.use("/api/college", collegeRouter);
	app.use("/api/role", roleRouter);
	app.use("/api/offer", offerRouter);
	app.use("/api/offers-dependence", offersDependenceRouter); // New route for offers dependence
	app.use("/api/student-offers", studentOfferRouter); // New route for student offers

	const routes = Router();

	return app;
}
