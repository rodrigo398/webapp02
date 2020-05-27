const MongoClient = require('mongodb').MongoClient
const objectID = require('mongodb').ObjectID;
const stringConexion = process.env.STRINGCONEXION;

var db


MongoClient.connect(stringConexion, (err, database)=> {
    db = database;
    
    module.exports.encontrarTodas = (callback)=>{
    
        var cursor = db.collection('productoedicion').find({})
        cursor.toArray(function(err,docs){
            if(err) throw err;
            callback(docs);
        })
    }

    module.exports.encontrarUna = (idP, callback)=>{
        var cursor = db.collection('productoedicion').find({_id:idP});
        cursor.toArray(function(err,docs){
            console.log(docs[0]);
            if(err) throw err;
            callback(null, docs[0]);
        })

    }
})