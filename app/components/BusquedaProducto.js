import {
    buscarProducto,
    buscarProductoDescripcionLike,
    guardarProducto,
    guardarVenta,
    estadoSesion,
    obtenerDataforId,
} from "../helpers/firebase.js";

export class BusquedaProducto extends HTMLElement {
    constructor() {
        super();
        
        this.keyupHandler = this.keyupHandler.bind(this);
        this.inputHandler = this.inputHandler.bind(this);
        this.clickulHandler = this.clickulHandler.bind(this);
        this.clientFoundHandler = this.clientFoundHandler.bind(this);
        this.clickResultadosHandler = this.clickResultadosHandler.bind(this);
        this.servicioTecnicoRegistradoHandler = this.servicioTecnicoRegistradoHandler.bind(this);

        const container = document.createElement('div');
        container.id = 'busquedaProducto-container';
        container.innerHTML = /*html*/`
        <div class="tablaBusqueda rounded">
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Descripcion</th>
                    </tr>
                </thead>
                <tbody id="bodyTablaBusqueda">
                    <tr>
                        <td data-th="ID: " >
                            <input class="form-control busquedaID" id="busquedaID" type="text" autocomplete="off" />
                        </td>
                        <td data-th="Descripcion: ">
                            <input class=" form-control busquedaDescripcion" id="busquedaDescripcion" type="text" autocomplete="off"/>
                            <div id="resultadosDescripcion">
                                <ul 
                                class="list-group bg-dark d-none" 
                                style="
                                    position:absolute;
                                    max-height: 200px; 
                                    overflow-y: auto;
                                    cursor:pointer; 
                                    z-index:999;
                                "></ul>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        `;
        this.appendChild(container);
        this.$busquedaID = this.querySelector('#busquedaID');
        this.$busquedaDescripcion = this.querySelector('#busquedaDescripcion');
        this.$resultadosDescripcion = this.querySelector("#resultadosDescripcion ul");

        this.cliente= {};
    }

    clientFoundHandler(e) {
        this.cliente = e.detail;
        this.$busquedaID.value = '';
        this.$busquedaID.focus();
    }

    async keyupHandler(e) {
        if (e.key === 'Enter') {
            if (this.$busquedaID.value === '') return;

            if(this.$busquedaID.value === 'ST'){
                let recibo = await obtenerDataforId('data', 'recibo');
                this.cliente = {...this.cliente, recibo: recibo};
                document.dispatchEvent(new CustomEvent('modalServicioTecnico', { bubbles: true, detail: this.cliente }));
                return;
            }
            let res = await buscarProducto(this.$busquedaID.value);
            if (res === false) {
                document.dispatchEvent(new CustomEvent('saveProduct', { bubbles: true, detail: this.$busquedaID.value }));
                this.$busquedaID.value = '';
                this.$busquedaDescripcion.value = '';
                this.$busquedaDescripcion.focus();
                return;
            }else{
                async function revisarProducto(id) {
                    const $filasTabla = Array.from(document.querySelectorAll(".filaTabla"));
                    let existe = false;
                    await Promise.all($filasTabla.map(async ($fila) => {
                        if ($fila.dataset.id == id) {
                        existe = true;
                        }
                    }));
                    return existe;
                }
                if (await revisarProducto(this.$busquedaID.value)) {
                    Swal.fire({
                        icon: "error",
                        title: "El producto ya existe en la tabla",
                        showConfirmButton: false,
                        timer: 1000,
                    }).then(()=>{
                        this.$busquedaID.value = '';
                        this.$busquedaDescripcion.value = '';
                        this.$busquedaID.focus();

                    });
                    return;
                }
                // comprobar si el inventario es mayor a 0
                if (res.cantidad_inventario <= 0) {
                    Swal.fire({
                        icon: "error",
                        title: "El producto no tiene inventario",
                        showConfirmButton: false,
                        timer: 1000,
                    }).then(()=>{
                        this.$busquedaID.value = '';
                        this.$busquedaDescripcion.value = '';
                        this.$busquedaID.focus();

                    });
                    return;
                }
                this.$busquedaID.value = '';
                this.$busquedaDescripcion.value = '';
                document.dispatchEvent(new CustomEvent('productoFound', { bubbles: true, detail: res }));
            }
        }
    }

    async inputHandler(e) {
         // para que el id busqueda se ponga en mayusculas instantaneamente
        if (e.target.id === "busquedaID" || e.target.id === "idProducto") {
            e.target.value = e.target.value.toUpperCase();
            // quitar los espacios en blanco
            e.target.value = e.target.value.replace(/\s/g, "");
            return;
        }
        if (this.$busquedaDescripcion.value === "" || this.$busquedaDescripcion.value.length < 3) {
            return;
        }
        let resultado = await buscarProductoDescripcionLike(this.$busquedaDescripcion.value);

        //eliminar clase d-none para mostrar los resultados
        this.$resultadosDescripcion.classList.remove("d-none");

        //limpiar el ul para que no se repitan los resultados
        this.$resultadosDescripcion.innerHTML = "";

        //si no hay resultados, mostrar mensaje
        if (resultado.length === 0) {
            this.$resultadosDescripcion.innerHTML = /*html*/ `<li class="list-group-item" tabindex="-1" id="sinResult">No hay resultados</li>`;
            return;
        }

        //si hay resultados, mostrarlos
        resultado.forEach((producto) => {
            const $li = document.createElement("li");
            $li.classList.add("list-group-item");
            $li.classList.add("list-group-item-action");
            $li.classList.add("list-group-item-dark");

            // la clase list-resultados-busqueda es para poder seleccionar con la tecla enter
            $li.classList.add("list-resultados-busqueda");
            $li.dataset.id = producto.id;

            //añadirle tabindex para que se pueda seleccionar con el teclado
            $li.tabIndex = 0;
            $li.textContent = producto.descripcion;
            this.$resultadosDescripcion.appendChild($li);
        });
    }

    async clickulHandler(e) {
        if (e.target.id === "sinResult") return;
        async function revisarProducto(id) {
            const $filasTabla = Array.from(document.querySelectorAll(".filaTabla"));
            let existe = false;
            await Promise.all($filasTabla.map(async ($fila) => {
                if ($fila.dataset.id == id) {
                existe = true;
                }
            }));
            return existe;
        }
        let res = await buscarProducto(e.target.dataset.id);
        if (await revisarProducto(res.id)) {
            Swal.fire({
                icon: "error",
                title: "El producto ya existe en la tabla",
                showConfirmButton: false,
                timer: 1000,
            });
            return;
        }
        if (res.cantidad_inventario <= 0) {
            Swal.fire({
                icon: "error",
                title: "El producto no tiene inventario",
                showConfirmButton: false,
                timer: 1000,
            }).then(()=>{
                this.$busquedaID.value = '';
                this.$busquedaDescripcion.value = '';
                this.$busquedaID.focus();

            });
            return;
        }

        this.$busquedaID.value = '';
        this.$busquedaDescripcion.value = '';
        this.$busquedaID.focus();
        this.$resultadosDescripcion.innerHTML = "";
        this.$resultadosDescripcion.classList.add("d-none");
        document.dispatchEvent(new CustomEvent('productoFound', { bubbles: true, detail: res }));
    }

    clickResultadosHandler(e) {
        this.$busquedaDescripcion.value = "";
        this.$resultadosDescripcion.innerHTML = "";
        this.$resultadosDescripcion.classList.add("d-none");
    }

    servicioTecnicoRegistradoHandler(e) {
        this.$busquedaID.value = '';
        this.$busquedaDescripcion.value = '';
        this.$busquedaID.focus();
    }


    connectedCallback() {
        this.$busquedaID.addEventListener('keyup', this.keyupHandler);
        this.$resultadosDescripcion.addEventListener('click', this.clickulHandler);
        this.addEventListener('input', this.inputHandler);
        this.addEventListener('click', this.clickResultadosHandler);
        document.addEventListener('clienteFound', this.clientFoundHandler);
        document.addEventListener('servicioTecnicoRegistrado', this.servicioTecnicoRegistradoHandler);
    }

    disconnectedCallback() {
        this.$busquedaID.removeEventListener('keyup', this.keyupHandler);
        this.$resultadosDescripcion.removeEventListener('click', this.clickulHandler);
        this.removeEventListener('input', this.inputHandler);
        this.removeEventListener('click', this.clickResultadosHandler);
        document.removeEventListener('clienteFound', this.clientFoundHandler);
        document.removeEventListener('servicioTecnicoRegistrado', this.servicioTecnicoRegistradoHandler);
    }
}
customElements.define('busqueda-producto-element', BusquedaProducto);