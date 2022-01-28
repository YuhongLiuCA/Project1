@isTest 
private class ProductControllerTest {
    @TestSetup
    static void makeData(){

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
    static void TP_GetProducts(){
        Test.startTest();
        List<Product2> result = ProductController.GetProducts();
        System.assertEquals(2, result.size());
        System.assertEquals('Apple', result[0].Name);
        Test.stopTest();        
    }
}