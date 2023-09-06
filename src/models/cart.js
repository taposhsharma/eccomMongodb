const validator = require("validator");
const mongoose = require("mongoose");


const bcrypt = require("bcryptjs");

const { urlencoded } = require("express");

const cartSchema = new mongoose.Schema({

  items: [{
   id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'Product'
   },
   quantity:{
    type:Number,
    required:true
   }
  }],
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref: 'User'
  }
  
  
 
},
{
  timestamps:true
});







const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;