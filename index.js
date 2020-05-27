const fileUpload = require('express-fileupload');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
var passport = require('passport');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var session = require('express-session');



app.set('view engine', 'ejs'); // set up ejs for templating

app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
require('./config/passport')(passport); // pass passport for configuration



// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/buildNR')));
app.use(express.static(path.join(__dirname, 'client/build')));
app.use('/images', express.static(path.join(__dirname, 'filestest')));
app.use('/zips', express.static(path.join(__dirname, 'zips')));


app.use(fileUpload());
app.use(bodyParser.urlencoded());
// Put all API endpoints under '/api'

// routes ======================================================================
require('./routes.js')(app, passport); // load our routes and pass in our app and fully configured passport


const port = process.env.PORT || 5000;
app.listen(port);

console.log(`escuchadno en ${port}`);