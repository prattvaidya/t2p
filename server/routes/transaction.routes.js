import express from "express";
import transactionCtrl from "../controllers/transaction.controller";
import authCtrl from "../controllers/auth.controller";
import userCtrl from "../controllers/user.controller";

const router = express.Router();

router
  .route("/api/transactions/exchange")
  .post(authCtrl.requireSignin, transactionCtrl.exchangePoints);

router
  .route("/api/transactions/myActivity/:userId")
  .get(authCtrl.requireSignin, transactionCtrl.myActivity);

router.param("userId", userCtrl.userByID);

export default router;
