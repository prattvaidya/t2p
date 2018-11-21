import express from "express";
import transactionCtrl from "../controllers/transaction.controller";

const router = express.Router();

router
  .route("/api/exchange")
  .post(transactionCtrl.exchangePoints);

export default router;
