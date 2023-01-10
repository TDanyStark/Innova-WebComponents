import { Header } from "./Header.js";
export class Home extends HTMLElement {
    constructor() {
        super();
        const container = document.createElement('div');
        container.id = 'home-container';
        container.innerHTML = /*html*/`
            <header-element></header-element>
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <h1>Home</h1>
                    </div>
                </div>
            </div>
        `;
        this.appendChild(container);
    }
}
customElements.define('home-element', Home);