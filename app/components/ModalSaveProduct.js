import { guardarProducto } from "../helpers/firebase.js";

export class ModalSaveProduct extends HTMLElement {
    constructor() {
        super();
        this.saveProductHandler = this.saveProductHandler.bind(this);
        this.innerHTML = /*html*/`
                <!-- Modal -->
            <div class="modal fade" id="modalSaveProduct" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content bg-dark text-white">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="staticBackdropLabel">Guardar Producto</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                        <div class="mb-3">
                            <label for="inputId" class="form-label">ID</label>
                            <input type="text" class="form-control" id="inputId">
                        </div>
                        <div class="mb-3">
                            <label for="inputDescripcion" class="form-label">Descripcion</label>
                            <input type="text" class="form-control" id="inputDescripcion">
                        </div>
                        <div class="mb-3">
                            <label for="inputCantidadInventario" class="form-label">Cantidad Inventario</label>
                            <input type="number" class="form-control" id="inputCantidadInventario">
                        </div>
                        <div class="mb-3">
                            <label for="inputPrecioUnidad" class="form-label">Precio Unidad</label>
                            <input type="number" class="form-control" id="inputPrecioUnidad" >
                        </div>
                        <div class="mb-3">
                            <label for="inputProveedor" class="form-label">Proveedor</label>
                            <input type="text" class="form-control" id="inputProveedor">
                        </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                            <button type="button" class="btn btn-primary">Guardar</button>
                        </div>
                    </div>
                </div>
            </div>
            `;

            this.modal = this.querySelector('#modalSaveProduct');
            this.ventanaModal = new bootstrap.Modal(this.modal);

            this.$id = this.querySelector('#inputId');
            this.$descripcion = this.querySelector('#inputDescripcion');
            this.$cantidadInventario = this.querySelector('#inputCantidadInventario');
            this.$precioUnidad = this.querySelector('#inputPrecioUnidad');
            this.$proveedor = this.querySelector('#inputProveedor');

    }

    async clickHandler(e) {
        console.log(e.target);
        if (e.target.matches('.btn-primary')) {
            if (this.$id.value === '' || this.$descripcion.value === '' || this.$cantidadInventario.value === '' || this.$precioUnidad.value === '' || this.$proveedor.value === '') {
                Swal.fire('error', 'Todos los campos son obligatorios').then(() => {
                    setTimeout(() => {
                        this.$descripcion.focus();
                    }, 500);
                });
                return;
            }
            let producto = {
                id: this.$id.value,
                descripcion: this.$descripcion.value,
                cantidad_inventario: this.$cantidadInventario.value,
                precio: this.$precioUnidad.value,
                proveedor: this.$proveedor.value
            }

            


            let res= await guardarProducto(producto);
            console.log(res);
            if (res) {
                Swal.fire('success', 'Producto guardado correctamente').then(() => {
                    this.ventanaModal.hide();
                });
            } else {
                Swal.fire('error', 'No se pudo guardar el producto');
            }
        }
    }

    saveProductHandler(e) {
        const producto = e.detail;
        console.log(producto);
        this.ventanaModal.show();

        //limpiar los campos
        this.$id.value = '';
        this.$descripcion.value = '';
        this.$cantidadInventario.value = '';
        this.$precioUnidad.value = '';
        this.$proveedor.value = '';

        //habilitar los campos
        this.$id.disabled = false;
        this.$descripcion.disabled = false;
        this.$cantidadInventario.disabled = false;
        this.$precioUnidad.disabled = false;
        this.$proveedor.disabled = false;

        this.$id.value = producto;
        if (this.$id.value.startsWith('ST')) {
            let precio = this.$id.value.replace('ST', '').replace('K', '');

            this.$id.disabled = true;
            this.$descripcion.disabled = true;
            this.$cantidadInventario.disabled = true;
            this.$precioUnidad.disabled = true;
            this.$proveedor.disabled = true;


            this.$descripcion.value = 'Servicio Tecnico';
            this.$cantidadInventario.value = 1;
            this.$precioUnidad.value = parseInt(precio*1000);
            this.$proveedor.value = 'Servicio Tecnico';

        }
        setTimeout(() => {
            this.$descripcion.focus();
        }, 500);
    }



    connectedCallback() {
        console.log('Se ha agregado el componente');
        this.addEventListener('click', this.clickHandler);
        document.addEventListener('saveProduct', this.saveProductHandler);
    }
}


customElements.define('modal-save-product-element', ModalSaveProduct);