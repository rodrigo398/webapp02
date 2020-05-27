var LocalStrategy   = require('passport-local').Strategy;
var baseUsuarios = require('./usuarios.json');


module.exports = function(passport) {
    
        // =========================================================================
        // passport session setup ==================================================
        // =========================================================================
        // required for persistent login sessions
        // passport needs ability to serialize and unserialize users out of session
    
        // used to serialize the user for the session
        passport.serializeUser(function(user, done) {
            done(null, user);
        });
    
        // used to deserialize the user
        passport.deserializeUser(function(id, done) {
            done(null, id);
        });


        passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'usuario',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, usuario, password, done) { // callback with email and password from our form

    
                // if no user is found, return the message
                let usuarioEncontrado = baseUsuarios.find((usuarioEnBase)=>{
                    return usuarioEnBase.nombreUsuario == usuario;
                })
                if (!usuarioEncontrado){
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }    
                // if the user is found but the password is wrong
                if(usuarioEncontrado && (password != usuarioEncontrado.password)){
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                }
                // all is well, return successful user
                return done(null, {user:usuarioEncontrado.nombreUsuario});
    
        }));

        
        

};
    