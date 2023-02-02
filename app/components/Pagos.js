import { Header } from './Header.js';

export class Pagos extends HTMLElement{
    constructor(){
        super();

        this.innerHTML = /*html*/`
        <header-element></header-element>
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <h1 class="text-center" style="cursor:pointer; color:#fff;">Registrar Pagos</h1>
                </div>
            </div>
            <div class="row">
                <div class="col-6 p-3 rounded bg-dark text-white">
                    <div class="row">
                        <div class="col">
                            <label for="inputDescripcion" class="form-label">Descripción:</label>
                            <input type="text" class="form-control" id="inputDescripcion">
                        </div>
                        <div class="col">
                            <label for="selectCategoria" class="form-label">Categoria:</label>
                            <select id="selectCategoria" class="form-select" aria-label="Default select example">
                                <option value="1">Gastos Operativos</option>
                                <option value="2">Pago Envios</option>
                                <option value="3">Otros</option>
                            </select>
                        </div>
                        <div class="col">
                            <label for="inputValor" class="form-label">Valor:</label>
                            <input type="text" class="form-control" id="inputValor">
                        </div>
                        <div class="col d-flex align-items-center">
                            <button style="margin-top:30px; width: 100%;" class="btn btn-primary" id="btnGuardar">Guardar</button>
                        </div>
                    </div>
                </div>
                <div class="col-6">
                    <div class="row">
                        <div class="col">
                            <label for="inputFecha" class="form-label">Fecha Inicio:</label>
                            <input type="date" class="form-control" id="inputFecha">
                        </div>
                        <div class="col">
                            <label for="inputFecha" class="form-label">Fecha Fin:</label>
                            <input type="date" class="form-control" id="inputFecha">
                        </div>
                        <div class="col">
                            <button class="btn btn-primary" id="btnVerPagos">Ver Pagos</button>
                        </div>
                    </div>
                    <div class="row">
                        <p>Dale Click para ver los pagos</p>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    connectedCallback(){}

    disconnectedCallback(){}
}

customElements.define('pagos-element', Pagos);