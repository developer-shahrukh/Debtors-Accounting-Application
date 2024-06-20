class UnitOfMeasurement
{
constructor(code,name)
{
this.code=code;
this.name=name;
}
getCode()
{
return this.code;
}
getName()
{
return this.name;
}
} // UnitOfMeasurement class ends here

class Item
{
constructor(code,name,hsnCode,cgst,sgst,igst,unitOfMeasurements)
{
this.code=code;
this.name=name;
this.hsnCode=hsnCode;
this.cgst=cgst;
this.sgst=sgst;
this.igst=igst;
this.unitOfMeasurements=unitOfMeasurements;
}
getCode()
{
return this.code;
}
getName()
{
return this.name;
}
getHSNCode()
{
    return this.hsnCode;
}
getCGST()
{
return this.cgst;
}
getSGST()
{
return this.sgst;
}
getIGST()
{
return this.igst;
}
getUnitOfMeasurements()
{
return this.unitOfMeasurements;
}
} // Item Class ends here

class State
{
    constructor(code,name,alphaCode)
    {
        this.code=code;
        this.name=name;
        this.alphaCode=alphaCode;
    }
    getCode()
    {
        return this.code;
    }
    getName()
    {
        return this.name;
    }
    getAlphaCode()
    {
        return this.alphaCode;
    }
} // State class ends here

class Trader
{
    constructor(code,name,address,gstNum,accountHolderName,accountNumber,branchName,ifscCode,regTitle1,regValue1,regTitle2,regValue2,regTitle3,regValue3,contact1,contact2,contact3,stateCode)
    {
        this.code=code;
        this.name=name;
        this.address=address;
        this.gstNum=gstNum;
        this.accountHolderName=accountHolderName;
        this.accountNumber=accountNumber;
        this.branchName=branchName;
        this.ifscCode=ifscCode;
        this.regTitle1=regTitle1;
        this.regValue1=regValue1;
        this.regTitle2=regTitle2;
        this.regValue2=regValue2;
        this.regTitle3=regTitle3;
        this.regValue3=regValue3;
        this.contact1=contact1;
        this.contact2=contact2;
        this.contact3=contact3;
        this.stateCode=stateCode;
    }
    getCode()
    {
        return this.code;
    }
    getName()
    {
        return this.name;
    }
    getAddress()
    {
        return this.address;
    }
    getGstNum()
    {
        return this.gstNum;
    }
    getAccountHolderName()
    {
        return this.accountHolderName;
    }
    getAccountNumber()
    {
        return this.accountNumber;
    }
    getBranchName()
    {
        return this.branchName;
    }
    getIFSCCode()
    {
        return this.ifscCode;
    }
    getRegTitle1()
    {
        return this.regTitle1;
    }
    getRegValue1()
    {
        return this.regValue1;
    }
    getRegTitle2()
    {
        return this.regTitle2;
    }
    getRegValue2()
    {
        return this.regValue2;
    }
    getRegTitle3()
    {
        return this.regTitle3;
    }
    getRegValue3()
    {
        return this.regValue3;
    }
    getContact1()
    {
        return this.contact1;
    }
    getContact2()
    {
        return this.contact2;
    }
    getContact3()
    {
        return this.contact3;
    }
    getStateCode()
    {
        return this.stateCode;
    }
} // Trader Class ends here

class Customer
{
    constructor(code,name,address,regTitle1,regValue1,regTitle2,regValue2,regTitle3,regValue3,contact1,contact2,contact3,stateCode)
    {
        this.code=code;
        this.name=name;
        this.address=address;
        this.regTitle1=regTitle1;
        this.regValue1=regValue1;
        this.regTitle2=regTitle2;
        this.regValue2=regValue2;
        this.regTitle3=regTitle3;
        this.regValue3=regValue3;
        this.contact1=contact1;
        this.contact2=contact2;
        this.contact3=contact3;
        this.stateCode=stateCode;
    }
    getCode()
    {
        return this.code;
    }
    getName()
    {
        return this.name;
    }
    getAddress()
    {
        return this.address;
    }
    getRegTitle1()
    {
        return this.regTitle1;
    }
    getRegValue1()
    {
        return this.regValue1;
    }
    getRegTitle2()
    {
        return this.regTitle2;
    }
    getRegValue2()
    {
        return this.regValue2;
    }
    getRegTitle3()
    {
        return this.regTitle3;
    }
    getRegValue3()
    {
        return this.regValue3;
    }
    getContact1()
    {
        return this.contact1;
    }
    getContact2()
    {
        return this.contact2;
    }
    getContact3()
    {
        return this.contact3;
    }
    getStateCode()
    {
        return this.stateCode;
    }
} // Customer Class ends here


module.exports={UnitOfMeasurement,Item,State,Trader,Customer};