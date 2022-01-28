@isTest 
private class CartControllerTest {

    @testSetup
    public static void SetupTests() {        
       
        // Create 3 accounts for test usage
        List<Account> accountsToInsert = new List<Account>();
        for(Integer num = 0; num < 3; num++) {
            accountsToInsert.add(new Account(name = 'Test Account ' + num));
        }
        
        Insert accountsToInsert;
        
    }

    @isTest 
    static void TP_GetCart() {
        Test.startTest();
        List<Account> accountList = [SELECT Name, Id FROM Account];

        List<Cart__c> newCarts = new List<Cart__c>();
        
        for(Integer i = 0; i < 5; i++) {
            Cart__c newCart = new Cart__c(
            Account__c = accountList[0].Id,
            Order_Number__c = 1 + i,
            Quantity__c = 20 *(i+1),
            Total_price__c = 40 * (i+1));
            newCarts.add(newCart);
        }
        Insert newCarts;

        List<Cart__c> result = CartController.getCart(1);
        System.assertEquals(1, result[0].Order_Number__c);
        Test.stopTest();
    }
    
    @isTest 
    static void TN_GetCart() {
        Test.startTest();
        List<Account> accountList = [SELECT Name, Id FROM Account];
        
        List<Cart__c> newCarts = new List<Cart__c>();
        
        for(Integer i = 0; i < 5; i++) {
            Cart__c newCart = new Cart__c(
            Account__c = accountList[0].Id,
            Order_Number__c = 1 + i,
            Quantity__c = 20 *(i+1),
            Total_price__c = 40 * (i+1));
            newCarts.add(newCart);
        }
        Insert newCarts;
        List<Cart__c> result = CartController.getCart(100);
        System.assertEquals(0, result.size());
        Test.stopTest();
    }

    @isTest
    static void TP_SaveCarts() {
        Test.startTest();
        List<Account> accountList = [SELECT Name, Id FROM Account];
        
        List<Cart__c> newCarts = new List<Cart__c>();
        
        for(Integer i = 0; i < 5; i++) {
            Cart__c newCart = new Cart__c(
            Account__c = accountList[0].Id,
            Order_Number__c = 1 + i,
            Quantity__c = 20 *(i+1),
            Total_price__c = 40 * (i+1));
            newCarts.add(newCart);
        }
        
        CartController.SaveCarts(newCarts);
        List<Cart__c> result = [SELECT Name,Account__c,Quantity__c,Total_price__c,Order_Number__c FROM Cart__c];
        System.assertEquals(5, result.size());
        System.assertEquals(accountList[0].Id, result[0].Account__c);
        Test.stopTest();
    }

    @isTest
    static void TN_SaveCarts() {
        Test.startTest();
        
        List<Cart__c> newCarts = new List<Cart__c>();
        
        for(Integer i = 0; i < 5; i++) {
            Cart__c newCart = new Cart__c(
            Account__c = '0015f00000CnQFbAAN',
            Order_Number__c = 1 + i,
            Quantity__c = 20 *(i+1),
            Total_price__c = 40 * (i+1));
            newCarts.add(newCart);
        }

        Boolean exceptionOccurred = false;
        try {
            CartController.SaveCarts(newCarts);
        } catch (Exception e){
            //Set boolean to true to catch exception being thrown
            exceptionOccurred = true;
        }
        
        System.assert(exceptionOccurred, 'An Exception was not thrown');
        Test.stopTest();
    }
}