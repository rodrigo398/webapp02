const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');



module.exports.enviarMail = (datosMail, callback)=>{
    var templatesFile = path.join(__dirname, '../templates/' + datosMail.sitio + ".ejs")
    var textomail = {};
    textomail.qeq2018 = {"publicacion": "Quién es Quién 2018!", "texto": "Te invitamos a completar este formulario para el Quién es Quién 2018!"};;
    textomail.formularioempresas = {"publicacion": "Guia de sustentabilidad!", "texto": "Estamos armando la “Guía de Sustentabilidad”, la publicación anual de El Cronista Comercial en la que se convoca a los referentes de sustentabilidad y RSE de las empresas más importantes el país que expongan los detalles de su estrategia. Y quisiéramos invitarlo a participar de la misma. En el siguiente link encontrará el formulario con los campos a completar:"};
    textomail.jovenesprofesionales2018 = {"publicacion": "Jóvenes profesionales 2018!", "texto": "Te invitamos a completar este formulario para la Guía de Jóvenes Profesionales 2018!"};
    textomail.medioambiente2018 = {"publicacion": "Guía de Medio Ambiente 2018", "texto": ""}
    var transporter = nodemailer.createTransport(
    {
        host: 'smtp.office365.com', // Office 365 server
        port: 587,     // secure SMTP
        secure: false, // false for TLS - as a boolean not string - but the default is false so just remove this completely
        auth: {
            user: 'perfilesdb@eccmedios.com.ar',
            pass: 'EOh1Z5MQV3F1A'
        }
    }
    
    /*
    {
        service: 'Gmail',
        auth: {
            user:"soporte@eccmedios.com.ar",
            pass:"soporte2015"
        }
    }
    */
    );
    console.log("en el mail service:");
    console.log(datosMail);
    ejs.renderFile(templatesFile, {businessName: datosMail.nombreEmpresa, textoCorreo: textomail[datosMail.sitio].texto,  tokenLink: "https://perfilesdb.cronista.com/"+ datosMail.sitio +"?id=" + datosMail.objectIDForm},function(err, data){
        console.log(err||data);
        var mailOptions = {
            from: "Maria del Pilar Assefh <formularios@cronista.com>",
            to: datosMail.mailPara,
            replyTo: "Devincenzi Agustina <adevincenzi@cronista.com>",
            subject: textomail[datosMail.sitio].publicacion + " - " + datosMail.nombreEmpresa,
            html: data
        }   
        //            text: "Hola, " + datosMail.nombreEmpresa + " completa este formulario: https://perfilesdb.cronista.com/formularioempresas?id=" + datosMail.objectIDForm 
        transporter.sendMail(mailOptions, (err,msg)=>{
            console.log("en el mail service msg:",msg);
            if(err){
                console.log("en el mail service error:",err);
                callback(err, null);
            }else{
                callback(null, msg);
            };
        })
    })

}