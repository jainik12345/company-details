import express from "express";
import {
  getAboutCounting,
  insertAboutCounting,
  updateAboutCounting,
} from "../controller/aboutCounting.controller.js";

const router = express.Router();

router.get("/", getAboutCounting);
router.post("/", insertAboutCounting);
router.put("/", updateAboutCounting);

export default router;
