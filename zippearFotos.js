/*const path = require('path');
const MongoClient = require('mongodb').MongoClient
const objectID = require('mongodb').ObjectID;
const officegen = require('officegen');
const fs = require('fs');
const archiver = require('archiver');        
        
        let pathZip = __dirname + "/zips/" + "Medio Ambiente 2018" + ".zip";
        let pathCarpeta = __dirname + "/filestest/" + "Medio Ambiente 2018" + "/";
        //let output = fs.createWriteStream(__dirname + '/' + pathZip);
        let output = fs.createWriteStream(pathZip);
        let archive = archiver('zip', { zlib: { level: 9 } });
        output.on('close', () => {
          console.log("ZIPPEADO");
        })
        archive.on('end', function () {
          console.log("ZIPPEADO");
        });
        archive.pipe(output);
        archive.directory(pathCarpeta, false);
        archive.finalize();*/

var fs = require('fs');
var path = require('path');
var process = require('process');
var archiver = require('archiver');

var carpetaArchivos = "./filestest/";
fs.readdir(carpetaArchivos, (err, files) => {
  if (err) {
    process.exit(1);
  }

  files.forEach((file, index) => {
    fs.stat(path.join(carpetaArchivos, file), (error, stat) => {
      if (error) {
        console.log("problema con el archivo");
        return;
      }
      if (stat.isDirectory()) {
        var output = fs.createWriteStream('./zips/' + file + '.zip');
        var archive = archiver('zip');

        output.on('close', () => {
          console.log(archive.pointer() + ' total bytes');
          console.log('archiver has been finalized and the output file descriptor has closed.');
        })

        archive.pipe(output);
        archive.directory(carpetaArchivos + file, false);
        archive.finalize();
      }
    })
  })
})