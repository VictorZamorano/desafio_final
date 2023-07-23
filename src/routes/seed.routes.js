import { Router } from "express";
import { seeder } from "../controllers/seed.controller.js";

const seedRouter = Router();

seedRouter.get("/", seeder);

export default seedRouter;