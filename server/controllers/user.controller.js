import User from "../models/user.model";
import Partner from "../models/partner.model";
import PartnerInternal from "../models/partner-internal.model";
import PartnerUserXR from "../models/partner-user-xr.model";
import _ from "lodash";
import errorHandler from "./../helpers/dbErrorHandler";
import formidable from "formidable";
import nodemailer from "nodemailer";
import config from "./../../config/config";
import fs from "fs";
import profileImage from "./../../client/assets/images/profile-pic.png";

const create = (req, res, next) => {
  const user = new User(req.body);
  user.save((err, result) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      });
    }

    //Seed PartnerInternal data
    Partner.find((err, partners) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }

      //Loop through all the existing Partners and create a PartnerInternal file for the User
      partners.forEach(p => {
        const partnerInternal = new PartnerInternal({
          partner: p,
          email: user.email,
          password: "123test",
          points: Math.floor(Math.random() * 1000) + 1
        });
        partnerInternal.save((err, result) => {
          if (err) {
          }
        });
      });
    });

    res.status(200).json({
      message: "Successfully signed up!"
    });

    //Send verification email
    // let transporter = nodemailer.createTransport({
    //   service: config.email_service,
    //   auth: {
    //     user: config.email_username,
    //     pass: config.email_pwd
    //   }
    // })

    // let mailOptions = {
    //   from: config.email_username,
    //   to: user.email,
    //   subject: 'Please verify your account',
    //   text: 'Please click on this link: http://localhost:3000/verify/' + user.verification_string
    // }

    // transporter.sendMail(mailOptions, (error, info) => {
    //   if (error) {
    //     return res.status(400).json({
    //       error: errorHandler.getErrorMessage(error)
    //     });
    //   }

    //   res.status(200).json({
    //     message: "Successfully signed up!"
    //   });
    // })
  });
};

/**
 * Load user and append to req.
 */
const userByID = (req, res, next, id) => {
  User.findById(id)
    .populate("partners", "_id name")
    .exec((err, user) => {
      if (err || !user)
        return res.status("400").json({
          error: "User not found"
        });
      req.profile = user;
      next();
    });
};

const userByVerificationString = (req, res, next, id) => {
  User.find({ verification_string: id }).exec((err, user) => {
    if (err || !user)
      return res.status("400").json({
        error: "User not found"
      });
    req.profile = user;
    next();
  });
};

const read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

const list = (req, res) => {
  User.find((err, users) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      });
    }
    res.json(users);
  }).select("name email updated created partners");
};

const update = (req, res, next) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Photo could not be uploaded"
      });
    }
    let user = req.profile;
    user = _.extend(user, fields);
    user.updated = Date.now();
    if (files.photo) {
      user.photo.data = fs.readFileSync(files.photo.path);
      user.photo.contentType = files.photo.type;
    }
    user.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }
      user.hashed_password = undefined;
      user.salt = undefined;
      res.json(user);
    });
  });
};

const remove = (req, res, next) => {
  let user = req.profile;
  user.remove((err, deletedUser) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      });
    }
    deletedUser.hashed_password = undefined;
    deletedUser.salt = undefined;
    res.json(deletedUser);
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
  return res.sendFile(process.cwd() + profileImage);
};

const registerPartner = (req, res, next) => {
  PartnerInternal.findOne(
    {
      partner: req.profile._id,
      email: req.body.partnerCredentials.email
    },
    (err, partnerInternal) => {
      if (err || !partnerInternal)
        return res.status("401").json({
          error: "User not found in Partner's records"
        });

      if (!partnerInternal.authenticate(req.body.partnerCredentials.password)) {
        return res.status("401").send({
          error: "Email and password don't match in Partner's records."
        });
      }

      User.findByIdAndUpdate(
        req.auth._id,
        { $push: { partners: req.profile._id } },
        (err, result) => {
          if (err) {
            return res.status(400).json({
              error: errorHandler.getErrorMessage(err)
            });
          }

          const partner_user_xr = new PartnerUserXR({
            partner: req.profile,
            user: req.auth,
            username: req.body.partnerCredentials.email,
            password: req.body.partnerCredentials.password,
            points: partnerInternal.points,
            updated: Date.now()
          });

          partner_user_xr.save((err, result) => {
            if (err) {
              console.log(err);
              return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
              });
            }
          });

          res.json({ message: "Registered Successfully" });
        }
      );
    }
  );
};

const unregisterPartner = (req, res, next) => {
  User.findByIdAndUpdate(
    req.auth._id,
    { $pull: { partners: req.profile._id } },
    (err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }

      PartnerUserXR.find({ partner: req.profile, user: req.auth }).remove(
        (err, result) => {
          if (err) {
            return res.status(400).json({
              error: errorHandler.getErrorMessage(err)
            });
          }
          res.json({ message: "Partner unregistered succesfully" });
        }
      );
    }
  );
};

const findPartners = (req, res) => {
  let partners = req.profile.partners;
  Partner.find({ _id: { $nin: partners } }, (err, partners) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      });
    }
    res.json(partners);
  }).select("name");
};

const myPartners = (req, res) => {
  //let partners = req.profile.partners;
  PartnerUserXR.find({ user: req.profile }, (err, partners) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      });
    }
    res.json(partners);
  })
    .populate("partner")
    .select("points updated");
};

export default {
  create,
  userByID,
  userByVerificationString,
  read,
  list,
  remove,
  update,
  photo,
  defaultPhoto,
  registerPartner,
  unregisterPartner,
  findPartners,
  myPartners
};
