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
            appendearEmpresasCompletadas(publicacionApendeada);
        },
        error: function(){
            console.log("error!");
        }
    })
}

function appendearEmpresasCompletadas(publicacionID){
    var datos = publicacionID;
    console.log("[[[[[[")
    console.log(datos);
    console.log("[[[[[[")
    $("#empresa").empty();
    $.ajax({
        type:"POST",
        data: {"idpublicacion": datos},
        url:"/postListaEmpresasCompletadas",
        success: function(response){
            response.forEach(function(element) {
                $("#empresa").append('<option value=' + element["_id"] + '>' + element.datosEmpresa.nombreEmpresa + '</option>')
            });
        },
        error: function(){
            console.log("error!");
        }
    }) 
}

$(document).ready(function() {
    var publicacionApendeada = "";
    appendearPublicaciones();
    $("#publicacion").on('change', function(){
        appendearEmpresasCompletadas(this.value);
    })
    $("#enviodatos").submit(function(e){
        $('#modalCarga').modal('show'); 
        //en realidad es el id de datosform, no el nombre de la empresa, todo cambiarlo
        var datos = $("[name='nombreEmpresa']").serialize();
        
        $.ajax({
            type:"POST",
            url:"/descompletarDatosForm",
            data: datos,
            success: function(response){
                $('#modalCarga').modal('hide');           
                alert("Desasociacion de datos exitosa!");
            },
            error: function(){
                $('#modalCarga').modal('hide')                
                alert("Error en carga de datos!!");
            }
        })
        
        e.preventDefault();
    })
});