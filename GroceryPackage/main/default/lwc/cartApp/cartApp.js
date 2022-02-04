import { LightningElement, wire, api, track  } from 'lwc';
import GetProducts from "@salesforce/apex/ProductController.GetProducts";
import SaveProducts from "@salesforce/apex/ProductController.SaveProducts";
import GetAccountList from "@salesforce/apex/AccountController.GetAccountList"; 
import SaveCarts from "@salesforce/apex/CartController.SaveCarts"; 
import getCart from '@salesforce/apex/CartController.getCart';
import SaveItems from "@salesforce/apex/ItemController.SaveItems"; 
import My_Resource from '@salesforce/resourceUrl/myResource';


export default class CartApp extends LightningElement {
    @track groceryProducts = [];
    @track cartItems = [];
    @track displayProduct = true;
    @track cartRecord ={
        Account__c: '',
        Order_Number__c: 0,
        Quantity__c: 0,
        Total_price__c: (0.0).toFixed(2)
    };
    @track currentAccount;
    @track accountList = [];
    @track optionList = [];
    accountValue = '';
    displayNotification = true;

    constructor() {
        super();
        //Initialize 5 products if no products in Database
        GetProducts()
          // Callback on a response
          .then((result) => {
            this.groceryProducts = [...result];
            let fruits = [{Name: "Apple", ProductCode: "001", Category__c:"NewArrival", Image__c: "Apple.jpg",Price__c: 2.75, Description:"A pound of apple", Quantity__c: 1600,StockQuantity__c: 1600},
            {Name: "Pear", ProductCode: "002", Category__c:"BestSeller", Image__c: "Pear.jpg",Price__c: 1.75, Description:"A pound of pear", Quantity__c: 1800,StockQuantity__c: 1800}
                    //{name: "Pear",image:"Pear.jpg",price:1.75,quantity:0,inc:"PearInc",dec:"PearDec",category:"BestSeller"},
                    //{name: "Banana",image:"Bananas.jpg",price:0.99,quantity:0,inc:"BananaInc",dec:"BananaDec",category:"OnSale"},
                    //{name: "Orange",image:"Oranges.jpg",price:1.09,quantity:0,inc:"OrangeInc",dec:"OrangeDec",category:"OnSale"},
                    //{name: "Grape",image:"Grapes.jpg",price:3.99,quantity:0,inc:"GrapeInc",dec:"GrapeDec",category:""}
            ];
            if(this.groceryProducts.length === 0) {
                SaveProducts({newProducts: fruits});
            } else {
                //Judge if current Database has grocery products or not, if not save default products
                let groceryExist = 0;
                for(let i = 0; i < this.groceryProducts.length; i++) {
                    if(this.groceryProducts.Quantity__c === null) {
                        continue;
                    } else {
                        groceryExist = 1;
                    }
                }
                if(groceryExist === 0){
                    SaveProducts({newProducts: fruits});
                }
            }
          })
          // Callback if there's an error
          .catch((error) => {
            console.log(error);
          }); 
    }

    //Add item into cart handler
    addItem(event) {
        let n;
        if(this.cartItems) {
            n = this.cartItems.length;
        } else {
            n = 0;
        }
        let item = {
            id__c: n,
            Name: event.detail.product.Name,
            Price__c: event.detail.product.Price__c,
            Category__c: event.detail.product.Category__c,
            Description__c: event.detail.product.Description,
            Quantity__c: event.detail.quantity,
            Image__c: event.detail.product.Image__c,
            Product__c: event.detail.product.Id, 
            Cart__c: 0,
            ItemPrice: (event.detail.product.Price__c * event.detail.quantity).toFixed(2)
        };

        //If item name already exists in Cart list, combine two items together
        for(let i = 0; i < this.cartItems.length; i++) {
            if(item.Name === this.cartItems[i].Name) {
                this.cartItems[i].Quantity__c += item.Quantity__c;
                return;
            }
        }

        //If item is new, add item into cart items
        this.cartItems.push(item);

        //Calculate new cart
        this.calculateCartQuantity();
    }

    calculateCartQuantity() {
        let itemQuantity = 0;
        let totalPrice = 0.0;

        //Calculate total prcie and total qunatity in the cart
        for(let i = 0; i < this.cartItems.length; i++) {
            itemQuantity += this.cartItems[i].Quantity__c;
            totalPrice += this.cartItems[i].Quantity__c * this.cartItems[i].Price__c;
        }
        this.cartRecord.Quantity__c = itemQuantity;
        this.cartRecord.Total_price__c = totalPrice.toFixed(2);  

        //Set orderNumber, if have n items, then the order number is n+1
        let orderNumber = 1;
        if(this.currentAccount.Carts__r) {
            orderNumber = this.currentAccount.Carts__r.length + 1;
        }
        this.cartRecord.Order_Number__c = orderNumber;
    }

    //Place order click event handler
    placeOrder(event) {

        //Calculate new cart
        this.calculateCartQuantity();     
     
        let carts=[];
        carts.push(this.cartRecord);
        let orderNumber = this.cartRecord.Order_Number__c;
        SaveCarts({carts: carts}).then((result1 => {
            //Get new cart object Id after saving it
            getCart({order_num: orderNumber}).then((result) => {
                let id_cart = result[0].Id;
                
                let newItems =[];
                //Save all items in the cart field Cart__c as new cart Id
                for(let i = 0; i < this.cartItems.length; i++) {
                    this.cartItems[i].Cart__c = id_cart;
                    //Set new Item object
                    let newItem = {
                        id__c: this.cartItems[i].id__c,
                        Name: this.cartItems[i].Name,
                        ItemPrice__c: this.cartItems[i].Price__c,
                        Quantity__c: this.cartItems[i].Quantity__c,
                        Product__c: this.cartItems[i].Product__c, 
                        Cart__c: this.cartItems[i].Cart__c
                    };
                    console.log(newItem);
                    newItems.push(newItem);
                }
                //Save new items into database
                SaveItems({newItems: newItems}).then(result2 => {
                    //Add notification text into the cart tab
                    this.displayNotification = false;
                    let textToDisplay = this.template.querySelector(".cartNotificationText");
                    console.log(textToDisplay);
                    textToDisplay.value = "Order placed, total " + this.cartRecord.Quantity__c + "items, total cost is $" + this.cartRecord.Total_price__c;
        
                    //The notification text dsiplay 10 seconds 
                    setTimeout(() => {
                        this.displayNotification = true;
                    }, 10000);
                    this.cartItems = [];
                    console.log("Good0");
                    if(!this.currentAccount.Carts__r) {
                        this.currentAccount.Carts__r = [];
                    }
                    this.currentAccount.Carts__r.push(this.cartRecord);
                    let index = this.findAccountIndex(this.accountList, this.currentAccount.Name);
                    console.log("Good1 "+index);
                    if(!this.accountList[index].Carts__r) {
                        this.accountList[index].Carts__r = [];
                    }
                    this.accountList[index].Carts__r.push(this.cartRecord);
                    console.log("Good2");
                    this.calculateCartQuantity();
                    console.log(this.cartRecord);
                }).catch(error => {console.log(error)});
            }).catch(error => {console.log(error);})
        })).catch(error => {
            console.log(error);
        });
    }

    //When User delete on item from Cart
    handleDeleteItem(event) {
        let v = event.detail;
        for(let i = 0; i < this.cartItems.length; i++) {
            if(this.cartItems[i].id__c == v) {
                this.cartItems.splice(i,1);
                break;
            }
        }
        //Calculate new cart
        this.calculateCartQuantity();
    }

    //Event handle for user change item quantity in cart
    hanldeQuantityChange(event) {
        let quantityChange = event.detail;
        for(let i = 0; i < quantityChange.length;i++) {
            this.cartItems[i].Quantity__c = quantityChange[i];
            this.cartItems[i].ItemPrice = (this.cartItems[i].Quantity__c * this.cartItems[i].Price__c).toFixed(2);
        }
        //Calculate new cart
        this.calculateCartQuantity();
    }

    //Handler for use click cart icon
    handleProductCartChange(event) {
        let component = event.target;
        this.template.querySelector('lightning-tabset').activeTabValue = "Cart";
    }

    //When component connected, load Account and Product data from Database
    connectedCallback() {
        //console.log("Account start");
        GetAccountList().then(result => {
            this.accountList = result;
            this.currentAccount = this.accountList[0];
            console.log(result);
            let newOptions = [];
            for(let i = 0; i < result.length; i++) {             
                newOptions.push({label: result[i].Name, value: result[i].Name});                
            }
            this.optionList = newOptions;
            this.accountValue = result[0].Name;
            this.cartRecord.Account__c = this.currentAccount.Id;
            //console.log("Good");
            console.log(this.accountList);
        }).catch((error) => {
            console.log(error);
        });

        GetProducts()
          // Callback on a response
          .then((result) => {
            this.groceryProducts = [...result];
            console.log(result);
            console.log(this.groceryProducts);
            for(let i=0; i < this.groceryProducts.length; i++) {
                this.groceryProducts[i].Image__c = My_Resource + this.groceryProducts[i].Image__c;
                //product.Image__c = Grape;
            }
            console.log(this.groceryProducts);
          })
          // Callback if there's an error
          .catch((error) => {
            console.log(error);
          });          
    }

    //Event handle for user change acoount
    handleAccountChange(e) {
        this.accountValue = e.detail.value;
        let index = this.findAccountIndex(this.accountList, e.detail.value);
        this.currentAccount = this.accountList[index];
        this.cartItems = [];

        this.cartRecord.Account__c = this.currentAccount.Id;
        this.cartRecord.Quantity__c = 0;
        this.cartRecord.Total_price__c = (0.0).toFixed(2);  
        let orderNumber = 1;
        if(this.currentAccount.Carts__r) {
            orderNumber = this.currentAccount.Carts__r.length + 1;
        }
        this.cartRecord.Order_Number__c = orderNumber;

        console.log("Account change");
        console.log(index);
        console.log(this.accountValue);
        console.log(this.currentAccount.Id);
    }  

    //Find account index with name input
    findAccountIndex(accountList, name) {
        if(accountList.length < 1) return -1;
        for(let i = 0; i < accountList.length; i++) {
            if(accountList[i].Name === name) return i;
        }
    }    
}