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
const getCustomerByCode=(code)=>{
    //alert(code);
    var promise=new Promise((resolve,reject)=>{
        fetch(`/getCustomerByCode?code=${code}`).then((response)=>{
            return response.json();
        }).then((customerData)=>{
            resolve(customerData);
        }).catch((error)=>{
            reject(error);
        })
    });
    return promise;
}

const getStates=(stateCode)=>{
    var promise=new Promise((resolve,reject)=>{

        fetch("/getStates").then((response)=>{
            return response.json();
        }).then((states)=>{
            resolve(states);
        }).catch((error)=>{
            reject(error);
        });
    });
    return promise;
}

    const getByStateCode=(stateCode)=>{
        var promise=new Promise((resolve,reject)=>{
            fetch(`/getByStateCode?stateCode=${stateCode}`).then((response)=>{
                return response.json();
            }).then((state)=>{
                resolve(state);
            }).catch((error)=>{
                reject(error);
            });
        });
        return promise;
    }
    var stateCodeGlobal="";
    const fillTheCustomerForm=(customer)=>{
        $("#nameDetails").val(customer.name);
        $("#addressDetails").val(customer.address);
        $("#registration-title-1-details").val(customer.regTitle1);
        $("#registration-value-1-details").val(customer.regValue1);
        $("#registration-title-2-details").val(customer.regTitle2);
        $("#registration-value-2-details").val(customer.regValue2);
        $("#registration-title-3-details").val(customer.regTitle3);
        $("#registration-value-3-details").val(customer.regValue3);
        $("#contact-number-1-details").val(customer.contact1);
        $("#contact-number-2-details").val(customer.contact2);
        $("#contact-number-3-details").val(customer.contact3);
        stateCodeGlobal=customer.stateCode;
        getByStateCode(customer.stateCode).then((state)=>{
            if(stateCodeGlobal==state.code) $("#stateDetails").append(`<option id='${state.code}' selected>${state.name}</option>`);
            else  $("#stateDetails").append(`<option id='${state.code}'>${state.name}</option>`);
        });        
    }

    const getCustomerData=()=>{
        var code=findCustomerCode(model.customerNameBeforeEdit);
        var name=$("#nameDetails").val().trim();
        var address=$("#addressDetails").val().trim();
        var regTitle1=$("#registration-title-1-details").val().trim();
        var regValue1=$("#registration-value-1-details").val().trim();
        var regTitle2=$("#registration-title-2-details").val().trim();
        var regValue2=$("#registration-value-2-details").val().trim();
        var regTitle3=$("#registration-title-3-details").val().trim();
        var regValue3=$("#registration-value-3-details").val().trim();
        var contact1=$("#contact-number-1-details").val().trim();
        var contact2=$("#contact-number-2-details").val().trim();
        var contact3=$("#contact-number-3-details").val().trim();
        var stateCode=findStateCode($("#stateDetails").val());
        var customerData={
            "code": code,
            "name": name,
            "address": address,
            "regTitle1": regTitle1,
            "regValue1": regValue1,
            "regTitle2": regTitle2,
            "regValue2": regValue2,
            "regTitle3": regTitle3,
            "regValue3": regValue3,
            "contact1": contact1,
            "contact2": contact2,
            "contact3": contact3,
            "stateCode": stateCode
        };
        return customerData;				
    }
const clearErrors=()=>{
    $("#nameError").html("");
    $("#addressError").html("");
}
const clearAddCustomerForm=()=>{
    $("#name").val("");
    $("#address").val("");
    $("#registration-title-1").val("");
	$("#registration-value-1").val("");
	$("#registration-title-2").val("");
	$("#registration-value-2").val("");
	$("#registration-title-3").val("");
	$("#registration-value-3").val("");
	$("#contact-1").val("");
	$("#contact-2").val("");
	$("#contact-3").val("");
}
const clearCustomerDetailsForm=()=>{
    $("#nameDetails").val("");
    $("#addressDetails").val("");
    $("#registration-title-1-details").val("");
    $("#registration-value-1-details").val("");
    $("#registration-title-2-details").val("");
    $("#registration-value-2-details").val("");
    $("#registration-title-3-details").val("");
    $("#registration-value-3-details").val("");
    $("#contact-number-1-details").val("");
    $("#contact-number-2-details").val("");
    $("#contact-number-3-details").val("");					
}

const findCustomerCode=(name)=>{
    var customer=model.customers.find(c=>c.name===name);
    return customer.code;
}

const findStateCode=(stateName)=>{
    var state=model.states.find(state=>state.name===stateName);
    return state.code;
}
    const updateCustomer=(customerData)=>{
        
    }

    