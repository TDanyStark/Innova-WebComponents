export class ModalRetirarST extends HTMLElement{
    constructor(){
        super();
        this.retirarSTHandler = this.retirarSTHandler.bind(this);

        this.innerHTML = /*html*/`
            <div class="modal fade " id="modalRetirarST" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                    <div class="modal-content bg-dark text-white">
                        <div class="modal-header">
                            <h5 class="modal-title" id="modalRetirarSTLabel">Retirar Stock</h5>
                            <button type="button" id="btnCerrar" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                        </div>
                        <div class="modal-footer">
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.modal = this.querySelector('#modalRetirarST');
        this.ventanaModal = new bootstrap.Modal(this.modal);

    }

    retirarSTHandler(e){
        alert(22)
        this.ventanaModal.show();
        console.log(e.detail);
    }

    connectedCallback(){
        document.addEventListener('retirarST', this.retirarSTHandler);
    }
}

customElements.define('modal-retirar-st', ModalRetirarST);