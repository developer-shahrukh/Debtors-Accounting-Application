const { connectionClass, oracleClientVersion } = require('oracledb');
const connector=require('./connector');
const entites=require('./entites');
class UnitOfMeasurementManager {
    constructor() {
    }
    async add(unitOfMeasurement) {
        var connection=await connector.getConnection();
        if(unitOfMeasurement.name==0) {
            throw "Name is required";
            return;
        }
        if(unitOfMeasurement.name.length>5) {
            throw " Name should be less than 5 characters";
            return;
        }
        var resultSet=await connection.execute(`select name from ac_uom where lower(name)=lower('${unitOfMeasurement.name}')`);
        if(resultSet.rows.length>0) {
            await connection.close();
            throw `UnitOfMeasurement Name is already exists ${unitOfMeasurement.name}`;
        }
        resultSet=await connection.execute(`insert into ac_uom (name) values ('${unitOfMeasurement.name}')`);
        await connection.commit();
        resultSet=await connection.execute(`select code from ac_uom where lower(name)=lower('${unitOfMeasurement.name}')`);
        unitOfMeasurement.code=resultSet.rows[0][0];
        await connection.close();
    } // add function ends here
    
    async delete(code) {
        var connection=await connector.getConnection();
        if(connection==null) {
            throw "Unable to established connection please try after some time";
        }
        if(!code) {
            throw "In order to delete code is required";
        }
        if(code < 0) {
            throw "In order to delete please provide code";
        }
        var resultSet=await connection.execute(`select code from ac_uom where code=${code}`);
        if(resultSet.rows.length==0) {
            await connection.close();
            throw `UnitofMeasurement code does not exists ${code}`;
            return;
        }
        resultSet=await connection.execute(`select uom_code from ac_item_uom where uom_code=${code}`);
        if(resultSet.rows.length>0) {
            await connection.close();
            throw `Unable to delete ${code} because this code have been alloted to an item`;
            return;
        }
        resultSet=await connection.execute(`delete from ac_uom where code=${code}`);
        await connection.commit();
        await connection.close();
    } // delete functions ends here
    
    async update(unitOfMeasurement) {
        var connection=await connector.getConnection();
        if(connection==null) {
            throw "Unable to connect try after some time";
            return;
        }
        if(unitOfMeasurement.code <= 0) {
            throw "In order to update please provide code";
        }
        if(unitOfMeasurement.name <= 0) {
            throw "In order to update please provide name";
        }
        var resultSet=await connection.execute(`select code from ac_uom where code=${unitOfMeasurement.code}`);
        if(resultSet.rows.length==0) {
            await connection.close();
            throw `Code Does not exists ${unitOfMeasurement.code}`;
            return;
        }
        resultSet=await connection.execute(`select code from ac_uom where lower(name)=lower('${unitOfMeasurement.name}') and code<>${unitOfMeasurement.code}`);
        if(resultSet.rows.length>0) {
            throw `${unitOfMeasurement.name} Exists`;
        }
        resultSet=await connection.execute(`update ac_uom set name='${unitOfMeasurement.name}' where code=${unitOfMeasurement.code}`)
        await connection.commit();
        await connection.close();
    }
    
    async getByCode(code) {
        var connection=await connector.getConnection();
        if(connection==null) {
            throw "Unable to connect try after some time";
            return;
        }
        if(code<=0) {
            throw "Code Should Greater than zero";
            return;
        }
        var resultSet=await connection.execute(`select * from ac_uom where code=${code}`);
        if(resultSet.rows.length==0) {
            await connection.close();
            throw `UnitOfMeasurement ${code} does not exists`;
            return;
        }
        var unitOfMeasurements=[];
        //var row=resultSet.rows[0];
        //var unitOfMeasurement=new entites.UnitOfMeasurement(parseInt(row[0]),row[1].trim());
        resultSet.rows.forEach((row)=>{
            var code=row[0];
            var name=row[1].trim();
            unitOfMeasurements.push(new entites.UnitOfMeasurement(code,name));
        });
        await connection.close();
        return unitOfMeasurements;
    }

    async getByName(name) {
        var connection=await connector.getConnection();
        if(connection==null) {
            throw "Unable to connect try after some time";
            return;
        }
        if(name.length==0) {
            throw "Name should not be empty";
            return;
        }
        var resultSet=await connection.execute(`select * from ac_uom where lower(name)=lower('${name}')`);
        if(resultSet.rows.length==0) {
            await connection.close();
            throw `UnitOfMeasurement ${name} does not exists`;
            return;
        }
        var unitOfMeasurements=[];
        /*var row=resultSet.rows[0];
        var unitOfMeasurement=new entites.UnitOfMeasurement(parseInt(row[0]),row[1].trim());*/
        resultSet.rows.forEach((row)=>{
            var code=row[0];
            var name=row[1].trim();
            unitOfMeasurements.push(new entites.UnitOfMeasurement(code,name));
        });
        await connection.close();
        return unitOfMeasurements;
    }
    async getAll() {
        var connection=await connector.getConnection();
        if(connection==null) {
            throw "Unable to connect try after some time";
            return;
        }
        var unitOfMeasurements=[];
        var unitOfMeasurement;
        var resultSet=await connection.execute("select * from ac_uom order by name");
        var x=0;
        var row;
        /*while(x<resultSet.rows.length) {
            row=resultSet.rows[x];
            unitOfMeasurement=new entites.UnitOfMeasurement(parseInt(row[0]),row[1].trim());
            unitOfMeasurements.push(unitOfMeasurement);
            x++;
        }*/
        // we can do like this also
        resultSet.rows.forEach((row)=>{
            var code=row[0];
            var name=row[1].trim();
            unitOfMeasurements.push(new entites.UnitOfMeasurement(code,name));
        });
        await connection.close();
        return unitOfMeasurements;
    }
}
class ItemManager {
    constructor() {
    }
    async add(item) {
        if(!item.name || item.name.length==0) {
            throw "Item Name Required";
        }
        if(item.name.length>25) {
            throw "Name cannot exceed character 25";
        }
        if(!item.cgst) {
            item.cgst=0;
        }
        if(item.cgst<0) {
            throw "CGST Cannot be negative";
        }
        if(!item.igst) {
            item.igst=0;
        }
        if(item.igst<0) {
            throw "IGST Cannot be negative";
        }
        if(!item.sgst) {
            item.sgst=0;
        }
        if(item.sgst<0) {
            throw "SGST Cannot be negative";
        }
        if(item.unitOfMeasurements.length==0) {
            throw "UnitOfMeasurement required";
        }
        var unitOfMeasurement;
        var connection=await connector.getConnection();
        if(connection==null) {
            throw "Unable to connect some errors occured please try after some time.";
        }
        var resultSet;
        resultSet=await connection.execute(`select name from ac_item where lower(name)=lower('${item.name}')`);
        if(resultSet.rows.length>0) {
            await connection.close();
            throw `Item ${item.name} Exists`;
        }
        for(var i=0; i<item.unitOfMeasurements.length; i++) {
            unitOfMeasurement=item.unitOfMeasurements[i];
            if(!unitOfMeasurement.code || unitOfMeasurement.code<0) {
                unitOfMeasurement.code=0;
            } 
            if(!unitOfMeasurement.name || unitOfMeasurement.length==0) {
                await connection.close();
                throw "UnitOfMeasurement name required";
            }
            if(unitOfMeasurement.name.length>5) {
                await connection.close();
                throw "UnitOfMeasurement name cannot exceed 5 characters";
            }
            resultSet=await connection.execute(`select code from ac_uom where lower(name)=lower('${unitOfMeasurement.name}')`);
            if(resultSet.rows.length>0) {
                unitOfMeasurement.code=resultSet.rows[0][0];
            }
            else {
                await connection.execute(`insert into ac_uom (name) values ('${unitOfMeasurement.name}')`);
                await connection.commit();
                resultSet=await connection.execute(`select code from ac_uom where lower(name)=lower('${unitOfMeasurement.name}')`);
                unitOfMeasurement.code=resultSet.rows[0][0]
            }
        }// for loops ends here
        await connection.execute(`insert into ac_item (name) values ('${item.name}')`);
        await connection.commit();
        resultSet=await connection.execute(`select code from ac_item where lower(name)=lower('${item.name}')`);
        item.code=resultSet.rows[0][0]
        await connection.execute(`insert into ac_item_tax values(${item.code},${item.cgst},${item.sgst},${item.igst})`);
        await connection.commit();
        for(var i=0; i<item.unitOfMeasurements.length; i++) {
            await connection.execute(`insert into ac_item_uom values(${item.code},${item.unitOfMeasurements[i].code})`);
            await connection.commit();
        }
        await connection.close();
    }
    async getAllItem() {
        var connection=await connector.getConnection();
        if(connection==null) {
            throw "Unable to connect try after some time";
            return;
        }
        var items=[];
        var resultSet=await connection.execute("select ii.code,ii.name,tt.item_code,tt.cgst,tt.igst,tt.sgst from ac_item ii join ac_item_tax tt on ii.code=tt.item_code order by ii.code");
        resultSet.rows.forEach((row)=>{
            var code=row[0];
            var name=row[1].trim();
            var itemCode=row[2];
            var cgst=row[3];
            var igst=row[4];
            var sgst=row[5];
            items.push(new entites.ItemData(code,name,itemCode,cgst,igst,sgst));
        });
        await connection.close();
        return items;
    }
    async getByItemCode(code) {
        var connection=await connector.getConnection();
        if(connection==null) {
            throw "Unable to connect try after some time";
        }
        var items=[];
        //var resultSet=await connection.execute(select ii.code,ii.name,tt.item_code,tt.cgst,tt.igst,tt.sgst from ac_item ii join ac_item_tax tt on ii.code=tt.item_code where ii.code=${code});
        var resultSet=await connection.execute(`select ii.code,ii.name,tt.item_code,tt.igst,tt.sgst,tt.cgst,uu.name as uom_name from ac_item ii JOIN ac_item_tax tt ON ii.code=tt.item_code JOIN ac_uom uu ON ii.code=uu.code where ii.code=${code}`);
        resultSet.rows.forEach((row)=>{
            var code=row[0];
            var name=row[1].trim();
            var itemCode=row[2];
            var cgst=row[3];
            var igst=row[4];
            var sgst=row[5];
            var uom_name=row[6];
            items.push(new entites.ItemData(code,name,itemCode,cgst,igst,sgst,uom_name));
            var name=row[6];
        });
        await connection.close();
        return items;
    }
    async delete(code) {
        if(code <= 0) {
            throw "Code Should be greater than zero.";
            return;
        } 
        var connection=await connector.getConnection();
        if(connection==null) {
            throw "Unable to established connection please try after some time";
        }
        var resultSet=await connection.execute(`select code from ac_item where code=${code}`);
        if(resultSet.rows.length === 0) {
            await connection.close();
            throw `Item Code ${code} Not Exists`;
        }
        resultSet=await connection.execute(`delete from ac_item where code=${code}`);
        await connection.commit();
        await connection.close();
    }
}
class StateManager {
    constructor() {}
    async getAll() {
        var connection=await connector.getConnection();
        if(connection==null) {
            throw "Unable to established connection please, try after some time";
            return;
        }
        var states=[];
        var resultSet=await connection.execute("select * from ac_state order by code");
        resultSet.rows.forEach((row)=>{
            var code=row[0];
            var name=row[1].trim();
            var alphaCode=row[2].trim();
            states.push(new entites.State(code,name,alphaCode));
        });
        await connection.close();
        return states;
    }
    async getByCode(stateCode) {
        var connection=await connector.getConnection();
        if(connection==null) {
            throw "Unable to established connection some errors occured";
            return;
        }
        if(stateCode<0) {
            throw "In Order to get State Information StateCode not must be less than zero";
        }
        var resultSet=await connection.execute(`select * from ac_state where code=${stateCode}`);
        if(resultSet.rows.length==0) {
            throw `State Code ${stateCode} not exists`;
            return;
        }
        var states=[];
        resultSet.rows.forEach((row)=>{
            var code=row[0];
            var name=row[1].trim();
            var alphaCode=row[2].trim();
            states.push(new entites.State(code,name,alphaCode));
        });
        await connection.close();
        return states;
    }
    async getByAlphaCode(alphaCode) {
        var connection=await connector.getConnection();
        if(connection==null) {
            throw "Unable to established connection some errors occured";
            return;
        }
        if(alphaCode.length==0) {
            throw "In Order to get State Information Alpha Code is Not Empty.";
        }
        var resultSet=await connection.execute(`select * from ac_state where code=${alphaCode}`);
        if(resultSet.rows.length==0) {
            throw `Aplha Code ${alphaCode} Not Exists.`;
            return;
        }
        var alphaCodes=[];
        resultSet.rows.forEach((row)=>{
            var code=row[0];
            var name=row[1].trim();
            var alphaCode=row[2].trim();
            alphaCodes.push(new entites.State(code,name,alphaCode));
        });
        await connection.close();
        return alphaCodes;
    }
}
class TraderManager {
    constructor(){}
    async getAll() {
        var connection=await connector.getConnection();
        if(connection==null) {
            throw "Unable to established connection some errors occured";
        }
        var traders=[];
        var resultSet=await connection.execute("select tt.code,tt.name,tt.address,tt.gst_num,tt.reg_title_1,reg_value_1,contact_1,contact_2,contact_3,tt.bank_custom_name,tt.account_number,tt.branch_name,tt.ifsc_code,ss.name as state_name from ac_trader tt JOIN ac_state ss ON tt.state_code=ss.code");
        if(resultSet.rows.length==0) {
            await connection.close();
            throw "No Records Found";
        }
        var traders=[];
        resultSet.rows.forEach((row)=>{
            var code=row[0];
            var name=row[1].trim();
            var address=row[2].trim();
            var gst_num=row[3].trim();
            var reg_title_1=row[4].trim();
            var reg_value_1=row[5].trim();
            var contact_1=row[6].trim();
            var contact_2=row[7].trim();
            var contact_3=row[8].trim();
            var bank_custom_name=row[9].trim();
            var account_number=row[10].trim();
            var branch_name=row[11].trim();
            var ifsc_code=row[12].trim();
            var state_code=row[13].trim();
            traders.push(new entites.Trader(code,name,address,gst_num,reg_title_1,reg_value_1,contact_1,contact_2,contact_3,bank_custom_name,account_number,branch_name,ifsc_code,state_code));
        });
        await connection.close();
        return traders;
    }


    async getByCode(traderCode) {
        if(traderCode <= 0) {
            throw "Trader Code Should Not Be Less Than Zero";
        }
        var connection=await connector.getConnection();
        if(connection==null) {
            throw "Unable to established connection some errors occured";
        }
        var traders=[];
        var resultSet=await connection.execute(`select code from ac_trader where code=${traderCode}`);
        if(resultSet.rows.length==0) {
            throw `Accounting Id ${traderCode} Does Not Exists.`;
        }
        resultSet=await connection.execute(`select * from ac_trader where code=${traderCode}`);
        resultSet.rows.forEach((row)=>{
            var code=row[0];
            var name=row[1].trim();
            var address=row[2].trim();
            var gst_num=row[3].trim();
            var reg_title_1=row[4];
            var reg_value_1=row[5];
            var reg_title_2=row[6];
            var reg_value_2=row[7];
            var reg_title_3=row[8];
            var reg_value_3=row[9];
            var contact_1=row[10];
            var contact_2=row[11];
            var contact_3=row[12];
            var state_code=row[13];
            traders.push(new entites.Trader(code,name,address,gst_num,reg_title_1,reg_value_1,
                reg_title_2,reg_value_2,reg_title_3,reg_value_3,contact_1,contact_2,contact_3,state_code));
        });
        await connection.close();
        return traders;    
    }
    async update(trader) {
        if(trader.code <= 0) {
            throw "Code is required to update";
        }
        if(trader.name === 0) {
            throw "Name is required";
        }
        var connection = await connector.getConnection();
        if (!connection) {
            throw "Failed to establish a database connection.";
        }
        try
        {
            var resultSet=await connection.execute(`select code from ac_trader where code=${trader.code}`);
            if(resultSet.rows.length < 0) {
                throw `Accounting Id ${trader.code} Does Not Exists.`;
            }
            resultSet = await connection.execute(`
            update ac_trader 
            set 
                name = :name,
                address = :address,
                gst_num = :gst_num,
                reg_title_1 = :reg_title_1,
                reg_value_1 = :reg_value_1,
                contact_1 = :contact_1,
                contact_2 = :contact_2,
                contact_3 = :contact_3,
                bank_custom_name = :bank_custom_name,
                account_number = :account_number,
                branch_name = :branch_name,
                ifsc_code = :ifsc_code,
                state_code = :state_code
                where 
                code = :code
            `, {
            name: trader.name,
            address: trader.address,
            gst_num: trader.gst_num,
            reg_title_1: trader.reg_title_1 !=null ? trader.reg_title_1 : null,
            reg_value_1: trader.reg_value_1 !=null ? trader.reg_value_1 : null,
            contact_1: trader.contact_1 !=null ? trader.contact_1 : null,
            contact_2: trader.contact_2 !=null ? trader.contact_2 : null,
            contact_3: trader.contact_3 !=null ? trader.contact_3 : null,
            bank_custom_name: trader.bank_custom_name,
            account_number: trader.account_number,
            branch_name: trader.branch_name,
            ifsc_code: trader.ifsc_code,
            state_code: trader.state_code,
            code: trader.code
        });
            await connection.commit();
            await connection.close();
        }catch(error) {
            throw error;
        }
    }
}

class CustomerManager {
    async add(customer) {
        if (!customer.code || customer.code <= 0) {
            throw "Code is required and must be a positive number.";
        }
        if (!customer.name) {
            throw "Name is required.";
        }
        if (!customer.address) {
            throw "Address is required.";
        }

        var connection = await connector.getConnection();
        if (!connection) {
            throw "Failed to establish a database connection.";
        }

        try {
            // Check if the address already exists
            const resultSet = await connection.execute(`SELECT address FROM ac_customer WHERE LOWER(address) = LOWER(:address), [customer.address]`);
            if (resultSet.rows.length > 0) {
                throw `Address '${customer.address}' already exists.`;
            }

            // Perform the insertion
            await connection.execute(
                `INSERT INTO ac_customer (code, name, address, reg_title_1, reg_value_1, reg_title_2, reg_value_2, reg_title_3, reg_value_3, contact_1, contact_2, contact_3, state_code) 
                 VALUES (:code, :name, :address, :reg_title_1, :reg_value_1, :reg_title_2, :reg_value_2, :reg_title_3, :reg_value_3, :contact_1, :contact_2, :contact_3, :state_code)`,
                customer
            );
            await connection.commit();
            console.log('Customer added successfully.');
        } catch (error) {
            throw error; // Rethrow the error for upper layer handling
        } finally {
            await connection.close();
        }
    }
    
    async update(customer) {
        if(!customer.code) {
            throw "Code is Required";
        }
        if(!customer.name) {
            throw "Name is Required";
        }
        if(!customer.address) {
            throw "Address is Required";
        }
        var connection=await connector.getConnection();
        if(connection==null) {
            throw "Some errors have been occured";
        }
        try
        {
            var resultSet=await connection.execute(`select code from ac_customer where code=${customer.code}`);
            if(resultSet.rows.length < 0) {
                throw `Code JDGBDFB ${customer.code} Does Not Exists`;
            }
            resultSet = await connection.execute(`
                UPDATE ac_customer 
                SET name = :name,address = :address,reg_title_1 = :reg_title_1,reg_value_1 = :reg_value_1,reg_title_2 = :reg_title_2,reg_value_2 = :reg_value_2,reg_title_3 = :reg_title_3,reg_value_3 = :reg_value_3,contact_1 = :contact_1,contact_2 = :contact_2,contact_3 = :contact_3,state_code = NVL(:state_code, state_code) WHERE code = :code`, {
                name: customer.name,
                address: customer.address,
                reg_title_1: customer.reg_title_1,
                reg_value_1: customer.reg_value_1,
                reg_title_2: customer.reg_title_2,
                reg_value_2: customer.reg_value_2,
                reg_title_3: customer.reg_title_3,
                reg_value_3: customer.reg_value_3,
                contact_1: customer.contact_1,
                contact_2: customer.contact_2,
                contact_3: customer.contact_3,
                state_code: customer.state_code,
                code: customer.code
            });
            await connection.commit();
            await connection.close();
        }catch(err) {
            throw err;
        }
    }

    async delete(code) {
        if(!code) {
            throw "Code is required to delete";
        }
        var connection=await connector.getConnection();
        if(connection==null) {
            throw "Some errors have been occured";
        }
        try
        {
            var resultSet=await connection.execute(`select code from ac_customer where code=${code}`);
            if(resultSet.rows.length < 0) {
                await connection.close();
                throw `Code ${customer.code} Not Exists`;
            }
            resultSet=await connection.execute(`delete from ac_customer where code=${code}`);
            await connection.commit();
            await connection.close();
        }catch(err) {
            console.log(err);
        } 
    }

    async getByCustomerCode(code) {
        if(!code) {
            throw "Code is Required To Fetch getAll";
        }
        var connection=await connector.getConnection();
        if(connection==null) {
            throw "Some errors have been occured";
        }
        try
        {
            var resultSet=await connection.execute(`select code from ac_customer where code=${code}`);
            if(resultSet.rows.length < 0) {
                throw `Code ${code} Not Exists`;
            }
            resultSet=await connection.execute(`select ii.code,ii.name,ii.address,ii.reg_title_1,ii.reg_value_1,ii.reg_title_2,ii.reg_value_2,ii.reg_title_3,ii.reg_value_3,ii.contact_1,ii.contact_2,ii.contact_3,ss.name as state_name from ac_customer ii join ac_state ss on ii.state_code=ss.code where ii.code=${code}`);
            var customers=[];
            resultSet.rows.forEach((row)=>{
                var code=row[0];
                var name=row[1].trim();
                var address=row[2].trim();
                var reg_title_1=row[3];
                var reg_value_1=row[4];
                var reg_title_2=row[5];
                var reg_value_2=row[6];
                var reg_title_3=row[7];
                var reg_value_3=row[8];
                var contact_1=row[9];
                var contact_2=row[10];
                var contact_3=row[11];
                var state_code=row[12];
                customers.push(new entites.Customer(code,name,address,reg_title_1,reg_value_1,reg_title_2,reg_value_2,reg_title_3,reg_value_3,contact_1,contact_2,contact_3,state_code));
            });
            await connection.close();
            return customers;
        }catch(err) {
            console.log(err);
        }
    }

    async getAll() {
        var connection=await connector.getConnection();
        if(connection==null) {
            throw "Some error Occured please again later";
        }
        try
        {
            //var resultSet=await connection.execute("select tt.code,tt.name,tt.address,tt.gst_num,tt.reg_title_1,reg_value_1,tt.reg_title_2,reg_value_2,tt.reg_title_3,reg_value_3,contact_1,contact_2,contact_3,ss.name as state_name from ac_trader tt JOIN ac_state ss ON tt.state_code=ss.code");
            var resultSet=await connection.execute("select code,name from ac_customer");
            if(resultSet.rows.length==0) {
                await connection.close();
                throw "No Records Found";
            }
            var customers=[];
            resultSet.rows.forEach((row)=>{
                var code=row[0];
                var name=row[1].trim();
                //var address=row[2].trim();
                //var reg_title_1=row[3];
                //var reg_value_1=row[4];
                //var reg_title_2=row[5];
                //var reg_value_2=row[6];
                //var reg_title_3=row[7];
                //var reg_value_3=row[8];
                //var contact_1=row[9];
                //var contact_2=row[10];
                //var contact_3=row[11];
                //var state_code=row[12];
                customers.push(new entites.Customer(code,name));
            });
            return customers;
        }catch(err) {
            throw err;
        }
    }
}

/* I have three table ac_uom,ac_item,ac_item_tax
ac_uom code,name
         1   Kg
         2   Pcs
         3   Ltr
ac_item_tax item_code,cgst,igst
                1       18  34
ac_item code,name
          1   Screw
    
    if i select ac_item code then it should show data like this
       code,name,item_code,igst,cgst,uom
        1    Screw   1      34   18   Kg
                                      Ltr
                                      Screw
 */

module.exports={UnitOfMeasurementManager,ItemManager,StateManager,TraderManager,CustomerManager};