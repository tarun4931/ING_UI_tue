import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/app-route/app-route.js';
class AdminComponent extends PolymerElement{
    constructor(){
        super();
    }
    static get properties(){
        return {
            route:{
                type: Object
            }
        }
    }
    static get template(){
        return html `
            <h1>Admin</h1>
            <app-route route="{{route}}" pattern="/:id" data="{{routeData}}" tail="{{subroute}}"></app-route>
            <div class="col-sm-8 offset-sm-1 border">
                Welcome Admin
            </div>
            ID : [[routeData.id]]
        `;
    }
}

customElements.define('admin-comp', AdminComponent);