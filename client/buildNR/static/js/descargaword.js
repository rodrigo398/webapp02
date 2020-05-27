$(document).ready(function() {
    appendearPublicaciones();
    $("#enviodatos").submit(function(e){
        var datos = $("#enviodatos").serialize();
        $.ajax({
            type:"POST",
            url:"/generateword",
            data: datos,
            success: function(response){
                console.log(response);
                window.open("/downloadword"); 
            },
            error: function(){
                console.log("error!");
            }
        })
        e.preventDefault();
    })
    $("#zip").click(function(e){
        var datos = $("#enviodatos").serialize();
        $.ajax({
            type:"POST",
            url:"/postZip",
            data: datos,
            success: function(response){
                console.log(response);
                window.open(response.urlZip); 
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