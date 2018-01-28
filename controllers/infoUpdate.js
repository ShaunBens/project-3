"use strict";
const DEBUG = true;

const Join = require("path").join;
const infoRoute = require("express").Router();
const _ = require("lodash");

const Auth = require("../lib/authcallback.js");
const ServErr = require("../util/servError.js");
const signToken = require("../lib/signToken.js");
const CRUD = require("../lib/CRUD.js");

const { "token-timeout": expiredIn } = require("../config/config.json");

module.exports = function() {

   infoRoute.put("/api/user", Auth, function(req, res) {
      DEBUG && console.log(req.body); // client handles invalid input
		const { _id: uid } = req.user;

      CRUD
         .update(uid, req.body)
         .then(data => {
            return signToken(req, data, expiredIn);
         })
         .then(refId => {
            res.status(200).json({
               message: "awesome",
               newRef: refId
            });
         })
         .catch(err => {
            return ServErr(res, err);
         });
   });

   return infoRoute;
}