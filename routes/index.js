const express = require('express');
const router = express.Router();
const firebase = require('firebase');
/* GET home page. */
router.get('/', function(req, res, next) {
  firebase.database().ref('users').once("value").then(allBubbles=>{
    res.render('index', {
      title: 'Budget Budgie',
      allBubbles : allBubbles.val()
    });
  });

});

module.exports = router;