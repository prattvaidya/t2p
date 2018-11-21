import PartnerUserXR from "../models/partner-user-xr.model";
import _ from "lodash";
import errorHandler from "./../helpers/dbErrorHandler";
import formidable from "formidable";
import fs from "fs";

const exchangePoints = (req, res, next) => {
  
  PartnerUserXR.findByIdAndUpdate(
    req.body.userPartner1XRId,
    {points: req.body.partner1points},
    (err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }

      PartnerUserXR.findByIdAndUpdate(
        req.body.userPartner2XRId,
        {points: req.body.partner2points},
        (err, result) => {
          if (err) {
            return res.status(400).json({
              error: errorHandler.getErrorMessage(err)
            });
          }

          res.status(200).json({
            message: "Points exchanged successfully!"
          });
      });
  });
};

export default {
  exchangePoints
};
