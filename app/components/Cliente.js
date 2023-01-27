import { clienteFound, guardarCliente } from '../helpers/firebase.js';
let form;
export class Cliente extends HTMLElement {
    constructor() {
        super();
        //bind keyupHandler
        this.keyupHandler = this.keyupHandler.bind(this);
        //bind ventaRealizadaHandler
        this.ventaRealizadaHandler = this.ventaRealizadaHandler.bind(this);
        this.clickHandler = this.clickHandler.bind(this);

        const container = document.createElement('div');
        container.id = 'cliente-container';
        container.innerHTML = /*html*/`
            <form class="needs-validation formCliente bg-dark p-2 rounded" novalidate>
                <h2 id="titleCliente" style="cursor:pointer;" class="text-white">Cliente</h2>
                <div class="container">
                    <div class="form-group">
                        <label for="validationCustom05" class="form-label text-white">Celular</label>
                        <input type="number" class="form-control" id="validationCustom05" required>
                        <div class="invalid-feedback">
                            Debe tener 10 dígitos mínimo.
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="validationCustom01" class="form-label text-white">Nombre y apellido</label>
                        <input type="text" class="form-control" id="validationCustom01" required>
                        <div class="invalid-feedback">
                            Debe tener un nombre.
                        </div>
                    </div>
                    <div class="form-group mx-auto" style="text-align: right; margin-top:10px;">
                        <button id="btnGuardarCliente" class="btn btn-primary" type="submit"><i class="fa-solid fa-floppy-disk"></i>  Guardar</button>
                    </div>
                </div>
            </form>
        `;
        this.appendChild(container);
        this.$celular = this.querySelector('#validationCustom05');
        this.$nombre = this.querySelector('#validationCustom01');
        this.$btnGuardar = this.querySelector('#btnGuardarCliente');

        this.titulo = this.querySelector('#titleCliente');

    }

    ventaRealizadaHandler() {
        this.$celular.value = '';
        this.$nombre.value = '';

        this.$celular.classList.remove('is-valid');
        this.$nombre.classList.remove('is-valid');

        //eliminar la clase was-validated}
        this.querySelector('.formCliente').classList.remove('was-validated');

        //habilitar el boton guardar
        this.$celular.disabled = false;
        this.$nombre.disabled = false;
        this.$btnGuardar.disabled = false;

        this.$celular.focus();
    }

    async keyupHandler(e) {
        const $celular = document.querySelector("#validationCustom05"),
            $nombre = document.querySelector("#validationCustom01"),
            $btnGuardar = document.querySelector("#btnGuardarCliente");
        // Remover evento previamente asignado
        if (e.target.value.length == 10 ) {
        
            $celular.classList.add("is-valid");

            // buscamos el cliente en la base de datos por ID
            let existClient = await clienteFound(e.target.value);
            if (existClient.nombre == undefined) {

                // si es undefined, significa que no existe el cliente en la base de datos
                $nombre.value = "";
                $nombre.focus();
                $btnGuardar.disabled = false;


                $nombre.classList.remove("is-valid");

                Swal.fire({
                    icon: 'info',
                    title: 'Cliente no encontrado',
                    text: 'Por favor, ingrese el nombre y apellido del cliente',
                    showConfirmButton: false,
                    timer: 1200
                });
            } else {
            // si existe el cliente en la base de datos
                $nombre.value = existClient.nombre;
                $btnGuardar.disabled = true;
                $nombre.disabled = true;
                $celular.disabled = true;



                let cliente = {
                    celular: $celular.value,
                    nombre: $nombre.value
                }

                // emitir evento para que se cargue el pedido
                document.dispatchEvent(new CustomEvent('clienteFound', { detail: cliente, bubbles: true, composed: true }));
                
        }
    }
}

    inputHandler(e) {
        const $celular = document.querySelector("#validationCustom05");

        if ($celular.value.length > 10) {
            $celular.value = $celular.value.substring(0, 10);
        }
    }

    keyupNombreHandler(e) {
        const $nombre = document.querySelector("#validationCustom01");
        if ($nombre.value.length > 3) {
            $nombre.classList.add("is-valid");
        }else{
            $nombre.classList.remove("is-valid");
        }
    }

    async submitFormHandler(e) {
        const $celular = document.querySelector("#validationCustom05"),
            $nombre = document.querySelector("#validationCustom01"),
            $btnGuardar = document.querySelector("#btnGuardarCliente");

        e.preventDefault();
        e.stopPropagation();
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
            console.log("formulario no valido")
        }else{
            let data= {
                $celular: $celular.value,
                $nombre: $nombre.value
            };
            let res = await guardarCliente(data);
            if (res == true) {
                Swal.fire({
                    icon: 'success',
                    title: 'Cliente guardado',
                    showConfirmButton: false,
                    timer: 1000
                });
                // quitar was-validated
                form.classList.remove('was-validated');
                // dejar el formulario disabled
                $celular.disabled = true;
                $nombre.disabled = true;
                $btnGuardar.disabled = true;

                let cliente = {
                    celular: $celular.value,
                    nombre: $nombre.value
                }

                // emitir evento para que se cargue el pedido
                document.dispatchEvent(new CustomEvent('clienteFound', { detail: cliente, bubbles: true, composed: true }));

            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al guardar cliente',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        }

        form.classList.add('was-validated');
    }

    clickHandler(e) {
        this.$celular.value = '';
        this.$nombre.value = '';

        this.$celular.classList.remove('is-valid');
        this.$nombre.classList.remove('is-valid');

        //eliminar la clase was-validated}
        this.querySelector('.formCliente').classList.remove('was-validated');

        //habilitar el boton guardar
        this.$celular.disabled = false;
        this.$nombre.disabled = false;
        this.$btnGuardar.disabled = false;

        this.$celular.focus();

        document.dispatchEvent(new CustomEvent('resetCliente'));
    }

    connectedCallback() {
        this.$celular.addEventListener("keyup", this.keyupHandler);
        this.$celular.addEventListener('input', this.inputHandler);
        this.$nombre.addEventListener("keyup", this.keyupNombreHandler)
        this.titulo.addEventListener("click", this.clickHandler);
        // Validar formulario
        form = this.querySelector('.formCliente');
        form.addEventListener('submit', this.submitFormHandler, false);
        document.addEventListener('ventaRealizada', this.ventaRealizadaHandler);
    }

    disconnectedCallback() {
        this.$celular.removeEventListener("keyup", this.keyupHandler);
        this.$celular.removeEventListener('input', this.inputHandler);
        this.$nombre.removeEventListener("keyup", this.keyupNombreHandler)
        this.titulo.removeEventListener("click", this.clickHandler);
        // Validar formulario
        form = this.querySelector('.formCliente');
        form.removeEventListener('submit', this.submitFormHandler, false);
        document.removeEventListener('ventaRealizada', this.ventaRealizadaHandler);
    }
}

customElements.define('cliente-element', Cliente);