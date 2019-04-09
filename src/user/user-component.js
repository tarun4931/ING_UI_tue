import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-ajax/iron-ajax';
class UserComponent extends PolymerElement{
    static get properties(){
        return {
            accountNumber:{
                type: String
            },
            route:{
                type: String
            }
        }
    }
    static get template(){
        return html `
            <h1>User</h1>
            <app-route route="{{route}}" pattern="/:accountNumber" data="{{routeData}}" tail="{{subroute}}"></app-route>
            <iron-ajax
                auto
                url="[[getBranchURL()]]"
                method="get"
                content-type="application/json"
                on-response="handleBranches"
                on-error="handleError"
                handle-as="json"
                loading="{{loadingData}}">
            </iron-ajax>
        `;
    }
    getBranchURL(){
        return config.baseUrl + '/branchs';
    }
    
    handleBranches(event){
        console.log(event.detail.response);
        if(event.detail.response.length > 0){
            this.branches = event.detail.response;
        }
    }
    
    handleError(event){
        if(event){
          this.toastMessage = "Unable to process the request";
          this.$.toast.open();
        }
    }
}

customElements.define('user-comp', UserComponent);