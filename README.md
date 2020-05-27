# Crear un formulario nuevo

Para crear un formulario nuevo (front end), hay que entrar a la carpeta Client y generarlo con npm start; esto genera los files en la carpeta public. Estos archivos hay que moverlos a la carpeta del formulario en si (ejemplo, /qeq2018/). El source que hay que editar est� en /client/src/App.js. No te olvides de cambiarle al index.html el nombre a form.html, porque sino por alguna razón el sitio lo toma como la página de index por más que especifiques otra cosa en el routes.js

Consideraciones a tomar en cuenta: El endpoint /setVisto devuelve todos los datos que tiene un formulario espec�fico, pero no los pone automaticamente en el state, salvo que lo settees dato por dato; consecuentemente una vez que obtenes los resultados del setVisto ten�s que asignarlos en el state. 

Otra consideracion a tomar en cuenta es que, al ser din�mica la metadata del mongo, el 'formato' en el que va a estar en la base se define en el front end. Por lo tanto, en el set response, antes de enviar la respuesta, tenés que poner las cosas como las querés en la base, por lo general dos o tres campos van como parte de Persona Fisica, y los demás como campos de persona jurídica.

En la base de datos tenés que agregar la nueva publicación sí o sí, este documento en la colection 'productoedicion' necesita los siguientes datos: publicacion y sitioPublicacion

En el back-end, lo que tenés que cambiar es, en services/mailService.js, agregar el textomail.nombre_que_le_hayas_dado_a_la_publicacion_en_el_back_end. Lo unico que tenés que agregarle a ese JSONObject es el nombre de la publicacion ("publicacion": "Guía de Medio Ambiente 2018", por ejemplo) para que lo ponga de subject en el mail. Después, en templates, agregá un ejs con nombre sitioPublicacion.ejs (el sitio publicacion que asignaste en la base de datos en el paso anterior).

También tenés que editar el routes.js para que el formulario nuevo, en su carpeta nueva, sea público (agregarle su propia ruta al formulario). 

Lo último que tenés que hacer, también en el backend, es en la generación del word (está en el routes, todavía no llegué a refactorizarlo, capaz llegue en el finde) ordenar el formulario como te lo pidan, nunca te olvides de pedirle al encargado de la guía en si que te mande el orden.

Cualquier cosa avísenme!