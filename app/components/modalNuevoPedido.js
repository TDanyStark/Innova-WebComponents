export class ModalNuevoPedido extends HTMLElement{
    constructor(){
        super();

        this.clickHandler = this.clickHandler.bind(this);
        this.nuevoPedidoHandler = this.nuevoPedidoHandler.bind(this);
        this.nuevoPedidoHandler

        this.innerHTML = /*html*/`
            <div class="modal fade " id="modalViewST" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                    <div class="modal-content bg-dark text-white">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Detalle de Servicio Tecnico - N° Recibo: <span id="Nrecibo"></span></h5>
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
                        </div>
                        <div class="modal-footer">
                            <button type="button" id="btnGuardar" class="btn btn-primary">Guardar</button>
                            <button type="button" id="btnCerrar" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.modal = this.querySelector('#modalViewST');
        this.ventanaModal = new bootstrap.Modal(this.modal);

        this.cliente = this.querySelector('#inputCliente');
        this.celular = this.querySelector('#inputCelular');

        this.$btnGuardar = this.querySelector('#btnGuardar');
    }

    nuevoPedidoHandler = (e) => {
        this.ventanaModal.show();
        this.cliente.value = e.detail.cliente;
        this.celular.value = e.detail.celular;
    }

    clickHandler = (e) => {
        if(e.target.id === 'btnGuardar'){
            this.ventanaModal.hide();
        }
    }

    connectedCallback(){
        document.addEventListener('nuevoPedido', this.nuevoPedidoHandler);
        this.addEventListener('click', this.clickHandler);
    }

    disconnectedCallback(){
        document.removeEventListener('nuevoPedido', this.nuevoPedidoHandler);
        this.removeEventListener('click', this.clickHandler);
    }
}

customElements.define('modal-nuevo-pedido', ModalNuevoPedido);