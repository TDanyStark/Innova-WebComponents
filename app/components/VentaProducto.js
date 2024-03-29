import {
    buscarProducto,
    buscarProductoDescripcionLike,
    guardarProducto,
    guardarVenta,
    estadoSesion,
    editDocMerge,
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
        this.resetClienteHandler = this.resetClienteHandler.bind(this);

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
                        <th scope="col" style="width: 15%;">Accion</th>
                    </tr>
                </thead>
            <tbody id="bodyTabla"></tbody>
            <tfoot>
                <tr>
                    
                    <td style="text-align:right; padding-right: 40px;" colspan="3">Metodo de Pago: </td>
                    <td colspan="3">
                        <select id="paymentMethod" class="form-select" style="width: 95%;" aria-label="Default select example">
                            <option selected value="Efectivo" data-value="Efectivo">Efectivo</option>
                            <option value="Davivienda - Daniel" data-value="4884 0357 8609">Davivienda - Daniel</option>
                            <option value="Nequi - Daniel" data-value="314 431 6062">Nequi - Daniel</option>
                            <option value="Ahorro a la Mano - Daniel" data-value="0 314 431 6062">Ahorro a la Mano - Daniel</option>
                            <option value="Davivienda - Oscar" data-value="5064 0007 0146">Davivienda - Oscar</option>
                            <option value="Daviplata - Oscar" data-value="310 346 9101">Daviplata - Oscar</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td class="tfootDescuento bg-dark">Descuento</td>
                    <td id="filaDescuento"><input class="inputDescuento" type="number" /></td>
                    <td style="text-align:right; padding-right: 40px;" colspan="2">Total: </td>
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

        this.paymentMethod = this.querySelector("#paymentMethod");
        this.inputDescuento = this.querySelector(".inputDescuento");

    }
    methodMiles(precio){
        return "$ " + precio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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
                <td data-th="V. Unitario: " id="tablaVUnitario" data-pricesale="${props.precio_compra}" data-id=${props.id} data-price=${props.precio}>${milesFuncion(props.precio)}</td>
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
            let pago;

            let resultado = await Swal.fire({
                title: "Pago",
                text: "Ingrese el Dinero Recibido",
                input: "number",
                inputAttributes: {
                    min: 0,
                    max: 1000000000,
                    step: 1,
                },
                showCancelButton: true,
                confirmButtonText: "Aceptar",
                cancelButtonText: "Cancelar",
                showLoaderOnConfirm: true,
                preConfirm: (abono) => {
                    abono = abono === "" ? 0 : parseInt(abono);
                    pago = abono;
                    return abono;
                },
                allowOutsideClick: () => !Swal.isLoading(),
            })
            
            pago = parseInt(pago);
            let total = parseInt($this.querySelector("#totalVenta").getAttribute("data-total"));
            if(resultado.isConfirmed){
                // verificar que el abono no sea mayor al total de la venta
                if (pago > total) {
                    let res = await Swal.fire({
                        icon: "info",
                        title: "devolver",
                        text: "Debes devolver: " + this.methodMiles(pago - total),
                        showCancelButton: true,
                        confirmButtonText: "Aceptar",
                        cancelButtonText: "Cancelar",
                    });
                    if (res.isDismissed) return;
                    
                }else{
                    let res = await Swal.fire({
                        icon: "info",
                        title: "abono",
                        text: "Abono: " + this.methodMiles(pago) + " Deuda: " + this.methodMiles(total - pago),
                        showCancelButton: true,
                        confirmButtonText: "Aceptar",
                        cancelButtonText: "Cancelar",
                    });
                    if (res.isDismissed) return;
                }
            }
            if (resultado.isDismissed) return;

            // verificar que usuario esta realizando la venta
            console.log(estadoSesion.email);
              // obtener los productos de la venta
            let productosVenta = [];
            let cantidadyInventario = [];
            let $filasTabla = $this.querySelectorAll("#bodyTabla tr");
            $filasTabla.forEach((fila) => {
                let cantidad = parseInt(fila.children[2].children[0].value)
                let precio = parseInt(fila.children[3].getAttribute("data-price"))
                let precio_compra = parseInt(fila.children[3].getAttribute("data-pricesale"))
                let producto = {
                    id: fila.children[0].textContent,
                    descripcion: fila.children[1].textContent,
                    cantidad: cantidad,
                    precio_compra,
                    precio: precio,
                    total: cantidad * precio,
                };
                productosVenta.push(producto);

                cantidadyInventario.push({
                    id: fila.children[0].textContent,
                    cantidad: cantidad,
                    inventario: parseInt(fila.children[2].children[0].getAttribute("data-inventario")),
                });

            });
            console.log(cantidadyInventario);

            let abono = pago > total ? total : pago;
            console.log(abono, "abono");

            let descuento = parseInt($this.querySelector(".inputDescuento").value)
            if (isNaN(descuento)) {
                descuento = 0;
            }
              //cliente, productos, total, descuento, vendedor
            let dataVenta = {
                celular: $this.cliente.celular,
                nombre: $this.cliente.nombre,
                productos: productosVenta,
                abono,
                total,
                descuento,
                vendedor: estadoSesion.email,
                metodoPago: this.paymentMethod.value,
            };
            let res = await guardarVenta(dataVenta);
            // editar el stock de los productos

            console.log(res);
            if (res === true) {
                // creo 
                cantidadyInventario.forEach(async (producto) => {
                    if(producto.id.startsWith("ST")) return;
                    let res2 = await editDocMerge("productos", producto.id, { cantidad_inventario: producto.inventario - producto.cantidad });
                    console.log(res2);
                    
                });
                //limpiar los elementos de la venta
                $this.querySelector("#bodyTabla").innerHTML = "";
                $this.querySelector("#totalVenta").textContent = "$ 0";
                $this.querySelector(".inputDescuento").value = "";

                //limpiar el cliente
                $this.cliente = {};
                $this.$clienteName.textContent = "Cliente";
                $this.$clienteId.textContent = "Celular";

                // limpiar pago
                this.paymentMethod.value = "Efectivo";


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
            // si el descuento es mayor al total de la venta, mostrar un mensaje de error
            console.log(parseInt($this.querySelector("#totalVenta").dataset.totalfordescuento));
            console.log(parseInt(e.target.value));
            if (parseInt($this.querySelector("#totalVenta").dataset.totalfordescuento) < parseInt(e.target.value)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'El descuento no puede ser mayor al total de la venta',
                });
                //limpiar el input descuesto
                $this.querySelector(".inputDescuento").value = "";
                return;
            }

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
            //limpiar el input descuento
            $this.querySelector(".inputDescuento").value = "";
            return;
        }
        
        if(e.target === this.paymentMethod){
            // console.log(e.target.options)
            // console.log(e.target.selectedIndex);
            // console.log(e.target.options[e.target.selectedIndex].getAttribute("data-value"));

            let paymentMethod = e.target.options[e.target.selectedIndex].getAttribute("data-value");

            Swal.fire({
                position: 'top-end',
                icon: 'info',
                title: 'El metodo de pago es: \n' + paymentMethod,
                color: 'red',
                showConfirmButton: true,
            })
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
            return;
        }
    }

    resetClienteHandler(e) {
        // agregarle d-none a this
        this.classList.add("d-none");
        // limpiar el nombre del cliente
        this.$clienteName.textContent = "";
        this.$clienteId.textContent = "";

        // limpiar la tabla de venta
        this.querySelector('#bodyTabla').innerHTML = "";

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

        document.addEventListener('resetCliente', this.resetClienteHandler);
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

        document.removeEventListener('resetCliente', this.resetClienteHandler);
    }
}

customElements.define('venta-producto-element', VentaProducto);