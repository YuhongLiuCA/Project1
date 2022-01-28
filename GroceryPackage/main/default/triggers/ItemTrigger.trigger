trigger ItemTrigger on Item__c (before insert, before update, after update, after insert, after delete) {
    switch on trigger.operationType {
        when AFTER_INSERT {
            ItemController.HandleProductQuantity(trigger.new);
        }
    }
}