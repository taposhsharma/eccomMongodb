const express = require('express');
const multer = require('multer');

const Product = require('../../models/product')

const { handleErrors, requireAuth } = require('./middlewares');
const productsRepo = require('../../repositories/products');
const productsNewTemplate = require('../../../template/views/admin/products/new');
const productsIndexTemplate = require('../../../template/views/admin/products/index');
const productsEditTemplate = require('../../../template/views/admin/products/edit');
const { requireTitle, requirePrice } = require('./validators');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/admin/products', requireAuth, async (req, res) => {
  const products = await Product.find();
  // console.log(products)
  res.send(productsIndexTemplate({ products }));
});

router.get('/admin/products/new', requireAuth, (req, res) => {
  res.send(productsNewTemplate({}));
});

router.post(
  '/admin/products/new',
  requireAuth,
  upload.single('image'),
  [requireTitle, requirePrice],
  handleErrors(productsNewTemplate),
  async (req, res) => {
    const image = req.file.buffer.toString('base64');
    const { title, price } = req.body;

    
    try{
      const product = new Product({title,price,image})
    console.log(product)
      await product.save()
    }catch(e){

    }

     res.redirect('/admin/products');
  }
);

router.get('/admin/products/:id/edit', requireAuth, async (req, res) => {
  const product = await Product.findOne({_id:req.params.id});

  if (!product) {
    return res.send('Product not found');
  }

  res.send(productsEditTemplate({ product }));
});

router.post(
  '/admin/products/:id/edit',
  requireAuth,
  upload.single('image'),
  [requireTitle, requirePrice],
  handleErrors(productsEditTemplate, async req => {
    const product = await Product.findOne({_id:req.params.id});
    return { product };
  }),
  async (req, res) => {
    const changes = req.body;

    if (req.file) {
      changes.image = req.file.buffer.toString('base64');
    }

    try {
      await Product.updateOne({_id:req.params.id},{$set:changes});
    } catch (err) {
      return res.send('Could not find item');
    }

    res.redirect('/admin/products');
  }
);

router.post('/admin/products/:id/delete', requireAuth, async (req, res) => {
  await Product.deleteOne({_id:req.params.id});

  res.redirect('/admin/products');
});

module.exports = router;
