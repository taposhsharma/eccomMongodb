const express = require('express');
const cartsRepo = require('../repositories/carts');
const productsRepo = require('../repositories/products');
const cartShowTemplate = require('../../template/views/carts/show');
const Cart = require('../models/cart')
const Product = require('../models/product')

const router = express.Router();

// Receive a post request to add an item to a cart
router.post('/cart/products', async (req, res) => {
  // Figure out the cart!
  
  let cart;

  // req.session.userId ="dkfjdslkfjdslkjfklds"
  if (!req.session.userId) {
    // We dont have a cart, we need to create one,
    // and store the cart id on the req.session.cartId
    // property
    return res.redirect('/');
    // req.session.cartId = 'hello';
  } else {
    console.log(req.body)
    // const product = await Product.findOne({_id:req.body.productId})
    // console.log(product)
    // console.log(req.session.cardId)
    cart = await Cart.findOne({userId:req.session.userId});
    if(!cart){
      let cartstatus = {
        items:{
          id:req.body.productId,
          quantity :1
        },
        userId:req.session.userId
      }
       cart = new Cart(cartstatus)
       await cart.save()
       res.redirect('/cart');
    }else{
      console.log(cart)
      
       const existingItem = cart.items.find(item => item.id == req.body.productId);
        if (existingItem) {
          // increment quantity and save cart
          existingItem.quantity++;
        } else {
          // add new product id to items array
          cart.items.push({ id: req.body.productId, quantity: 1 });
        }
        await Cart.updateOne({userId:req.session.userId},{$set:cart});
        res.redirect('/cart');

    }

    // We have a cart! Lets get it from the repository
    // cart = await cartsRepo.getOne(req.session.cartId);
  }

  // const existingItem = cart.items.find(item => item.id === req.body.productId);
  // if (existingItem) {
  //   // increment quantity and save cart
  //   existingItem.quantity++;
  // } else {
  //   // add new product id to items array
  //   cart.items.push({ id: req.body.productId, quantity: 1 });
  // }
  // await cartsRepo.update(cart.id, {
  //   items: cart.items
  // });

  // res.redirect('/cart');
});

// Receive a GET request to show all items in cart
router.get('/cart', async (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/');
  }

  const cart = await Cart.findOne({userId:req.session.userId});

  for (let item of cart.items) {
    const product = await Product.findOne({_id:item.id});

    item.product = product;
  }

  res.send(cartShowTemplate({ items: cart.items }));
});

// Receive a post request to delete an item from a cart

router.post('/cart/products/delete',async (req,res)=>{
const {itemId} = req.body
const cart = await Cart.findOne({userId:req.session.userId})

const items = cart.items.filter(item=>item.id!=itemId)

await Cart.updateOne({userId:req.session.userId},{$set:{items:items}});
res.redirect('/cart')
})
module.exports = router;
