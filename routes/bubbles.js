var express = require('express');
var router = express.Router();
// const http = require('http');
const firebase = require('firebase');



/* GET users listing. */
router.get('/:userID', function(req, res, next) {
  let bubbleRef = firebase.database().ref('users');
    bubbleRef.child(req.params.userID.toString()).once("value").then(userVal=>{
      if(userVal.val()==null){
        res.redirect('back');
      } else {
        res.render('budgetpage', { user: userVal.val() });
      }
    });
});

module.exports = router;