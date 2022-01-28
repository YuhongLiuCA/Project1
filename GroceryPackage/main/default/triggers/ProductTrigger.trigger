trigger ProductTrigger on Product2 (before insert) {    
    switch on trigger.operationType {
        when BEFORE_INSERT {
            ProductController.CheckStock(trigger.new);
        }
    }

}