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
        app.post('/register', (req, res, next) => {
            // prepare an object containing all user inputs.
            let userInput = {
                username: req.body.username,
                fullname: req.body.fullname,
                password: req.body.password
            };
            // call create function. to create a new user. if there is no error this function will return it's id.
            user.create(userInput, function(lastId) {
                // if the creation of the user goes well we should get an integer (id of the inserted user)
                if(lastId) {
                    // Get the user data by it's id. and store it in a session.
                    user.find(lastId, function(result) {
                        req.session.user = result;
                        req.session.opp = 0;
                        res.redirect('/home');
                    });
        
                }else {
                    console.log('Error creating a new user ...');
                }
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