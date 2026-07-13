import { Router } from "express";
import { identify } from "../controller/identify.controller.js";

const router = Router();
router.post("/identify", identify);

export default router;
