if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
    console.log(process.env)
}

// require('dotenv').config()


const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const ExpressError = require('./utils/ExpressError')

const passport = require('passport')
const LocalStrategy = require('passport-local')

const User = require('./models/user')
const mongoSanitize = require('express-mongo-sanitize')


const coffeeShopRoutes = require('./routes/coffeeShops')
const profileRoutes = require('./routes/profiles')
const userRoutes = require('./routes/user')
const connectRoutes = require('./routes/connects')
const dashBoardRoutes = require('./routes/dashBoard')

const mongoStore = require('connect-mongo')

// const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/Coffwok'
const dbUrl = 'mongodb://localhost:27017/Coffwok'
// mongoose.connect(dbUrl, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false
// });

// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", () => {
//     console.log("Database connected");
// });

mongoose.connect(dbUrl)
    .then(() => {
        console.log('Connect to database successfully !')
    })
    .catch((err) => {
        console.log('ERROR')
        console.log(err)
    })

const app = express()

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

const secret = process.env.SECRET || 'iLoveThu'

const store = mongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60
})

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
}

app.use(session(sessionConfig))
app.use(flash())
app.use(mongoSanitize())

app.use(passport.initialize()) // tell express we'll use passport
app.use(passport.session()) // this middleware change 'user' value that is in session id into deserialized user
passport.use(new LocalStrategy(User.authenticate())) // or u can passport.use(new LocalStrategy(User.authenticate())); Tell pasport use mongodb with local strategy

passport.serializeUser(User.serializeUser()) // write userid into session
passport.deserializeUser(User.deserializeUser()) // retrieve user info to automatically login in futher request


app.use((req, res, next) => {
    // console.log(window.document.cookie)
    // console.log(req.query)
    if (req.originalUrl !== '/login' && req.originalUrl !== '/register') {
        req.session.returnTo = req.originalUrl
        console.log(req.session)
    }
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.errors = req.flash('error')
    next()
})

app.use('/coffeeShops', coffeeShopRoutes)
app.use('/coffeeShops/:id/profiles', profileRoutes)
app.use('/', userRoutes)
app.use('/', connectRoutes)
app.use('/user/:userID', dashBoardRoutes)

// app.use('/users/:id', connectRoutes)


app.get('/', (req, res) => {
    // res.send('ciao')
    res.render('home.ejs')
})

// ERROR HANDLER
app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    const {
        statusCode = 500, message = 'Something went wrong'
    } = err
    console.log(err.message)
    res.status(statusCode).render('error', {
        err
    })
})

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Listenning from port ${port}`)
})