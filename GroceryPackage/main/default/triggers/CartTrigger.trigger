trigger CartTrigger on Cart__c (before insert) {
    switch on trigger.operationType {
        when BEFORE_INSERT {
            CartController.CheckAccount(trigger.new);
        }
    }

}