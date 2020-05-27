$(document).ready(function() {
    appendearPublicaciones();
    $("#enviodatos").submit(function(e){
        var datos = $("#enviodatos").serialize();
        var urlBase = window.location;        
        $.ajax({
            type:"POST",
            url:"/postFormulariosCompletados",
            data: datos,
            success: function(response){
                var datosGrilla = []; 
                console.log(response);
                for (var index = 0; index < response.length; index++) {
                    var element = response[index];
                    var keysParaColumnas = [];
                    var arrayDataPersonaJuridica = [];
                    keysParaColumnas.push({"title":"Empresa"});
                    keysParaColumnas.push({"title":"Rubro"});
                    keysParaColumnas.push({"title":"Maximo responsable"});
                    var datosPersonaJuridica = element.data["persona juridica"];
                    for (var key in datosPersonaJuridica){
                        if (datosPersonaJuridica.hasOwnProperty(key)){
                            keysParaColumnas.push({"title":key});
                            arrayDataPersonaJuridica.push(datosPersonaJuridica[key]);
                            console.log(datosPersonaJuridica[key]);
                        }
                    }
                    keysParaColumnas.push({title: "imagen Representante"});
                    keysParaColumnas.push({title: "Edición de datos"});
                    var pathFoto = element.data["persona fisica"].foto.substr(element.data["persona fisica"].foto.indexOf("/", element.data["persona fisica"].foto.indexOf("/") + 1));
                    pathFoto = urlBase.protocol + "//" + urlBase.host + "/images/" + pathFoto;
                    var pathEditar =  urlBase.protocol + "//" + urlBase.host + "/formularioempresasadmin?id=" + element["_id"];
                    var arrayDatosPrevio = [element.datosEmpresa.nombreEmpresa, element.datosEmpresa.rubroEmpresa, element.data["persona fisica"].nombre]
                    var arrayParaDatosConcat = arrayDatosPrevio.concat(arrayDataPersonaJuridica);
                    var arrayDatosPost = ["<img src='" + pathFoto+"' style='height:30px; width:30px'>", "<a href='" + pathEditar +"'/>Editar</a>"];
                    arrayParaDatosConcat = arrayParaDatosConcat.concat(arrayDatosPost);
                    datosGrilla.push(arrayParaDatosConcat);
                    //datosGrilla.push([element.datosEmpresa.nombreEmpresa, element.datosEmpresa.rubroEmpresa, element.data["persona fisica"].nombre,element.data["persona juridica"].empleados, element.data["persona juridica"].facturacion, element.data["persona juridica"]["inversiones proyectadas"],element.data["persona juridica"]["expectativas y proyectos"],element.data["persona juridica"]["principales obstaculos"],element.data["persona juridica"]["inversiones proyectadas"], "<img src='" + pathFoto+"' style='height:30px; width:30px'>", "<a href='" + pathEditar +"'/>Editar</a>"])
                }
                console.log(datosGrilla);
                $('#datosForm').DataTable({
                    "data": datosGrilla,
                    columns: keysParaColumnas
                });
            },
            error: function(){
                console.log("error!");
            }
        })
        e.preventDefault();
    })
});


function appendearPublicaciones(){
    $.ajax({
        type:"GET",
        url:"/getPublicaciones",
        success: function(response){
            response.forEach(function(element) {
                $("#publicacion").append('<option value=' + element["_id"] + '>' + element["publicacion"] + '</option>')
            });
        },
        error: function(){
            console.log("error!");
        }
        }) 
}