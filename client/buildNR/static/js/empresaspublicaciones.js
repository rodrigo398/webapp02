$(document).ready(function() {
    var publicacionApendeada = "";
    appendearPublicaciones();
    $("#publicacion").on('change', function(){
        appendearEmpresasFiltr(this.value);
    })
    $("#enviodatos").submit(function(e){
        $('#modalCarga').modal('show')        
        var datos = $("#enviodatos").serialize();
        $.ajax({
            type:"POST",
            url:"/primeraInsercionDatos",
            data: datos,
            success: function(response){
                $('#modalCarga').modal('hide')                
                alert("Carga de datos exitosa!");
            },
            error: function(){
                $('#modalCarga').modal('hide')                
                alert("Error en carga de datos!!");
            }
        })
        e.preventDefault();
    })
});
function appendearEmpresasFiltr(publicacionID){
    var datos = publicacionID;
    console.log("[[[[[[")
    console.log(datos);
    console.log("[[[[[[")
    $("#empresa").empty();
    $.ajax({
        type:"POST",
        data: {"idpublicacion": datos},
        url:"/getEmpresasNoPublicadas",
        success: function(response){
            response.forEach(function(element) {
                $("#empresa").append('<option value=' + element["_id"] + '>' + element["nombreEmpresa"] + '</option>')
            });
        },
        error: function(){
            console.log("error!");
        }
    }) 
}
function appendearEmpresas(){
    $.ajax({
        type:"GET",
        url:"/getEmpresas",
        success: function(response){
            response.forEach(function(element) {
                $("#empresa").append('<option value=' + element["_id"] + '>' + element["nombreEmpresa"] + '</option>')
            });
        },
        error: function(){
            console.log("error!");
        }
        }) 
}

function appendearPublicaciones(){
    var selectPublicaciones = $("#publicacion");
    $.ajax({
        type:"GET",
        url:"/getPublicaciones",
        success: function(response){
            for (var index = 0; index < response.length; index++) {
                var element = response[index];
                if (index === 0){
                    publicacionApendeada = element["_id"];
                }
                selectPublicaciones.append('<option value=' + element["_id"] + '>' + element["publicacion"] + '</option>')                
            }
            appendearEmpresasFiltr(publicacionApendeada);
        },
        error: function(){
            console.log("error!");
        }
    })
}