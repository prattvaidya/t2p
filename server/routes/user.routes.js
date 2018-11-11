import express from "express";
import userCtrl from "../controllers/user.controller";
import authCtrl from "../controllers/auth.controller";
import partnerCtrl from "../controllers/partner.controller";

const router = express.Router();

router
  .route("/api/users")
  .get(userCtrl.list)
  .post(userCtrl.create);

router
  .route("/api/users/photo/:userId")
  .get(userCtrl.photo, userCtrl.defaultPhoto);
router.route("/api/users/defaultphoto").get(userCtrl.defaultPhoto);

router
  .route("/api/users/registerPartner/:partnerId")
  .put(authCtrl.requireSignin, userCtrl.registerPartner);
router
  .route("/api/users/unregisterPartner/:partnerId")
  .put(authCtrl.requireSignin, userCtrl.unregisterPartner);

router
  .route("/api/users/findPartners/:userId")
  .get(authCtrl.requireSignin, userCtrl.findPartners);

router
  .route("/api/users/:userId")
  .get(authCtrl.requireSignin, userCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove);

router.param("userId", userCtrl.userByID);
router.param("partnerId", partnerCtrl.partnerByID);

export default router;
