const publicacionesempresasManager = require("../model/publicacionempresas_manager.js");

module.exports.getEmpresasFiltradas = (request, callback)=>{
    publicacionesempresasManager.filtrarEmpresasAsignadas(request, callback);    
}

module.exports.getEmpresasSinFiltrar = (request, callback)=>{
    publicacionesempresasManager.obtenerEmpresasAsignadas(request, callback);   
}