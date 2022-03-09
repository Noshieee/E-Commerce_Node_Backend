const User = require('../models/userModels')
const Product = require('../models/productModel');

async function getUser(req, res, next) {
  console.log(req.decoded)
    let user;
    try {
        user = await User.findById(req.decoded._id);

    if (!user) res.status(404).json({ message: "Could not find user" });
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
    res.user = user;
    next();
}

async function getProduct(req, res, next) {
  let product;
  try {
    product = await Product.findById(req.params.id);
    if (!product) {
    res.status(404).json({ message: "Cannot find the Product You are looking for" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  res.product = product;
  next();
}


module.exports = { getUser, getProduct };