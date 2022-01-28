import { api, LightningElement } from 'lwc';

export default class CartItem extends LightningElement {
    @api
    gcart=[];

    //User click "Place order" icon handler
    placeOrder(event) {        
        //Get all updated quantity number that user may change
        let newGcart = [];
        let inputAll = this.template.querySelectorAll("lightning-input");
        for(let i = 0; i < inputAll.length; i++){
            console.log("All input="+inputAll[i].value);
      
            let newCartItem = {
            id__c: this.gcart[i].id__c,
            Name: this.gcart[i].Name,
            Price__c: this.gcart[i].Price__c,
            Category__c: this.gcart[i].Category__c,
            Description__c: this.gcart[i].Description__c,
            Quantity__c: inputAll[i].value,
            Image__c: this.gcart[i].Image__c,
            Product__c: this.gcart[i].Product__c, 
            Cart__c: this.gcart[i].Cart__c
            };

            newGcart.push(newCartItem);
        }
        
        //Generate custom event for order generation
        this.dispatchEvent(new CustomEvent('placeorder', {
            detail: newGcart,  
            bubbles: true
        }));
    }

    //User click item "Delete" icon handle, delete on item from cart
    handleItemDelete(event) {
        let v = event.target.value;
        
        //Send custom event of new cart
        this.dispatchEvent(new CustomEvent('deleteitem', {
            detail: v,  
            bubbles: true
        }));
    }

    //Event handler for quantity change
    handleQuantityChange(event) {
        let v = event.detail.value;
        let component = event.target;
        let inputAll = this.template.querySelectorAll("lightning-input");
        let quantityAll = [];
        for(let i = 0; i < inputAll.length; i++) {
            quantityAll.push(inputAll[i].value);
        }
        console.log(v);
        this.dispatchEvent(new CustomEvent('quantitychange', {
            detail: quantityAll,
            bubbles: true
        }));
    }
}