import { Router } from "express";
import { seeder } from "../controllers/seed.controller";

const router = Router();

router.get("/", seeder);

export default seedRouter;