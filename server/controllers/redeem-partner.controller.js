import RedeemPartner from "../models/redeem-partner.model";
import _ from "lodash";
import errorHandler from "./../helpers/dbErrorHandler";
import formidable from "formidable";
import fs from "fs";
import redeemPartnerImage from "./../../client/assets/images/org-picture.png";

const create = (req, res, next) => {
  const redeemPartner = new RedeemPartner(req.body);
  redeemPartner.save((err, result) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      });
    }
    res.status(200).json({
      message: "Successfully created Redeem Partner!"
    });
  });
};

/**
 * Load user and append to req.
 */
const redeemPartnerByID = (req, res, next, id) => {
  RedeemPartner.findById(id).exec((err, redeemPartner) => {
    if (err || !redeemPartner)
      return res.status("400").json({
        error: "Redeem Partner not found"
      });
    req.profile = redeemPartner;
    next();
  });
};

// const read = (req, res) => {
//   return res.json(req.profile);
// };

const list = (req, res) => {
  RedeemPartner.find((err, redeemPartners) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      });
    }
    res.json(redeemPartners);
  }).select("name category tnc conversion_rate denominations updated created");
};

// const update = (req, res, next) => {
//   let partner = req.profile;
//   partner = _.extend(partner, req.body);
//   partner.updated = Date.now();

//   partner.save((err, result) => {
//     if (err) {
//       return res.status(400).json({
//         error: errorHandler.getErrorMessage(err)
//       });
//     }
//     res.json(partner);
//   });
// };

// const remove = (req, res, next) => {
//   let partner = req.profile;
//   partner.remove((err, deletedPartner) => {
//     if (err) {
//       console.log("There is some error while removing here");
//       return res.status(400).json({
//         error: errorHandler.getErrorMessage(err)
//       });
//     }
//     res.json(deletedPartner);
//   });
// };

const photo = (req, res, next) => {
  if (req.profile.photo.data) {
    res.set("Content-Type", req.profile.photo.contentType);
    return res.send(req.profile.photo.data);
  }
  next();
};

const defaultPhoto = (req, res) => {
  return res.sendFile(process.cwd() + redeemPartnerImage);
};

export default {
  create,
  redeemPartnerByID,
  // read,
  list,
  // remove,
  // update,
  photo,
  defaultPhoto
};
