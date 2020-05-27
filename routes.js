const path = require('path');
const MongoClient = require('mongodb').MongoClient
const objectID = require('mongodb').ObjectID;
const officegen = require('officegen');
const fs = require('fs');
const archiver = require('archiver');
const empresasController = require("./controller/empresas_controller");
const publicacionesController = require("./controller/publicaciones_controller");
const datosformController = require("./controller/datosform_controller");
const publicacionesempresasController = require("./controller/publicacionesempresas_controller");



const stringConexion = process.env.STRINGCONEXION;

var db

module.exports = function (app, passport) {



  app.get('/', function (req, res) {
    res.render('index.ejs'); // load the index.ejs file
  });

  // =====================================
  // LOGIN ===============================
  // =====================================
  // show the login form
  app.get('/login', function (req, res) {

    // render the page and pass in any flash data if it exists
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  app.post('/PRUEBA', passport.authenticate('local-login', {
    successRedirect: '/home', // redirect to the secure profile section
    failureRedirect: '/', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));



  app.get('/getEmpresas', (req, res) => {
    empresasController.buscarEmpresas((results) => {
      res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' });
      res.write(JSON.stringify(results));
      res.send();
    })
  });

  app.post("/postFormulariosCompletados", (req, res) => {
    console.log(req.body);
    datosformController.obtenerFormulariosCompletados(req.body.publicacionEmpresa, (results) => {
      res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' });
      res.write(JSON.stringify(results));
      res.send();
    })
  })

  app.post('/getEmpresasNoPublicadas', (req, res) => {
    console.log(req.body);
    publicacionesempresasController.getEmpresasFiltradas(req.body.idpublicacion, (err, results) => {
      res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' });
      res.write(JSON.stringify(results));
      res.send();
    })
  })

  app.post('/getEmpresasPublicadas', (req, res) => {
    publicacionesempresasController.getEmpresasSinFiltrar(req.body.idpublicacion, (err,results)=>{
      res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' });
      res.write(JSON.stringify(results));
      res.send();
    })
  })

  app.post("/postListaEmpresasCompletadas", (req, res) => {
    console.log(req.body);
    datosformController.obtenerEmpresasFormulariosCompletados(req.body.idpublicacion, (results) => {
      res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' });
      res.write(JSON.stringify(results));
      res.send();
    })
  })

  app.post("/descompletarDatosForm", (req, res) => {
    let idDatosForm = req.body.nombreEmpresa;
    datosformController.pasarCompletadoABorrador(idDatosForm, (results) => {
      res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' });
      res.write(JSON.stringify(results));
      res.send();
    })
  })

  app.post('/cargaempresas', (req, res) => {
    empresasController.agregarEmpresa(req.body, (err, results) => {
      if (err) {
        res.status(503).send("ERROR, empresa duplicada");
      } else {
        res.send(200, "working!");
      }
    })
  });

  app.get('/getPublicaciones', (req, res) => {
    publicacionesController.buscarPublicaciones((results) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify(results));
      res.send();
    })
  });

  app.post('/setVisto', (req, res) => {
    datosformController.settearVisto(req, (err, responseLimitada) => {
      if (err){
        res.writeHead(500);
        res.send();
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(responseLimitada));
        res.send();
      }
    })
  })

  app.get('/getStatus', (req, res) => {
    datosformController.obtenerEstados((err, beautifiedResponse) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify(beautifiedResponse));
      res.send();
    })
  })

  app.post('/postZip', (req, res) => {
    var objectPublicacion = new objectID(req.body.publicacionEmpresa);
    MongoClient.connect(stringConexion, (err, database) => {
      if (err) console.log("Error!");
      console.log("EMPEZO LA GENERACIÓN DE ZIP");
      db = database;
      db.collection('productoedicion').find({ "_id": objectPublicacion }).next((err, doc) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        let urlZip = { "urlZip": "/zips/" + doc.publicacion + ".zip" };
        res.write(JSON.stringify(urlZip));
        res.send();
        /*
        let pathZip = __dirname + "/zips/" + doc.publicacion + ".zip";
        let pathCarpeta = __dirname + "/filestest/" + doc.publicacion + "/";
        //let output = fs.createWriteStream(__dirname + '/' + pathZip);
        let output = fs.createWriteStream(pathZip);
        let archive = archiver('zip', { zlib: { level: 9 } });
        output.on('close', () => {
          console.log(archive.pointer());
        })
        archive.on('end', function () {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          let urlZip = { "urlZip": "/zips/" + doc.publicacion + ".zip" };
          res.write(JSON.stringify(urlZip));
          res.send();
        });
        archive.pipe(output);
        archive.directory(pathCarpeta, false);
        archive.finalize();
        */
      })
    })
  })

  app.post('/primeraInsercionDatos', (req, res) => {
    var request = req.body;
    datosformController.primeraInsercion(request, (err, results) => {
      if (!err) {
        res.writeHead(200);
        res.send();
      } else {
        console.log(err);
        res.writeHead(503);
        res.send();
      }
    })
  })

  app.post('/desasociacionDatos', (req, res) => {
    var request = req.body;
    datosformController.desasociarEmpresas(request, (err, results) => {
      if (!err) {
        res.writeHead(200);
        res.send();
      } else {
        console.log(err);
        res.writeHead(503);
        res.send();
      }
    })
  })

  app.post('/cambioNombreEmpresa', (req, res) => {
    var request = req.body;
    empresasController.cambiarNombre(request, (err, results)=>{
      if (!err){
        res.writeHead(200);
        res.send();
      } else {
        res.writeHead(503);
        res.send();
      }
    })
  })

  app.post('/upload', (req, res) => {
    var fromwhere = req.headers.referer;
    fromwhere = fromwhere.substring(fromwhere.indexOf('/', 8), fromwhere.lastIndexOf('?'));
    if (fromwhere == "/formularioempresas") {
      var personafisica = { nombre: req.body.nombre };
      var personajuridica = { empresa: req.body.empresa };
      if ((req.files != null) && (req.files.logoToBeSent != null)) {
        req.files.logo = req.files.logoToBeSent;
      } else if ((req.files != null)) {
        req.files.logo = undefined;
      }
    } else {
      var personafisica = JSON.parse(req.body["persona fisica"]);
      var personajuridica = JSON.parse(req.body["persona juridica"]);
    }
    MongoClient.connect(stringConexion)
      .then((database) => {
        db = database;
        var pathArchivo;
        var pathArchivoLogo;
        var regexFormato = /(?:\.([^.]+))?$/;
        console.log(req.files);
        console.log(req);
        if ((req.files != null)) {
          if (req.files.imagen != undefined) {
            let archivo = req.files.imagen;
            var formatoImagen = regexFormato.exec(archivo.name)[1];
            db.collection('datosform').aggregate([{ "$match": { "_id": new objectID(req.body.id) } }, { "$lookup": { from: "productoedicion", localField: "publicacionid", foreignField: "_id", as: "infoPublicacion" } }]).toArray((err, doc) => {
              var nombrePublicacion = doc[0].infoPublicacion[0].publicacion;
              var folderPublicacion = __dirname + '/filestest/' + nombrePublicacion + '/';
              if (!fs.existsSync(folderPublicacion)) {
                fs.mkdirSync(folderPublicacion);
              }
              pathArchivo = folderPublicacion + personajuridica.empresa + personafisica.nombre + "." + formatoImagen;
              // Use the mv() method to place the file somewhere on your server 
              archivo.mv(pathArchivo, function (err) {
                if (err) {
                  console.log(err);
                  return res.status(500).send(err);
                }
              });
            })
          }

          if ((req.files.logo != undefined)) {
            let archivoLogo = req.files.logo;
            let formatoImagenLogo = regexFormato.exec(archivoLogo.name)[1];
            db.collection('datosform').aggregate([{ "$match": { "_id": new objectID(req.body.id) } }, { "$lookup": { from: "productoedicion", localField: "publicacionid", foreignField: "_id", as: "infoPublicacion" } }]).toArray((err, doc) => {
              var nombrePublicacion = doc[0].infoPublicacion[0].publicacion;
              var folderPublicacion = __dirname + '/filestest/' + nombrePublicacion + '/';
              if (!fs.existsSync(folderPublicacion)) {
                fs.mkdirSync(folderPublicacion);
              }
              pathArchivoLogo = folderPublicacion + personajuridica.empresa + "Logo" + "." + formatoImagenLogo;
              archivoLogo.mv(pathArchivoLogo, function (err) {
                if (err) {
                  console.log(err);
                  return res.status(500).send(err);
                }
              });
            })
          }
        }

        MongoClient.connect(stringConexion, (err, database) => {
          if (err) console.log(err);
          db = database;
          console.log("***********");
          console.log(pathArchivo);
          if (pathArchivo == undefined) {
            pathArchivo = "";
          }
          var safeObjectId = req.body.id;
          var idempresa = "";
          safeObjectId = objectID.isValid(req.body.id) ? new objectID(req.body.id) : null;

          db.collection('datosform').find({ "_id": safeObjectId }).toArray((err, docs) => {
            if (docs.length > 0){
              let statusDocumento = docs[0].status;
              console.log();
              if (docs[0].publicacionid == "5a4bd8cde620015e0b6fe84d") {
                if ((fromwhere == "/formularioempresasadmin") || (statusDocumento != "Completado")) {
                  db.collection('datosform').updateOne({ "_id": safeObjectId }, { $set: { "status": req.body.status, data: { "persona fisica": { "nombre": req.body.nombre, "cargo": req.body.cargo, "foto": pathArchivo }, "persona juridica": { "rubro": req.body.rubro, "fotologo": pathArchivoLogo, "teléfono": req.body.telefono, "mail": req.body.mail, "facturación 2017": req.body.facturacion, "facturación proyectada 2018": req.body.facturacionproyectada, "inversiones proyectadas": req.body.inversionesproyectadas, "reporte de sustentabilidad": req.body.reportesustentabilidad, "certificaciones": req.body.certificaciones, "políticas de ahorro": req.body.politicasdeahorro, "trazabilidad de insumos": req.body.trazabilidad, "políticas de residuos": req.body.politicasresiduos, "facebook": req.body.facebook, "twitter": req.body.twitter, "instagram": req.body.instagram, "linkedin": req.body.linkedin, "otra red social": req.body.otrared } } } });
                  res.writeHead(200, "Datos Actualizados!")
                  res.send();
                  console.log("entro en el if");
                } else {

                  console.log("entro en el else");
                  res.writeHead(403, "El formulario ya fue completado!");
                  res.send();
                }
              } else {
                if ((fromwhere == "/formularioempresasadmin") || (statusDocumento != "Completado")) {
                  personafisica.foto = pathArchivo;
                  db.collection('datosform').updateOne({ "_id": safeObjectId }, { $set: { "status": req.body.status, data: { "persona fisica": personafisica, "persona juridica": personajuridica } } });
                  res.writeHead(200, "Datos Actualizados!")
                  res.send();
                  console.log("entro en el if");
                } else {

                  console.log("entro en el else");
                  res.writeHead(403, "El formulario ya fue completado!");
                  res.send();
                }
              }
            } else {
              res.writeHead(500),
              res.send();
            }
          })

          /*
          db.collection('empresas').save({"_id":safeObjectId}, (err, result)=>{
            if (err) return console.log(err)
            idempresa = result.ops[0]._id;
            console.log("tamaño del cursor:");
            console.log(db.collection('empresas').find({"empresa":"test"}));
            var safeObjectEmpresa = idempresa;
            safeObjectEmpresa = objectID.isValid(safeObjectEmpresa) ? new objectID(safeObjectEmpresa) : null;
          //ahora tendria que crear la coleccion datos de form, con dos jsons, persona fisica y juridica y los datos del form.
            db.collection('datosform').save({"persona fisica":{"nombre":req.body.nombre, "cargo":req.body.cargo,"foto":pathArchivo}, "persona juridica":{"rubro":req.body.rubro, "direccion":req.body.direccion, "telefono":req.body.telefono, "empleados": req.body.empleados, "facturacion": req.body.facturacion, "unidades de negocio":req.body.unidadesNegocio, "inversiones proyectadas":req.body.inversionesproyectadas}, "empresaid":safeObjectEmpresa} );  
          })
          */
        })
      })


  })



  app.post('/generateword', (req, res) => {
    var out = fs.createWriteStream("perfiles.docx");

    var docTest = officegen('docx');

    var objectPublicacion = new objectID(req.body.publicacionEmpresa);


    MongoClient.connect(stringConexion, (err, database) => {
      if (err) console.log(err);
      db = database;
      let anterior = "";
      let anteriorSubrubro = "";
      console.log(objectPublicacion);
      db.collection('datosform').aggregate([{ $match: { publicacionid: objectPublicacion } }, { $lookup: { from: 'empresas', localField: 'empresaid', foreignField: '_id', as: 'infoEmpresa' } }, { $unwind: { path: "$infoEmpresa" } }, { $sort: { "infoEmpresa.rubroEmpresa": 1 } }]).toArray((err, docs) => {
        if (objectPublicacion == "5a4bd8cde620015e0b6fe84d") { //sustentabilidad
          docs.sort(function (primero, segundo) {
            if (primero.infoEmpresa.nombreEmpresa < segundo.infoEmpresa.nombreEmpresa) return -1
            else return 1;
          })
        }
        if (objectPublicacion == "5a5656af8eaad2325c301761") { //QeQ, CAMBIAR EN PRODU
          docs.sort((primero, segundo) => {
            primero.infoEmpresa.subrubroEmpresa = (primero.infoEmpresa.subrubroEmpresa == undefined) ? "" : primero.infoEmpresa.subrubroEmpresa;
            segundo.infoEmpresa.subrubroEmpresa = (segundo.infoEmpresa.subrubroEmpresa == undefined) ? "" : segundo.infoEmpresa.subrubroEmpresa;
            if (primero.infoEmpresa.rubroEmpresa.toUpperCase() < segundo.infoEmpresa.rubroEmpresa.toUpperCase()) { //rubro
              return -1;
            } else if (primero.infoEmpresa.rubroEmpresa.toUpperCase() > segundo.infoEmpresa.rubroEmpresa.toUpperCase()) {
              return 1;
            } else if (primero.infoEmpresa.subrubroEmpresa.toUpperCase() < segundo.infoEmpresa.subrubroEmpresa.toUpperCase()) {
              return -1;
            } else if (primero.infoEmpresa.subrubroEmpresa.toUpperCase() > segundo.infoEmpresa.subrubroEmpresa.toUpperCase()) {
              return 1;
            } else if (primero.infoEmpresa.nombreEmpresa.toUpperCase() < segundo.infoEmpresa.nombreEmpresa.toUpperCase()) {
              return -1;
            } else if (primero.infoEmpresa.nombreEmpresa.toUpperCase() > segundo.infoEmpresa.nombreEmpresa.toUpperCase()) {
              return 1;
            }
          })
        }
        if ((objectPublicacion == "5afb332d0c950d91992a1216") || (objectPublicacion == "5b2928b60c950d919936063b")){ //Jovenes profesionales
          docs.sort(function(primero, segundo){
            if (primero.infoEmpresa.nombreEmpresa < segundo.infoEmpresa.nombreEmpresa) return -1
            else return 1;
          })
        }
        for (var index = 0; index < docs.length; index++) {
          var element = docs[index];
          if (element.status == "Completado") {
            let parrafo = docTest.createP();
            parrafo.addLineBreak();
            var rubroActual = (element.infoEmpresa.rubroEmpresa != undefined) ? element.infoEmpresa.rubroEmpresa : "";
            anterior = (anterior != undefined) ? anterior : "";
            if ((anterior.toUpperCase() != rubroActual.toUpperCase()) && !(objectPublicacion == "5a4bd8cde620015e0b6fe84d") && !(objectPublicacion == "5afb332d0c950d91992a1216") && !(objectPublicacion == "5b2928b60c950d919936063b")) {
              parrafo.addText(element.infoEmpresa.rubroEmpresa, { bold: true, underline: true });
              parrafo.addLineBreak();
            } else {
              parrafo.addLineBreak();
            }
            var subrubroActual = (element.infoEmpresa.subrubroEmpresa != undefined) ? element.infoEmpresa.subrubroEmpresa : "";
            console.log(subrubroActual);
            anteriorSubrubro = (anteriorSubrubro != undefined) ? anteriorSubrubro : "";
            if ((objectPublicacion == "5a5656af8eaad2325c301761") && (anteriorSubrubro.toUpperCase() != subrubroActual.toUpperCase())) {
              parrafo.addText(element.infoEmpresa.subrubroEmpresa, { bold: true });
              parrafo.addLineBreak();
              anteriorSubrubro = element.infoEmpresa.subrubroEmpresa;
            }
            console.log("****")
            console.log(element.infoEmpresa.subrubroEmpresa);
            console.log("****")
            parrafo.addLineBreak();
            parrafo.addText(element.infoEmpresa.nombreEmpresa, { back: 'FFFF00' });
            if (!(objectPublicacion == "5afb332d0c950d91992a1216")){
              parrafo.addLineBreak();
              parrafo.addText(element.data["persona fisica"].nombre);
              parrafo.addLineBreak();
              parrafo.addText(element.data["persona fisica"].cargo);
              if (objectPublicacion == "5b2928b60c950d919936063b"){
                parrafo.addLineBreak();
                parrafo.addText(element.data["persona fisica"].contacto)
                parrafo.addLineBreak();
              }
            }
            parrafo.addLineBreak();
            parrafo.addLineBreak();
            parrafo.addText(element.infoEmpresa.nombreEmpresa, { back: 'FFFF00' });
            parrafo.addLineBreak();

            if (objectPublicacion == "5a4bd8cde620015e0b6fe84d") {
              //se ordena según fue pedido por M.P
              var k = JSON.parse(JSON.stringify(element.data["persona juridica"], ["rubro", "teléfono", "mail", "facebook", "twitter", "instagram", "linkedin", "otra red social", "facturación 2017", "facturación proyectada 2018", "reporte de sustentabilidad", "certificaciones", "políticas de ahorro", "trazabilidad de insumos", "políticas de residuos"], 4));
              element.data["persona juridica"] = k;
            }

            if (objectPublicacion == "5a5656af8eaad2325c301761") {
              //se ordena según fue pedido por M.P
              var jsonOrdenado = JSON.parse(JSON.stringify(element.data["persona juridica"], ["rubro", "dirección", "teléfono", "web", "twitter", "facebook", "facturacion", "facturacion2018", "inversiones2018", "empleados", "propietarios"], 4));
              jsonOrdenado["responsables"] = element.data["persona juridica"]["responsables"];
              element.data["persona juridica"] = jsonOrdenado;

            }

            if (objectPublicacion == "5b2928b60c950d919936063b"){
              let ordenado = JSON.parse(JSON.stringify(element.data["persona juridica"], ["cantidadEmpleados", "facturacion2017", "facturacionp2018", "inversion2017", "inversionp2018", "huellasDeCarbono", "metasReduccionEmisiones", "externalidadesNegativasDeOperaciones", "principalProgramaCambioClimatico"], 4));
              element.data["persona juridica"] = ordenado;
            }

            for (var key in element.data["persona juridica"]) {
              if ((element.data["persona juridica"].hasOwnProperty(key)) && (key != "fotologo") && (key != "logoToBeSent") && (key != "empresa") && (key != "id") && (key != "modalImagenesIsOpen") && (key != "modalRejectedImagesIsOpen")) {
                var elementopersonajuridica = element.data["persona juridica"][key];
                if ((elementopersonajuridica != null) && (elementopersonajuridica != "") && (key != "responsables")) {
                  key = (key == "facturacion") ? "facturación 2017" : key;
                  key = (key == "facturacion2018") ? "facturación (p) 2018" : key;
                  key = (key == "inversiones2018") ? "inveresiones 2018" : key;
                  key = (key == "propietarios") ? "propietarios y principales accionistas" : key;
                  parrafo.addText(key.charAt(0).toUpperCase() + key.slice(1) + ": " + elementopersonajuridica);
                  parrafo.addLineBreak();
                }
                if (key == "responsables") {
                  if (element.data["persona juridica"][key] != undefined) {
                    for (let index = 0; index < element.data["persona juridica"][key].length; index++) {
                      const responsable = element.data["persona juridica"][key][index];
                      parrafo.addText(responsable.cargoResponsable + ": " + responsable.nombreResponsable);
                      parrafo.addLineBreak();
                    }
                  }
                }
              }
            }

            anterior = element.infoEmpresa.rubroEmpresa;


          }
        }
        docTest.on('finalize', (written) => {
          console.log("test1");

        })
        docTest.generate(res);
        docTest.generate(out);
        out.on("close", () => {
          console.log("generado!");
        })
        res.writeHead(200, {
          "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          'Content-disposition': 'attachment; filename=doctest.docx'
        });
      })
    })
  })

  // The "catchall" handler: for any request that doesn't
  // match one above, send back React's index.html file.

  app.get('/home', isLoggedIn, (req, res) => {
    res.render('home.ejs');
  })

  app.get('/empresas', isLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname + '/client/buildNR/empresas.html'));
  });

  app.get('/empresaspublicaciones', isLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname + '/client/buildNR/empresaspublicaciones.html'));
  })

  app.get('/desasociar', isLoggedIn, (req,res)=>{
    res.sendFile(path.join(__dirname + '/client/buildNR/desasociar.html'));
  })

  app.get('/editarnombre', isLoggedIn, (req,res)=>{
    res.sendFile(path.join(__dirname + '/client/buildNR/editarnombre.html'));
  })

  app.get('/pasarborrador', isLoggedIn, (req,res)=>{
    res.sendFile(path.join(__dirname + '/client/buildNR/pasarborrador.html'));
  })

  app.get('/status', isLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname + '/client/buildNR/status.html'));
  })

  app.get('/descargaword', isLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname + '/client/buildNR/descargaword.html'));
  })

  app.get('/downloadword', isLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname + '/perfiles.docx'));
  })

  app.get('/formularioscompletos', isLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname + '/client/buildNR/formularioscompletos.html'));
  })

  app.get('/qeq2018', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/qeq2018/form.html'));
  });

  app.get('/jovenesprofesionales2018', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/jovenesprofesionales2018/form.html'));
  });

  app.get('/medioambiente2018', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/medioambiente2018/form.html'));
  });

  app.get('/formularioempresas', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/sustentabilidad2018/form.html'));
  });

  app.get('/gracias', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/buildNR/gracias.html'));
  })


  app.get('/graciasQeQ18', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/buildNR/graciasQeQ18.html'));
  })

  app.get('/formularioempresasadmin', isLoggedIn, (req, res) => {
    res.sendfile(path.join(__dirname + '/client/buildNR/formadmin.html'));
  })

}

function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}

