/**
 * Copyright 2017, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

// [START gae_node_request_example]
const express = require('express');
const path = require('path');
const request = require('request');
// const server = https.createServer();
const app = express();

const users = ['HACKATHONUSER084', 'HACKATHONUSER085', 'HACKATHONUSER086', 'HACKATHONUSER087']
const reqOptions = []
const userAccts = []

users.forEach(user => {
  reqOptions.push({ 
    method: 'GET',
    url: 'http://ncrqe-qe.apigee.net/digitalbanking/db-accounts/v1/accounts',
    qs: { hostUserId: user },
    headers: 
     { 'cache-control': 'no-cache',
       Connection: 'keep-alive',
       'Accept-Encoding': 'gzip, deflate',
       Host: 'ncrqe-qe.apigee.net',
       'Postman-Token': 'b95697df-aa7a-4d96-9e2c-f00c032012f2,37198656-90f9-4ae8-b9b1-52fac5a066d0',
       'Cache-Control': 'no-cache',
       'User-Agent': 'PostmanRuntime/7.18.0',
       Accept: 'application/json',
       transactionId: 'f1f47dcd-8331-4955-ae0a-e91f08c768d9',
       Authorization: 'Bearer kWfKFNxaUsooMjqlWEH41cH5LYUz' 
      } 
    })
})
// console.log(reqOptions)
reqOptions.forEach((option, idx) => {
  request(option, function(error, response, body){
    if(error) throw new Error(error);
    // console.log(JSON.parse(body).accounts[0].category)
    // userAccts.push(JSON.parse(body))
    store(idx, JSON.parse(body).accounts)
  })
})
// store user accounts to database


// request(options, function (error, response, body) {
//   if (error) throw new Error(error);

//   console.log(JSON.parse(body).accounts[0]);
// });


// var request = require("request");

// var options = { method: 'GET',
//   url: 'http://ncrqe-qe.apigee.net/digitalbanking/db-transactions/v1/transactions',
//   qs: 
//    { accountId: 'rf5ao6Qclwsth9OfOvUb-EeV1m2BfmTzUEALGLQ3ehU',
//      hostUserId: 'HACKATHONUSER086' },
//   headers: 
//    { 'cache-control': 'no-cache',
//      Connection: 'keep-alive',
//      'Accept-Encoding': 'gzip, deflate',
//      Host: 'ncrqe-qe.apigee.net',
//      'Postman-Token': '180c6447-6e59-4720-acd6-5b0656abed8a,962aa7d6-3fc9-4361-a3e2-b1c93bb63319',
//      'Cache-Control': 'no-cache',
//      'User-Agent': 'PostmanRuntime/7.18.0',
//      Accept: 'application/json',
//      transactionId: 'fdd1542a-bcfd-439b-a6a1-5a064023b0ce',
//      Authorization: 'Bearer u3We4JXZAWN0OFKNkK2mqBooiMnt' } };

// request(options, function (error, response, body) {
//   if (error) throw new Error(error);

//   console.log(typeof(body));
//   console.log(body);
// });





// var options = {
//   url: 'http://ncrqe-qe.apigee.net/digitalbanking/db-accounts/v1/accounts?hostUserId=HACKATHONUSER084',
//   headers:{
//     'Authorization': "Bearer f2Hs1JBslYzVzptgJ6Q5zjkSGTZ"
//   }
// };

// function callback(error, response, body) {
//   console.log(response.statusCode)
// }

// request(options, callback)

// request('http://ncrqe-qe.apigee.net/digitalbanking/db-transactions/v1/transactions?accountId=rf5ao6Qclwsth9OfOvUb-EeV1m2BfmTzUEALGLQ3ehU&hostUserId=HACKATHONUSER086', function(error, response, body){
//   response.setHeader("Authorization", "Bearer QWccIwo69dHpxBJnNF7cdKB61UBF")
//   console.log(response.statusCode)
// })

// app.get('http://ncrqe-qe.apigee.net/digitalbanking/db-transactions/v1/transactions?accountId=rf5ao6Qclwsth9OfOvUb-EeV1m2BfmTzUEALGLQ3ehU&hostUserId=HACKATHONUSER086', 
// function(req, res){
//   res.setHeader("Authorization", "Bearer QWccIwo69dHpxBJnNF7cdKB61UBF")
//   console.log("success")
// })

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var bubbleRouter = require('./routes/bubbles');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/bubble', bubbleRouter);

// Start the server
const PORT = process.env.PORT || 8080;
const http = require('http').createServer(app);
http.listen(8080, function(){
  console.log('listening on *:8080');
});
// [END gae_node_request_example]

module.exports = app;

const firebase = require('firebase');
const firebaseConfig = {
  apiKey: "AIzaSyDjTok9Bd5kdtWeSqUT8FJ1YWgfMeSqgW4",
  authDomain: "bubble-budgie.firebaseapp.com",
  databaseURL: "https://bubble-budgie.firebaseio.com",
  projectId: "bubble-budgie",
  storageBucket: "bubble-budgie.appspot.com",
  messagingSenderId: "629131954627",
  appId: "1:629131954627:web:798aa8d26f2af0ab5fd576",
  measurementId: "G-NKY8EEG4TQ"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
let database = firebase.app().database();

function store(idx, accounts){
  let userId = users[idx]
  let userDB = database.ref(`users/${userId}`);
  userDB.set({
    name: userId
  })
  accounts.forEach(ac => {
    console.log(ac.currentBalance)
    userDB.child('bubbles').push({
      label: ac.category,
      amt: ac.currentBalance.amount,
      depth: 2,
      type: 'pool'
    })
  })
}
const io = require('socket.io').listen(http);
io.on('connection', function(socket) {
  socket.on('newBubble', bubbleInfo => {
    let userRef = firebase.database().ref('users').child(bubbleInfo.ownerID.toString());
    userRef.once("value").then(userValue=>{
      let newBubbleID = Math.floor(Math.random()*99999)+10;
      if(bubbleInfo.label.length>1&&bubbleInfo.type.length>1&&bubbleInfo.amt>0) {
        userRef = userRef.child('bubbles');
        userRef.child(newBubbleID).set({
          label: bubbleInfo.label,
          type: bubbleInfo.type,
          amt: bubbleInfo.amt
        }).then(result=>{
          io.emit("newBubbleAdded", {
            ownerID : bubbleInfo.ownerID,
            bubbleInfo: bubbleInfo
          });
      })
      }
    });
  });
});

/* GET transactions .*/
// http.setHeader("Authorization", "Bearer QWccIwo69dHpxBJnNF7cdKB61UBF");
// https.setHeader("Authorization", "Bearer QWccIwo69dHpxBJnNF7cdKB61UBF")
// https.get('http://ncrqe-qe.apigee.net/digitalbanking/db-transactions/v1/transactions?accountId=rf5ao6Qclwsth9OfOvUb-EeV1m2BfmTzUEALGLQ3ehU&hostUserId=HACKATHONUSER086', 
// (res) => {

//   let data = ''

//   // A chunk of data has been recieved.
//   res.on('data', (chunk) => {
//     data += chunk;
//   });
//   // The whole response has been received. Print out the result.
//   res.on('end', () => {
//     console.log(JSON.parse(data));
//   });
// }).on("error", (err) => {
//   console.log("Error: " + err.message);
// })

//write some more pseudocode or something