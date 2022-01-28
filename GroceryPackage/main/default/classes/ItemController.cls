public with sharing class ItemController {
    public ItemController() {

    }

    //In Items after insert trigger, decrease item quantity from Product stock quantity, and save the new stock quantity
    public static void HandleProductQuantity(List<Item__c> newItems) {
        List<Id> productIds = new List<Id>();
        for(Integer i = 0; i < newItems.size();i++) {
            productIds.add(newItems[i].Product__c);
        }
        List<Product2> productList = [SELECT Name,Quantity__c,StockQuantity__c FROM Product2 WHERE Id IN :productIds];
        for(Integer i = 0; i < productList.size(); i++) {
            Integer index = FindIndexOfItems(newItems, productList[i].Id);
            if(index != -1) {
                productList[i].StockQuantity__c -= newItems[index].Quantity__c; 
            }
        }
        Update productList;
    }

    //Search index of product id from the list of items
    @testVisible private static Integer FindIndexOfItems(List<Item__c> items, Id id) {
        for(Integer i = 0; i < items.size();i++) {
            if(items[i].Product__c == id) {
                return i;
            }
        }
        return -1;
    }

    @AuraEnabled
    public static void SaveItems(List<Item__c> newItems){
        try {
            List<Item__c> cartItems = new List<Item__c>();
            for(Integer i = 0; i < newItems.size(); i++) {
                Item__c newItem = new Item__c(
                    id__c = newItems[i].id__c,
                    Name = newItems[i].Name,
                    ItemPrice__c = newItems[i].ItemPrice__c,
                    Quantity__c = newItems[i].Quantity__c,
                    Product__c = newItems[i].Product__c, 
                    Cart__c = newItems[i].Cart__c
                );
                cartItems.add(newItem);
            }  
            Insert cartItems;          
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}