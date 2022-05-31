const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const database = admin.firestore();
var split;

exports.timerUpdate = functions.pubsub.schedule('* * * * *').onRun((context) => {
    // database.doc("timers/timer1").update({ "time": admin.firestore.Timestamp.now() });
    // return console.log('successful timer update');



var query = admin.database().ref("notifications").orderByKey();
query.once("value")
  .then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var key = childSnapshot.key;
      var noti = childSnapshot.val();
     split = noti.split(",");
     var currentDateTime = parseInt(Date.now()/1000);
     var futureDateTime = parseInt(split[0]);
  
     
                if(currentDateTime>=futureDateTime){

                    admin.messaging().sendToTopic(split[1],{notification:{        
                        title:"New Letter",
                        body:"You have a new letter from "+split[3]
                                }})                

                    try {
                        var adaRef = admin.database().ref('notifications/'+key);
                        adaRef.remove();
                          } catch (error) {
                            console.error(error);
                        
                          }

                }

             

                


  });
});


  
});

