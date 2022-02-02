trigger ProductTrigger on Product2 (before insert) {    
    switch on trigger.operationType {
        when BEFORE_INSERT {
            //Load handler function to set stock quantity same as product quantity when creat products
            ProductController.CheckStock(trigger.new);
        }
    }

}