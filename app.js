const express       = require('express')
const path          = require('path')
const moongose      = require('mongoose')
const hbs           = require('hbs')
// const bodyParser    = require('body-parser')

//intailizing the server
const app = express()

//DB Config
const db = require('./config/keys').MongoURI

moongose.connect(db, {useNewUrlParser: true})
    .then( () => console.log('mongo database connected'))
    .catch(err =>console.log(err));

app.use(express.urlencoded({ extended:false }));
app.use(express.json())
// app.use(bodyParser.json())

const User = require('./models/user');
//static files
const static_path = path.join(__dirname,path.join('public') )
const template_path = path.join(__dirname, path.join('templates/views'))
const partials_path = path.join(__dirname, path.join('templates/partials'))


app.use(express.static(static_path));

//to set view engile, hbs - handle bar
app.set("view engine", "hbs");
app.set('views', template_path)
hbs.registerPartials(partials_path)

app.get("/", (req, res) => {
    res.render('index');
});

app.get("/login", (req, res) => {
    res.render('login');
});

app.get("/register", (req, res) => {
    res.render('register');
});
app.get("/chat", (req, res) => {
    res.render('chat');
});

// app.post('/api/register', (req, res)=>{
//     console(req);
//     res.end()
// })
// create a new user in our databse
app.post("/api/register", async (req, res) => {
    console.log(req.body);
    // res.json({status: 'ok'})
    try{
        const username = req.body.username;
        const password = req.body.password;
        
        const registerUser = new User({
                username: username,
                password: password
        });
        const registered = await registerUser.save();
        res.status(201).render('index');
        // res.render("owo new user");
        
    }catch(error){ 
        res.status(400).send(error)
    }
});


// routes
// app.use('/', require('./routes/index'))
// app.use('/users', require('./routes/users'))

const PORT = process.env.PORT || 5000;

//the server is started and listening
app.listen(PORT, console.log(`server started on port ${PORT}`))