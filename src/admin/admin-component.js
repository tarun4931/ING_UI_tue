import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-textarea.js';
import { sharedStyle } from '../shared-style/shared-style.js';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-spinner/paper-spinner.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/app-route/app-route.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-spinner/paper-spinner.js';
import '@polymer/paper-toast/paper-toast.js';

class AdminComponent extends PolymerElement{
    constructor(){
        super();
    }
    static get properties(){
        return {
            route:{
                type: Object
            },
            loadingData:{
                type: Boolean,
                value: true
            },
            accountDetails:{
                type: Object,
                value:{
                    name:'',
                    address:'',
                    dob:'',
                    gender:'',
                    branch:''
                }
            },
            branches:{
                type: Array,
                valu: []
            }
        }
    }
    static get template(){
        return html `
            ${sharedStyle}
            <style>
            	iron-form {
            		width:50%;
            		margin-left:10%;
            		margin-top:2%;
            	}
            	.btn {
            		color:
            	}
            </style>
            <h1>Welcome Admin</h1>
            <app-route route="{{route}}" pattern="/:id" data="{{routeData}}" tail="{{subroute}}"></app-route>
            <paper-toast id="toast" text="[[toastMessage]]" with-backdrop horizontal-align="center" vertical-align="middle"></paper-toast>
            <div class="col-sm-12 d-flex justify-content-center align-content-center">
                <paper-spinner active="{{loadingData}}"></paper-spinner>
            </div>
            <div class="col-sm-6 col-md-6 offset-md-2 border">
                <iron-form id="accForm">
                        <form>
                            <div class="row col-sm-12 col-md-12 d-flex justify-content-center">
                                <h1>Create Account<h1>
                            </div>
                            <div class="form-group">
                                <paper-input type="text" placeholder="Enter UserName" label="userName" value="{{accountDetails.name}}" auto-validate required error-message="Field is required"></paper-input>
                            </div>
                            <div class="form-group">
                                <paper-textarea type="text" placeholder="Enter Address" label="Address" value="{{accountDetails.address}}" cols="5" rows="3" auto-validate required error-message="Field is required"></paper-textarea>
                            </div>
                            <div class="form-group">
                                <paper-input type="date" placeholder="Enter DOB" label="Date of Birth" value="{{accountDetails.dob}}" auto-validate required error-message="Field is required"></paper-input>
                            </div>
                            <div class="form-group">
                                <paper-dropdown-menu label="Gender" required>
        							<paper-listbox slot="dropdown-content" attr-for-selected="name" selected="{{accountDetails.gender}}">
          								<paper-item name="male">Male</paper-item>
        								<paper-item name="female">Female</paper-item>
        							</paper-listbox>
        						</paper-dropdown-menu>
                            </div>
                            <div class="form-group">
                                <paper-dropdown-menu label="Branch" required>
                                    <paper-listbox slot="dropdown-content" attr-for-selected="name" selected="{{accountDetails.branch}}">
                                        <template is="dom-repeat" items="[[branches]]">
                                          <paper-item name="{{item.name}}">{{item.name}}</paper-item>
                                        </template>
        							</paper-listbox>
        						</paper-dropdown-menu>
                            </div>
                            <div class="form-group">
                                <paper-button raised on-click="createAccount">Create</paper-button>
                                <paper-button raised on-click="reset">Cancel</paper-button>
                            </div>
                        </form>
                </iron-form>
             </div>
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
            <iron-ajax
                id="ajax"
                url="[[getCreateAccountURL()]]"
                method="post"
                body="[[accountDetails]]"
                content-type="application/json"
                on-response="handleAccountCreation"
                on-error="handleError"
                handle-as="json"
                loading="{{loadingData}}">
            </iron-ajax>
        `;
    }
    getBranchURL(){
        return config.baseUrl + '/branchs';
    }
    createAccount(){
        if(this.$.accForm.validate()){
            this.$.ajax.generateRequest();
        }
    }
    getCreateAccountURL(){
        return config.baseUrl + '/signup';
    }
    reset(){
        this.$.accForm.reset();
    }
    handleBranches(event){
        if(event.detail.response.length > 0){
            this.branches = event.detail.response;
        }
    }
    handleAccountCreation(event){
        if(event.detail.response){
            this.toastMessage = event.detail.response.msg;
            this.$.toast.open();
            this.reset();
        }
    }
    handleError(event){
        if(event){
          this.toastMessage = "Unable to process the request";
          this.$.toast.open();
        }
    }
}

customElements.define('admin-comp', AdminComponent);