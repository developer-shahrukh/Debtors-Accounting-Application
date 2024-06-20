class TraderModel
{
    constructor()
    {
        this.traders=[];
        this.statesData=[];
        this.customers=[];
        this.items=[];
        this.uoms=[];
        this.stateCodeGlobal=0;
    }
}
var model=new TraderModel();
const getTraders=()=>{
    var promise=new Promise((resolve,reject)=>{
        fetch("/getTrader").then((response)=>{
            if(!response.ok) return;
            return response.json();
        }).then((trader)=>{
            resolve(trader);
        }).catch((error)=>{
            reject(error);
        });
    });
    return promise;
}
const getStates=()=>{
    var promise=new Promise((resolve,reject)=>{
        fetch("/getStates").then((response)=>{
            if(!response.ok) return;
            return response.json();
        }).then((states)=>{
            resolve(states);
        }).catch((error)=>{
            reject(error);
        });
    });
    return promise;
}
const getCustomers=()=>{
    var promise=new Promise((resolve,reject)=>{
        fetch("/getCustomers").then((response)=>{
            return response.json();
        }).then((customers)=>{
            resolve(customers);
        }).catch((error)=>{
            reject(error);
        });
    });
    return promise;
}
const getItems=()=>{
    var promise=new Promise((resolve,reject)=>{
        fetch("/getItems").then((response)=>{
            if(!response.ok) return;
            return response.json();
        }).then((items)=>{
            resolve(items);
        }).then((error)=>{
            reject(error);
        });
    });
    return promise;
}
const getByItemCode=(code)=>{
    var promise=new Promise((resolve,reject)=>{
        fetch(`getByCode?code=${code}`).then((response)=>{
            if(!response.ok) return;
            return response.json();
        }).then((item)=>{
            resolve(item);
        }).catch((error)=>{
            relject(error);
        })
    });
    return promise;
}
const getUnitOfMeasurements=()=>{
    var promise=new Promise((resolve,reject)=>{
        fetch("/getUnitOfMeasurements").then((response)=>{
            if(!response.ok) return;
            return response.json();
        }).then((unitOfMeasurements)=>{
            resolve(unitOfMeasurements);
        }).catch((error)=>{
            reject(error);
        });
    });
    return promise;
}


const clearCustomerForm=()=>{
    $("#customerNameFill").text("");
    $("#customerAddress").text("");
    $("#customerState").text("");
    $("#customerContact1").text("");
    $("#customerContact2").text("");
    $("#customerContact3").text("");
    $("#customerTitle1").text("");
    $("#customerValue1").text("");
    $("#customerTitle2").text("");
    $("#customerValue2").text("");
    $("#customerTitle3").text("");
    $("#customerValue3").text("");
}
const clearItemFormData=()=>{
    $('#item-name').val("");
    $("#hsn-code").val("");
    $("#uom").empty();
    $("#item-cgst").val("");
    $("#item-sgst").val("");
    $("#item-igst").val("");  
    $("#item-rate").val("");         
    $("#item-quantity").val("");
}
const disableSomeItemInputTag=()=>{
    $("#hsn-code").prop("disabled",true);
    $("#item-cgst").prop("disabled",true);
    $("#item-sgst").prop("disabled",true);
    $("#item-igst").prop("disabled",true);
}
const clearErrorSection=()=>{
    $("#nameError").text("");
    $("#rateError").text("");
    $("#quantityError").text("");
}

$(()=>{
    $("#item-table-content").hide();
    $(".addButton").click(()=>{
        $("#exampleModal").modal('show');
        //console.log(model.items);
        //console.log(model.uoms);
        $("#item-name").on('input', function() {
            var searchItem = $(this).val().toLowerCase();
            var matchedItem = model.items.filter(function(item) {
                return item.name.toLowerCase().includes(searchItem);
            });
    
            var dropdown = $("#item-drop-down");
            dropdown.empty();
            if (searchItem && matchedItem.length > 0) {
                matchedItem.forEach(function(item) {
                    dropdown.append(`<div class="item-drop-down" id='${item.code}'>${item.name}</div>`);
                });
                dropdown.show();
                
            } else {
                dropdown.hide();
            }
        });
    
        // Hide the dropdown when clicking outside
        $(document).click(function(event) {
            if (!$(event.target).closest('#item-name').length) {
                $("#item-drop-down").hide();
            }
        });
         // Allow clicking on dropdown items
        $(document).on('click', '.item-drop-down', function() {
            clearItemFormData();
            disableSomeItemInputTag();
            var item=$(this).text();
            var itemData=model.items.find(i=>i.name===item);
            //console.log(itemData);
            $("#uom").empty();
            getByItemCode(itemData.code).then((uoms)=>{
                uoms.forEach((u)=>{
                   // console.log(u);
                    //console.log(u.unitOfMeasurements);
                    var uomData=model.uoms.find(uom=>uom.code===u.unitOfMeasurements);
                    //console.log(uomData);
                    $("#uom").append(`<option id='${uomData.code}'>${uomData.name}</option>`);
                });
            });
            $('#item-name').val(item);
            $("#hsn-code").val(itemData.hsnCode);
            $("#item-cgst").val(itemData.cgst);
            $("#item-sgst").val(itemData.sgst);
            $("#item-igst").val(itemData.igst);            
            $("#dropDown").hide();
        });
    });

    $("#item-data-add").click(()=>{
        var itemName=$("#item-name").val();
        if(!itemName)        
        {
            $("#nameError").text("Choose item name");
            $("#item-name").focus();
            return;
        }
        clearErrorSection();
        var itemHsnCode=$("#hsn-code").val();
        var uom=$("#uom").val();
        var cgst=$("#item-cgst").val();
        var sgst=$("#item-sgst").val();
        var igst=$("#item-igst").val();
        var itemRate=$("#item-rate").val();
        if(itemRate<=0 || itemRate=="")
        {
            $("#rateError").text("Rate Required");
            return;
        }
        clearErrorSection();
        var quantity=$("#item-quantity").val();
        if(quantity<=0 || quantity=="")
        {
            $("#quantityError").text("Quantity Required");
            return;
        }
        clearErrorSection();
        //console.log(itemName,itemHsnCode,uom);
        //console.log(cgst,sgst,igst);
        //console.log(itemRate,quantity);
        $("#itemTable> tbody").append(`<tr><td><input type="checkbox"></td><td>${itemName}</td><td>${itemHsnCode}</td><td>${uom}</td><td>${cgst}</td><td>${sgst}</td><td>${igst}</td><td>${itemRate}</td><td>${quantity}</td></tr>`)
        $("#exampleModal").close();
    });
    
    getStates().then((states)=>{
        states.forEach((state)=>{
            model.statesData.push(state);
        });
    }); // getStates function ends here
    getCustomers().then((customers)=>{
        customers.forEach((customer)=>{
            //console.log(customer);
            model.customers.push(customer);
        });
    });
    getItems().then((items)=>{
        items.forEach((item)=>{
            model.items.push(item);
        });
    });
    getUnitOfMeasurements().then((uoms)=>{
        uoms.forEach((uom)=>{
            model.uoms.push(uom);
        });
    });
    getTraders().then((traders)=>{
        traders.forEach((trader)=>{
            $("#tradersName").append(trader.name);
            $("#tradersAddress").append(trader.address);
            model.stateCodeGlobal=trader.stateCode;
            var obj=model.statesData.find(state=>state.code===model.stateCodeGlobal);
            $("#tradersState").append(`<span id='${obj.code}'>${obj.name}</span>`);
            $("#tradersContact").append(`${trader.contact1}`);
            $("#tradersContact").append(`&nbsp;&nbsp;&nbsp;${trader.contact2}`);
            $("#tradersTitle1").append(trader.regTitle1);
            $("#tradersValue1").append(trader.regValue1);
            $("#tradersTitle2").append(trader.regTitle2);
            $("#tradersValue2").append(trader.regValue2);
            $("#tradersTitle3").append(trader.regTitle3);
            $("#tradersValue3").append(trader.regValue3);
            $("#traderBankName").append(`<span style='color:gray'>${trader.accountHolderName}</span>`);
            $("#traderAccountNumber").append(`<span style='color:gray'>${trader.accountNumber}</span>`);
            $("#traderIFSC").append(`<span style='color:gray'>${trader.ifscCode}</span>`);
            $("#traderBankBranch").append(`<span style='color:gray'>${trader.branchName}</span>`);
            //model.traders.push(trader);
           //console.log(trader);
        });
    }); // getTraders function ends here
    
    $("#customerName").on('input', function() {
        var searchWhat = $(this).val().toLowerCase();
        var matchedCustomers = model.customers.filter(function(customer) {
            return customer.name.toLowerCase().includes(searchWhat);
        });

        var dropdown = $("#dropDown");
        dropdown.empty();
        if (searchWhat && matchedCustomers.length > 0) {
            matchedCustomers.forEach(function(customer) {
                dropdown.append(`<div class="dropDownItem" id='${customer.code}'>${customer.name}</div>`);
            });
            dropdown.show();
            
        } else {
            dropdown.hide();
        }
    });

    // Hide the dropdown when clicking outside
    $(document).click(function(event) {
        if (!$(event.target).closest('#customerName').length) {
            $("#dropDown").hide();
        }
    });

    // Allow clicking on dropdown items
    $(document).on('click', '.dropDownItem', function() {
        clearCustomerForm();
        $("#item-table-content th")
        $("#item-table-content").show();
        var customerName=$(this).text();
        var customerData=model.customers.find(customer=>customer.name===customerName);
        $('#customerName').val($(this).text());
        $("#dropDown").hide();
        $("#customerNameFill").append(customerData.name);
        $("#customerAddress").append(customerData.address);
        model.stateCodeGlobal=customerData.stateCode;
        var obj=model.statesData.find(state=>state.code===model.stateCodeGlobal);
        $("#customerState").append(`<span id='${obj.code}'>${obj.name}</span>`);
        if(customerData.contact1==null) $("#customerContact1").text("");
        else $("#customerContact1").append(customerData.contact1);
        if(!customerData.contact2) $("#customerContact2").text("");
        else $("#customerContact2").append(customerData.contact2);
        if(!customerData.contact3) $("#customerContact3").text("");
        else $("#customerContact3").append(customerData.contact3);
        $("#customerTitle1").append(customerData.regTitle1);
        $("#customerValue1").append(customerData.regValue1);
        $("#customerTitle2").append(customerData.regTitle2);
        $("#customerValue2").append(customerData.regValue2);
        $("#customerTitle3").append(customerData.regTitle3);
        $("#customerValue3").append(customerData.regValue3);
    });


}); // document loaded braces ends here