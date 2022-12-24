const { response } = require('express');
var express = require('express');
var router = express.Router();
var userHelpers = require('../helpers/user-helper');
var marked = require('marked')
var createDomPurify =require('dompurify')
const {JSDOM} =require('jsdom')
var domPurify = createDomPurify(new JSDOM().window)
/* GET users listing. */

router.get('/', (req, res, next) => {
  let user = req.session.user
  if (user) {
    userHelpers.getAllDetails(user).then((data) => {
    
      res.render('users/us-index', { user, data });
    })

  }
  else {
    res.redirect('/')
  }
})

router.get('/user-index/:date', (req, res) => {
  let user = req.session.user
  if (user) {
    userHelpers.getDay(req.params.date,user).then((data)=>{
      let d=data[0].date
      p=new Date(d)
      let k=p.toDateString()
      
      let html=domPurify.sanitize(marked.parse(data[0].content))
      res.render('users/us-day',{k,user,html})
    })
  }
  else {
    res.redirect('/')
  }
})
router.post('/search',(req,res)=>{
  let user = req.session.user
  let search = req.body.search
  
  console.log(search)
  if (user) {
    userHelpers.getSearch(search,user).then((result)=>{
      res.render('users/us-search',{user,result,search})
    })
  }
  else{
res.redirect('/')
  }
})



router.get('/add-journal', (req, res) => {
  let user = req.session.user
  if (user) {
    let user = req.session.user
    
    res.render('users/us-add', { user })
  }
  else {
    res.redirect('/')
  }
})
router.post('/add-journal', (req, res) => {
  let user = req.session.user
  if (user) {
    
    let d=req.body.date
    let data=req.body
    let p=new Date(d)
    let k={day:p.toDateString()}
    
    let dat = Object.assign(data,k);
    console.log(dat)
    userHelpers.addDetails(user._id,dat).then(() => {
      res.redirect('/user')

    })
  }
  else {
    res.redirect('/')
  }
})
module.exports = router;
