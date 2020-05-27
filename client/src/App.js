import React from 'react'
import './bootstrap.min.css'
import './styles.css'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Form, Field } from 'simple-react-form'
import ArrayComponent from 'simple-react-form-material-ui/lib/array'
import Text from 'simple-react-form-material-ui/lib/text'
import File from 'simple-react-form-material-ui/lib/file/'
import Toggle from 'simple-react-form-material-ui/lib/toggle'
import Textarea from 'simple-react-form-material-ui/lib/textarea'
import DatePicker from 'simple-react-form-material-ui/lib/date-picker'
import MultipleCheckbox from 'simple-react-form-material-ui/lib/multiple-checkbox'
import RaisedButton from 'material-ui/RaisedButton'
import Dropzone from 'react-dropzone'
import Modal from 'react-modal'
import Loader from 'react-loader-advanced'


var request = require('superagent');
const queryString = require('query-string');

const spinner = <span><img style={{ display: 'block', margin: 'auto', width: '6%', position: 'fixed', top: '50%', left: '50%', marginLeft: '-3%', marginTop: '-3%' }} src="/images/spinner.gif"></img></span>;

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

class Comp1 extends React.Component {
  constructor(props) {
    super(props);
    this.handleLoad = this.handleLoad.bind(this);
  }


}

class PostsCreate extends React.Component {


  constructor(props) {
    super(props)
    this.handleLoad = this.handleLoad.bind(this);

    this.state = {
      filesToBeSent: [],
      logoToBeSent: [],
      empresa: "test",
      id: queryString.parse(window.location.search).id,
      modalIsOpen: false,
      modalCaracteresIsOpen: false,
      modalImagenesIsOpen: false,
      modalRejectedImagesIsOpen: false,
      loading: false
    }
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openModalCaracteres = this.openModalCaracteres.bind(this);
    this.closeModalCaracteres = this.closeModalCaracteres.bind(this);
    this.openModalImagenes = this.openModalImagenes.bind(this);
    this.closeModalImagenes = this.closeModalImagenes.bind(this);
    this.openModalRejectedImages = this.openModalRejectedImages.bind(this);
    this.closeModalRejectedImages = this.closeModalRejectedImages.bind(this);

  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  openModalCaracteres() {
    this.setState({ modalCaracteresIsOpen: true });
    console.log(this.state);
  }

  closeModalCaracteres() {
    this.setState({ modalCaracteresIsOpen: false });
  }

  openModalImagenes() {
    this.setState({ modalImagenesIsOpen: true });
  }

  closeModalImagenes() {
    this.setState({ modalImagenesIsOpen: false });
  }

  openModalRejectedImages() {
    this.setState({ modalRejectedImagesIsOpen: true });
  }

  closeModalRejectedImages() {
    this.setState({ modalRejectedImagesIsOpen: false });
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  componentDidMount() {
    this.handleLoad = this.handleLoad.bind(this);
    window.addEventListener('load', this.handleLoad);
  }

  handleLoad() {
    var _this = this;
    var req = request.post('/setVisto');
    req.field("id", queryString.parse(window.location.search).id);
    req.end(function (err, res) {
      if (err) {
        console.log("error ocurred");
      }
      var respuesta = JSON.parse(res.text);
      console.log(respuesta);
      if (respuesta.nombreEmpresa !== undefined && respuesta.rubroEmpresa !== undefined && (respuesta.data === undefined || (respuesta.data["persona fisica"] === undefined && (respuesta.data["persona juridica"] === undefined)))) {
        _this.setState({
          empresa: respuesta.nombreEmpresa,
          status: respuesta.status
        })
      } else if (respuesta.data !== undefined) {
        if (respuesta.data["persona juridica"] !== undefined) {
          _this.setState({
            empresa: respuesta.nombreEmpresa,
            nombre: respuesta.data["persona fisica"].nombre,
            cargo: respuesta.data["persona fisica"].cargo,
            contacto: respuesta.data["persona fisica"].contacto,
            cantidadEmpleados: respuesta.data["persona juridica"].cantidadEmpleados,
            facturacion2017: respuesta.data["persona juridica"].facturacion2017,
            facturacionp2018: respuesta.data["persona juridica"].facturacionp2018,
            inversion2017: respuesta.data["persona juridica"].inversion2017,
            inversionp2018: respuesta.data["persona juridica"].inversionp2018,
            huellasDeCarbono: respuesta.data["persona juridica"].huellasDeCarbono,
            metasReduccionEmisiones: respuesta.data["persona juridica"].metasReduccionEmisiones,
            externalidadesNegativasDeOperaciones: respuesta.data["persona juridica"].externalidadesNegativasDeOperaciones,
            principalProgramaCambioClimatico: respuesta.data["persona juridica"].principalProgramaCambioClimatico,
            status: respuesta.status
          })
        }
      }
      console.log(_this.state);
      if (_this.state.status == "Completado") {
        window.location.replace(window.location.origin + "/gracias");
        _this.setState({ modalIsOpen: true });
      }
    });
  }

  handleClick(event) {
    var self = this;
    var botonApretado = event.currentTarget.id;
    console.log("******");
    console.log(event.currentTarget.id);
    console.log("******");
    this.setState({ loading: true });
    if ((this.state.nombre && this.state.cargo)) {
      if ((botonApretado == "Borrador") || ((this.state.logoToBeSent.length > 0))) {
        var logoArray = this.state.logoToBeSent;
        var filesArray = this.state.filesToBeSent;
        var req = request.post('/upload');
        var personafisica = {};
        var personajuridica = {};
        if(this.state.filesToBeSent.length>0){
          req.attach("imagen",filesArray[0][0]);
        }
        if (this.state.logoToBeSent.length > 0) {
          req.attach("logo", logoArray[0][0])
        }
        for (var clave in this.state) {
          if (this.state.hasOwnProperty(clave)) {
            if ((clave != "filesToBeSent") && (clave != "status") && (clave != "loading") && (clave != "modalIsOpen") && (clave != "modalCaracteresIsOpen") && !(clave.match(/responsable[1-9]|10cargo/)) && !(clave.match(/responsable[1-9]|10nombre/))) {
              let sentKey = "";
              if ((clave == "nombre") || (clave == "cargo") || (clave == "contacto")) {
                if (this.state[clave] != null) {
                  personafisica[clave] = this.state[clave];
                }
              } else {
                if (this.state[clave] != null) {
                  personajuridica[clave] = this.state[clave];
                }
              }
            }
          }
        }
        req.field("persona fisica", JSON.stringify(personafisica));
        req.field("persona juridica", JSON.stringify(personajuridica));
        console.log(event.currentTarget.id);
        req.field("status", botonApretado);
        req.field("id", this.state["id"]);
        console.log("este es el request:")
        console.log(req);
        req.end(function (err, res) {
          if (err) {
            console.log("error ocurred");
          }
          self.setState({ loading: false });
          console.log("res", res);
          if (botonApretado == "Completado") {
            window.location.replace(window.location.origin + "/gracias");
          }
          if (res.status == 500){
            self.setState({modalIsOpen : true});
          }
          self.setState({ modalIsOpen: true });
        });
      } else {
        self.setState({ loading: false });
        self.setState({ modalImagenesIsOpen: true });

      }
    } else {
      self.setState({ loading: false });
      self.setState({ modalCaracteresIsOpen: true });
    }
  }

  onDrop(acceptedFiles, rejectedFiles) {
    console.log(acceptedFiles);
    console.log(rejectedFiles);
    if ((acceptedFiles.length > 0) && (acceptedFiles[0].size > 0)) {
      console.log('Accepted files: ', acceptedFiles[0].name);
      console.log(rejectedFiles);
      var filesToBeSent = this.state.filesToBeSent;
      filesToBeSent.pop();
      filesToBeSent.push(acceptedFiles);
      this.setState({ filesToBeSent });
      filesToBeSent.map(f => console.log(f[0].name));
      console.log(this.state);
    } else {

      this.setState({ modalRejectedImagesIsOpen: true });
    }
  }

  onDropLogo(acceptedFiles, rejectedFiles) {
    if ((acceptedFiles.length > 0) && (acceptedFiles[0].size > 0)) {
      var logoToBeSent = this.state.logoToBeSent;
      logoToBeSent.pop();
      logoToBeSent.push(acceptedFiles);
      this.setState({ logoToBeSent });
      logoToBeSent.map(f => console.log(f[0].name));
      console.log(this.state);
    } else {

      this.setState({ modalRejectedImagesIsOpen: true });
    }
  }

  pruebaConcepto(changes) {
    /*
    if ((changes.expectativasyproyectos != undefined) && (changes.expectativasyproyectos.length > 500)) {
      changes.expectativasyproyectos = changes.expectativasyproyectos.substring(0, 500);
      changes.modalCaracteresIsOpen = true;

    }
    if ((changes.principalesobstaculos != undefined) && (changes.principalesobstaculos.length > 500)) {
      changes.principalesobstaculos = changes.principalesobstaculos.substring(0, 500);
      changes.modalCaracteresIsOpen = true;

    }
    */
    /*
    if((changes.huellasDeCarbono) && (changes.huellasDeCarbono.length > 300)){
      changes.huellasDeCarbono = changes.HuellasDeCarbono.subString(0,300);
    }
    */
   if((changes.huellasDeCarbono) && (changes.huellasDeCarbono.length>300)){
     changes.huellasDeCarbono = changes.huellasDeCarbono.substring(0,300);
   }
   if((changes.metasReduccionEmisiones) &&(changes.metasReduccionEmisiones.length > 300)){
     changes.metasReduccionEmisiones = changes.metasReduccionEmisiones.substring(0,300);
   }
   if((changes.externalidadesNegativasDeOperaciones) &&(changes.externalidadesNegativasDeOperaciones.length > 300)){
    changes.externalidadesNegativasDeOperaciones = changes.externalidadesNegativasDeOperaciones.substring(0,300);
   }
   if((changes.principalProgramaCambioClimatico) &&(changes.principalProgramaCambioClimatico.length > 300)){
    changes.principalProgramaCambioClimatico = changes.principalProgramaCambioClimatico.substring(0,500);
   }
    console.log(changes);
    this.setState(changes);

  }

  render() {
    return (
      <MuiThemeProvider>
        <Loader show={this.state.loading} foregroundStyle={{ color: 'white' }}
          backgroundStyle={{ backgroundColor: 'white' }} message={spinner}>
          <header className="site-header">
            <div className="content-logo">
              <a href="https://www.cronista.com/" target="_blank" title="El Cronista">
                <img src="https://www.cronista.com/arte/dolar/lg_cronista_web.svg" style={{ width: "270px", height: "40px" }} />
              </a>
            </div>
          </header>
          <div className="content-form-empresas clearfix">
            <Modal
              isOpen={this.state.modalIsOpen}
              onAfterOpen={this.afterOpenModal}
              onRequestClose={this.closeModal}
              style={customStyles}
              contentLabel="Formulario Guardado"
            >

              <h2 ref={subtitle => this.subtitle = subtitle}>Formulario guardado!</h2>
              <button onClick={this.closeModal}>Cerrar</button>
            </Modal>
            <Modal
              isOpen={this.state.modalCaracteresIsOpen}
              onAfterOpen={this.afterOpenModal}
              onRequestClose={this.closeModalCaracteres}
              style={customStyles}
              contentLabel="Los campos Nombre y cargo son obligatorios!"
            >

              <h2 ref={subtitle => this.subtitle = subtitle}>Los campos Nombre y cargo son obligatorios!</h2>
              <button onClick={this.closeModalCaracteres}>Cerrar</button>
            </Modal>
            <Modal
              isOpen={this.state.modalImagenesIsOpen}
              onAfterOpen={this.afterOpenModal}
              onRequestClose={this.closeModalImagenes}
              style={customStyles}
              contentLabel="Para el envío del formulario el logo y la foto son obligatorios"
            >

              <h2 ref={subtitle => this.subtitle = subtitle}>Para el envío del formulario el logo es obligatorio.</h2>
              <button onClick={this.closeModalImagenes}>Cerrar</button>
            </Modal>
            <Modal
              isOpen={this.state.modalRejectedImagesIsOpen}
              onAfterOpen={this.afterOpenModal}
              onRequestClose={this.closeModalRejectedImages}
              style={customStyles}
              contentLabel="El tamaño mínimo de las imágenes es 1 megabyte."
            >

              <h2 ref={subtitle => this.subtitle = subtitle}>El tamaño mínimo de las imágenes es 1 megabyte (MB)</h2>
              <button onClick={this.closeModalRejectedImages}>Cerrar</button>
            </Modal>
            <h1 className="title-form-empresas">Carga de datos</h1>
            <Form state={this.state} onChange={changes => this.pruebaConcepto(changes)}>
              <div className="col-lg-12 col-sm-12 col-md-12 col-xs-12">
                <div className="holder-name">Empresa:</div>
                <Field fieldName='empresa' defaultValue='test' disabled='true' type={Text} style={{ fontSize: '30px', fontWeight: 'bolder' }} />
              </div>
              <div className="col-lg-6 col-sm-6 col-md-6 col-xs-12">
                <Field fieldName='nombre' label="Nombre del referente del área" type={Text} />
              </div>
              <div className="col-lg-6 col-sm-6 col-md-6 col-xs-12">
                <Field fieldName='cargo' label="Cargo del referente del área" type={Text} />
              </div>
              <div className="col-lg-6 col-sm-6 col-md-6 col-xs-12">
                <Field fieldName='contacto' label="Contacto del referente del área" type={Text} />
              </div>
              <div className="col-lg-6 col-sm-6 col-md-6 col-xs-12">
                <Field fieldName='cantidadEmpleados' label="Cantidad de Empleados" type={Text} />
              </div>
              <div className="col-lg-6 col-sm-6 col-md-6 col-xs-12">
                <Field fieldName='facturacion2017' label="Facturación 2017" type={Text} />
              </div>
              <div className="col-lg-6 col-sm-6 col-md-6 col-xs-12">
                <Field fieldName='facturacionp2018' label="Facturación (p) 2018" type={Text} />
              </div>
              <div className="col-lg-12 col-sm-12 col-md-12 col-xs-12">
                <Field fieldName='inversion2017' label="Inversión en medioambiente 2017" type={Text} />
              </div>
              <div className="col-lg-12 col-sm-12 col-md-12 col-xs-12">
                <Field fieldName='inversionp2018' label="Inversión (p) en medioambiente 2018" type={Text} />
              </div>
              <div className="col-lg-12 col-sm-12 col-md-12 col-xs-12">
                <Field fieldName='huellasDeCarbono' label="¿Mide huellas de carbono? (No más de 300 caracteres con espacios)" type={Textarea} />
              </div>
              <div className="col-lg-12 col-sm-12 col-md-12 col-xs-12">
                <Field fieldName='metasReduccionEmisiones' label="¿Tiene metas de reduccion de emisiones de gases de efecto invernadero? (No más de 300 caracteres con espacios)" type={Textarea} />
              </div>
              <div className="col-lg-12 col-sm-12 col-md-12 col-xs-12">
                <Field fieldName='externalidadesNegativasDeOperaciones' label="¿Cómo compensa las externalidades negativas de sus operaciones en el medioambiente? (No más de 300 caracteres con espacios)" type={Textarea} />
              </div>
              <div className="col-lg-12 col-sm-12 col-md-12 col-xs-12">
                <Field fieldName='principalProgramaCambioClimatico' label="Principal programa con sus empleados relacionado con el cambio climático (NO MAS DE 500 CARACTERES CON ESPACIOS, SE BORRARA LA RESPUESTA SI NO ESTA RELACIONADA CON EL CAMBIO CLIMATICO)" type={Textarea} />
              </div>
              <div className="content-drop-img clearfix">
                <div className="col-lg-6 col-sm-6 col-md-6 col-xs-6 text-center">
                    <Dropzone multiple={false}  accept={"image/*"} onDrop={(files) => this.onDrop(files)}>
                        <div>Soltá acá foto del número uno que responde.</div>
                        {
                        this.state.filesToBeSent.map(f => <div><div style={{paddingTop:"10%"}}>Imagen cargada:</div><img style={{width:"30%"}} src={f[0].preview} /></div>)
                        }
                  </Dropzone>
                  </div>
                  <div className="col-lg-6 col-sm-6 col-md-6 col-xs-6 text-center">
                  <Dropzone multiple={false} accept={"image/*"} minSize={0} onDrop={(files) => this.onDropLogo(files)}>
                    <div>Soltá acá la foto del logo de la empresa.</div>
                    {
                      this.state.logoToBeSent.map(f => <div><div style={{ paddingTop: "10%" }}>Imagen cargada:</div><img style={{ width: "30%" }} src={f[0].preview} /></div>)
                    }
                  </Dropzone>
                </div>
              </div>
            </Form>
            <div className="col-lg-6 col-sm-6 col-md-6 col-xs-6 text-center">
              <RaisedButton label="Guardar Formulario" id="Borrador" primary={true} onClick={(event) => this.handleClick(event)} />
            </div>
            <div className="col-lg-6 col-sm-6 col-md-6 col-xs-6 text-center">
              <RaisedButton label="Enviar Formulario" id="Completado" primary={true} onClick={(event) => this.handleClick(event)} />
            </div>
            <br />
          </div>
          <footer className="site-footer clearfix">
            <div className="a-divider-inner"></div>
            <div className="logos-footer clearfix">
              <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 text-center">
              </div>
              <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 text-center">
              </div>
              <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 text-center">
              </div>
            </div>
            <div className="legal container">
              “Los Datos Personales declarados en el presente formulario son obligatorios veraces y revisten el carácter de declaración jurada.
				Asimismo formarán parte de la base de datos de El Cronista Comercial S.A. (el “Cronista”) para la gestión de suscripciones.
				En caso de declaración de datos inexactos, el Cronista podrá revocar la suscripción correspondiente.
				El suscriptor por medio de la suscripción de cualquier producto comercializado por El Cronista, brinda su conformidad expresa y autoriza a El Cronista a enviarle y trasmitirle todo tipo de comunicaciones, avisos, publicidades y mensajes que guarden relación con la suscripción o con los productos o servicios comercializados por parte de El Cronista con los fines publicitarios,
				 comerciales y promocionales a los domicilios, como así también a las direcciones de correo electrónico y teléfonos, que se encuentren registrados en la base de datos de El Cronista. El titular de los datos personales tiene la facultad de ejercer el derecho de acceso a los mismos en forma gratuita a intervalos no inferiores a seis meses salvo que se acredite un interés legítimo al efecto conforme lo establecido en el artículo 1, inciso 3 de la Ley 25.326. La DIRECCIÓN NACIONAL DE PROTECCIÓN DE DATOS PERSONALES, Órgano de Control de la Ley Nº 25.326, tiene la atribución de atender las denuncias y
				 reclamos que se interpongan con relación al incumplimiento de las normas sobre protección de datos personales. El Suscriptor podrá ejercer su derecho de acceso, rectificación y/o supresión en cualquier momento manifestando por escrito al domicilio de El Cronista sito en Avenida Paseo Colón 740 Primer Piso, Ciudad de Buenos Aires.”
				</div>
          </footer>
        </Loader>
      </MuiThemeProvider>
    )
  }
}

export default PostsCreate;