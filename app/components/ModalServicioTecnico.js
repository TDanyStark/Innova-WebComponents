import { estadoSesion, guardarProducto } from "../helpers/firebase.js";

export class ModalServicioTecnico extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = /*html*/`
            <!-- Modal -->
            <div class="modal fade" id="modalSaveProduct" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content bg-dark text-white">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="staticBackdropLabel">Generar Servicio Tecnico</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                    <div class="mb-3">
                        <label for="inputCliente" class="form-label">Cliente</label>
                        <input type="text" class="form-control" id="inputCliente" disabled>
                    </div>
                    <div class="mb-3">
                        <label for="inputTelefono" class="form-label">Telefono</label>
                        <input type="text" class="form-control" id="inputTelefono" disabled>
                    </div>
                    <div class="mb-3">
                        <label for="selectEquipo" class="form-label">Equipo</label>
                        <select id="selectEquipo" name="equipo">
                            <option value="" selected >Escoja una opcion</option>
                            <option value="portatil" >Portatil</option>
                            <option value="AIO">Todo en Uno</option>
                            <option value="escritorio">Escritorio</option>
                            <option value="impresora">Impresora</option>
                            <option value="otro">Otro</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="inputCantidadInventario" class="form-label">Marca</label>
                        <input type="number" class="form-control" id="inputCantidadInventario">
                    </div>
                    <div class="mb-3">
                        <label for="inputPrecioCompra" class="form-label">Precio Compra</label>
                        <input type="number" class="form-control" id="inputPrecioCompra">
                    </div>
                    <div class="mb-3">
                        <label for="inputPrecioUnidad" class="form-label">Precio Venta</label>
                        <input type="number" class="form-control" id="inputPrecioUnidad" >
                    </div>
                    <div class="mb-3">
                        <label for="inputProveedor" class="form-label">Proveedor</label>
                        <input type="text" class="form-control" id="inputProveedor">
                    </div>
                    </div>
                    <div class="modal-footer">
                        <button tabIndex="0" type="button" class="btn btn-primary">Guardar</button>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    connectedCallback() {

    }

    disconnectedCallback() {
        
    }
}

customElements.define('modal-servicio-tecnico', ModalServicioTecnico);