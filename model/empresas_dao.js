const MongoClient = require('mongodb').MongoClient
const objectID = require('mongodb').ObjectID;
const stringConexion = process.env.STRINGCONEXION;

var db
MongoClient.connect(stringConexion, (err, database)=> {
    db = database;
    
    module.exports.encontrarTodas = (callback)=>{
        var cursor = db.collection('empresas').find({}, {"nombreEmpresa": 1, "contactoEmpresa": 1, "rubroEmpresa": 1, "subrubroEmpresa": 1})
        cursor.toArray(function(err,docs){
            if(err) throw err;
            callback(docs);
        })
    }

    module.exports.encontrarUna = (idP, callback)=>{
        db.collection('empresas').find({_id:idP}).next((err,doc)=>{
            if(err){
                callback(new Error('No encontre el registro.'));
                return;
            };
            callback(null, doc);
        })

    }


    module.exports.agregarEmpresa = (empresa, callback)=>{
        if (err) console.log(err);
        console.log(empresa);
        var valoresUpdate = {}
        if (empresa.subrubroEmpresa != undefined){
            valoresUpdate = {"nombreEmpresa": empresa.nombreEmpresa, "contactoEmpresa": empresa.contactoEmpresa, "rubroEmpresa": empresa.rubroEmpresa, "subrubroEmpresa": empresa.subrubroEmpresa};
        } else {
            valoresUpdate = {"nombreEmpresa": empresa.nombreEmpresa, "contactoEmpresa": empresa.contactoEmpresa, "rubroEmpresa": empresa.rubroEmpresa};
        }
        db.collection('empresas').update({"nombreEmpresa": empresa.nombreEmpresa}, valoresUpdate, {upsert:true}, (err,result)=>{
            if(err){
                callback(new Error('Connection error: ' + err));
                return;
            };
            callback(null, {message:"Empresa agregada exitosamente", compania:result});  
        });/*
        db.collection('empresas').insert(empresa, (err, result)=>{
            if(err){
                callback(new Error('Connection error: ' + err));
                return;
            };
            callback(null, {message:"Empresa agregada exitosamente", compania:result});    
        });*/

    }

    module.exports.cambiarNombre = (datos, callback)=>{
        if (err) console.log(err);
        let idEmpresa = new objectID(datos.idEmpresa);
        let nuevoNombre = datos.nuevoNombre;

        db.collection('empresas').update({"_id": idEmpresa}, {$set:{"nombreEmpresa": nuevoNombre}}, (err, count, status)=>{
            if (err) callback(err, null);
            callback(null, {message:"Empresa actualizada"});
        })
        
    }
})