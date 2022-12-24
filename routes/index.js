const { response } = require('express');
var express = require('express');
var router = express.Router();
var userHelpers = require('../helpers/user-helper');
const { ObjectId } = require("mongodb");

/* GET home page. */
router.get('/', function (req, res, next) {
  let user = req.session.user
  if (user) {
    res.redirect('/user');
  }
  else {
    res.render('index', { user });
  }
});

router.get('/login', (req, res) => {
  if (req.session.loginStatus) {
    res.redirect("/user/user-index")
  } else {
    res.render('login', { "loginErr": req.session.loginErr });
    req.session.loginErr = false
  }
});
router.post('/login', (req, res) => {
  userHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loginStatus = true
      req.session.user = response.user
      res.redirect('/user')
    } else {
      req.session.loginErr = "Invalid Email or Password"
      res.redirect('/login')
    }
  })
})
router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})


router.post('/signup', (req, res) => {
  let date_ob = new Date();
  console.log(date_ob)
  userHelpers.doSignup(req.body).then((response) => {
    res.redirect('/login')
  })
})


module.exports = router;
