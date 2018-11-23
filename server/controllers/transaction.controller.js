import PartnerUserXR from "../models/partner-user-xr.model";
import Activity from "../models/activity.model";
import _ from "lodash";
import errorHandler from "./../helpers/dbErrorHandler";
import formidable from "formidable";
import fs from "fs";

const exchangePoints = (req, res, next) => {
  PartnerUserXR.findByIdAndUpdate(
    req.body.userPartner1XRId,
    { $inc: { points: (-1 * req.body.partner1points) } },
    (err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }
      PartnerUserXR.findByIdAndUpdate(
        req.body.userPartner2XRId,
        { $inc: { points: req.body.partner2points } },
        (err, result) => {
          if (err) {
            return res.status(400).json({
              error: errorHandler.getErrorMessage(err)
            });
          }
        });
    });
  const activity = new Activity({
    user: req.body.user,
    debit_partner: req.body.debit_partner,
    debit_points: req.body.partner1points,
    credit_partner: req.body.credit_partner,
    credit_points: req.body.partner2points,
    activity_type: 'exchange',
    created: Date.now()
  });
  activity.save((err, result) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      });
    }
  })

  res.status(200).json({
    message: "Points exchanged successfully!"
  });
};

const myActivity = (req, res, next) => {
  Activity.find({ user: req.profile }, (err, activities) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      });
    }
    activities.sort((a, b) => {
      return b.created - a.created
    })
    res.json(activities);
  }).populate("debit_partner").populate("credit_partner").select("debit_points credit_points created");
}

export default {
  exchangePoints,
  myActivity
};
