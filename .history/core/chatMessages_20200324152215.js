const pool = require('./pool');
const bcrypt = require('bcrypt');
var mysql = require('mysql');

function chatMessages() {};

chatMessages.prototype = {
    // Find the user data by id or username.
    find : function(callback)
    {
       

        // var con = mysql.createConnection({
        // host: "localhost",
        // user: "root",
        // password: "",
        // database: "chatApp"
        // });

        // con.connect(function(err) {
        // if (err) throw err;
        // con.query("SELECT * FROM chatMessages", function (err, result, fields) {
        //     if (err) throw err;
        //     console.log(result);
        // });
        // });


       
        // prepare the sql query
        let sql = `SELECT * FROM chatMessages ORDER BY id DESC`;
        
        pool.query(sql, function (error, results, fields) {
            if (error) throw error;
            if(result.length) {
                callback(result[0]);
            }else {
                callback(null);
            }
            console.log('The solution is: ', results);
          });

        // pool.query(sql, function(err, result) {
        //     if(err) throw err
        //     // callback(result);

        //     if(result.length) {
        //         callback(result);
        //     }else {
        //         callback('no Result found');
        //     }
        // });
    },

    // This function will insert data into the database. (create a new user)
    // body is an object 
    create : function(body, callback) 
    {
        return body;
        var username = body.username;
        var message = body.message;
        // var pwd = body.password;
        // // Hash the password before insert it into the database.
        // body.password = bcrypt.hashSync(pwd,10);

        // this array will contain the values of the fields.
        var bind = [];
        // loop in the attributes of the object and push the values into the bind array.
        // for(prop in body){
        //     bind.push(body[prop]);
        // }
        // prepare the sql query
        let sql = 'INSERT INTO chatMessages(username, message) VALUES ('+username+', '+message+')';

        return sql;
        // call the query give it the sql string and the values (bind array)
        pool.query(sql, bind, function(err, result) {
            if(err) throw err;
            // return the last inserted id. if there is no error
            callback(result.insertId);
        });
    },

    get : function(callback)
    {
    
        // find the user data by his username.
         // prepare the sql query
         let sql = `SELECT * FROM chatMessages ORDER BY id DESC`;
        //  return sql;
         // call the query give it the sql string 
         pool.query(sql, function(err, result) {
             if(err) throw err;
             // return the last inserted id. if there is no error
             callback(result);
         });
       
        
    }

}

module.exports = chatMessages;