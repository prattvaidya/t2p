import User from "../models/user.model";
import PartnerInternal from "../models/partner-internal.model";
import PartnerUserXR from "../models/partner-user-xr.model";
import jwt from "jsonwebtoken";
import expressJwt from "express-jwt";
import config from "./../../config/config";

const signin = (req, res) => {
  User.findOne(
    {
      email: req.body.email
    },
    (err, user) => {
      if (err || !user)
        return res.status("401").json({
          error: "User not found"
        });

      if (!user.authenticate(req.body.password)) {
        return res.status("401").send({
          error: "Email and password don't match."
        });
      }

      if (!user.is_verified) {
        return res.status("401").send({
          error: "Account is not verified."
        });
      }

      const token = jwt.sign(
        {
          _id: user._id
        },
        config.jwtSecret
      );

      res.cookie("t", token, {
        expire: new Date() + 9999
      });

      //Random allocation of points to PartnerInternal data.
      PartnerInternal.find({ email: user.email }, (err, partnerInternals) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
          });
        }
        partnerInternals.forEach(pI => {
          PartnerInternal.update(
            { _id: pI._id },
            { points: (Math.floor(Math.random() * 1000) + 1) },
            { multi: false },
            (err, result) => {
              if (err) {
                return res.status(400).json({
                  error: errorHandler.getErrorMessage(err)
                });
              }
            });
        });
      });

      //Update PartnerUserXR with new data
      PartnerUserXR.find({ user: user }, (err, puxrs) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
          });
        }
        puxrs.forEach(puxr => {

          PartnerInternal.findOne(
            { partner: puxr.partner, email: puxr.username },
            (err, result) => {
              if (err) {
                return res.status(400).json({
                  error: errorHandler.getErrorMessage(err)
                });
              }
              if (!result.authenticate(puxr.password)) {

                return res.status("401").send({
                  error: "Partner credentials don't match."
                });
              }

              PartnerUserXR.update(
                { _id: puxr._id },
                { points: result.points, updated: Date.now() },
                { multi: false },
                (err, result) => {
                  if (err) {
                    return res.status(400).json({
                      error: errorHandler.getErrorMessage(err)
                    });
                  }
                });
            });
        });
      });

      return res.json({
        token,
        user: {
          _id: user._id,
          first_name: user.first_name,
          email: user.email,
          is_admin: user.is_admin
        }
      });
    }
  );
};

const signout = (req, res) => {
  res.clearCookie("t");
  return res.status("200").json({
    message: "signed out"
  });
};

const verify = (req, res) => {
  // console.log(req.profile[0]._id)
  User.update(
    { _id: req.profile[0]._id },
    { is_verified: true },
    { multi: false },
    (err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }

      res.status(200).json({
        message: "User verified successfully!"
      });
    });
}

const requireSignin = expressJwt({
  secret: config.jwtSecret,
  userProperty: "auth"
});

const hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!authorized) {
    return res.status("403").json({
      error: "User is not authorized"
    });
  }
  next();
};

export default {
  signin,
  signout,
  requireSignin,
  hasAuthorization,
  verify
};
