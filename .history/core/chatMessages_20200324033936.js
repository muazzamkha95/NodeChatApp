const pool = require('./pool');
const bcrypt = require('bcrypt');


function chatMessages() {};

chatMessages.prototype = {
    // Find the user data by id or username.
    find : function(message = null, callback)
    {
       
        // prepare the sql query
        let sql = `SELECT * FROM chatMessages ORDER BY id DESC`;


        pool.query(sql, function(err, result) {
            if(err) throw err
            callback(result);

            if(result.length) {
                callback(result);
            }else {
                callback(null);
            }
        });
    },

    // This function will insert data into the database. (create a new user)
    // body is an object 
    create : function(body, callback) 
    {
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
        let sql = `INSERT INTO chatMessages(username, message) VALUES (`{username}`,`{message{}`)`;
        // call the query give it the sql string and the values (bind array)
        pool.query(sql, bind, function(err, result) {
            if(err) throw err;
            // return the last inserted id. if there is no error
            callback(result.insertId);
        });
    },

    get : function(username, message, callback)
    {
        // find the user data by his username.
         // prepare the sql query
         let sql = `SELECT * FROM chatMessages ORDER BY id DESC`;
         // call the query give it the sql string and the values (bind array)
         pool.query(sql, bind, function(err, result) {
             if(err) throw err;
             // return the last inserted id. if there is no error
             callback(result);
         });
       
        
    }

}

module.exports = chatMessages;