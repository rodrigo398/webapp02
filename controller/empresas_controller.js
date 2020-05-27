const empresasDao = require("../model/empresas_dao");

module.exports.buscarEmpresas = (callback)=>{
    empresasDao.encontrarTodas(callback);
}

module.exports.agregarEmpresa = (body, callback)=>{
    empresasDao.agregarEmpresa(body, callback);
}

module.exports.cambiarNombre = (body, callback)=>{
    empresasDao.cambiarNombre(body, callback);
}