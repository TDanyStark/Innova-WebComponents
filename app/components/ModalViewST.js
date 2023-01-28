import { obtenerData, editDocMerge }  from '../helpers/firebase.js';

export class ModalViewST extends HTMLElement {
    constructor() {
        super();

        this.verSTHandler = this.verSTHandler.bind(this);
        this.clickHandler = this.clickHandler.bind(this);

        this.innerHTML = /*html*/`
            <div class="modal fade " id="modalViewST" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                    <div class="modal-content bg-dark text-white">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Detalle de Servicio Tecnico - N° Recibo: <span id="Nrecibo"></span></h5>
                            <button type="button" id="btnCerrar" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="container-fluid">
                                <div class="row">
                                    <div class="col-md-6">
                                        <label for="inputCliente" class="form-label">* Cliente</label>
                                        <input type="text" class="form-control" id="inputCliente" disabled>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="inputCelular" class="form-label">* Celular</label>
                                        <input type="text" class="form-control" id="inputCelular" disabled>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-4">
                                        <label for="selectEquipo" class="form-label">* Equipo</label>
                                        <select id="selectEquipo" class="form-select" aria-label="Default select example">
                                            <option selected >Escoja una Opcion</option>
                                            <option value="portatil" >Portatil</option>
                                            <option value="AIO">Todo en Uno</option>
                                            <option value="escritorio">Escritorio</option>
                                            <option value="impresora">Impresora</option>
                                            <option value="otro">Otro</option>
                                        </select>
                                    </div>
                                    <div class="col-md-4">
                                        <label for="inputMarca" class="form-label">* Marca y Ref</label>
                                        <input type="text" class="form-control" id="inputMarca">
                                    </div>
                                    <div class="col-md-4">
                                        <label for="selectCargador" class="form-label">* Cargador</label>
                                        <select id="selectCargador" class="form-select" aria-label="Default select example">
                                            <option selected >Escoja una Opcion</option>
                                            <option value="si">Si</option>
                                            <option value="no">No</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-12">
                                        <label for="textFallaReportada">* Falla reportada:</label>
                                        <textarea class="form-control" placeholder="Escriba la Falla Reportada" id="textFallaReportada"></textarea>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-12">
                                        <label for="textObservaciones">Observaciones:</label>
                                        <textarea class="form-control" placeholder="Ejm: Tiene partida una tapa, esta mojado, etc" id="textObservaciones"></textarea>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col">
                                        <label for="inputAbono" class="form-label">Abono: </label>
                                        <input type="number" class="form-control" id="inputAbono">
                                    </div>
                                    <div class="col">
                                        <label for="inputTotal" class="form-label">Total: </label>
                                        <input type="number" class="form-control" id="inputTotal">
                                    </div>
                                </div>
                                <div class="row">
                                    ${window.isAdmin ? /*html*/`
                                        <div class="col-md-6">
                                            <label for="selectTec" class="form-label">Asignar a un tecnico?: </label>
                                            <select name="tecnicos" class="form-control" id="selectTec">
                                                <option selected>No asignar</option>
                                            </select>
                                        </div>
                                    `: ''}
                                    <div class="col" style="margin-top: 20px">
                                        <p>Despues de 2 meses de recibido el producto no se responde...</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" id="btnCerrarTwo" class="btn btn-danger" data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.modal = this.querySelector('#modalViewST');
        this.ventanaModal = new bootstrap.Modal(this.modal);

        this.cliente = this.querySelector('#inputCliente');
        this.celular = this.querySelector('#inputCelular');
        this.equipo = this.querySelector('#selectEquipo');
        this.marca = this.querySelector('#inputMarca');
        this.cargador = this.querySelector('#selectCargador');
        this.fallaReportada = this.querySelector('#textFallaReportada');
        this.observaciones = this.querySelector('#textObservaciones');
        this.abono = this.querySelector('#inputAbono');
        this.total = this.querySelector('#inputTotal');

        this.$selectTec = this.querySelector('#selectTec');

        this.Nrecibo = this.querySelector('#Nrecibo');

        this.btnCerrar2 = this.querySelector('#btnCerrarTwo');
        this.btnCerrar = this.querySelector('#btnCerrar');

        this.isSaved = false;
        this.ID;

    }

    verSTHandler = async (e) => {
        console.log(e.detail)
        if(window.isAdmin){
            if (this.$selectTec.options.length <= 1) {
                let tecnicos = await obtenerData('tecnicos');
                tecnicos.forEach(tec => {
                    let option = document.createElement('option');
                    option.value = tec.email;
                    option.textContent = tec.email;
                    this.$selectTec.appendChild(option);
                });
            }
        }

        this.ID = e.detail.id;

        let st = e.detail;
        this.cliente.value = st.cliente;
        this.celular.value = st.celular;
        this.equipo.value = st.equipo;
        this.marca.value = st.marca;
        this.cargador.value = st.cargador;
        this.fallaReportada.value = st.fallaReportada;
        this.observaciones.value = st.observaciones;
        this.abono.value = st.abono;
        this.total.value = st.total;
        this.Nrecibo.textContent = st.recibo;

        // establecer los data atribute para los campos 
        this.cliente.dataset.dbkey = "cliente";
        this.celular.dataset.dbkey = "celular";
        this.equipo.dataset.dbkey = "equipo";
        this.marca.dataset.dbkey = "marca";
        this.cargador.dataset.dbkey = "cargador";
        this.fallaReportada.dataset.dbkey = "fallaReportada";
        this.observaciones.dataset.dbkey = "observaciones";
        this.abono.dataset.dbkey = "abono";
        this.total.dataset.dbkey = "total";


        this.$selectTec.value = st.vendedor;

        this.ventanaModal.show();
    }

    changeHandler = async (e) => {
        let id = this.ID;
        let newValue = e.target.value;
        let key = e.target.getAttribute("data-dbkey");

        // si el valor es un numero, convertirlo a entero si no dejarlo como string
        newValue = isNaN(parseInt(newValue)) ? newValue : parseInt(newValue);

        // creo la data que le pasa a la funcion de firebase y creo la key dinamicamente
        let data = {};
        data[key] = newValue;

        let res = await editDocMerge('servicioTecnico', id, data);
        console.log(res);
        if(res){
            this.isSaved = true;
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Actualizado',
                timer: 1000,
                showConfirmButton: false
            })
        }
    }

    clickHandler = async (e) => {
        if( e.target === this.btnCerrar || e.target === this.btnCerrar2){
            
            this.ventanaModal.hide();
            let $this = this;
            function waitToSaved(){
                console.log($this.isSaved, 'isSaved'	);
                if($this.isSaved){
                    document.dispatchEvent(new CustomEvent('ActualizarTablaST'));
                    $this.isSaved = false;
                }else{
                    setTimeout(waitToSaved, 600);
                }
                return;
            }
            waitToSaved();
        }
    }

    connectedCallback() {
        
        document.addEventListener('verST', this.verSTHandler);
        this.addEventListener('change', this.changeHandler);
        this.addEventListener('click', this.clickHandler);
    }

    disconnectedCallback() {
        document.removeEventListener('verST', this.verSTHandler);
        this.removeEventListener('change', this.changeHandler);
    }

    
}

customElements.define('modal-view-st', ModalViewST);