import express from 'express'
import authCtrl from '../controllers/auth.controller'
import userCtrl from "../controllers/user.controller";

const router = express.Router()

router.route('/auth/verify/:verificationString')
  .get(authCtrl.verify)
router.route('/auth/signin')
  .post(authCtrl.signin)
router.route('/auth/signout')
  .get(authCtrl.signout)

router.param("verificationString", userCtrl.userByVerificationString);

export default router
