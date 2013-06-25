"use strict";

var makeAPI = require("makeapi");

var defaultOptions = {
  endpoint: "https://makeapi.webmaker.org",
  auth: "",
  urlHost: "https://makes.org",
  detailsParam: "makeDetails"
};

module.exports = function(app, options) {
  return function( req, res, next ) {
    var publishOpts = {};
    var subdomain;
    var make;
    var details;

    for (option in defaultOptions) {
      if (typeof options[option] === typeof defaultOptions[option]) {
        publishOpts[option] = options[option];
      } else {
        publishOpts[option] = defaultOptions[option];
      }
    }

    // Per-user or per app?
    subdomain = options.username || options.appName || "";

    // Use make object passed to us, or create one
    make = options.make || makeAPI.makeAPI({
      apiURL: publishOpts[endpoint],
      auth: publishOpts[auth]
    });

    details = req[publishOpts[makeDetailsParam]];
    if (!details) {
      next({err:"You must attach makeDetails to the req"});
    }
    details.url = details.url || publishOpts.urlHost + "/" + subdomain + "/" + details.slug;

    make.create({
      maker: req.session.email,
      make: details
    }, function (err,data) {
      if (err) {
        next(err);
      }
      req.make = data;
      next();
    });

  };

};
