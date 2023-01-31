import { Cliente } from './Cliente.js';
import { ListPedidos } from './ListPedidos.js';

export class Pedidos extends HTMLElement{
    constructor(){
        super();

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
                <div id="listPedidos" class="col">
                    <list-pedidos></list-pedidos>
                </div>
            </div>
        </div>
        `;
    }
}

customElements.define('pedidos-element', Pedidos);