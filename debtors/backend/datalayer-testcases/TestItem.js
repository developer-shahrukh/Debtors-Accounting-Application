const entities=require('datalayer/entities');
const managers=require('datalayer/managers');
if(process.argv.length==2)
{
console.log("You need to pass operation and data");
return;
}
var testWhat=process.argv[2];
if(testWhat=="add")
{
var name="Stationary";
var cgst=18;
var sgst=18;
var igst=24;
var unitOfMeasurements=[];
var unitOfMeasurement;
unitOfMeasurement=new entities.UnitOfMeasurement(1,"KG");
unitOfMeasurements.push(unitOfMeasurement);
unitOfMeasurement=new entities.UnitOfMeasurement(4,"PKT");
unitOfMeasurements.push(unitOfMeasurement);
unitOfMeasurement=new entities.UnitOfMeasurement(0,"Gram");
unitOfMeasurements.push(unitOfMeasurement);
unitOfMeasurement=new entities.UnitOfMeasurement(0,"PCS");
unitOfMeasurements.push(unitOfMeasurement);
var item=new entities.Item(0,name,cgst,sgst,igst,unitOfMeasurements);
var m=new managers.ItemManager();
m.add(item).then(()=>{
console.log(`Item : ${name} added with code ${item.code}`);
}).catch((err)=>{
console.log(err);
});
} // testWhat=="add" ends here

if(testWhat=="getAll")
{
var m=new managers.ItemManager();
m.getAll().then((items)=>{
if(items.length==0)
{
console.log("No Records in item list");
}
else
{
var i;
for(i=0;i<items.length;i++)
{
console.log(items[i]);
}
}
}).catch((err)=>{
console.log(err);
});
} // item getAll ends here

