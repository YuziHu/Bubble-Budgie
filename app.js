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

const app = express();

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
  apiKey: "AIzaSyCcmzO5DIAgH4PWg5VkVtHAVVl4nWWMxl4",
  authDomain: "hackgt-a-team.firebaseapp.com",
  databaseURL: "https://hackgt-a-team.firebaseio.com",
  projectId: "hackgt-a-team",
  storageBucket: "hackgt-a-team.appspot.com",
  messagingSenderId: "822974388081",
  appId: "1:822974388081:web:47d3c0bcb1ab6fc4a208d0",
  measurementId: "G-63ESSJLJHD"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const io = require('socket.io').listen(http);
io.on('connection', function(socket) {
  socket.on('newBubble', bubbleInfo => {
    let userRef = firebase.database().ref('users').child(bubbleInfo.ownerID.toString());
    userRef.once("value").then(userValue=>{
      let newBubbleID = Math.floor(Math.random()*99999)+10;
      userRef.child('bubbles/'+newBubbleID).set({
        label: bubbleInfo.label,
        type: bubbleInfo.type,
        amt: bubbleInfo.amt
      }).then(result=>{
        io.emit("successfulAddBubble", {
          bubbleInfo
        });
      })
    });
  });
});