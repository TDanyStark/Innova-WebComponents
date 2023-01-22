import { estadoSesion, guardarServicioTecnico, obtenerData} from "../helpers/firebase.js";

export class ModalServicioTecnico extends HTMLElement {
    constructor() {
        super();

        this.ModalServicioTecnicoHandler = this.ModalServicioTecnicoHandler.bind(this);

        this.innerHTML = /*html*/`
            <!-- Modal -->
            <div class="modal fade" id="modalServicioTecnico" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content bg-dark text-white">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="staticBackdropLabel">Generar Servicio Tecnico - N° Recibo: <span id="Nrecibo"></span></h1>
                            <button type="button" tabIndex="-1" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="container-fluid">
                                <div class="row">
                                    <div class="col-md-6">
                                        <label for="inputCliente" class="form-label">* Cliente</label>
                                        <input type="text" class="form-control" id="inputCliente" disabled>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="inputTelefono" class="form-label">* Telefono</label>
                                        <input type="text" class="form-control" id="inputTelefono" disabled>
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
                                    <div class="col-md-12">
                                        <label for="inputPedido" class="form-label">Pedidos: </label>
                                        <input type="text" id="inputPedido" class="form-control" placeholder="Teclado Lenovo s145, memoria Ram o link ML o virtualTronic etc" />
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-4">
                                        <label for="inputTotalPedido" class="form-label">Total Pedido: </label>
                                        <input type="number" class="form-control" id="inputTotalPedido">
                                    </div>
                                    <div class="col-md-4">
                                        <label for="inputAbono" class="form-label">Abono: </label>
                                        <input type="number" class="form-control" id="inputAbono">
                                    </div>
                                    <div class="col-md-4">
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
                                    <div class="col-md-6">
                                        <p>Despues de 2 meses de recibido el producto no se responde...</p>
                                    </div>
                                </div>
                                    
                            </div>
                        </div>
                        <div class="modal-footer">
                        <button id="btnRegistrar" tabIndex="0" type="button" class="btn btn-primary">Registrar</button>
                        <button id="btnLimpiar" tabIndex="-1" type="button" class="btn btn-warning">Limpiar</button>
                            </div>
                    </div>
                </div>
            </div>
        `;
            this.modal = this.querySelector('#modalServicioTecnico');
            this.ventanaModal = new bootstrap.Modal(this.modal);

            this.btnRegistrar = this.querySelector('#btnRegistrar');
            this.btnLimpiar = this.querySelector('#btnLimpiar');

            this.cliente = this.querySelector('#inputCliente');
            this.telefono = this.querySelector('#inputTelefono');
            this.equipo = this.querySelector('#selectEquipo');
            this.marca = this.querySelector('#inputMarca');
            this.cargador = this.querySelector('#selectCargador');
            this.fallaReportada = this.querySelector('#textFallaReportada');
            this.observaciones = this.querySelector('#textObservaciones');
            this.abono = this.querySelector('#inputAbono');
            this.total = this.querySelector('#inputTotal');
            this.pedido = this.querySelector('#inputPedido');
            this.totalPedido = this.querySelector('#inputTotalPedido');

            this.$Nrecibo = this.querySelector('#Nrecibo');

            this.$selectTec = this.querySelector('#selectTec');

    }

    clickHandler = async (e) => {
        if (e.target === this.btnRegistrar) {
            if (this.cliente.value === '' || this.telefono.value === '' || this.equipo.value === 'Escoja una Opcion' || this.marca.value === '' || this.cargador.value === 'Escoja una Opcion' || this.fallaReportada.value === '') {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Todos los campos con * son obligatorios!',
                });
            } else {
                let vendedor;
                if (this.$selectTec.value === 'No asignar') {
                    vendedor = estadoSesion.email;
                }else{
                    vendedor = this.$selectTec.value;
                }
                let observaciones = this.observaciones.value === '' ? 'Sin Observaciones' : this.observaciones.value;
                let abono = this.abono.value === '' ? 0 : parseInt(this.abono.value);
                let total = this.total.value === '' ? 0 : parseInt(this.total.value);


                let pedido = this.pedido.value === '' ? 'Sin Pedido' : this.pedido.value;
                let totalPedido = this.totalPedido.value === '' ? 0 : parseInt(this.totalPedido.value);

                if (totalPedido != 0){
                    total = totalPedido + total;
                }

                const data = {
                    recibo: this.$Nrecibo.textContent,
                    cliente: this.cliente.value,
                    celular: this.telefono.value,
                    equipo: this.equipo.value,
                    marca: this.marca.value,
                    cargador: this.cargador.value,
                    fallaReportada: this.fallaReportada.value,
                    observaciones: observaciones,
                    abono: abono,
                    total: total,
                    estado: 'Ingresado',
                    PagadoATecnico: false,
                    fechaSalida: "sin fecha",
                    vendedor: vendedor,
                    totalPedido: totalPedido,
                    pedido: pedido
                };
                let res= await guardarServicioTecnico(data);

                if (res === true) {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Registro Exitoso',
                        showConfirmButton: false,
                        timer: 1500
                    }).then(() => {
                        document.dispatchEvent(new CustomEvent('servicioTecnicoRegistrado'));
                    });
                    
                    //limpiar Datos
                    this.cliente.value = '';
                    this.telefono.value = '';
                    this.equipo.value = 'Escoja una Opcion';
                    this.marca.value = '';
                    this.cargador.value = 'Escoja una Opcion';
                    this.fallaReportada.value = '';
                    this.observaciones.value = '';
                    this.abono.value = '';
                    this.total.value = '';

                    this.ventanaModal.hide();
                }else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Ocurrio un error al registrar el servicio tecnico',
                    });
                }
            }
        }
        if (e.target === this.btnLimpiar) {
            this.equipo.value = 'Escoja una Opcion';
            this.marca.value = '';
            this.cargador.value = 'Escoja una Opcion';
            this.fallaReportada.value = '';
            this.observaciones.value = '';
            this.abono.value = '';
            this.total.value = '';
        }
    }

    ModalServicioTecnicoHandler = async (e) => {
        this.cliente.value = e.detail.nombre;
        this.telefono.value = e.detail.celular;
        this.$Nrecibo.textContent = e.detail.recibo.Nrecibo;
        if(window.isAdmin){
            let tecnicos = await obtenerData('tecnicos');
            tecnicos.forEach(tec => {
                let option = document.createElement('option');
                option.value = tec.email;
                option.textContent = tec.email;
                this.$selectTec.appendChild(option);
            });
        }

        this.ventanaModal.show();
    };

    connectedCallback() {
        document.addEventListener('modalServicioTecnico', this.ModalServicioTecnicoHandler);
        this.addEventListener('click', this.clickHandler);
    }

    disconnectedCallback() {
        document.removeEventListener('modalServicioTecnico', this.ModalServicioTecnicoHandler);
        this.removeEventListener('click', this.clickHandler);
    }
}

customElements.define('modal-servicio-tecnico', ModalServicioTecnico);