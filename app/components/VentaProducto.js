import {
    buscarProducto,
    buscarProductoDescripcionLike,
    guardarProducto,
    guardarVenta,
    estadoSesion,
} from "../helpers/firebase.js";

import { BusquedaProducto } from "./BusquedaProducto.js";

export class VentaProducto extends HTMLElement {
    constructor() {
        super();
        // bind manejadorCliente
        this.manejadorCliente = this.manejadorCliente.bind(this);
        this.manejadorProducto = this.manejadorProducto.bind(this);
        this.clickHandler = this.clickHandler.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.inputHandler = this.inputHandler.bind(this);

        const container = document.createElement('div');
        container.id = 'ventaProducto-container';
        container.innerHTML = /*html*/`
        
        <busqueda-producto-element ></busqueda-producto-element>
        <hr />
        <h3 class="text-center" style="color:#fff;">Cliente: <span id="clienteName">Cliente</span> - <span class="text-center" id="clienteId">Celular</span> </h3>
        <hr />

        <div class="tablaProductos rounded">
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Descripcion</th>
                        <th scope="col" style="width: 5%; max-width: 10%;">Cantidad</th>
                        <th scope="col" style="width: 15%;">V. Unitario</th>
                        <th scope="col" style="width: 15%; min-width: 15%;">V. Total</th>
                        <th scope="col">Accion</th>
                    </tr>
                </thead>
            <tbody id="bodyTabla"></tbody>
            <tfoot>
                <tr>
                    <td class="tfootDescuento bg-dark">Descuento</td>
                    <td id="filaDescuento"><input class="inputDescuento" type="number" /></td>
                    <td class="izquierda phoneNone" colspan="2">Total: </td>
                    <td id="totalVenta">$ 0</td>
                    <td><button type="button" class="btn btn-primary" id="btnCobrarVenta">Cobrar</button></td>
                </tr>
            </tfoot>
            </table>
        </div>

        `;
        this.appendChild(container);
        this.classList.add('d-none');
        this.$clienteName = this.querySelector('#clienteName');
        this.$clienteId = this.querySelector('#clienteId');
        this.cliente = {}

    }

    manejadorCliente(e) {
        console.log("cliente encontrado")
        this.classList.remove('d-none');
        this.$clienteName.innerHTML = e.detail.nombre;
        this.$clienteId.innerHTML = e.detail.celular;
        this.cliente = e.detail;
    }

    manejadorProducto(e) {
        // esto es para usar el this de la clase
        let $this = this;
        let descuento = $this.querySelector(".inputDescuento").value;
        function milesFuncion(precio){
            return "$ " + precio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
        function sumarTotal() {
            // Si el descuento no es un número o esta vacio, asignarle 0
            if (isNaN(descuento)) {
                descuento = 0;
            }
            const $filasTabla = document.querySelectorAll(".filaTabla");
        
            // Recorrer las filas y sumar los valores totales
            let totalVenta = 0;
            $filasTabla.forEach(($fila) => {
                // Convertir el valor total de la fila a un número y eliminar el símbolo de moneda y el separador de miles
                const valorFila = parseInt($fila.querySelector("#tablaVTotal").textContent.replace("$ ", "").replace(/\./g, ""));
                totalVenta += valorFila;
            });
            document.querySelector("#totalVenta").dataset.totalfordescuento = totalVenta;
    
            // Restar el descuento
            totalVenta -= descuento;
    
            // Mostrar el total de la venta en el elemento totalVenta
            document.querySelector("#totalVenta").textContent = "$ " + totalVenta.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            // agregarle un dataset al boton cobrar para poder enviar el total de la venta
            document.querySelector("#totalVenta").dataset.total = totalVenta;
            return;
        }
        function agregarProducto(props) {
            const $bodyTabla = $this.querySelector('#bodyTabla');
            const $fila = document.createElement('tr');
            $fila.classList.add('filaTabla');
            $fila.dataset.id = props.id;
            $fila.id = "filaTabla"
            $fila.innerHTML = /*html*/`
                <td data-th="ID: " scope="row" data-id=${props.id}>${props.id}</td>
                <td data-th="Descripcion: " data-id=${props.id}>${props.descripcion}</td>
                <td data-th="Cantidad: " data-id=${props.id} >
                    <input class="filaCantidad" style="width:90%;" type="number" min="1" value= "1" data-id=${props.id} data-inventario=${props.cantidad_inventario} />
                </td>
                <td data-th="V. Unitario: " id="tablaVUnitario" data-id=${props.id} data-price=${props.precio}>${milesFuncion(props.precio)}</td>
                <td data-th="V. Total: " id="tablaVTotal" data-id=${props.id}>${milesFuncion(props.precio)}</td>
                <td data-th="Accion: " data-id=${props.id}>
                    <button id="btnEliminar" class="btn btn-danger" type="button" data-id=${props.id}>Eliminar</button>
                </td>
            `;
            $bodyTabla.appendChild($fila);
            console.log("agregar producto");
            sumarTotal();
        }
        agregarProducto(e.detail);
    }

    async clickHandler(e) {
        let $this = this;
        function sumarTotal() {
            let descuento = $this.querySelector(".inputDescuento").value;
            // Si el descuento no es un número o esta vacio, asignarle 0
            if (isNaN(descuento)) {
                descuento = 0;
            }
            const $filasTabla = document.querySelectorAll(".filaTabla");
        
            // Recorrer las filas y sumar los valores totales
            let totalVenta = 0;
            $filasTabla.forEach(($fila) => {
                // Convertir el valor total de la fila a un número y eliminar el símbolo de moneda y el separador de miles
                const valorFila = parseInt($fila.querySelector("#tablaVTotal").textContent.replace("$ ", "").replace(/\./g, ""));
                totalVenta += valorFila;
            });
            document.querySelector("#totalVenta").dataset.totalfordescuento = totalVenta;
    
            // Restar el descuento
            totalVenta -= descuento;
    
            // Mostrar el total de la venta en el elemento totalVenta
            document.querySelector("#totalVenta").textContent = "$ " + totalVenta.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            // agregarle un dataset al boton cobrar para poder enviar el total de la venta
            document.querySelector("#totalVenta").dataset.total = totalVenta;
            return;
        }
        if (e.target.matches('#btnEliminar')) {
            // el metodo closest busca el elemento mas cercano en el arbol del DOM
            // console.log(e.target.parentElement.parentElement) esto hace lo mismo que el closest
            e.target.closest('.filaTabla').remove();
            sumarTotal();
        }
        if (e.target.matches('#btnCobrarVenta')) {
            if ($this.querySelector("#tablaVTotal") === null) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "No hay productos agregados",
                });
                return;
            }
            // verificar que usuario esta realizando la venta
            console.log(estadoSesion.email);
              // obtener los productos de la venta
            let productosVenta = [];
            let $filasTabla = $this.querySelectorAll("#bodyTabla tr");
            $filasTabla.forEach((fila) => {
                let cantidad = parseInt(fila.children[2].children[0].value)
                let precio = parseInt(fila.children[3].getAttribute("data-price"))
                let producto = {
                    id: fila.children[0].textContent,
                    descripcion: fila.children[1].textContent,
                    cantidad: cantidad,
                    precio: precio,
                    total: cantidad * precio,
                };
                productosVenta.push(producto);
            });
              // obtener el total de la venta en numero
            let total = parseInt($this.querySelector("#totalVenta").getAttribute("data-total"));
              //cliente, productos, total, descuento, vendedor
            let dataVenta = {
                cliente: $this.cliente.celular,
                nombre: $this.cliente.nombre,
                productos: productosVenta,
                total,
                descuento: parseInt($this.querySelector(".inputDescuento").value),
                vendedor: estadoSesion.email,
            };
            let res = await guardarVenta(dataVenta);
            console.log(res);

            if (res === true) {
                //limpiar los elementos de la venta
                $this.querySelector("#bodyTabla").innerHTML = "";
                $this.querySelector("#totalVenta").textContent = "$ 0";
                $this.querySelector(".inputDescuento").value = "";

                //limpiar el cliente
                $this.cliente = {};
                $this.$clienteName.textContent = "Cliente";
                $this.$clienteId.textContent = "Celular";

                sumarTotal();
                Swal.fire({
                    position: 'top-end',
                    icon: "success",
                    title: "Venta realizada",
                    text: "La venta se realizo correctamente",
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                }).then(() => {
                    this.classList.add('d-none');
                    document.dispatchEvent(new CustomEvent('ventaRealizada'));
                });
            }else{
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "No se pudo guardar la venta, vuelve a intentarlo",
                });
            }
        }
    }

    changeHandler(e) {
        let $this = this;
        function sumarTotal() {
            let descuento = $this.querySelector(".inputDescuento").value;
            // Si el descuento no es un número o esta vacio, asignarle 0
            if (isNaN(descuento)) {
                descuento = 0;
            }
            const $filasTabla = $this.querySelectorAll(".filaTabla");
        
            // Recorrer las filas y sumar los valores totales
            let totalVenta = 0;
            $filasTabla.forEach(($fila) => {
                // Convertir el valor total de la fila a un número y eliminar el símbolo de moneda y el separador de miles
                const valorFila = parseInt($fila.querySelector("#tablaVTotal").textContent.replace("$ ", "").replace(/\./g, ""));
                totalVenta += valorFila;
            });
            $this.querySelector("#totalVenta").dataset.totalfordescuento = totalVenta;
    
            // Restar el descuento
            totalVenta -= descuento;
    
            // Mostrar el total de la venta en el elemento totalVenta
            $this.querySelector("#totalVenta").textContent = "$ " + totalVenta.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            // agregarle un dataset al boton cobrar para poder enviar el total de la venta
            $this.querySelector("#totalVenta").dataset.total = totalVenta;
            $this.querySelector("#totalVenta").dataset.descuento = descuento;


            return;
        }
        //comprobar si el input es el de descuento
        if (e.target.matches('.inputDescuento')) {
            //si es el input de descuento, sumar el total
            //si el total de la venta esta en 0 no hacer nada
            if (parseInt($this.querySelector("#totalVenta").dataset.total) > 0) {
                sumarTotal();
                return;
            }

            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No hay productos en la venta',
            })
            //limpiar el input descuesto
            $this.querySelector(".inputDescuento").value = "";
            return;
        }
    }

    inputHandler(e) {
        let $this = this;
        function sumarTotal() {
            let descuento = $this.querySelector(".inputDescuento").value;
            // Si el descuento no es un número o esta vacio, asignarle 0
            if (isNaN(descuento)) {
                descuento = 0;
            }
            const $filasTabla = $this.querySelectorAll(".filaTabla");
        
            // Recorrer las filas y sumar los valores totales
            let totalVenta = 0;
            $filasTabla.forEach(($fila) => {
                // Convertir el valor total de la fila a un número y eliminar el símbolo de moneda y el separador de miles
                const valorFila = parseInt($fila.querySelector("#tablaVTotal").textContent.replace("$ ", "").replace(/\./g, ""));
                totalVenta += valorFila;
            });
            $this.querySelector("#totalVenta").dataset.totalfordescuento = totalVenta;
    
            // Restar el descuento
            totalVenta -= descuento;
    
            // Mostrar el total de la venta en el elemento totalVenta
            $this.querySelector("#totalVenta").textContent = "$ " + totalVenta.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            // agregarle un dataset al boton cobrar para poder enviar el total de la venta
            $this.querySelector("#totalVenta").dataset.total = totalVenta;
            $this.querySelector("#totalVenta").dataset.descuento = descuento;


            return;
        }
        function milesFuncion(precio){
            return "$ " + precio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
        //comprobar si el input es el de unidades
        if (e.target.matches('.filaCantidad')) {
            // si se cambia el input de cantidad en la tabla de venta se recalcula el total
            const $filaTabla = e.target.parentElement.parentElement;
            const $tablaVTotal = $filaTabla.querySelector("#tablaVTotal");
            const $tablaVUnitario = $filaTabla.querySelector("#tablaVUnitario");
            let cantidad = parseInt(e.target.value);
            let precio = $tablaVUnitario.dataset.price;

            let inventario = parseInt(e.target.dataset.inventario);
            // Validar si el valor ingresado es mayor al valor máximo permitido
            if (cantidad > inventario) {
            // Mostrar alerta
                Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "La cantidad ingresada es mayor al inventario",
                });

            // Establecer el valor máximo permitido como el valor del input
            // console.log(inventario);
                e.target.value = inventario;
                cantidad = inventario;
            }
            $tablaVTotal.textContent = milesFuncion(cantidad * precio);
            // sumar el total de la venta
            sumarTotal();
    }
}

    connectedCallback() {
        console.log("conectado")
        //escuchar evento cliente seleccionado
        document.addEventListener('clienteFound', this.manejadorCliente);

        //escuchar evento producto seleccionado
        document.addEventListener('productoFound', this.manejadorProducto);

        //escuchar evento click
        this.addEventListener('click', this.clickHandler);

        this.addEventListener('change', this.changeHandler);

        this.addEventListener('input', this.inputHandler);
    }

    disconnectedCallback() {
        console.log("desconectado")
         //escuchar evento cliente seleccionado
        document.removeEventListener('clienteFound', this.manejadorCliente);

         //escuchar evento producto seleccionado
        document.removeEventListener('productoFound', this.manejadorProducto);

        //escuchar evento click
        this.removeEventListener('click', this.clickHandler);

        this.removeEventListener('change', this.changeHandler);

        this.removeEventListener('input', this.inputHandler);
    }
}

customElements.define('venta-producto-element', VentaProducto);