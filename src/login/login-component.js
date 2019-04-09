import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-input/paper-input.js';
import { sharedStyle } from '../shared-style/shared-style.js';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-spinner/paper-spinner.js';
import '@polymer/paper-toast/paper-toast.js';
class LoginComponent extends PolymerElement{
    constructor(){
        super();
    }
    static get properties(){
        return {
            userName:{
                type: String
            },
            password:{
                type: String
            },
            userDetails:{
                type: Object
            },
            route:{
                type: Object
            },
            loadingData:{
                type: Boolean,
                value: false
            },
            toastMessage:{
                type: String
            },
            user:{
                type: Object
            }
        }
    }
    static get template(){
        return html `
            ${sharedStyle}
            <paper-toast id="toast" text="[[toastMessage]]" with-backdrop horizontal-align="center" vertical-align="middle"></paper-toast>
            <div class="container">
                <div class="col-sm-12 d-flex justify-content-center align-content-center">
                    <paper-spinner active="{{loadingData}}"></paper-spinner>
                </div>
                <div class="col-sm-6 col-md-6 offset-md-2 border">
                    <iron-form id="loginForm">
                        <form>
                            <div class="row col-sm-12 col-md-12 d-flex justify-content-center">
                                <h1>Login<h1>
                            </div>
                            <div class="form-group">
                                <paper-input type="text" label="UserName" placeholder="Enter UserName" value="{{userName}}" auto-validate required error-message="Field is required"></paper-input>
                            </div>
                            <div class="form-group">
                                <paper-input type="password" label="Password" placeholder="Enter Password" value="{{password}}" auto-validate required error-message="Field is required"></paper-input>                        
                            </div>
                            <div class="form-group">
                                <paper-button raised on-click="submitUser">Submit</paper-button>
                                <paper-button raised on-click="reset">Cancel</paper-button>
                            </div>
                        </form>
                    </iron-form>
                </div>
            </div>
            <iron-ajax
                id="ajax"
                url="[[getLoginURL()]]"
                method="post"
                body="[[user]]"
                content-type="application/json"
                on-response="handleResponse"
                on-error="handleError"
                handle-as="json"
                loading="{{loadingData}}">
            </iron-ajax>
        `;
    }
    submitUser(){
        if(this.$.loginForm.validate()){
            this.user = {
                "name": this.userName,
                "password": this.password
            }
            this.$.ajax.generateRequest();
        }
    }
    reset(){
        this.$.loginForm.reset();
    }
    getLoginURL(){
        return config.baseUrl + '/login'
    }
    handleResponse(event){
        if(event.detail.response && event.detail.response.status){
            this.userDetails = event.detail.response;
            this.reset();
            sessionStorage.setItem('userDetails', JSON.stringify(this.userDetails));
            this.dispatchEvent(new CustomEvent('login', {bubbles: true, composed: true, detail:{"login":true}}))
            if(this.userDetails.role === 'ADMIN'){
                this.set('route.path', '/admin');
            }else{
                let url = '/user/'+ this.userDetails.accountnumber;
                this.set('route.path', url);
            }
        }else{
            this.toastMessage = "Invalid Credentials";
            this.$.toast.open();
        }
    }
    handleError(event){
        if(event){
          this.toastMessage = "Unable to process the request";
          this.$.toast.open();
        }
    }
}

customElements.define('login-comp', LoginComponent);