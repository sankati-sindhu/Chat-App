const express               = require('express')
const path                  = require('path')
const passport              = require('passport')
const router                = express.Router();
const {ensureAuthenticated} = require('../config/auth')
router.get('/login', (req, res) =>{
    res.render('login')
})

router.get('/register', (req, res) =>{
    res.render('register')
})

router.post('/login', async (req, res, next) => {
    // try{
        console.log("is user", req.body)
          passport.authenticate('local', {
            successRedirect: '/users/' + req.body.username,
            failureRedirect: '/users/login',
        })(req, res, next);
    // }
    // catch (err){
    //     console.log(err)
    //     res.status(400).send('invalid');
    // }
    console.log(req.body.password)
  
});
router.get('/:id', ensureAuthenticated, (req, res) =>{
    console.log('username is ',req.user)
    // const obj = [
    //     {username: "hello", id:"1"},
    //     {username: "as", id:"2"},
    //     {username: "df", id:"3"},
    //     {username: "dfsa", id:"4"},
    // ]
   
    res.render('chat', {
        // names: obj,
        // username: req.user.username,
        // id: req.user._id.toString()
        user: req.user
    })
})
router.get('logout', (req, res)=>{
    req.logout();
    res.redirect('index');
})
module.exports = router;