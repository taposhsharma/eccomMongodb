const express = require('express');
const productsRepo = require('../repositories/products');
const productsIndexTemplate = require('../../template/views/products/index');
const Product = require('../models/product')

const router = express.Router();

router.get('/', async (req, res) => {
  const products = await Product.find();
  res.send(productsIndexTemplate({ products }));
});

module.exports = router;
