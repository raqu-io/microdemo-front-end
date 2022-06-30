(function (){
  'use strict';

  var util = require('util');

  var domain = "";
  process.argv.forEach(function (val, index, array) {
    var arg = val.split("=");
    if (arg.length > 1) {
      if (arg[0] == "--domain") {
        domain = "." + arg[1];
        console.log("Setting domain to:", domain);
      }
    }
  });

  // Fixes for service mesh
  const catalogueAddr = process.env.CATALOGUE_URL || util.format("http://cataloge%s", domain)
  const cartsAddr = process.env.CARTS_URL || util.format("http://carts%s", domain)
  const ordersAddr = process.env.ORDERS_URL || util.format("http://orders%s", domain)
  const userAddr = process.env.USER_URL || util.format("http://user%s", domain)


  module.exports = {
    catalogueUrl:  catalogueAddr,
    tagsUrl:       util.format("%s/tags", catalogueAddr),
    cartsUrl:      util.format("%s/carts", cartsAddr),
    ordersUrl:     util.format("%s", ordersAddr),
    customersUrl:  util.format("%s/customers", userAddr),
    addressUrl:    util.format("%s/addresses", userAddr),
    cardsUrl:      util.format("%s/cards", userAddr),
    loginUrl:      util.format("%s/login", userAddr),
    registerUrl:   util.format("%s/register", userAddr),
  };
}());
