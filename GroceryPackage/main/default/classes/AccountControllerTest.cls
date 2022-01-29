@isTest
private class AccountControllerTest {
    @TestSetup
    static void makeData(){
        List<Account> newAccounts = new List<Account>();
        for(Integer num = 0; num < 5; num++) {
            newAccounts.add(new Account(name = 'Test Account ' + num, Active__c = 'Yes'));
        }
        Insert newAccounts;
    }

    @isTest 
    static void TP_GetAccountList() {
        Test.startTest();
        List<Account> allAccounts = AccountController.GetAccountList();
        System.assertEquals(5,allAccounts.size());
        Test.stopTest();
    }
}