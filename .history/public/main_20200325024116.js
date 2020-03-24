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
         username:  null,
         ready: false,
         info: [],
         connections: 0,
         connected:true
     },
     
     beforeMount(){
        var app = this; 
        app.getLoggedInUser();

         axios.get('/getMessages')
            .then(function (response) {
                app.messages = response.data;
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
            });
      
     },
     updated() {
         this.scrollToEnd();
     },
     // Our vue created method
     created() {
         // Emitting 'leave' event on tab closed event.
         window.onbeforeunload = () => {
             socket.emit('leave', this.username);
         }
         // Listening to chat-message event emitted from the server and pushing to messages array
         socket.on('chat-message', (data) => {
             this.messages.push({
                 message: data.message,
                 username: data.user,
             });
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
     //Vue Methods hook
     methods: {
         //The send method stores the user message and emit an event to the server.
         async send() {
            var app = this;
            try {
                const response = await axios.get('/session-user');
                app.username = response.data.username;
            } catch (error) {
                console.error(error);
            }
            
            const params = new URLSearchParams();
            params.append('username', app.username);
            params.append('message', app.newMessage);
            axios.post('/SaveMessage', params);
            app.messages.push({
                message: app.newMessage,
                username: 'Me',
            });
            socket.emit('chat-message', {
                username: app.username, 
                message: app.newMessage,     
             });
             app.newMessage = null;
         },
         getLoggedInUser(){
            axios.get('/session-user',(res)=>{
                if(res){
                    this.username = res.username;
                    this.addUser;
                }else{
                   console.log('no User');
                }
            });
         },
         scrollToEnd: function () {
            var content = this.$refs.messagesContainer;
            content.scrollTop = content.scrollHeight
        },
         // The addUser method emit a 'joined' event with the username and set the 'ready' property to true.
         addUser() {
             this.ready = true;
             socket.emit('joined', this.username)
         }
     },

 });
