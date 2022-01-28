@isTest
private class ItemControllerTest {
    @TestSetup
    static void makeData(){

        // Create 3 accounts for test usage
        List<Account> accountsToInsert = new List<Account>();
        for(Integer num = 0; num < 3; num++) {
            accountsToInsert.add(new Account(name = 'Test Account ' + num));
        }
        
        Insert accountsToInsert;

        List<Account> accountList = [SELECT Name, Id FROM Account];

        List<Cart__c> newCarts = new List<Cart__c>();
        
        //Creat 2 carts for test usage
        for(Integer i = 0; i < 2; i++) {
            Cart__c newCart = new Cart__c(
            Account__c = accountList[0].Id,
            Order_Number__c = 1 + i,
            Quantity__c = 20 *(i+1),
            Total_price__c = 40 * (i+1));
            newCarts.add(newCart);
        }
        Insert newCarts;

        //Insert two products for test
        List<Product2> newProducts = new List<Product2>();
        List<String> productNames = new String[3];
        productNames[0] = 'Apple';
        productNames[1] = 'Pear';

        for(Integer i = 0; i < 2; i++) {
            Product2 newProduct = new Product2(
                Name = productNames[i],
                ProductCode = '001' + i, 
                Category__c = 'OnSale', 
                Price__c = 2.99, 
                Quantity__c = 1000,
                StockQuantity__c = 1000
            );
            newProducts.add(newProduct);
        }     
        Insert newProducts;
        
    }

    @isTest 
    static void NP_SaveItems() {
        Test.startTest();
        List<Product2> allProducts = [SELECT Name, Id, Price__c FROM Product2];
        List<Cart__c> allCarts = [SELECT Id FROM Cart__c];
        
        List<Item__c> cartItems = new List<Item__c>();
        for(Integer i = 0; i < 2; i++) {
            
            Item__c newItem = new Item__c(
                id__c = i+1,
                Name = allProducts[i].Name,
                ItemPrice__c = allProducts[i].Price__c,
                Quantity__c = 100,
                Product__c = allProducts[i].Id, 
                Cart__c = allCarts[0].Id
            );
            cartItems.add(newItem);
        }  
        ItemController.SaveItems(cartItems); 
        List<Item__c> result = [SELECT Id,Quantity__c FROM Item__c];    
        System.assertEquals(2,result.size());

        allProducts = [SELECT Name, Id, Price__c,StockQuantity__c FROM Product2];
        System.assertEquals(900, Integer.valueOf(allProducts[0].StockQuantity__c));
        Test.stopTest();
    }
}