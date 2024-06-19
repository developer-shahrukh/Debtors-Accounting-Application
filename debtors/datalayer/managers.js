const connector=require("./connector");
const entities=require("./entities");
class UnitOfMeasurementManager
{
constructor()
{}
async add(unitOfMeasurement)
{
if(!unitOfMeasurement.name)
{
throw "Name required";
}
if(unitOfMeasurement.name.length>5)
{
throw "Name cannot exceed 5 characters";
}
var connection=await connector.getConnection();
if(connection==null)
{
throw "Unable to connect to database";
}
var resultSet=await connection.execute(`select name from ac_uom where lower(name)=lower('${unitOfMeasurement.name}')`);
if(resultSet.rows.length>0)
{
await connection.close();
throw `${unitOfMeasurement.name} exists`;
}
await connection.execute(`insert into ac_uom (name) values('${unitOfMeasurement.name}')`)
await connection.commit();
resultSet=await connection.execute(`select code from ac_uom where lower(name)=lower('${unitOfMeasurement.name}')`);
unitOfMeasurement.code=resultSet.rows[0][0];
await connection.close(); 
} // add function ends

async remove(code)
{
if(!code)
{
throw "Code required";
}
if(code<=0)
{
throw "Invalid code";
}
var connection=await connector.getConnection();
if(connection==null)
{
throw "Unable to connect to database";
}
var resultSet=await connection.execute(`select code from ac_uom where code=${code}`);
if(resultSet.rows.length==0)
{
await connection.close();
throw `Invalid code ${code}`;
}
resultSet=await connection.execute(`select uom_code from ac_item_uom where uom_code=${code}`);
if(resultSet.rows.length>0)
{
await connection.close();
throw `Unit of measurement with code ${code} has been alloted to an item`;
}
await connection.execute(`delete from ac_uom where code=${code}`)
await connection.commit();
await connection.close(); 
} // remove function ends

async update(unitOfMeasurement)
{
if(!unitOfMeasurement.code)
{
throw "Code required";
}
if(unitOfMeasurement.code<=0)
{
throw "Invalid code";
}
if(!unitOfMeasurement.name)
{
throw "Name required";
}
if(unitOfMeasurement.name.length>5)
{
throw "Name cannot exceed 5 characters";
}
var connection=await connector.getConnection();
if(connection==null)
{
throw "Unable to connect to database";
}
var resultSet=await connection.execute(`select code from ac_uom where code=${unitOfMeasurement.code}`);
if(resultSet.rows.length==0)
{
await connection.close();
throw `Invalid code ${unitOfMeasurement.code}`;
}
var resultSet=await connection.execute(`select code from ac_uom where lower(name)=lower('${unitOfMeasurement.name}') and code<>${unitOfMeasurement.code}`);
if(resultSet.rows.length>0)
{
await connection.close();
throw `${unitOfMeasurement.name} exists`;
}
await connection.execute(`update ac_uom set name='${unitOfMeasurement.name}' where code=${unitOfMeasurement.code}`);
await connection.commit();
await connection.close(); 
} // update function ends

async getAll()
{
var connection=await connector.getConnection();
if(connection==null)
{
throw "Unable to connect to database";
}
var unitOfMeasurements=[];
var unitOfMeasurement;
var resultSet=await connection.execute("select * from ac_uom order by name");
var x=0;
var row;
while(x<resultSet.rows.length)
{
row=resultSet.rows[x];
unitOfMeasurement=new entities.UnitOfMeasurement(parseInt(row[0]),row[1].trim());
unitOfMeasurements.push(unitOfMeasurement);
x++;
}
await connection.close();
return unitOfMeasurements;
} // getAll function ends here


async getByCode(code)
{
if(!code)
{
throw "Code required";
}
if(code<=0)
{
throw "Invalid code";
}
var connection=await connector.getConnection();
if(connection==null)
{
throw "Unable to connect to database";
}
var resultSet=await connection.execute(`select * from ac_uom where code=${code}`);
if(resultSet.rows.length==0)
{
await connection.close();
throw `Invalid code ${code}`;
}
var row=resultSet.rows[0];
var unitOfMeasurement=new entities.UnitOfMeasurement(parseInt(row[0]),row[1].trim());
await connection.close(); 
return unitOfMeasurement;
} // getByCode function ends here

async getByName(name)
{
if(!name)
{
throw "Name required";
}
if(name.length<=0 || name.length>5)
{
throw "Invalid name";
}
var connection=await connector.getConnection();
if(connection==null)
{
throw "Unable to connect to database";
}
var resultSet=await connection.execute(`select * from ac_uom where lower(name)=lower('${name}')`);
if(resultSet.rows.length==0)
{
await connection.close();
throw `Invalid name ${name}`;
}
var row=resultSet.rows[0];
var unitOfMeasurement=new entities.UnitOfMeasurement(parseInt(row[0]),row[1].trim());
await connection.close(); 
return unitOfMeasurement;
} // getByName function ends here
}// UnitOfMeasurementManager class ends here


class ItemManager
{
constructor()
{}
async add(item)
{
if(!item.name || item.name.length==0)
{
throw "Item name required";
}
if(item.name.length>25)
{
throw "Name cannot exceed 25 characters";
}
if(!item.hsnCode)
{
    throw "HSN Code required";
}
if(!item.cgst)
{
item.cgst=0;
}
if(item.cgst<0)
{
throw "CGST cannot be negative";
}
if(!item.sgst)
{
item.sgst=0;
}
if(item.sgst<0)
{
throw "SGST cannot be negative";
}
if(!item.igst)
{
item.igst=0;
}
if(item.igst<0)
{
throw "IGST cannot be negative";
}
if(item.unitOfMeasurements.length==0)
{
throw "Unit of measurement required";
}
var connection=await connector.getConnection();
if(connection==null)
{
throw "Unable to connect to database";
}
var resultSet;
resultSet=await connection.execute(`select name from ac_item where lower(name)=lower('${item.name}')`);
if(resultSet.rows.length>0)
{
await connection.close();
throw `${item.name} exists`;
}
var unitOfMeasurement;
var i;
for(i=0;i<item.unitOfMeasurements.length;i++)
{
unitOfMeasurement=item.unitOfMeasurements[i];

if(!unitOfMeasurement.code || unitOfMeasurement.code<0)
{
unitOfMeasurement.code=0;
}
if(!unitOfMeasurement.name || unitOfMeasurement.name.trim().length==0)
{
await connection.close();
throw "Unit of measurement name required";
}
if(unitOfMeasurement.name.length>5)
{
await connection.close();
throw "Unit of measurement cannot exceed 5 character";
}
resultSet=await connection.execute(`select code from ac_uom where lower(name)=lower('${unitOfMeasurement.name}')`);
if(resultSet.rows.length>0)
{
unitOfMeasurement.code=resultSet.rows[0][0];
}
else
{
await connection.execute(`insert into ac_uom (name) values ('${unitOfMeasurement.name}')`);
await connection.commit();
resultSet=await connection.execute(`select code from ac_uom where lower(name)=lower('${unitOfMeasurement.name}')`);
unitOfMeasurement.code=resultSet.rows[0][0];
}
} // for loop ends here
await connection.execute(`insert into ac_item (name,hsn_code) values('${item.name}',${item.hsnCode})`);
await connection.commit();
resultSet=await connection.execute(`select code from ac_item where lower(name)=lower('${item.name}')`);
item.code=resultSet.rows[0][0];
await connection.execute(`insert into ac_item_tax values(${item.code},${item.cgst},${item.sgst},${item.igst})`);
await connection.commit();	
for(var i=0;i<item.unitOfMeasurements.length;i++)
{
await connection.execute(`insert into ac_item_uom values(${item.code},${item.unitOfMeasurements[i].code})`);
await connection.commit();
}
await connection.close(); 
} // item add function ends here


async getAll()
{
var connection=await connector.getConnection();
if(connection==null)
{
throw "Unable to connect to database";
}
var items=[];
var item;
var resultSet=await connection.execute("SELECT i.code AS item_code, i.name AS item_name, i.hsn_code AS hsn_code,it.cgst, it.sgst, it.igst, u.name AS uom_name FROM ac_item i LEFT JOIN ac_item_tax it ON i.code = it.item_code LEFT JOIN ac_uom u ON i.code = u.code");
var x=0;
var row;
while(x<resultSet.rows.length)
{
row=resultSet.rows[x];  
item=new entities.Item(parseInt(row[0]),row[1].trim(),parseInt(row[2]),row[3],row[4],row[5],row[6]);
items.push(item);
x++;
}
await connection.close();           
return items;
} // item getAll function ends here

async getByCode(code)
{
    if(!code)
    {
    throw "Code required";
    }
    if(code<=0)
    {
    throw "Invalid code";
    }
    var connection=await connector.getConnection();
    if(connection==null)
    {
    throw "Unable to connect to database";
    }
   // var resultSet=await connection.execute(`SELECT i.code AS item_code, i.name AS item_name, i.hsn_code AS item.hsn_code ,it.cgst, it.sgst, it.igst,u.name AS uom_name FROM ac_item i LEFT JOIN ac_item_tax it ON i.code = it.item_code LEFT JOIN ac_uom u ON i.code = u.code WHERE i.code=${code}`);
    var resultSet=await connection.execute(`SELECT ai.code AS item_code,ai.name AS item_name,ai.hsn_code,ait.cgst,ait.sgst,ait.igst,aiu.uom_code FROM ac_item ai LEFT JOIN ac_item_tax ait ON ai.code = ait.item_code LEFT JOIN ac_item_uom aiu ON ai.code = aiu.item_code WHERE ai.code =${code}`);

    if(resultSet.rows.length==0)        
    {
    await connection.close();
    throw `Invalid code ${code}`;
    }
    var items=[];
    resultSet.rows.forEach((row)=>{
        var code=row[0];
        var name=row[1].trim();
        var hsnCode=parseInt(row[2]);
        var cgst=row[3];
        var sgst=row[4];
        var igst=row[5];
        var uom=row[6];
        items.push(new entities.Item(code,name,hsnCode,cgst,igst,sgst,uom));
    });
    await connection.close(); 
    return items;
}

async deleteItem(code)
{
    if(!code)
    {
    throw "Code required";
    }
    if(code<=0)
    {
    throw `Invalid code ${code}`;
    return false;
    }
    var connection=await connector.getConnection();
    if(connection==null)
    {
    throw "Unable to connect database";    
    }
    await connection.execute(`delete from ac_item_uom where item_code=${code}`);
    await connection.commit();
    await connection.execute(`delete from ac_item_tax where item_code=${code}`);
    await connection.commit();
    await connection.execute(`delete from ac_item where code=${code}`);
    await connection.commit();
    await connection.close(); 
    console.log(`Item deleted ${code}`);
    return true;
}
} // ItemManager class ends here

class StateManager
{
   
    constructor()
    {
    }
    async getAll()
    {
        var connection=await connector.getConnection();
        if(connection==null)
        {
        throw "Unable to connect to database";
        }
        var states=[];
        var state;
        var resultSet=await connection.execute("select * from ac_state");
        var x=0;
        var row;
        while(x<resultSet.rows.length)
        {
        row=resultSet.rows[x];  
        state=new entities.State(parseInt(row[0]),row[1].trim(),row[2]);
        states.push(state);
        x++;
        }
        await connection.close();           
        return states; 
    }
    async getByCode(stateCode)
    {
        if(!stateCode)
        {
        throw "Code required";
        }
        if(stateCode<=0)
        {
        throw "Invalid code";
        }
        var connection=await connector.getConnection();
        if(connection==null)
        {
        throw "Unable to connect to database";
        }
        var resultSet=await connection.execute(`select * from ac_state where code=${stateCode}`);
        if(resultSet.rows.length==0)
        {
        await connection.close();
        throw `Invalid code ${stateCode}`;
        }
        var row=resultSet.rows[0];
        var state=new entities.State(parseInt(row[0]),row[1].trim(),row[2]);
        await connection.close(); 
        return state;
    
    }
    async getByAlphaCode(alphaCode)
    {
        if(!alphaCode)
        {
        throw "Alpha code required";
        }
        if(alphaCode<=0)
        {
        throw "Invalid Alpha code";
        }
        var connection=await connector.getConnection();
        if(connection==null)
        {
        throw "Unable to connect to database";
        }
        var resultSet=await connection.execute(`select * from ac_state where alpha_code=${alphaCode}`);
        if(resultSet.rows.length==0)
        {
        await connection.close();
        throw `Invalid alpha code ${alphaCode}`;
        }
        var row=resultSet.rows[0];
        var state=new entities.State(parseInt(row[0]),row[1].trim(),row[2]);
        await connection.close(); 
        return state;
    }
} // StateManager Class ends here

class TraderManager
{
    constructor()
    {}
    async getTraders()
    {
        var connection=await connector.getConnection();
        if(connection==null)
        {
        throw "Unable to connect to database";
        }
        var resultSet=await connection.execute("select * from ac_trader");
        if(resultSet.rows.length==0)
        {
            trader=new entities.Trader(0,"","","","","","","","","","","","",0);
            await connection.close();
            return trader;
        }
        var x=0;
        var trader;
        var traders=[];
        var row;
        while(x<resultSet.rows.length)
        {        
            row=resultSet.rows[x];
          let code=parseInt(row[0]);
          let name=row[1].trim();
          let address=row[2].trim();
          let gst_num=row[3].trim();
          let account_holder_name=row[4].trim();
          let account_number=parseInt(row[5]);
          let branch_name=row[6].trim();
          var ifsc_code=row[7].trim();
          let reg_title_1 = row[8] != null ? row[8].trim() : '';
          let reg_value_1 = row[9] != null ? row[9].trim() : '';
          let reg_title_2 = row[10] != null ? row[10].trim() : '';
          let reg_value_2 = row[11] != null ? row[11].trim() : '';
          let reg_title_3 = row[12] != null ? row[12].trim() : '';
          let reg_value_3 = row[13] != null ? row[13].trim() : '';
          let contact_1 = row[14] != null ? row[14].trim() : '';
          let contact_2 = row[15] != null ? row[15].trim() : '';
          let contact_3 = row[16] != null ? row[16].trim() : '';      
          let state_code=parseInt(row[17]);
          trader=new entities.Trader(code,name,address,gst_num,account_holder_name,account_number,branch_name,ifsc_code,reg_title_1,reg_value_1,reg_title_2,reg_value_2,reg_title_3,reg_value_3,contact_1,contact_2,contact_3,state_code);
          traders.push(trader);
          x++;
        }
        await connection.close();   
        return traders; 
    }
async updateTrader(trader)
{
 var code=trader.code;
 var name=trader.name;
 var address=trader.address;
 var gstNum=trader.gstNum;
 var accountHolderName=trader.accountHolderName;
 var accountNumber=trader.accountNumber;
 var branchName=trader.branchName;
 var ifscCode=trader.ifscCode;
 var regTitle1=trader.regTitle1;
 var regValue1=trader.regValue1;
 var regTitle2=trader.regTitle2;
 var regValue2=trader.regValue2;
 var regTitle3=trader.regTitle3;
 var regValue3=trader.regValue3;
 var contact1=trader.contact1;
 var contact2=trader.contact2;
 var contact3=trader.contact3;
 var stateCode=trader.stateCode;
if(!code)
{
throw "Code required";
}
if(code<=0)
{
throw "Invalid code";
}
if(!name)
{
throw "Name required";
}
if(name.length>150)
{
throw "Name cannot exceed 150 characters";
}
if(!address)
{
    throw "Address required";
}
if(address.length>500)
{
    throw "Address cannot exceed 500 characters";
}
if(!gstNum)
{
    throw "GST Number required";
}
if(gstNum.length>=20)
{
    throw "GST Number cannot exceed 20 characters";
}
if(!accountHolderName)
{
    throw "Account holder name required";
}
if(!accountNumber || accountNumber<=0)
{
    throw "Account number required";
}
if(!branchName)
{
    throw "Branch name required";
}
if(!ifscCode || ifscCode<=0)
{
    throw "IFSC Code required";
}
if(!stateCode)
{
    throw "State code require";
}
if(stateCode<0 || stateCode>=38)
{
    throw "State code invalid";
}
var connection=await connector.getConnection();
if(connection==null)
{
throw "Unable to connect to database";
}
var count=await connection.execute(`select count(*) from ac_trader`);
if(count==0)
{
await connection.execute(`insert into ac_trader (code,name,address,gst_num,account_holder_name,account_number,branch_name,ifsc_code,reg_title_1,reg_value_1,reg_title_2,reg_value_2,reg_title_3,reg_value_3,contact_1,contact_2,contact_3,state_code) values(${code},'${name}','${address}','${gstNum}','${accountHolderName}','${accountNumber}','${branchName}',${ifscCode},'${regTitle1}','${regValue1}','${regTitle2}','${regValue2}','${regTitle3}','${regValue3}','${contact1}','${contact2}','${contact3}',${stateCode})`);
await connection.commit();
await connection.close();
}
else
{
await connection.execute(`update ac_trader set name='${name}',address='${address}',gst_num='${gstNum}',account_holder_name='${accountHolderName}',account_number=${accountNumber},branch_name='${branchName}',ifsc_code='${ifscCode}',reg_title_1='${regTitle1}',reg_value_1='${regValue1}',reg_title_2='${regTitle2}',reg_value_2='${regValue2}',reg_title_3='${regTitle3}',reg_value_3='${regValue3}',contact_1='${contact1}',contact_2='${contact2}',contact_3='${contact3}',state_code=${stateCode} where code=${code}`);
await connection.commit();
await connection.close(); 
}
} // Update trader ends 
} // TraderManager Class ends here

class CustomerManager
{
    constructor(){}
    async addCustomer(customer)
    {
        var connection=await connector.getConnection();
        if(connection==null)
        {
            throw "Cannot connect to database";
        }
        if(customer.code)
        {
            throw "Code is auto generated";
        }
        if(!customer.name)
        {
            throw "Name required";
        }
        if(!customer.address)
        {
            throw "Address required";
        }
        if(!customer.stateCode)
        {
            throw "State code required";
        }
        var resultSet=await connection.execute(`select name from ac_customer where lower(name)=lower('${customer.name}')`);
        if(resultSet.rows.length>0)
        {
            await connection.close();
            throw `Name ${customer.name} exists.`;
        }
        await connection.execute(`insert into ac_customer (code,name,address,reg_title_1,reg_value_1,reg_title_2,reg_value_2,reg_title_3,reg_value_3,contact_1,contact_2,contact_3,state_code) values(ac_customer_code_seq.nextval,'${customer.name}','${customer.address}','${customer.regTitle1}','${customer.regValue1}','${customer.regTitle2}','${customer.regValue2}','${customer.regTitle3}','${customer.regValue3}','${customer.contact1}','${customer.contact2}','${customer.contact3}',${customer.stateCode})`);
        await connection.commit();
        resultSet=await connection.execute(`select code from ac_customer where lower(name)=lower('${customer.name}')`);
        customer.code=resultSet.rows[0][0];
        await connection.close();
    } // add function ends here

    async updateCustomer(customer)
    {
    try{
      if(!customer.code)
      {
        throw "Code required";
      }
      if(customer.code<=0)
      {
        throw "Code cannot be zero ornegative";
      }
      var connection=await connector.getConnection();
      if(connection==null)
      {
        throw "Unable to connect to database";
      }
      var resultSet=await connection.execute(`select code from ac_customer where code=${customer.code}`);
      if(resultSet.rows.length==0)
      {
        await connection.close();
        throw `Invalid code ${customer.code}`;
      }
      await connection.execute(`update ac_customer set name='${customer.name}',address='${customer.address}',reg_title_1='${customer.regTitle1}',reg_value_1='${customer.regValue1}',reg_title_2='${customer.regTitle2}',reg_value_2='${customer.regValue2}',reg_title_3='${customer.regTitle3}',reg_value_3='${customer.regValue3}',contact_1='${customer.contact1}',contact_2='${customer.contact2}',contact_3='${customer.contact3}',state_code=${customer.stateCode} where code=${customer.code}`);
      await connection.commit();
      await connection.close();
    }catch(error)
      {
        console.log(error);
      }
    } // updateCustomer ends here
async removeCustomer(name)
{
    if(!name)
    {
        throw "Name required";
    }
    if(name.length==0)
    {
        throw `Invalid name ${name}`;
    }
    var connection=await connector.getConnection();
    if(connection==null)
    {
        throw "Cannot connect to database";
    }
    var resultSet=await connection.execute(`select name from ac_customer where lower(name)=lower('${name}')`)
    if(resultSet.rows.length==0)
    {
        await connection.close();
        throw `Invalid name ${name}`;
    }
    await connection.execute(`delete from ac_customer where lower(name)=lower('${name}')`);
    await connection.commit();
    await connection.close();
    var responseJSON={
        success:true,
        error: ""
    };
    return responseJSON;
} // remove ends here
async getCustomers()
{
    var connection=await connector.getConnection();
    if(connection==null)
    {
        throw "No record found";
    }
    var resultSet=await connection.execute("select * from ac_customer");
    if(resultSet.rows.length==0)
    {
        await connection.close();
        throw "No record available";
    }
    var customers=[];
    var customer;
    resultSet.rows.forEach((row)=>{
        var code=parseInt(row[0]);
        var name=row[1].trim();
        var address=row[2].trim();
        var regTitle1=row[3];
        var regValue1=row[4];
        var regTitle2=row[5];
        var regValue2=row[6];
        var regTitle3=row[7];
        var regValue3=row[8];
        var contact1=row[9];
        var contact2=row[10];
        var contact3=row[11];
        var stateCode=parseInt(row[12]);
        customer=new entities.Customer(code,name,address,regTitle1,regValue1,regTitle2,regValue2,regTitle3,regValue3,contact1,contact2,contact3,stateCode);
        customers.push(customer);
    });
    await connection.close();
    return customers;
} // getCustomers
async getCustomerByCode(code)
{
    if(!code)
    {
        throw "Code required";
    }
    if(code<=0)
    {
        throw `Invalid code ${code}`;
    }
    var connection=await connector.getConnection();
    if(connection==null)
    {
        throw "Cannot connect to database";
    }
    var resultSet=await connection.execute(`select * from ac_customer where code=${code}`);
    if(resultSet.rows.length==0)
    {
        await connection.close();
        throw `Invalid code ${code}`;
    }
    var customer;
    var customers=[];
    resultSet.rows.forEach((row)=>{
        var code=parseInt(row[0]);
        var name=row[1].trim();
        var address=row[2].trim();
        var regTitle1=row[3];
        var regValue1=row[4];
        var regTitle2=row[5];
        var regValue2=row[6];
        var regTitle3=row[7];
        var regValue3=row[8];
        var contact1=row[9];
        var contact2=row[10];
        var contact3=row[11];
        var stateCode=parseInt(row[12]);
        customer=new entities.Customer(code,name,address,regTitle1,regValue1,regTitle2,regValue2,regTitle3,regValue3,contact1,contact2,contact3,stateCode);
        customers.push(customer);
    });
    await connection.close();
    return customers;
} // getCustomerByCode
}

module.exports={UnitOfMeasurementManager,ItemManager,StateManager,TraderManager,CustomerManager};
