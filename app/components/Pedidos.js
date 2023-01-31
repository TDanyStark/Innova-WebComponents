import { obtenerDataWhere } from '../helpers/firebase.js';
import { Cliente } from './Cliente.js';
import { ListPedidos } from './ListPedidos.js';

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
                                    <button class="btn btn-primary" id="verPedidos">Ver Pedidos</button>
                                </div>
                                <div class="col">
                                    <button class="btn btn-primary d-none" id="nuevoPedido">Crear Nuevo Pedido</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr />
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
        </div>
        `;

        this.$divListPedidos = this.querySelector('#listPedidos');
        this.$divSmsError = this.querySelector('#smsError');
        this.$btnVerPedidos = this.querySelector('#verPedidos');
        this.$btnNuevoPedido = this.querySelector('#nuevoPedido');

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
        }else{
            this.$divListPedidos.classList.add('d-none');
            this.$divSmsError.classList.remove('d-none');
            this.$btnNuevoPedido.classList.remove('d-none');
        }
    }

    resetClienteHandler = () => {
        this.$divListPedidos.classList.add('d-none');
        this.$divSmsError.classList.add('d-none');
        this.$btnNuevoPedido.classList.add('d-none');
    }

    clickHandler = (e) => {
        if (e.target.id === 'verPedidos') {
            // disparar evento para que se llame a listPedidos con todos los pedidos
            return;
        }
        
        if (e.target.id === 'nuevoPedido') {
            // disparar evento para que se abra el modal de nuevo pedido
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
    }
}

customElements.define('pedidos-element', Pedidos);