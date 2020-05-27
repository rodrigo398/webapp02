const appendear = function appendearEmpresas(){
    var selectEmpresasCargadas = $("#empresaOriginal");
    $.ajax({
        type:"GET",
        url:"/getEmpresas",
        success: function(response){
            for (var index = 0; index < response.length; index++) {
                var element = response[index];
                selectEmpresasCargadas.append('<option value=' + element["_id"] + '>' + element["nombreEmpresa"] + '</option>')                
            }
        },
        error: function(){
            console.log("error!");
        }
    })
}
$(document).ready(function() {

    $("#enviodatos").submit(function(e){
        $('#modalCarga').modal('show'); 
        var datos = $("#enviodatos").serialize();
        
        $.ajax({
            type:"POST",
            url:"/cambioNombreEmpresa",
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


    appendear();
});
