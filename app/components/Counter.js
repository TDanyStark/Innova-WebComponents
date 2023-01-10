export class Counter extends HTMLElement{

    constructor() {
        super();
        this.attachShadow({mode:'open'});
        this.shadowRoot.innerHTML = /*html*/`
        <style>
            h2{
                color: red;
            }
        </style>
        <h2>0</h2>
        <button>+</button>
        <button id="CerrarSesion">Cerrar Sesion</button>
        `;
        this.$h2 = this.shadowRoot.querySelector('h2');
        this.$button = this.shadowRoot.querySelector('button');
        this.$buttonCerrarSesion = this.shadowRoot.querySelector('#CerrarSesion');

        
    }

    connectedCallback(){
        this.$button.addEventListener('click', () => {
            this.$h2.textContent = Number(this.$h2.textContent) + 1;
        });
        this.$buttonCerrarSesion.addEventListener('click', () => {
            location.hash = '#/login';
        });
    }

    disconnectedCallback(){
        this.$button.removeEventListener('click', () => {
            this.$h2.textContent = Number(this.$h2.textContent) + 1;
        });

        this.$buttonCerrarSesion.removeEventListener('click', () => {
            location.hash = '#/login';
        });
    }

}

customElements.define('counter-element', Counter);