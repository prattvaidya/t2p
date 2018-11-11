import Partner from "../models/partner.model";
import _ from "lodash";
import errorHandler from "./../helpers/dbErrorHandler";
import formidable from "formidable";
import fs from "fs";
import partnerImage from "./../../client/assets/images/org-picture.png";

const create = (req, res, next) => {
  const partner = new Partner(req.body);
  partner.save((err, result) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      });
    }
    res.status(200).json({
      message: "Successfully created partner!"
    });
  });
};

/**
 * Load user and append to req.
 */
const partnerByID = (req, res, next, id) => {
  Partner.findById(id).exec((err, partner) => {
    if (err || !partner)
      return res.status("400").json({
        error: "Partner not found"
      });
    req.profile = partner;
    next();
  });
};

const read = (req, res) => {
  return res.json(req.profile);
};

const list = (req, res) => {
  Partner.find((err, partners) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      });
    }
    res.json(partners);
  }).select("name industry about updated created");
};

const update = (req, res, next) => {
  let partner = req.profile;
  partner = _.extend(partner, req.body);
  partner.updated = Date.now();

  partner.save((err, result) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      });
    }
    res.json(partner);
  });
};

const remove = (req, res, next) => {
  let partner = req.profile;
  partner.remove((err, deletedPartner) => {
    if (err) {
      console.log("There is some error while removing here");
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      });
    }
    res.json(deletedPartner);
  });
};

const photo = (req, res, next) => {
  if (req.profile.photo.data) {
    res.set("Content-Type", req.profile.photo.contentType);
    return res.send(req.profile.photo.data);
  }
  next();
};

const defaultPhoto = (req, res) => {
  return res.sendFile(process.cwd() + partnerImage);
};

export default {
  create,
  partnerByID,
  read,
  list,
  remove,
  update,
  photo,
  defaultPhoto
};
