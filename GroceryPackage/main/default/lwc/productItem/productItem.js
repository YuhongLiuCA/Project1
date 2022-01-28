import { LightningElement, api, track} from 'lwc';

export default class ProductItem extends LightningElement {
    @api 
    gproduct;

    @track
    itemQuantity = 0;

    displayNotification = true;

    //User press "+" key event handler
    addProductItem(event) {
        if(this.itemQuantity < this.gproduct.StockQuantity__c)
            this.itemQuantity++;
    }

    //User press "-" key event handler
    reduceProductItem(event) {
        if(this.itemQuantity > 0)
            this.itemQuantity--;
    }

    //Event hanlde for user direct input number in the quantity box
    handleQuantityChange(event) {
        let n = parseInt(event.target.value);
        if(n <= this.gproduct.StockQuantity__c && n >= 0) {
            this.itemQuantity = n;
        } 
    }

    //Event handler for the user press "Add to cart" button
    addToCart(event) {

        //If quantity number less than 1, reset to 0 and directly return
        if(this.itemQuantity < 1) {
            this.itemQuantity = 0;
            let component = this.template.querySelector("input");
            component.value = this.itemQuantity;
            return;
        }

        //Send custom event to parent component to handle it
        this.dispatchEvent(new CustomEvent('additem', {
            detail: {product: this.gproduct, quantity: this.itemQuantity},  
            bubbles: true
        }));

        //Reset quantity to 0 after custom event sent
        let component = this.template.querySelector("input");
        let num = this.itemQuantity;
        this.itemQuantity = 0;
        component.value = this.itemQuantity;

        //Add notification text into the card item
        this.displayNotification = false;
        let textToDisplay = this.template.querySelector(".notificationText");
        console.log(textToDisplay);
        textToDisplay.value = "" + num + " " + this.gproduct.Name + " already added into cart";
        
        //The notification text dsiplay 10 seconds 
        setTimeout(() => {
            this.displayNotification = true;
        }, 10000);
        console.log("add submitted");
    }
}