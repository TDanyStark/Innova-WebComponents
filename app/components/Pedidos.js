import { obtenerData, obtenerDataWhere, obtenerPedidosDateStarttoEnd } from '../helpers/firebase.js';
import { Cliente } from './Cliente.js';
import { ListPedidos } from './ListPedidos.js';
import { ModalVerPedido } from './ModalVerPedido.js';
import { ModalNuevoPedido } from './modalNuevoPedido.js';

export class Pedidos extends HTMLElement{
    constructor(){
        super();
        this.clienteFoundHandler = this.clienteFoundHandler.bind(this);
        this.clickHandler = this.clickHandler.bind(this);
        this.resetClienteHandler = this.resetClienteHandler.bind(this);


        this.innerHTML = /*html*/`
        <header-element></header-element>
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <h1 class="text-center" style="cursor:pointer; color:#fff;">Pedidos</h1>
                </div>
            </div>
            <div class="row">
                <div id="listServicioTecnico" class="col-4">
                    <cliente-element></cliente-element>
                </div>
                <div id="containerInfo" class="col-8">
                    <div class="row">
                        <div id="Funciones" class="col">
                            <div class="row row-cols-auto">
                                <div class="col">
                                    <label class="form-label text-white" for="start">Fecha inicio:</label>
                                    <input class="form-control-sm" type="date" id="start" name="trip-start">
                                </div>
                                <div class="col">
                                    <label class="form-label text-white" for="end">Fecha fin:</label>
                                    <input class="form-control-sm" type="date" id="end" name="trip-end">
                                </div>
                                <div class="col">
                                    <button class="btn btn-primary" id="verPedidos">Ver Pedidos</button>
                                </div>
                                <div class="col">
                                    <button class="btn btn-primary d-none" id="nuevoPedido">Crear Nuevo Pedido</button>
                                </div>
                                
                            </div>
                            <div class="row">
                                    <p class="text-white">Para ver todos los pedidos Resetee el cliente</p>
                                </div>
                        </div>
                    </div>
                    <div class="row">
                        <div id="smsError" class="col d-none">
                            <div class="alert alert-danger" role="alert">
                                <h4 class="alert-heading">Error!</h4>
                                <p id="smsErrorText">No se Encontraron Pedidos para este cliente</p>
                                <hr>
                                <p class="mb-0">Por favor, añada un pedido, o busque otro cliente</p>
                            </div>
                        </div>
                        <div id="listPedidos" class="col d-none">
                            <list-pedidos ></list-pedidos>
                        </div>
                    </div>
                </div>
            </div>
            <modal-ver-pedido></modal-ver-pedido>
            <modal-nuevo-pedido></modal-nuevo-pedido>
        </div>
        `;

        this.$divListPedidos = this.querySelector('#listPedidos');
        this.$divSmsError = this.querySelector('#smsError');
        this.$btnVerPedidos = this.querySelector('#verPedidos');
        this.$btnNuevoPedido = this.querySelector('#nuevoPedido');

        this.fechaStart = this.querySelector('#start');
        this.fechaEnd = this.querySelector('#end');

        this.cliente = {};
    }

    clienteFoundHandler = async (e) => {
        this.cliente = e.detail;
        let pedidos = await obtenerDataWhere('pedidos', 'celular', '==', e.detail.celular)
        if (pedidos.length > 0) {

            //disparar evento para que se llame a listPedidos con los pedidos del cliente
            document.dispatchEvent(new CustomEvent('listPedidos', {detail: pedidos}));

            this.$divListPedidos.classList.remove('d-none');
            this.$divSmsError.classList.add('d-none');
            this.$btnNuevoPedido.classList.remove('d-none');
            this.$btnVerPedidos.disabled = true;
        }else{
            this.$divListPedidos.classList.add('d-none');
            this.$divSmsError.classList.remove('d-none');
            this.$btnNuevoPedido.classList.remove('d-none');
            this.$btnVerPedidos.disabled = false;
        }
    }

    resetClienteHandler = () => {
        this.$divListPedidos.classList.add('d-none');
        this.$divSmsError.classList.add('d-none');
        this.$btnNuevoPedido.classList.add('d-none');
        this.$btnVerPedidos.disabled = false;

        this.fechaStart.value = '';
        this.fechaEnd.value = '';
    }

    clickHandler = async (e) => {
        if (e.target.id === 'verPedidos') {
            let fechaStart = new Date(this.fechaStart.value+" 00:00:00").getTime();
            let fechaEnd = new Date(this.fechaEnd.value+" 23:59:59").getTime();


            if (fechaStart > fechaEnd) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'La fecha de inicio no puede ser mayor a la fecha de fin',
                });
                this.fechaStart.value = '';
                this.fechaEnd.value = '';
                return;
            }

            if (isNaN(fechaStart) || isNaN(fechaEnd)) {
                let today = new Date();
                let mesAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 dias atras
                mesAgo = mesAgo.getTime();

                fechaStart = mesAgo;
                fechaEnd = today.getTime();

            }

            // disparar evento para que se llame a listPedidos con todos los pedidos
            let pedidos = await obtenerPedidosDateStarttoEnd(fechaStart, fechaEnd);
            document.dispatchEvent(new CustomEvent('seeAllListPedidos', {detail: pedidos}));
            this.$divListPedidos.classList.remove('d-none');
            this.$divSmsError.classList.add('d-none');
            this.$btnVerPedidos.disabled = true;
            return;
        }
        
        if (e.target.id === 'nuevoPedido') {
            document.dispatchEvent(new CustomEvent('nuevoPedido', { detail: this.cliente }));
            return;
        }
    }

    connectedCallback() {
        document.addEventListener('clienteFound', this.clienteFoundHandler);
        document.addEventListener('resetCliente', this.resetClienteHandler);
        this.addEventListener('click', this.clickHandler);
    }

    disconnectedCallback() {
        document.removeEventListener('clienteFound', this.clienteFoundHandler);
        document.removeEventListener('resetCliente', this.resetClienteHandler);
        this.removeEventListener('click', this.clickHandler);
    }
}

customElements.define('pedidos-element', Pedidos);