const empresasDao = require("./empresas_dao");
const datosformDao = require("./datosform_dao");

module.exports.filtrarEmpresasAsignadas = (idPublicacion, callback)=>{
    var arrayEmpresasAsignadas = datosformDao.buscarEmpresasIngresadas(idPublicacion, (err, docs)=>{
        let arrayEmpresasAsignadas = docs;
        empresasDao.encontrarTodas((docs)=>{
            let arrayTotalEmpresas = docs;
            let idsArrayEmpresasAsignadas = [];
            for (var index = 0; index < arrayEmpresasAsignadas.length; index++) {
                var element = arrayEmpresasAsignadas[index];
                idsArrayEmpresasAsignadas.push(element.empresaid.toString());
            }
            var arrayEmpresasFiltrado = arrayTotalEmpresas.filter((empresa)=>{
                return idsArrayEmpresasAsignadas.indexOf(empresa._id.toString()) < 0;
            })
            console.log(arrayEmpresasFiltrado);
            callback(null, arrayEmpresasFiltrado);
        })
    });
}

module.exports.obtenerEmpresasAsignadas = (idPublicacion, callback)=>{
    let arrayEmpresasAsignadas = datosformDao.buscarEmpresasIngresadas(idPublicacion, (err,docs)=>{
        let arrayEmpresasAsignadas = docs;
        empresasDao.encontrarTodas((docs)=>{
            let arrayTotalEmpresas = docs;
            let idsArrayEmpresasAsignadas = [];
            for (var index = 0; index < arrayEmpresasAsignadas.length; index++) {
                var element = arrayEmpresasAsignadas[index];
                idsArrayEmpresasAsignadas.push(element.empresaid.toString());
            }
            var arrayEmpresasFiltrado = arrayTotalEmpresas.filter((empresa)=>{
                return idsArrayEmpresasAsignadas.indexOf(empresa._id.toString()) > 0;
            })
            console.log(arrayEmpresasFiltrado);
            callback(null, arrayEmpresasFiltrado);
        })
    })
}