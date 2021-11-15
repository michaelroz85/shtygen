var express = require('express');
var app = express();
var mysql = require('./mySql.js');
let session = require('./testjs.js')
var bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
 
function showUser(data, res){ 
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data)); 
}

function addUser(req, res, urlencodedParser){
    //console.log(req);
    //isUserAllowed(recookie)   
    //res.cookie('moni','nonon', 'role'= teacher);
    const user = {
        firstName: req.body.fname,
        lastName: req.body.lname,
        phone: req.body.phone,
        email: req.body.email
    }
    console.log(user);
    //console.log(req.headers.cookie);
    
    let action = req.route.path.slice(1);
    console.log("action = " + action);
   
    mysql.isUserAllowed(req, res, action)
    mysql.addUser(user);
    //res.sendFile(__dirname + "/public/addUserForm.html");
}



/*function editUser(req, res, urlencodedParser){
    let id= req.params.id;
    mysql.editUser(req);
}*/

app.post('/addUser', urlencodedParser, function (req, res) {
     //console.log(req.body.fname, req.body.lname );
     console.log(req.body);
   // mysql.searchUser(req, res, userAllowedActs)
    addUser(req, res, urlencodedParser);
});

app.post('/edit/:id', urlencodedParser, function (req, res) {   
    //console.log(req.body);
    //editUser(req, res, urlencodedParser);
    mysql.editUser(req, res);
});

app.post("/delete/:id", urlencodedParser, function(req,res) {
    let action = req.route.path.slice(1, 7);
    console.log(action);
    //mysql.userAllowedActs(req,res, action, "")   
    mysql.deleteUser( req.params.id, req, res);
    //mysql.getUsers(req, res, "",show);
});

app.get('/', function (req, res) {
    guidId = session.getUUID();
    session.createJSON(guidId)
    console.log("guidId2 = " + guidId);
    res.end("myglobal is " + session.myGlobal++ );
});

app.get('/show', function (req, res) {
    console.log("show")
    mysql.getUsers(req, res, "",showUser);
});

app.get('/:id/showUser', function (req, res) {
    
    mysql.getUser(req, res, req.params.id,"",showUser);
});

app.get('/login', function (req, res) {
    mysql.login(req, res);
    //res.cookie('so','do you');
    //console.log(req.headers.cookie.split("=")[1]);
});

app.get("/search", function(req,res) {
    console.log(req.query.term +" "+ req.query.item);
     
    mysql.searchUser( req, res , showUser);
   // mysql.getUsers(req, res, mysql.getUser);
});

app.listen(8080, function () {
      console.log('Example app listening on port 8080!');
});