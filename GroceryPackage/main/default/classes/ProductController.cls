public with sharing class ProductController {
    public ProductController() {

    }

    public static void CheckStock(List<Product2> products) {
        for(Integer i = 0; i < products.size(); i++) {
            if(products[i].Quantity__c != products[i].StockQuantity__c) {
                products[i].StockQuantity__c = products[i].Quantity__c;
            }
        }
    }

    @AuraEnabled
    public static List<Product2> GetProducts() {

        List<Product2> allProducts = [SELECT Name, ProductCode, Category__c, Image__c,Price__c, Description, Quantity__c,StockQuantity__c FROM Product2];

        return allProducts;
    }
}