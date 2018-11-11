import express from "express";
import partnerCtrl from "../controllers/partner.controller";

const router = express.Router();

router
  .route("/api/partners")
  .get(partnerCtrl.list)
  .post(partnerCtrl.create);

router
  .route("/api/partners/photo/:partnerId")
  .get(partnerCtrl.photo, partnerCtrl.defaultPhoto);
router.route("/api/partners/defaultphoto").get(partnerCtrl.defaultPhoto);

router
  .route("/api/partners/:partnerId")
  .get(partnerCtrl.read)
  .put(partnerCtrl.update)
  .delete(partnerCtrl.remove);

router.param("partnerId", partnerCtrl.partnerByID);

export default router;
