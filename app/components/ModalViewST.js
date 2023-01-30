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
                                            <option value="Portatil" >Portatil</option>
                                            <option value="AIO">Todo en Uno</option>
                                            <option value="Escritorio">Escritorio</option>
                                            <option value="Impresora">Impresora</option>
                                            <option value="Otro">Otro</option>
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
                                    <div class="col-3">
                                        <p class="form-label">Total Abono</p>
                                        <p class="form-label" id="totalAbono" style="font-size: 1.5rem;"></p>
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
                                    <div class="col" style="margin-top: 25px">
                                        <p style="margin: 0;">Despues de 2 meses de recibido el producto no se responde...</p>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md">
                                        <label for="inputFechaIngreso" class="form-label">Fecha de Ingreso: </label>
                                        <input type="date" class="form-control" id="inputFechaIngreso" disabled>
                                    </div>
                                    <div class="col-md">
                                        <label for="inputFechaEntrega" class="form-label">Fecha de Entrega: </label>
                                        <input type="date" class="form-control" id="inputFechaEntrega" disabled>
                                    </div>
                                    <div class="col-md">
                                        <label for="inputEstado" class="form-label">Estado: </label>
                                        <select id="inputEstado" class="form-select" aria-label="Default select example">
                                            <option value="Ingresado">Ingresado</option>
                                            <option value="En Revision">En Revision</option>
                                            <option value="Solucionado">Solucionado</option>
                                            <option value="Sin Solucion">Sin Solucion</option>
                                            <option value="En Espera, Pendiente de Arreglo">En Espera, Pendiente de Arreglo</option>
                                            <option value="Entregado, Sin Solucion">Entregado, Sin Solucion</option>
                                            <option value="Entregado" disabled>Entregado</option>
                                        </select>
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
        this.totalAbono = this.querySelector('#totalAbono');
        this.total = this.querySelector('#inputTotal');
        this.fechaIngreso = this.querySelector('#inputFechaIngreso');
        this.fechaSalida = this.querySelector('#inputFechaEntrega');
        this.estado = this.querySelector('#inputEstado');
        this.vendedor = this.querySelector('#selectTec');

        this.$selectTec = this.querySelector('#selectTec');

        this.Nrecibo = this.querySelector('#Nrecibo');

        this.btnCerrar2 = this.querySelector('#btnCerrarTwo');
        this.btnCerrar = this.querySelector('#btnCerrar');

        this.isSaved = false;
        this.isclicked = false;
        this.ID;

    }

    milesFuncion(precio){
        return "$ " + precio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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
        let fecha = new Date(parseInt(st.id)).toISOString().split("T")[0];
        console.log(st.fechaSalida);
        let fechaSalida = st.fechaSalida == 'sin fecha' ? "" : new Date(parseInt(st.fechaSalida)).toISOString().split("T")[0];
        console.log(fechaSalida);
        let totalAbono = this.milesFuncion(st.abono);
        this.cliente.value = st.cliente;
        this.celular.value = st.celular;
        this.equipo.value = st.equipo;
        this.marca.value = st.marca;
        this.cargador.value = st.cargador;
        this.fallaReportada.value = st.fallaReportada;
        this.observaciones.value = st.observaciones;
        this.abono.value = "";
        this.totalAbono.textContent = totalAbono;
        this.totalAbono.dataset.abono = st.abono;
        this.total.value = st.total;
        this.Nrecibo.textContent = st.recibo;
        this.fechaIngreso.value = fecha;
        this.fechaSalida.value = fechaSalida;
        this.estado.value = st.estado;
        this.vendedor.value = st.vendedor;

        // establecer los data atribute para los campos 
        this.cliente.dataset.dbkey = "cliente";
        this.celular.dataset.dbkey = "celular";
        this.equipo.dataset.dbkey = "equipo";
        this.marca.dataset.dbkey = "marca";
        this.cargador.dataset.dbkey = "cargador";
        this.fallaReportada.dataset.dbkey = "fallaReportada";
        this.observaciones.dataset.dbkey = "observaciones";
        this.abono.dataset.dbkey = "abono";
        this.totalAbono.dataset.dbkey = "abono";
        this.total.dataset.dbkey = "total";
        this.fechaIngreso.dataset.dbkey = "fecha";
        this.fechaSalida.dataset.dbkey = "fechaEntrega";
        this.estado.dataset.dbkey = "estado";
        this.vendedor.dataset.dbkey = "vendedor";


        this.$selectTec.value = st.vendedor;

        this.ventanaModal.show();
    }

    changeHandler = async (e) => {
        if(e.target == this.abono){
            if(e.target.value == "") return;
            let abono = parseInt(e.target.value);
            let totalAbono = parseInt(this.totalAbono.dataset.abono);
            let total = parseInt(this.total.value);


            if(abono + totalAbono > total){
                this.abono.value = "";
                
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'El abono no puede ser mayor al total',
                }).then(() => {
                    setTimeout(() => {
                        this.abono.focus();
                    }, 500);
                })
                return;
            }
            this.totalAbono.textContent = this.milesFuncion(abono + totalAbono);
            this.totalAbono.dataset.abono = abono + totalAbono;
            e.target.value = "";
            e.target.focus();

            let data = {
                abono: this.totalAbono.dataset.abono
            }
        }
        let id = this.ID;
        let newValue = e.target.value;
        let key = e.target.getAttribute("data-dbkey");

        // si el valor es un numero, convertirlo a entero si no dejarlo como string
        newValue = isNaN(parseInt(newValue)) ? newValue : parseInt(newValue);


        // creo la data que le pasa a la funcion de firebase y creo la key dinamicamente
        let data = {};
        data[key] = newValue;

        if (key === "abono") {
            data[key] = parseInt(this.totalAbono.dataset.abono);
        }

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
        // comprobar si el e.target es un input
        if(e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT'){
            this.isclicked = true;
        }
        if( e.target === this.btnCerrar || e.target === this.btnCerrar2){
            let $this = this;

            if(this.isclicked){
                let contador = 0;
                function waitToSaved(){
                    console.log($this.isSaved, 'isSaved'	);
                    if(contador >= 10) return;
                    if($this.isSaved){
                        document.dispatchEvent(new CustomEvent('ActualizarTablaST'));
                        $this.isSaved = false;
                    }else{
                        setTimeout(waitToSaved, 600);
                    }
                    contador++;
                    return;
                }
                waitToSaved();
            }
            this.ventanaModal.hide();
            
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
        this.removeEventListener('click', this.clickHandler);
    }

    
}

customElements.define('modal-view-st', ModalViewST);