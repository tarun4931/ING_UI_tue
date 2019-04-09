import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-input/paper-input.js';
import { sharedStyle } from '../shared-style/shared-style.js';
import '@polymer/paper-button/paper-button';
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
            }
        }
    }
    static get template(){
        return html `
            ${sharedStyle}
            <h1>Login</h1>
            <div class="container">
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
                
                url="[[getLoginURL()]]"
                method="get"
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
            console.log(this.userName, this.password);
            this.set('route.path', '/admin/1');
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
            sessionStorage.setItem('userDetails', JSON.parse(this.userDetails));
        }
    }
}

customElements.define('login-comp', LoginComponent);