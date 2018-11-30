import PartnerUserXR from "../models/partner-user-xr.model";
import Activity from "../models/activity.model";
import _ from "lodash";
import errorHandler from "./../helpers/dbErrorHandler";
import formidable from "formidable";
import fs from "fs";
import nodemailer from 'nodemailer'
import randomstring from 'randomstring'
import config from "./../../config/config"

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
  }).populate("debit_partner").populate("credit_partner").populate("redeem_partner").select("debit_points credit_points redeem_points activity_type created");
}

const redeemPoints = (req, res, next) => {
  PartnerUserXR.findByIdAndUpdate(
    req.body.userPartner1XRId,
    { $inc: { points: (-1 * req.body.partner1points) } },
    (err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }
    });
  const activity = new Activity({
    user: req.body.user,
    debit_partner: req.body.debit_partner,
    debit_points: req.body.partner1points,
    redeem_partner: req.body.redeem_partner,
    redeem_points: req.body.redeemPoints,
    activity_type: 'redeem',
    created: Date.now()
  });
  activity.save((err, result) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      });
    }
  })

  let transporter = nodemailer.createTransport({
    service: config.email_service,
    auth: {
      user: config.email_username,
      pass: config.email_pwd
    }
  })

  let mailOptions = {
    from: config.email_username,
    to: req.body.user.email,
    subject: 'Your Gift Card is here!',
    text: 'Gift card No: ' + randomstring.generate({
      length: 12,
      charset: 'alphanumeric',
      capitalization: 'uppercase'
    })
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(error)
      });
    }

    res.status(200).json({
      message: "Points redeemed successfully!"
    });
  })
};

export default {
  exchangePoints,
  myActivity,
  redeemPoints
};
