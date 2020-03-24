

 // Client side Socket.IO object
 var socket = io();

 
    
 // Creating a new Vue Instance
 let vue = new Vue({
     
     // Adding a root element to our vue app
     el: '#app',

     // Declaring our data object with empty arrays and properties
     data: {
         newMessage: null,
         messages: [],
         typing: false,
         username: null,
         ready: false,
         info: [],
         connections: 0,
     },
     
     beforeMount(){
       

        axios.get('/getMessages',(res)=>{
            this.messages = res;
            console.log(this.messages);
         });
     },
     
     // Our vue created method
     created() {
            this.getLoggedInUser();
         // Emitting 'leave' event on tab closed event.
         window.onbeforeunload = () => {
             socket.emit('leave', this.username);
         }
         
         // Listening to chat-message event emitted from the server and pushing to messages array
         socket.on('chat-message', (data) => {
             this.messages.push({
                 message: data.message,
                 type: 1,
                 user: data.user,
             });
         });
         
         
         // Listening to typing event emitted from the server and setting the data (username) to the UI
         socket.on('typing', (data) => {
             this.typing = data;
         });

          // Listening to stopTyping event emitted from the server and setting the typing property to false
         socket.on('stopTyping', () => {
             this.typing = false;
         });

          // Listening to 'joined' event emitted from the server and pushing the data to info array
         socket.on('joined', (data) => {
             this.info.push({
                 username: data,
                 type: 'joined'
             });

             // Setting a time out for the info array to be emptied
             setTimeout(() => {
                 this.info = [];
             }, 5000);
         });

         // Listening to 'leave' event emitted from the server and pushing the data to info array
         socket.on('leave', (data) => {
             this.info.push({
                 username: data,
                 type: 'left'
             });
             
             // Setting a time out for the info array to be emptied
             setTimeout(() => {
                 this.info = [];
             }, 5000);
         });

          // Listening to 'connections' event emitted from the server to get the total number of connected clients
         socket.on('connections', (data) => {
             this.connections = data;
         });
     },

     // Vue Watch hook
     watch: {
         
         // Watching for changes in the message inbox box and emitting the either 'typing' or 'stopTyping' event
         newMessage(value) {
             value ? socket.emit('typing', this.username) : socket.emit('stopTyping')
         }
     },

     //Vue Methods hook
     methods: {
         
         //The send method stores the user message and emit an event to the server.
         send() {
            axios.post('/saveMessage', {
                username: this.username,
                message: 'tstone'
              })
              .then(function (response) {
                console.log(response);
              })
              .catch(function (error) {
                console.log(error);
              });
             this.messages.push({
                 message: this.newMessage,
                 type: 0,
                 user: 'Me',
             });

             socket.emit('chat-message', {
                 message: this.newMessage,
                 user: this.username
             });
             this.newMessage = null;
         },
         getLoggedInUser(){
             
            axios.get('/session-user',(res)=>{

                if(res){
                    this.username = res.username;
                }else{
                   console.log('no User');
                }
                
            });
         },

         // The addUser method emit a 'joined' event with the username and set the 'ready' property to true.
         addUser() {
             this.ready = true;
             socket.emit('joined', this.username)
         }
     },

 });