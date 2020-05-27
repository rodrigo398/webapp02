const MongoClient = require('mongodb').MongoClient
const objectID = require('mongodb').ObjectID;
const empresasDao = require("./empresas_dao");
const publicacionesDao = require("./publicaciones_dao");
const mailService = require("../services/mailService");
const stringConexion = process.env.STRINGCONEXION;

var db

MongoClient.connect(stringConexion, (err, database) => {

    db = database;

    module.exports.creacionDatosForm = (request, callback) => {
        publicacionesDao.encontrarUna(new objectID(request.publicacionEmpresa), (err, documentoPubli) => {
            if (documentoPubli) {
                var sitioPublicacion = documentoPubli.sitioPublicacion;
            }

            if (Array.isArray(request.nombreEmpresa)) {
                request.nombreEmpresa.forEach(function (element) {
                    db.collection('datosform').insert({ 'empresaid': new objectID(element), 'publicacionid': new objectID(request.publicacionEmpresa), 'status': 'Enviado', data: {} }, (err, docInserted) => {
                        if (err) {
                            callback(err, null);
                            return;
                        }
                        empresasDao.encontrarUna(new objectID(element), (err, doc) => {
                            var objectIDCreado = docInserted.ops[0]._id;
                            if (doc) {
                                var datosMail = { mailPara: doc.contactoEmpresa, nombreEmpresa: doc.nombreEmpresa, objectIDForm: objectIDCreado, sitio: sitioPublicacion };
                                mailService.enviarMail(datosMail, (callback))
                            }
                        })
                    });
                });
            } else {
                db.collection('datosform').insert({ 'empresaid': new objectID(request.nombreEmpresa), 'publicacionid': new objectID(request.publicacionEmpresa), 'status': 'Enviado', data: {} }, (err, docInserted) => {
                    if (err) {
                        console.log("");
                        callback(err, null);
                        return;
                    }
                    empresasDao.encontrarUna(new objectID(request.nombreEmpresa), (err, doc) => {
                        var objectIDCreado = docInserted.ops[0]._id;
                        if (doc) {
                            var datosMail = { mailPara: doc.contactoEmpresa, nombreEmpresa: doc.nombreEmpresa, objectIDForm: objectIDCreado, sitio: sitioPublicacion };
                            mailService.enviarMail(datosMail, (callback))
                        }
                    })
                });
            }
        })//
    }

    module.exports.getEstados = (callback) => {
        var beautifiedResponse = { data: [] };
        db.collection('datosform').aggregate([{ $lookup: { from: 'empresas', localField: 'empresaid', foreignField: '_id', as: 'datosEmpresa' } }, { $lookup: { from: 'productoedicion', localField: 'publicacionid', foreignField: '_id', as: 'datosPublicacion' } }]).toArray((err, docs) => {
            for (var index = 0; index < docs.length; index++) {
                let data = docs[index]
                console.log(data);
                if (data.datosEmpresa[0] == undefined){
                    console.log("HOLA");
                    console.log(data);
                    console.log("HOLA");
                }
                if (data.datosEmpresa[0].subrubroEmpresa == undefined){
                    data.datosEmpresa[0].subrubroEmpresa = "";
                }
                
                beautifiedResponse.data.push([data.datosEmpresa[0].nombreEmpresa, data.datosEmpresa[0].rubroEmpresa, data.datosEmpresa[0].subrubroEmpresa, data.status, data.datosEmpresa[0].contactoEmpresa, data.datosPublicacion[0].publicacion, "https://perfilesdb.cronista.com/" + data.datosPublicacion[0].sitioPublicacion + "?id=" + data["_id"]]);
                // beautifiedResponse.push({"status":data.status, "nombreEmpresa":data.datosEmpresa[0].nombreEmpresa, "objectIDForm":data._id, "contactoEmpresa": data.datosEmpresa[0].contactoEmpresa} );
            }
            callback(null, beautifiedResponse);
        });
    }

    module.exports.setVisto = (req, callback) => {
        var safeObjectId = req.body.id;
        var idempresa = "";
        safeObjectId = objectID.isValid(req.body.id) ? new objectID(req.body.id) : null;

        db.collection('datosform').aggregate([{ "$match": { "_id": safeObjectId } }, { "$lookup": { from: 'empresas', localField: 'empresaid', foreignField: '_id', as: 'datosEmpresa' } }, { "$lookup": { from: 'productoedicion', localField: 'publicacionid', foreignField: '_id', as: 'datosPublicacion' } }, { $unwind: { path: "$datosEmpresa" } }, { $unwind: { path: "$datosPublicacion" } }]).toArray((err, docs) => {
            if (err){
                callback(err, null);
            } else {
                if (docs.length>0){
                    console.log(docs[0].status);
                    var responseLimitada = { data: docs[0].data, nombreEmpresa: docs[0].datosEmpresa.nombreEmpresa, rubroEmpresa: docs[0].datosEmpresa.rubroEmpresa, publicacion: docs[0].datosPublicacion.publicacion, status: docs[0].status };
                    if (docs[0].status == "Enviado") {
                        db.collection('datosform').updateOne({ "_id": safeObjectId }, { $set: { "status": "Visto" } });
                    }
                    callback(null, responseLimitada);
                }
            }
        })
    }

    module.exports.buscarEmpresasIngresadas = (idPublicacion, callback) => {
        var safeObjectId = objectID.isValid(idPublicacion) ? new objectID(idPublicacion) : null;

        db.collection('datosform').aggregate([{ "$match": { "publicacionid": safeObjectId } }, { "$project": { "empresaid": 1, "_id": 0 } }, { "$lookup": { from: 'empresas', localField: 'empresaid', foreignField: '_id', as: 'datosEmpresa' } }, { $unwind: { path: "$datosEmpresa" } }]).toArray((err, docs) => {
            callback(null, docs);
        })
    }

    module.exports.buscarFormulariosCompletos = (idPublicacion, callback) => {
        db.collection('datosform').aggregate([{ "$match": { "status": "Completado", "publicacionid": new objectID(idPublicacion) } }, { "$lookup": { from: 'empresas', localField: 'empresaid', foreignField: '_id', as: 'datosEmpresa' } }, { "$lookup": { from: 'productoedicion', localField: 'publicacionid', foreignField: '_id', as: 'datosPublicacion' } }, { $unwind: { path: "$datosEmpresa" } }, { $unwind: { path: "$datosPublicacion" } }]).toArray((err, docs) => {
            callback(docs);
        })
    }

    module.exports.buscarEmpresasFormulariosCompletos = (idPublicacion, callback) => {
        db.collection('datosform').aggregate([{ "$match": { "status": "Completado", "publicacionid": new objectID(idPublicacion) } }, { "$lookup": { from: 'empresas', localField: 'empresaid', foreignField: '_id', as: 'datosEmpresa' } }, { "$lookup": { from: 'productoedicion', localField: 'publicacionid', foreignField: '_id', as: 'datosPublicacion' } }, { $unwind: { path: "$datosEmpresa" } }, { $unwind: { path: "$datosPublicacion" } }]).toArray((err, docs) => {
            callback(docs);
        })
    }

    module.exports.desasociacionDatosForm = (request, callback)=>{
        db.collection('datosform').deleteOne({"empresaid": new objectID(request.nombreEmpresa), "publicacionid": new objectID(request.publicacionEmpresa)}, (err,resp)=>{
            if (err){
                callback(err, null);
            };
            callback(null, "success");
        });
    }

    module.exports.pasarABorrador = (idDatosForm, callback)=>{
        db.collection('datosform').updateOne({"_id": new objectID(idDatosForm)}, {$set:{"status":"Borrador"}}, (err, contador, estado)=>{
            if (!err){
                callback(null, "success");
            }
        })
    }
})