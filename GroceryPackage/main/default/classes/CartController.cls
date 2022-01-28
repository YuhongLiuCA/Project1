public with sharing class CartController {

    //Get the cart according to the parameter which is Order_Number__c field value
    @AuraEnabled
    public static List<Cart__c> getCart(Integer order_num){
        try {
            List<Cart__c> c = [SELECT Name,Account__c,Quantity__c,Total_price__c,Order_Number__c FROM Cart__c WHERE Order_Number__c = :order_num];
            return c;            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void SaveCarts(List<Cart__c> carts){
        List<cart__c> newCarts = [SELECT Name,Account__c,Quantity__c,Total_price__c FROM Cart__c];
        for(Integer i = 0; i < carts.size(); i++) {
            Cart__c newCart = new Cart__c(Account__c = carts[i].Account__c,
            Order_Number__c = carts[i].Order_Number__c,
            Quantity__c = carts[i].Quantity__c,
            Total_price__c = carts[i].Total_price__c);
            newCarts.add(newCart);
        }
        try {
            Upsert newCarts;       
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public static void CheckAccount(List<Cart__c> carts){
        List<Account> accountList = [SELECT Name, Id FROM Account];
        System.debug(accountList);
        for(Cart__c cart : carts) {
            if(GetIndexOfAccount(accountList, cart.Account__c) == false) {
                cart.addError('Cart not valid.');
            }
        }
    }

    @testVisible private static Boolean GetIndexOfAccount(List<Account> accounts, Id id) {
        for(Integer i = 0; i < accounts.size();i++) {
            if(accounts[i].Id == id) return true;
        }
        return false;
    }

}