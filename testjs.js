var express = require('express');
var app = express();

function getUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
}

let guidId = getUUID()
//console.log (guidId);
let guidId2 = "";
//let action = "go";
var sessionVars = []; // empty Object
let sessionKey = guidId;
var key  ;
let arr = [];
let myGlobal = 0;

function createJSON(guidId, acts) { //create the sessions array for all the alowed actions
    sessionVars[guidId] = []; // empty Array, which you can push() values into
    arr =  acts; //the list of the allowed ations for this user.   
    console.log(" createJSON " + acts);
    sessionVars[guidId] = [
        {lastSeen :  Date.now()},
        {allowedActionsArr : arr},
        {myGlobal : myGlobal}
    ]    

    return sessionVars;
}

//createJSON(guidId);

function getSessionPermissions(action, sessionKey) {
    console.log(sessionKey + "  "+ action + "sessionKey action")
    for (var key in sessionVars) {
       // console.log(sessionVars[key][1].allowedActionsArr)
        if (key == sessionKey) {
            let actList = sessionVars[key][1].allowedActionsArr ;
            return (actList.includes( action ))? true : false 
        }
    }
}

//let result = getSessionPermissions(guidId);
//console.log(result);

var intervalLastConect = setInterval(myCallback, 5*1000);

function myCallback(){
    let s = JSON.stringify(sessionVars); 
    //console.log(sessionVars);  
    for ( key in sessionVars) {
        //console.log(sessionVars[key])
        sessionKey = key;
        if (key == sessionKey) {//delete session after 10 min
           // console.log(key)
            if (sessionVars[key]) {  //console.log("test")
                let lastSeen = sessionVars[key][0].lastSeen;
            //    console.log(lastSeen);
                (lastSeen + 1000*9 < Date.now())? delete sessionVars[key] : "ok";
            } else {
                console.log("no data")
            }
        } else{
            console.log("the key isn`t..")
        }
    }

}

/*app.get('/', function (req, res) {
    
    guidId = getUUID();
    createJSON(guidId)
    console.log("guidId2 = " + guidId);
    res.end("myglobal is " + myGlobal++ );
});*/

module.exports = {
    setInterval,
    myCallback,
    getSessionPermissions,
    getUUID,
    createJSON,
    myGlobal
}

