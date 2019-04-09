import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

class LoginComponent extends PolymerElement{
    static get template(){
        return html `
            <h1>Login</h1>
        `;
    }
}

customElements.define('login-comp', LoginComponent);