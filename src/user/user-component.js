import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-ajax/iron-ajax';
import '@polymer/paper-spinner/paper-spinner.js';
import '@polymer/paper-toast/paper-toast.js';
import {sharedStyle} from '../shared-style/shared-style.js';
import '@vaadin/vaadin-accordion/vaadin-accordion.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-form/iron-form.js';
class UserComponent extends PolymerElement{
    connectedCallback(){
        super.connectedCallback();
    }
    static get properties(){
        return {
            accountNumber:{
                type: String
            },
            route:{
                type: String
            },
            routeData:{
                type: Object
            },
            userURL:{
                type: String,
                value: config.baseUrl
            },
            userDetails:{
                type:Object,
                value:{}
            },
            allUsers:{
                type: Array,
                value: []
            },
            transferUserAccount:{
                type: String
            },
            amount:{
                type: String
            },
            transferDetails:{
                type: Object,
                value: {}
            },
            balanceDetails:{
                type: Object,
                value: {}
            }
            
        }
    }
    static get template(){
        return html `
            ${sharedStyle}
            <app-route route="{{route}}" pattern="/:accountNumber" data="{{routeData}}" tail="{{subroute}}"></app-route>
            <paper-toast id="toast" text="[[toastMessage]]" with-backdrop horizontal-align="center" vertical-align="middle"></paper-toast>
            <div class="col-sm-12 d-flex justify-content-center align-content-center">
                <paper-spinner active="{{loadingData}}"></paper-spinner>
            </div>
            <div class="col-sm-8 col-md-8 offset-md-1">
                <div class="row">
                    <div>Welcome <span class="text-primary">[[userDetails.name]]</span></div>
                    <div class="text-danger" style="margin-left:180px;">Available Balance: [[balanceDetails.balance]]</div>
                    
                    <div class="col-sm-12 mt-4 mb-3">
                    <vaadin-accordion>
                        <vaadin-accordion-panel>
                            <div slot="summary">Profile Details</div>
                            <vaadin-vertical-layout>
                                <div class="col-sm-12">
                                   <div class="form-group">
                                        UserName: [[userDetails.name]]
                                   </div>
                                   <div class="form-group">
                                        AccountNumber: [[userDetails.accountNumber]]
                                   </div>
                                   <div class="form-group">
                                        Address: [[userDetails.address]]
                                   </div>
                                   <div class="form-group">
                                        Branch: [[userDetails.branch]]
                                   </div>
                                   <div class="form-group">
                                        DOB: [[userDetails.dob]]
                                   </div>
                                </div>
                            </vaadin-vertical-layout>
                        </vaadin-accordion-panel>
                        <vaadin-accordion-panel>
                            <div slot="summary">Fund Transfer</div>
                            <vaadin-vertical-layout>
                                <iron-form id="transferForm">
                                    <form>
                                        <div class="col-sm-6">
                                            <div class="form-group">
                                                <paper-input type="text" name="amount" label="Amount" placeholder="Enter Amount to Transafer" value="{{amount}}" pattern="[0-9]*" auto-validate error-message="Should be valid Number" required></paper-input>
                                            </div>
                                            <div class="form-group">
                                                <paper-dropdown-menu label="Select User" required>
                                                    <paper-listbox slot="dropdown-content" attr-for-selected="name" selected="{{transferUserAccount}}">
                                                        <template is="dom-repeat" items="[[allUsers]]">
                                                        <paper-item name="{{item.accountNumber}}">{{item.name}}</paper-item>
                                                        </template>
                                                    </paper-listbox>
                                                </paper-dropdown-menu>
                                            </div>
                                            <div class="form-group">
                                                <paper-button raised on-click="transfer">Transfer</paper-button>
                                            </div>
                                        </div>
                                    </form>
                                </iron-form>
                            </vaadin-vertical-layout>
                        </vaadin-accordion-panel>
                    </vaadin-accordion>
                    </div>
                </div>
            </div>
            <iron-ajax
                auto
                url="[[userURL]]/users/[[routeData.accountNumber]]"
                method="get"
                content-type="application/json"
                on-response="handleUserData"
                on-error="handleError"
                handle-as="json"
                loading="{{loadingData}}">
            </iron-ajax>
            <iron-ajax
                id="balanceInfo"
                url="[[userURL]]/users/balance/[[routeData.accountNumber]]"
                method="get"
                content-type="application/json"
                on-response="handleBalance"
                on-error="handleError"
                handle-as="json"
                loading="{{loadingData}}">
            </iron-ajax>
            <iron-ajax
                auto
                url="[[userURL]]/users"
                method="get"
                content-type="application/json"
                on-response="handleAllUsers"
                on-error="handleError"
                handle-as="json"
                loading="{{loadingData}}">
            </iron-ajax>
            <iron-ajax
                id="fundTransfer"
                url="[[userURL]]/transfer"
                method="post"
                body="[[transferDetails]]"
                content-type="application/json"
                on-response="handleFundTransfer"
                on-error="handleError"
                handle-as="json"
                loading="{{loadingData}}">
            </iron-ajax>
        `;
    }
    transfer(){
        if(this.$.transferForm.validate()){
            this.transferDetails = {
                "srcAcct": this.routeData.accountNumber,
                "transferAmount": parseInt(this.amount),
                "destAcct": this.transferUserAccount
            }
            // console.log(this.transferDetails);
            this.$.fundTransfer.generateRequest();
        }
    }
    handleUserData(event){
        if(event.detail.response){
            this.userDetails = event.detail.response;
            this.$.balanceInfo.generateRequest();
        }
    }
    handleAllUsers(event){
        if(event.detail.response.length > 0){
            this.allUsers = event.detail.response.filter((user) => {
                return user.accountNumber != this.routeData.accountNumber;
            })
        }
    }
    handleBalance(event){
        if(event.detail.response){
            this.balanceDetails = event.detail.response;
        }
    }
    handleFundTransfer(event){
        if(event.detail.response && event.detail.response.status){
            this.toastMessage = event.detail.response.msg;
            this.$.toast.open();
            this.$.transferForm.reset();
            this.$.balanceInfo.generateRequest();
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