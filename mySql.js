var mysql = require('mysql');
var session = require('./testjs.js');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "archivi"
});

let sessionVars;

con.connect(function(err){
    console.log("db connected.");
});

exports.getUsers = function(fields=""){  
    return new Promise (function(resolve, reject){
        let sql = "SELECT * FROM users";
        con.query(sql, function (err, data, fields) {

            if (err) reject(err);

            console.log(data);
            resolve(data);
        })
    });
}

var act = [];
exports.act = act;

exports.login = async function(req,res){
    return new Promise (function(resolve, reject){
        var sql = "SELECT * FROM users WHERE userName = '"+ req.query.userName + "'AND password = '" + req.query.password +"'";
        console.log(sql);
        let action = req.route.path.slice(1);
        console.log("action = " + action);        
        console.log(req.query);
        con.query(sql, function (err, data) {
            if (err) reject(err);
   
            if (data != "") {
                resolve(data);
                if(req.query.userName == data[0].userName && req.query.password == data[0].password){
                    console.log("success login!! welcome " + data[0].first)
                    let role = data[0].role;
                    res.cookie('role', role);
                    console.log(role);
                    let guidId = session.getUUID();
                    /*async function getActs(){
                        return new Promise (function(resolve, reject){
                            (async () => act = await userAllowedActs(role, req, res))()    
                        })
                    }*/

                        userAllowedActs(role, req, res) //.then(console.log("the action list is " + act) )     
                    
                      
        
                      
                    //.then(function (result) { console.log("resultaaaaaaaaaaaa")})//{sessionVars = session.createJSON(guidId, act)})
                   // .then(console.log("sessionVars= " + sessionVars))
                    //.then(console.log(Object.values(sessionVars)[0][1].allowedActionsArr));
                  
                   // res.cookie('action', act);
                    exports.isUserAllowed(req,res, action, guidId);
                    res.send(`Hey there, welcome <a href=\'/logout'>click to logout</a>`);
                }
                else{
                    res.send('Invalid username or password');
                }
                console.log("welcome rabbi "+ data[0].first +"!");
                //console.log( data);
            } else {
                console.log("gevalld!! one or more of the details are wrong!!");
            }
        })    
    });
    
}

exports.isUserAllowed = function(req, res, action, guidId){
   
    let result = session.getSessionPermissions(action, guidId);
    console.log("result = " + result);
}

exports.getUser = function(req, res, id, fields=""){
    //let result = session.getSessionPermissions('get_user_details', guidId);
   /* let result = exports.isUserAllowed(req, res, 'get_user-details', guidId )
    console.log("result = " + result); 
    if (true){
        return new Promise (function(resolve, reject){
            var sql = "SELECT * FROM users WHERE userId="+id;
            con.query(sql, function (err, data, fields) {
                if (err) reject(err);
                console.log(data);
                resolve(data);
            })
        });
    } else{
        console.log("sorry the data isn't//");
    }*/
    console.log(sessionVars)
}

exports.deleteUser = function(id){
        con.query("DELETE FROM users WHERE userId='"+ id +"'");
}

exports.searchUser = function( req, res, callback){

    let sql = `SELECT * FROM users WHERE`+` ${req.query.item} LIKE '${req.query.term}' LIMIT 1`;

    console.log(sql);
    //console.log(req);
    
    con.query(sql, function (err, result) {
        console.log("Searching!", result);
        if(result){
            console.log(result);
            callback(result, res);
        } else {
            callback(null, req, res)
        }

    });       

}
    
async function userAllowedActs(role, req, res){ //checking if the user allowed to do this action
    //console.log(Object.values(sessionVars)[0][1].allowedActionsArr);
    
    return new Promise((req,res) => {
        let sql ="";
        if(role == 'student'){
            sql =  `SELECT doing as action FROM permission WHERE role LIKE '${role}'`;//select all the actions for this role
        } else {
            sql =  `SELECT doing as action FROM permission`;//select all the actions for teacher or admin;
            
        }
        
        con.query(sql , function(err, data){
            if (err) console.log(err);
            act = [];
       
           // console.log(acts);
            //if(Object.values(sessionVars)[0][1].allowedActionsArr == "" ){
                data.forEach(action => {
                    a = "'"+ Object.values(action) + "', ";
                    act = act +a;    
                });
                act = act.slice(0, -2);//the array of the allowed actions of thet user
            //}
            
           // res.cookie('act', act);
           console.log("the acts ============" +act);
            return act
        });
    }); 
};

exports.addUser = function(user){
    
        console.log("start to add!");
       /* con.query("INSERT INTO `users` (`userId`, `first`, `last`, `mail`, `phone`, `address`, `userName`, `password`, `activeOrNot`, `role`, `myGroups`, `familyStatus`, `profession`, `hobbies`, `sihur`, `birthday`, `dateStartSite`) VALUES ('NULL','" + user.firstName + "', '" + user.lastName + "', '" + user.phone + "', '" + user.email + "', '', '', '', '', '', '', '', '', '', '', '', '');", function(err, result){
            if (err) 
                console.log(err);
            else 
                console.log("the user added successfully!");
        });*/
} ;

exports.editUser = function( req){

    /* let update = "UPDATE users SET ";
    for (const [key, value] of Object.entries(req.body)) {
        let keys = 
    }    
    */
    for (const [key, value] of Object.entries(req.body)) {  //the loop updates all the edited item in DB
        console.log(key, value);
        con.query("UPDATE users SET " + key + " = '" + value + "' WHERE users.userId =' "+ req.params.id +"'");

    }
}