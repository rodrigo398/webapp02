const publicacionesDao = require("../model/publicaciones_dao");

module.exports.buscarPublicaciones = (callback)=>{
    publicacionesDao.encontrarTodas(callback);
}