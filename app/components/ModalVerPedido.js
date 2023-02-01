import { editDocMerge } from "../helpers/firebase.js";

export class ModalVerPedido extends HTMLElement{
    constructor(){
        super();

        this.modalVerPedidoHandler = this.modalVerPedidoHandler.bind(this);
        this.changeHandler = this.changeHandler.bind(this);

        this.innerHTML = /*html*/`
            <div class="modal fade " id="modalVerPedido" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                    <div class="modal-content bg-dark text-white">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Detalle de Pedido - N° Recibo: <span id="Nrecibo"></span></h5>
                            <button type="button" id="btnCerrar" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
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
                                <div class="col">
                                    <label for="inputPedido" class="form-label">Pedido</label>
                                    <input type="text" class="form-control" id="inputPedido" />
                                </div>
                                <div class="col">
                                    <label for="inputProveedor" class="form-label">Proveedor</label>
                                    <input type="text" class="form-control" id="inputProveedor" />
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
                                    <label for="inputPrecioCompra" class="form-label">Precio Compra: </label>
                                    <input type="number" class="form-control" id="inputPrecioCompra">
                                </div>
                                <div class="col">
                                    <label for="inputTotal" class="form-label">Total: </label>
                                    <input type="number" class="form-control" id="inputTotal">
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
                                        <option value="Pendiente">Pendiente</option>
                                        <option value="En Oficina">En Oficina</option>
                                        <option value="Entregado" disabled>Entregado</option>
                                        <option value="Reembolso">Reembolso</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" id="btnGuardar" class="btn btn-primary">Guardar</button>
                            <button type="button" id="btnCerrar" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.modal = this.querySelector('#modalVerPedido');
        this.ventanaModal = new bootstrap.Modal(this.modal);

        this.Nrecibo= this.querySelector('#Nrecibo');

        this.cliente = this.querySelector('#inputCliente');
        this.celular = this.querySelector('#inputCelular');
        this.pedido = this.querySelector('#inputPedido');
        this.proveedor = this.querySelector('#inputProveedor');

        this.inputAbono = this.querySelector('#inputAbono');
        this.totalAbono = this.querySelector('#totalAbono');
        this.inputPrecioCompra = this.querySelector('#inputPrecioCompra');
        this.inputTotal = this.querySelector('#inputTotal');

        this.inputFechaIngreso = this.querySelector('#inputFechaIngreso');
        this.inputFechaEntrega = this.querySelector('#inputFechaEntrega');
        this.inputEstado = this.querySelector('#inputEstado');

        this.ID;

        this.btnGuardar = this.querySelector('#btnGuardar');

    }


    milesFuncion = (precio) => precio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    modalVerPedidoHandler = (e) => {
        this.ventanaModal.show();
        console.log(e.detail);

        this.ID = e.detail.id;

        let fechaIngreso = new Date(parseInt(e.detail.id)).toISOString().split("T")[0];
        let fechaEntrega = e.detail.fechaEntrega == "undefined" ? "" : new Date(parseInt(e.detail.fechaEntrega)).toISOString().split("T")[0];

        this.Nrecibo.textContent = e.detail.recibo;

        this.cliente.value = e.detail.cliente;
        this.celular.value = e.detail.celular;
        this.pedido.value = e.detail.pedido;
        this.proveedor.value = e.detail.proveedor;

        this.totalAbono.textContent = this.milesFuncion(e.detail.abono);
        this.totalAbono.dataset.abono = e.detail.abono;
        this.inputPrecioCompra.value = e.detail.precioCompra;
        this.inputAbono.value = '';
        
        this.inputTotal.value = e.detail.total;
        
        this.inputFechaIngreso.value = fechaIngreso;
        this.inputFechaEntrega.value = fechaEntrega;
        this.inputEstado.value = e.detail.estado;

    };

    changeHandler = (e) => {
        console.log(e.target);

        if(e.target == this.inputAbono){
            if(e.target.value == "") return;
            let abono = parseInt(e.target.value);
            let totalAbono = parseInt(this.totalAbono.dataset.abono);
            let total = parseInt(this.inputTotal.value);

            if(abono + totalAbono > total){
                inputAbono.value = "";
                
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'El abono no puede ser mayor al total',
                }).then(() => {
                    setTimeout(() => {
                        inputAbono.focus();
                    }, 500);
                })
                return;
            }
            this.totalAbono.textContent = this.milesFuncion(abono + totalAbono);
            this.totalAbono.dataset.abono = abono + totalAbono;
            e.target.value = "";
            e.target.focus();
        }
    }

    clickHandler = async (e) => {
        if(e.target == this.btnGuardar){
            let id = this.ID;
            let abono = parseInt(this.totalAbono.dataset.abono);
            let total = parseInt(this.inputTotal.value);
            let estado = this.inputEstado.value;
            let pedido = this.pedido.value;
            let proveedor = this.proveedor.value;
            let precioCompra = parseInt(this.inputPrecioCompra.value);

            let pedidoObj = {
                abono,
                total,
                estado,
                pedido,
                proveedor,
                precioCompra,
            }

            console.log('PedidoObj ',pedidoObj);
            this.ventanaModal.hide();
            let res = await editDocMerge('pedidos', id, pedidoObj);
            console.log('pedido editado', res);

            if (res) {
                let obj = {
                    cliente : this.cliente.value,
                    celular : this.celular.value,
                }
                document.dispatchEvent(new CustomEvent('actualizarPedidos', {detail: obj}));
            }
        }
    };

    connectedCallback(){
        document.addEventListener('modalVerPedido', this.modalVerPedidoHandler);
        this.addEventListener('change', this.changeHandler);
        this.addEventListener('click', this.clickHandler);
    }

    disconnectedCallback(){
        document.removeEventListener('modalVerPedido', this.modalVerPedidoHandler);
        this.removeEventListener('change', this.changeHandler);
        this.removeEventListener('click', this.clickHandler);
    }
    

}

customElements.define('modal-ver-pedido', ModalVerPedido);