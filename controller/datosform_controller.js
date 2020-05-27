const datosformDao = require("../model/datosform_dao");

module.exports.primeraInsercion = (request, callback)=>{
    datosformDao.creacionDatosForm(request, callback);
}

module.exports.obtenerEstados = (callback)=>{
    datosformDao.getEstados(callback);
}

module.exports.settearVisto = (request, callback)=>{
    datosformDao.setVisto(request, callback);
}

module.exports.obtenerFormulariosCompletados = (request, callback)=>{
    datosformDao.buscarFormulariosCompletos(request, callback);
}

module.exports.obtenerEmpresasFormulariosCompletados = (request, callback)=>{
    datosformDao.buscarEmpresasFormulariosCompletos(request, (arrayPublicacionesCompletas)=>{
        for (let index = 0; index < arrayPublicacionesCompletas.length; index++) {
            const publicacionCompleta = arrayPublicacionesCompletas[index];
            delete publicacionCompleta.data;
        }
        callback(arrayPublicacionesCompletas);
    });
}

module.exports.pasarCompletadoABorrador = (request, callback)=>{
    datosformDao.pasarABorrador(request, callback);
}

module.exports.desasociarEmpresas = (request, callback)=>{
    datosformDao.desasociacionDatosForm(request, callback);
}