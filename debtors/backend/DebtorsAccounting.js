const express=require('express');
const app=express();
const port=3000;
const managers=require('c:/shahrukh/jqexpress/debtors/datalayer/managers.js');
const entities=require('c:/shahrukh/jqexpress/debtors/datalayer/entities.js');

app.use(express.json());
app.use(express.static("../frontend/public"));
app.get("/",function(request,response){
response.redirect("/index.html");
});

app.get("/getItems",async function(request,response)
{
    try
    {
        var m=new managers.ItemManager();
        var items=await m.getAll();
        response.send(items);
    }catch(error)
    {
        response.send(error);
    }
    });

app.get("/getUnitOfMeasurements",async function(request,response){
    try
    {
        var m=new managers.UnitOfMeasurementManager();
        var uom=await m.getAll();
        response.send(uom);
    }catch(error)
    {
        response.send(error);
    }
});

app.get("/getUnitOfMeasurementByCode",async function(request,response){
    try
    {
        var m=new managers.UnitOfMeasurementManager();
        var code=request.query.code;
        var uoms=await m.getByCode(code);
        response.json(uoms);
    }catch(error)
    {
        console.log(error);
    }
    });
app.post("/addUnitOfMeasurement",async function(request,response){
    try
    {
        var m=new managers.UnitOfMeasurementManager();
        var body=request.body;
        var name=request.body.unitOfMeasurement;
        console.log(name);
        //var uom=await m.addUnitOfMeasurement(name);
        //response.send(uom);
    }catch(error)
    {
        response.send(error);
    }
});

app.get("/getByCode",async function(request,response){
try
{
    var m=new managers.ItemManager();
    var code=request.query.code;
    var items=await m.getByCode(code);
    response.json(items);
}catch(error)
{
    response.send(error);
}
});

app.get("/getStates",async function(request,response)
{
 try
 {
    var m=new managers.StateManager();
    var states=await m.getAll();
    response.send(states);
 }catch(error)
 {
    response.send(error);
 }
});

app.get("/getByStateCode",async function(request,response){
    try
    {    
        var manager=new managers.StateManager();
        var stateCode=request.query.stateCode;
        var state=await manager.getByCode(stateCode);
        response.send(state);
    }catch(error)
    {
        response.send(error);
    }
});

app.get("/getByAlphaCode",async function(request,response){
    try
    {
        var manager=new managers.StateManager();
        var alphaCode=request.query.alphaCode;
        var state=await manager.getByAlphaCode(alphaCode);
        response.send(state);
    }catch(error)
    {
        response.send(error);
    }
});

app.get("/getTrader",async function(request,response){
    try
    {
        var manager=new managers.TraderManager();
        var trader=await manager.getTraders();
        response.json(trader);
    }catch(error)
    {
        response.send(error);
    }
});

app.post("/updateTrader",async function(request,response){
    try
    {
        var body=request.body;
        var name=request.body.name;
        var address=request.body.address;
        var gstNum=request.body.gst;
        var accountHolderName=request.body.accountHolderName;
        var accountNumber=request.body.accountNumber;
        var branchName=request.body.branchName;
        var ifscCode=request.body.ifscCode;
        var regTitle1=request.body.regTitle1;
        var regValue1=request.body.regValue1;
        var regTitle2=request.body.regTitle2;
        var regValue2=request.body.regValue2;
        var regTitle3=request.body.regTitle3;
        var regValue3=request.body.regValue3;
        var contact1=request.body.contact1;
        var contact2=request.body.contact2;
        var contact3=request.body.contact3;
        var stateCode=request.body.stateCode;
        var code=1;
        /* console.log(name,address,gstNum);
        console.log(accountHolderName,accountNumber,branchName,ifscCode);
        console.log(regTitle1,regValue1,regTitle2,regValue2,regTitle3,regValue3);
        console.log(contact1,contact2,contact3);
        console.log(stateCode);*/
        var trader=new entities.Trader(code,name,address,gstNum,accountHolderName,accountNumber,branchName,ifscCode,regTitle1,regValue1,regTitle2,regValue2,regTitle3,regValue3,contact1,contact2,contact3,stateCode);
        var m=new managers.TraderManager();
        m=await m.updateTrader(trader);
        response.send({success:true});
    }catch(error)
    {
        response.send(error);
    }
}); 

app.post("/addItem",async function(request,response){
    try
    {
        var m=new managers.ItemManager();
        var body=request.body;
        var code=request.body.code;
        var name=request.body.name;
        var hsnCode=request.body.hsnCode;
        var cgst=request.body.cgst;
        var sgst=request.body.sgst;
        var igst=request.body.igst;
        var uoms=request.body.uom;
        var unitOfMeasurements=[];
        for(var i=0;i<uoms.length;i++)
        {
            var uomName=uoms[i];
            i++;
            var uomCode=uoms[i];
            var uom=new entities.UnitOfMeasurement(uomCode,uomName);
            unitOfMeasurements.push(uom);
        }
        var item=new entities.Item(code,name,hsnCode,cgst,sgst,igst,unitOfMeasurements);
        await m.add(item);
        var itemCode=item.code;
        //console.log(`Item Added with code ${code}`);
        response.send({"success":true,"itemCode":itemCode});
    }catch(error)
    {
        response.send(error);
    }
});

app.get("/deleteItemByCode",async function(request,response){
    try
    {
        var code=request.query.code;
        var m=new managers.ItemManager();
        var success=await m.deleteItem(code);
        response.send(success);
    }catch(error)
    {
        response.send(error);
    }    
});

app.get("/getCustomers",async function(request,response){
    try
    {
    var m=new managers.CustomerManager();
    var customers=await m.getCustomers();
    response.send(customers);
    }catch(err)
    {
       console.log(err);
       response.send(err);
    }
});

app.get("/getCustomerByCode",async function(request,response){
    try
    {
        var code=request.query.code;
        var m=new managers.CustomerManager();
        var customer=await m.getCustomerByCode(code);
        response.send(customer);
    }catch(error)
    {
        response.send(error);
    }
});


app.post("/addCustomer",async function(request,response){
    try
    {
        var body=request.body;
        var name=request.body.name; 
        var address=request.body.address;
        var regTitle1=request.body.regTitle1;
        var regValue1=request.body.regValue1;
        var regTitle2=request.body.regTitle2;
        var regValue2=request.body.regValue2;
        var regTitle3=request.body.regTitle3;
        var regValue3=request.body.regValue3;
        var contact1=request.body.contact1;
        var contact2=request.body.contact2;
        var contact3=request.body.contact3;
        var stateCode=request.body.stateCode;
        var m=new managers.CustomerManager();
        var customer=new entities.Customer(0,name,address,regTitle1,regValue1,regTitle2,regValue2,regTitle3,regValue3,contact1,contact2,contact3,stateCode);
        await m.addCustomer(customer);
        var code=customer.code;
        response.send({"suceess":true,"code":code});
    }catch(error)
    {
        response.send(error);
    }
});

app.post("/updateCustomer",async function(request,response){
    try
    {
        var body=request.body;
        var code=request.body.code;
        var name=request.body.name;
        var address=request.body.address;
        var regTitle1=request.body.regTitle1;
        var regValue1=request.body.regValue1;
        var regTitle2=request.body.regTitle2;
        var regValue2=request.body.regValue2;
        var regTitle3=request.body.regTitle3;
        var regValue3=request.body.regValue3;
        var contact1=request.body.contact1;
        var contact2=request.body.contact2;
        var contact3=request.body.contact3;
        var stateCode=request.body.stateCode;
        var m=new managers.CustomerManager();
        var customer=new entities.Customer(code,name,address,regTitle1,regValue1,regTitle2,regValue2,regTitle3,regValue3,contact1,contact2,contact3,stateCode);
        await m.updateCustomer(customer);
        response({"success":true,"customer": customer});
    }catch(error)
    {
        response.send(error);
    }
});

app.get("/removeCustomer",async function(request,response){
    try
    {
        var name=request.query.name;
        var m=new managers.CustomerManager();
        console.log(name);
        var responseJSON=await m.removeCustomer(name);
        response.send(responseJSON);
    }catch(error)
    {
        response.send(error);
    }
});

app.listen(port,function(error){
if(error)
{
console.log(`Some problem ${error}`);
}
});
console.log(`Server is ready on port number ${port}`);
