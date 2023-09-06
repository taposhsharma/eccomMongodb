const express = require('express');
const crypto = require('crypto');
const { handleErrors } = require('./middlewares');
const User = require('../../models/user')
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../../template/views/admin/auth/signup');
const signinTemplate = require('../../../template/views/admin/auth/signin');
const {
  requireEmail,
  requirePassword,
  requirePasswordConfirmation,
  requireEmailExists,
  requireValidPasswordForUser
} = require('./validators');

const router = express.Router();

router.get('/signup', (req, res) => {
  res.send(signupTemplate({ req }));

});

router.post(
  '/signup',
  [requireEmail, requirePassword, requirePasswordConfirmation],
  
  handleErrors(signupTemplate),
  async (req, res) => {
   
    const user = new User(req.body)
    try{
        await user.save()
      
       req.session.userId = user._id
        // res.status(201).send({user,token})
        res.redirect('/admin/products');
    }catch(err){
        res.status(400).send(err)
        console.log(err)
    }
  
  }
);

router.get('/signout', (req, res) => {
  req.session = null;
  res.send('You are logged out');
});

router.get('/signin', (req, res) => {
  res.send(signinTemplate({}));
});

router.post(
  '/signin',
  [requireEmailExists, requireValidPasswordForUser],
  handleErrors(signinTemplate),
  async (req, res) => {
    try{
   
      const user = await User.findByCredentials(req.body.email,req.body.password) 
      
      
      req.session.userId = user._id
      // console.log("hello")
      res.redirect('/admin/products');    
 }catch(e){
       
 }

    
  }
);

module.exports = router;
