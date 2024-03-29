import { obtenerData, eliminarData, editarData } from "../helpers/firebase.js";


export class ListInventario extends HTMLElement {
    constructor() {
        super();
        //bind 
        this.clickHandler = this.clickHandler.bind(this);
        this.pintarProductos = this.pintarProductos.bind(this);
        this.keyupHandler = this.keyupHandler.bind(this);
        this.productoFoundHandler = this.productoFoundHandler.bind(this);
        this.verInventarioHandler = this.verInventarioHandler.bind(this);

        const container = document.createElement('div');
        container.id = 'list-inventario-container';
        container.innerHTML = /*html*/`
            <table id="tablaProductos" class="table table-hover table-dark">
                <thead>
                    <tr>
                        <th scope="col" class="col-sm-3 col-md-3 col-lg-2">ID</th>
                        <th scope="col" class="col-sm-3 col-md-3 col-lg-2">Descripcion</th>
                        <th scope="col" class="col-sm-3 col-md-3 col-lg-2">Cantidad Inventario</th>
                        <th scope="col" class="col-sm-3 col-md-3 col-lg-2">Precio Compra</th>
                        <th scope="col" class="col-sm-3 col-md-3 col-lg-2">Precio Final</th>
                        <th scope="col" class="col-sm-3 col-md-3 col-lg-2">Proveedor</th>
                        <th scope="col" class="col-sm-3 col-md-3 col-lg-2">User</th>
                        <th scope="col" class="col-sm-3 col-md-3 col-lg-2">Accion</th>
                    </tr>
                </thead>
                <tbody id="data-table-body">
                    
                </tbody>
            
            </table>
            `;
        this.appendChild(container);

        this.$dataTableBody = this.querySelector('#data-table-body');
        this.editIsActive = false;

    }


    async pintarProductos(productos) {
        this.$dataTableBody.innerHTML = '';
        productos.forEach((producto) => {
            this.$dataTableBody.innerHTML += /*html*/`
                <tr>
                    <td data-id="true">${producto.id}</td>
                    <td class="form-control-sm">${producto.descripcion}</td>
                    <td class="text-center">${producto.cantidad_inventario}</td>
                    <td data-info="${producto.precio_compra}">${producto.precio_compra}</td>
                    <td data-info="${producto.precio}">${producto.precio}</td>
                    <td class="form-control-sm text-center">${producto.proveedor}</td>
                    <td class="text-center">${producto.usuario}</td>
                    <td>
                        <button class="btn btn-danger" id="btn-delete" data-id="${producto.id}"><i data-id="${producto.id}"  class="fa fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });
        
        $('#tablaProductos').DataTable({
            responsive: true,
            autoWidth: false,
            "language": {
                "lengthMenu": "",
                "zeroRecords": "No se encontraron resultados en su busqueda",
                "searchPlaceholder": "Buscar registros",
                "info": "Mostrando de _START_ al _END_ de un total de _TOTAL_ registros",
                "infoEmpty": "No existen registros",
                "infoFiltered": "(filtrado de un total de _MAX_ registros)",
                "search": "Buscar:",
                "paginate": {
                    "first": "Primero",
                    "last": "Último",
                    "next": "Siguiente",
                    "previous": "Anterior"
                },
            },
            pageLength: 8,
            pagingType: "simple_numbers",
        });
    }
    async clickHandler(e) {
        // console.log(e.target)
        // comprobar si el elemento que se hizo click tiene el id btn-delete o en el i
        if (e.target.matches('#btn-delete') || e.target.matches('#btn-delete i')) {
            let target = e.target.matches('#btn-delete') ? e.target : e.target.parentElement;
            let res = await Swal.fire({
                title: '¿Estas seguro?',
                text: "No podras revertir esta accion!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, eliminar!'
            })

            if (res.isDismissed) return;
            // obtener el id del producto
            const id = target.dataset.id;
            await eliminarData('productos', id);
            
            // eliminar del DOM el producto
            target.parentElement.parentElement.remove();
        }
        if(e.target.tagName == 'TD'){
            if(this.editIsActive) return;
            //si es el id no se puede editar
            if(e.target.dataset.id === "true") return;
            const td = e.target;
            const value = td.innerText;
            td.innerHTML = /*HTML */`<input class="inputEditActive" type="text" style="width:90%;" value="${value}">`;
            this.editIsActive = true;
        }
    }

    async keyupHandler(e) {
        // comprobar si es el input inputEditActive
        if( e.target.matches('.inputEditActive')){
            if(e.key == 'Enter'){
                if(e.target.value == '') {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'No puedes dejar campos vacios!',
                    })
                    return;
                };
                const input = e.target;
                const value = input.value;
                const td = input.parentNode;
                td.innerHTML = value;
                this.editIsActive = false;
                let id = td.parentNode.children[0].innerText;
                let data = {
                    id,
                    descripcion: td.parentNode.children[1].innerText,
                    cantidad_inventario: parseInt(td.parentNode.children[2].innerText),
                    precio_compra: parseInt(td.parentNode.children[3].innerText),
                    precio: parseInt(td.parentNode.children[4].innerText),
                    proveedor: td.parentNode.children[5].innerText
                }
                console.log(data);
                await editarData('productos', id, data);
                
            }
        }
    }

    productoFoundHandler(e) {
    let dataArray = [];
    dataArray.push(e.detail);

    //eliminar la tabla
    $('#tablaProductos').DataTable().destroy();
    this.pintarProductos(dataArray);
    }

    verInventarioHandler = async () => {
        let productos = await obtenerData('productos');
        $('#tablaProductos').DataTable().destroy();
        this.pintarProductos(productos);
    }

    connectedCallback() {
        this.addEventListener('click', this.clickHandler);
        this.addEventListener('keyup', this.keyupHandler);
        document.addEventListener('productoFound', this.productoFoundHandler);
        document.addEventListener('verInventario', this.verInventarioHandler)
    }

    disconnectedCallback() {
        this.removeEventListener('click', this.clickHandler);
        this.removeEventListener('keyup', this.keyupHandler);
        document.removeEventListener('productoFound', this.productoFoundHandler);
        document.removeEventListener('verInventario', this.verInventarioHandler)
    }
}

customElements.define('list-inventario-element', ListInventario);