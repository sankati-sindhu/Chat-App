const express       = require('express')
const path          = require('path')
const moongose      = require('mongoose')
const hbs           = require('hbs')
const bcrypt        = require('bcryptjs')
const session       = require("express-session");
const passport      = require('passport')
// const socketio      = require('socket.io');
const http          = require('http')


// const session       = require('express-session')
//intailizing the server
const app = express()

const server = http.createServer(app);

const io = require('socket.io')(server)
//passport config
require('./config/passport')(passport);

//DB Config
const db = require('./config/keys').MongoURI

//connecting to database
moongose.connect(db, {useNewUrlParser: true})
.then( () => console.log('mongo database connected'))
.catch(err =>console.log(err));

app.use(express.urlencoded({ extended:false }));
app.use(express.json())

//sessions middleware
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true

}));

//passport middleware
// app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//including models 
const User = require('./models/user');


//paths declaration
const static_path = path.join(__dirname,path.join('public') )
const template_path = path.join(__dirname, path.join('templates/views'))
const partials_path = path.join(__dirname, path.join('templates/partials'))


//to set view engile, hbs - handle bar
app.set("view engine", "hbs");
app.set('views', template_path)
hbs.registerPartials(partials_path)

// let clientSocketIds = [];
let users = [];

const addUser = (userId, socketId) =>{
    !users.some(user => user.userId === userId) &&
        users.push({userId, socketId});
};

const removeUser = (socketId) => {
    usres = users.filter(user => user.socketId !== socketId);
};

const getUser = (userId) => {
    return users.find(user => user.userId === userId)
}
io.on('connection', (socket)=>{
    console.log("conneted");
    // io.emit('welcome', "hello this is socket");
    socket.on("addUser", userId=>{
        addUser(userId, socket.id);
        io.emit("getUsers", users);
    })
    //send and get message
    socket.on("sendMessage", ({senderId, receiverId, text}) => {
        const user = getUser(receiverId);
        if(user){
            io.to(user.socketId).emit("getMessage", {
                senderId,
                text,
            })

        }
    })
    //disconnect
    socket.on("disconnect", ()=>{
        console.log("a user disconnected");
        removeUser(socket.id);
        io.emit("getUsers", users);
    })
});


//adding static files
app.use('/users',express.static(static_path));
app.use('/',express.static(static_path));
//adding routes
app.use('/', require('./routes/index.js'))
app.use('/users', require('./routes/users.js'))
app.use('/api/messages', require('./routes/messages.js'))
app.use('/api/coversations', require('./routes/conversations.js'))


// create a new user in our databse
app.post("/api/register", async (req, res) => {
    // console.log(req.body);
    // res.json({status: 'ok'})
    try{
        const username = req.body.username;
        const password = req.body.password;
        const publickey = req.body.privateKey;
        const privatekey = req.body.publicKey;
        console.log(privatekey, publickey)
        const registerUser = new User({
                username: username,
                password: password,
                publickey: publickey, 
                privatekey:privatekey  
        });
        bcrypt.genSalt(10, (err, salt) => {
            // console.log('is it');
            bcrypt.hash(registerUser.password, salt, (err, hash) => {
                if(err) throw err;
                //set password to hash
                registerUser.password = hash;
                // console.log(hash);
                registerUser.save()
                    .then((user) => {
                        // req.flash('success_msg', 'you are now registered')
                        // res.redirect('/');
                    })
                    .catch(err => console.log(err));
            })
        })
     
        // res.send("owo new user");
        
    }catch(error){ 
       
        res.status(400).send(error)
    }
});

app.get("/api/users/:userid", async (req, res) => {
    try{
        console.log('trying to get user ifo', req.params.userid)
        const user = await User.findOne({
            _id: req.params.userid,
        });
        res.status(200).json(user);
    }catch(err){
        res.status(500).json(err);
    }
});

const PORT = process.env.PORT || 5000;

//the server is started and listening
server.listen(PORT, console.log(`server started on port ${PORT}`))