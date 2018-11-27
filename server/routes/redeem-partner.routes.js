import express from "express";
import redeemPartnerCtrl from "../controllers/redeem-partner.controller";
import authCtrl from "../controllers/auth.controller";

const router = express.Router();

router
  .route("/api/redeem-partners")
  .get(authCtrl.requireSignin, redeemPartnerCtrl.list)
  .post(authCtrl.requireSignin, redeemPartnerCtrl.create);

router
  .route("/api/redeem-partners/photo/:redeemPartnerId")
  .get(redeemPartnerCtrl.photo, redeemPartnerCtrl.defaultPhoto);
router.route("/api/redeem-partners/defaultphoto").get(redeemPartnerCtrl.defaultPhoto);

// router
//   .route("/api/partners/:partnerId")
//   .get(partnerCtrl.read)
//   .put(partnerCtrl.update)
//   .delete(partnerCtrl.remove);

router.param("redeemPartnerId", redeemPartnerCtrl.redeemPartnerByID);

export default router;
