$(document).ready(function() {
    var empresas
    $.ajax({
        type:"GET",
        url:"/getEmpresas",
        success: function(data){
            empresas = data
            console.log(empresas);
                $("#nombreEmpresa").typeahead({
                    minLength:2,
                    highlight:true
                },{
                    name:"dataset",
                    source: substringMatcher(empresas)
                })
                }
    })

    
    $("#nombreEmpresa").on('keyup paste change', function(){
        var empresaAComparar = $("#nombreEmpresa").val();
        var data = empresas.filter(function(empresa){
            return empresaAComparar === empresa.nombreEmpresa;
        })
        if (data.length > 0){
            $("#contactoEmpresa").val(data[0].contactoEmpresa);
            $("#rubroEmpresa").val(data[0].rubroEmpresa);
            $("#subrubroEmpresa").val(data[0].subrubroEmpresa);
        }
        console.log(data);
    })

    $("#enviodatos").submit(function(e){
        var datos = $("#enviodatos").serialize();
        console.log(datos);
        $.ajax({
            type:"POST",
            url:"/cargaempresas",
            data: datos,
            success: function(data){
                alert("Carga de datos exitosa!");
                window.location.replace("/home");
            },
            error: function(){
                alert("Error en carga de datos!");
            }
        })
        e.preventDefault();
    })


    var substringMatcher = function (strs){
        return function findMatches(q, cb){
            var matches, substringRegex;

            matches = [];

            substrRegex = new RegExp(q, 'i');

            $.each(strs, function(i, str){
                if(substrRegex.test(str.nombreEmpresa)){
                    matches.push(str.nombreEmpresa);
                }
            });

            cb(matches);
        }
    }
});