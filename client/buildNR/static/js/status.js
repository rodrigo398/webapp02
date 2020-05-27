$(document).ready(function () {
    var urlBase = window.location;
    $('#example').DataTable({
        "ajax": urlBase.protocol + "//" + urlBase.host + "/getStatus",
		"createdRow": function(row, data, dataIndex){
			console.log(data);
			if( data[3] == 'Visto'){
				$(row).addClass('visto');
			}else if(data[3] == 'Borrador'){
				$(row).addClass('borrador');
			}else if(data[3] == 'Completado'){
				$(row).addClass('completado');
			}else if(data[3] == 'Enviado'){
				$(row).addClass('enviado');
			}
		}
    });
	
	$("td").each(function( index ) {
		if($(this).text().length > 100) {
			$(this).stop().animate({width:"285px"},285);
			var x = $(this).text();
			$(this).text($(this).text().substr(0, 50));
			$( this ).addClass("tool" );
			$( this ).popover({
				content:x,
				placement:"top",
			});
		}	
	});
	
	$("#descargaExcel").click(function () {
        console.log("test");
        $.ajax({
            type: "GET",
            url: urlBase.protocol + "//" + urlBase.host + "/getStatus",
            success: function (data) {
                const rows = data.data;
                rows.unshift(["Empresa", "Rubro", "Subrubro", "Status", "Mail de Contacto", "Publicacion", "Url de Grilla"])
                console.log(rows);
                exportToCsv("excel.csv", data.data);
            }
        })
    })
});

function exportToCsv(filename, rows) {
    var processRow = function (row) {
        var finalVal = '';
        for (var j = 0; j < row.length; j++) {
            var innerValue = row[j] === null ? '' : row[j].toString();
            if (row[j] instanceof Date) {
                innerValue = row[j].toLocaleString();
            };
            var result = innerValue.replace(/"/g, '""');
            if (result.search(/("|,|\n)/g) >= 0)
                result = '"' + result + '"';
            if (j > 0)
                finalVal += ',';
            finalVal += result;
        }
        return finalVal + '\n';
    };

    var csvFile = 'sep=, \n';
    for (var i = 0; i < rows.length; i++) {
        csvFile += processRow(rows[i]);
    }

    var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}
/*
$(document).ready( function () {
  var table = $('#example').dataTable({
    "createdRow": function( row, data, dataIndex ) {
             if ( data[3] == 'Visto' ) {        
         $(row).addClass('vzisto');
     
       }
      

    }
  });
} );
*/