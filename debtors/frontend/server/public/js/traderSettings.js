class TraderModel
{
    constructor()
    {
        this.statesData=[];
        this.stateCodeGlobal=0;
    }
}
var model=new TraderModel();
const getStates=()=>{
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
} // getStates ends here

const getTrader=()=>{
    var promise=new Promise((resolve,reject)=>{
        fetch("/getTrader").then((response)=>{
            return response.json();
        }).then((trader)=>{
            resolve(trader);
        }).catch((error)=>{
            reject(error);
        });
    });
    return promise;
} // getTrader ends here  

const fillTraderData=(traders)=>{
    traders.forEach((trader)=>{
        $("#name").val(trader.name);
        $("#address").val(trader.address);
        $("#gst").val(trader.gstNum);
        $("#accountHolderName").val(trader.accountHolderName);
        $("#accountNumber").val(trader.accountNumber);
        $("#branchName").val(trader.branchName);
        $("#ifscCode").val(trader.ifscCode);
        $("#regTitle1").val(trader.regTitle1);
		$("#regValue1").val(trader.regValue1);
		$("#regTitle2").val(trader.regTitle2);
		$("#regValue2").val(trader.regValue2);
		$("#regTitle3").val(trader.regTitle3);
		$("#regValue3").val(trader.regValue3);
        $("#contact1").val(trader.contact1);
        $("#contact2").val(trader.contact2);
        $("#contact3").val(trader.contact3);
        model.stateCodeGlobal=trader.stateCode;
        var obj=model.statesData.find(state=>state.code===model.stateCodeGlobal);
        $("#state").append(`<option id='${obj.code}'>${obj.name}</option>`);
        $("#traderForm :input").prop("disabled",true)
    });
} // fillTraderData ends here

const updateTrader=()=>{
		var traderData=getTradersData();
        if(!traderData) return;
        traderData=JSON.stringify(traderData);
        $.ajax({
            "url": "/updateTrader",
            "method": "POST",
            "contentType": "application/json",
            "data": traderData,
            "success": function(response){
                if(response.error)
                {
                    alert("Some Error : "+response.error);
                }
                else
                {
                    $("#traderForm :input").prop("disabled",true);
                    $("#notification").text("Trader Updated");
                    $("#noticeBoard").fadeIn();               
                    setTimeout(function(){
                        $("#noticeBoard").fadeOut();
                    },4000);
                }
                
            },
            "error": function(error){
                alert("Error : "+error);
            }
        });
	} // updateTrader function ends here

const getTradersData=()=>{
    clearError();
	var name=$("#name").val();
    var address=$("#address").val();
    var gst=$("#gst").val();
    var accountHolderName=$("#accountHolderName").val();
    var accountNumber=$("#accountNumber").val();
    var branchName=$("#branchName").val();
    var ifscCode=$("#ifscCode").val();
	var regTitle1=$("#regTitle1").val();
	var regValue1=$("#regValue1").val();
	var regTitle2=$("#regTitle2").val();
	var regValue2=$("#regValue2").val();
	var regTitle3=$("#regTitle3").val();
	var regValue3=$("#regValue3").val();
	var contact1=$("#contact1").val();
	var contact2=$("#contact2").val();
	var contact3=$("#contact3").val();
	var stateCode=$("#state option:selected").attr('id');
    var errorCount=0;
    if(name.length==0) 
    {
        errorCount++;
        $("#nameError").html("Name is required");
        $("#name").focus();
    }if(address.length==0){
        errorCount++;
        $("#addressError").html("Address is required");
        if(name.length==0) $("#name").focus();
        else $("#address").focus();
    }if(gst.length==0){
        errorCount++;
        $("#gstError").html("GST is required");
        if(name.length==0) $("#name").focus();
        else if(address.length==0) $("#address").focus();
        else $("#gst").focus();
    }if(accountHolderName.length==0){
        errorCount++;
        $("#accountHolderNameError").html("Account holder name required");
        if(name.length==0) $("#name").focus();
        else if(address.length==0) $("#address").focus();
        else if(gst.length==0) $("#gst").focus();
        else $("#accountHolderName").focus();
    }if(accountNumber.length==0){
        errorCount++;
        $("#accountNumberError").html("Account number required");
        if(name.length==0) $("#name").focus();
        else if(address.length==0) $("#address").focus();
        else if(gst.length==0) $("#gst").focus();
        else if(accountHolderName.lengths==0) $("#accountHolderName").focus();
        else $("#accountNumber").focus();
    }if(branchName.length==0){
        errorCount++;
        $("#branchNameError").html("Branch name required");
        if(name.length==0) $("#name").focus();
        else if(address.length==0) $("#address").focus();
        else if(gst.length==0) $("#gst").focus();
        else if(accountHolderName.lengths==0) $("#accountHolderName").focus();
        else if(accountNumber.length==0) $("#accountNumber").focus();
        else $("#branchName").focus();
    }if(ifscCode.length==0){
        errorCount++;
        $("#ifscCodeError").html("IFSC code required");
        if(name.length==0) $("#name").focus();
        else if(address.length==0) $("#address").focus();
        else if(gst.length==0) $("#gst").focus();
        else if(accountHolderName.lengths==0) $("#accountHolderName").focus();
        else if(accountNumber.length==0) $("#accountNumber").focus();
        else if(branchName.length==0) $("#branchName").focus();
        else $("#ifscCode").focus();
    }
    if(errorCount>0) return false;
    if(regTitle1.length==0) regTitle1="";
    if(regValue1.length==0) regValue1="";
    if(regTitle2.length==0) regTitle2="";
    if(regValue2.length==0) regValue2="";
    if(regTitle3.length==0) regTitle3="";
    if(regValue3.length==0) regValue3="";
    if(contact1.length==0) contact1="";
    if(contact2.length==0) contact2="";
    if(contact3.length==0) contact3="";
	
    var traderNewData={
		"name": name,
		"address": address,
		"gst": gst,
        "accountHolderName": accountHolderName,
        "accountNumber": accountNumber,
        "branchName": branchName,
        "ifscCode": ifscCode,
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
	return traderNewData;
} // getTradersData function ends heressss

const clearError=()=>{
        $("#nameError").html("");
        $("#addressError").html("");
        $("#gstError").html("");
        $("#accountHolderNameError").html("");
        $("#accountNumberError").html("");
        $("#branchNameError").html("");
        $("#ifscCodeError").html("");
}