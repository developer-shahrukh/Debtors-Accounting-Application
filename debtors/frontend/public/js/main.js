class ItemMasterDataModel
{
  constructor()
  {
    this.items=[];
    this.unitOfMeasurements=[];
  }
}
      
const addItem=()=>{
  var itemData={
    "code": 0,
    "name": name,
    "hsnCode": hsnCode,
    "cgst": cgst,
    "sgst": sgst,
    "igst": igst,
    "unitOfMeasurements": []
  };
  alert('click');
  addItemData(itemData);
}

// Pupulate table code start here
      
const updateItemView=(source)=>{
  var tbd=$("#itemTable").find("tbody");
  var i,cell,row;
  i=0;
  while(i<source.length){
    row=$("<tr>");
    cell=$(`<td>${i+1}</td>`);
    row.append(cell);
    cell=$(`<td>${source[i].code}</td>`);
    row.append(cell);
    cell=$(`<td>${source[i].name}</td>`);
    row.append(cell);
    cell=$(`<td class='icons' id='${source[i].code}'><i class="fa fa-edit"></i></td>`);
    row.append(cell);
    cell=$(`<td class='icons' id='${source[i].code}'><i class="fa fa-trash" onClick="deleteItem(${source[i].code})"></i></td>`);
    row.append(cell);
    tbd.append(row);
    i++;
  }
}
// Populate table code ends here

const deleteItem=(code)=>{
  deleteItemByCode(code).then((success)=>{
    if(success)
    {
      var model=new ItemMasterDataModel();
      $("#notification").text(`Item deleted code : ${code}`);
      var index=model.items.findIndex(item=>item.code==code);
      console.log('Index  is '+index);
      
      $("#noticeBoard").fadeIn();               
      setTimeout(function(){
        $("#noticeBoard").fadeOut();
      },4000);
    }
    else
    {
      alert('Item cannot delete');
    }
  });
}

const deleteItemByCode=(code)=>{
  var promise=new Promise((resolve,reject)=>{
    fetch(`/deleteItemByCode?code=${code}`).then((response)=>{
        return response.json();
      }).then((success)=>{
        resolve(success);
      }).catch((error)=>{
        resolve(error);
    });
  });
  return promise;
}
 
const getUnitOfMeasurements=()=>{
  var promise=new Promise((resolve,reject)=>{
    fetch("/getUnitOfMeasurements").then((response)=>{
        return response.json();
      }).then((unitOfMeasurements)=>{
        resolve(unitOfMeasurements);
      }).catch((error)=>{
        reject(error);
    });
  });
  return promise;
}

const getItems=()=>{
  var promise=new Promise((resolve,reject)=>{
    fetch("/getItems").then((response)=>{
      return response.json();
    }).then((itemData)=>{
      resolve(itemData);
    }).catch((error)=>{
      reject(error);
    });
  });
  return promise;
}

const clearError=()=>{
  $("#nameError").html("");
  $("#hsnCodeError").html("");
  $("#cgstError").html("");
  $("#sgstError").html("");
  $("#igstError").html("");
  $("#uomError").html("");
}

const clearForm=()=>{
  $("#item-name").val("");
  $("#hsn-code").val("");
  $("#item-cgst").val("");
  $("#item-sgst").val("");
  $("#item-igst").val("");
  $("#unitOfMeasurements").empty();
}

$(()=>{
    var model=new ItemMasterDataModel();
    getItems().then((itemsData)=>{
      for(var i=0;i<itemsData.length;i++)
      {
        model.items.push(itemsData[i]);
      }
      updateItemView(model.items);
    }); // getItems function ends here

    getUnitOfMeasurements().then((uomData)=>{
      for(var i=0;i<uomData.length;i++)
      {
        model.unitOfMeasurements.push(uomData[i]); 
      }
      model.unitOfMeasurements.forEach((unitOfMeasurement)=>{
        $("#select").append(`<li id='${unitOfMeasurement.code}'>${unitOfMeasurement.name}</li>`);
      });
    }); // getUnitOfMeasurements function ends here
            
            
    $(document).on('click','tr',function(){
       var itemCode=$(this).closest('tr').find('td:eq(1)').text();
       $.ajax({
          type: 'GET',
          url: '/getByCode',
          contentType: 'application/json',
          data: ({code: itemCode}),
          success: function(response){
          if(response.error){
            alert('Some problem');
          }
          else{
            //console.log(response);
            //console.log(response.length);
            $("#unitOfMeasurementsList").empty();
            response.forEach((u)=>{
              //console.log(u.unitOfMeasurements)
              var code=u.unitOfMeasurements;
              var promise=new Promise((resolve,reject)=>{
                fetch(`getUnitOfMeasurementByCode?code=${code}`).then((response)=>{
                  return response.json();
                    }).then((uom)=>{
                        //console.log("Code : "+uom.code);
                        //console.log("Name : "+uom.name);
                        $("#unitOfMeasurementsList").append(`<li id='${uom.code}'>${uom.name}</li>`);
                      }).catch((error)=>{
                    reject(error);
                  });
                return promise;
              });        
            });    
  
            $("#name").text(`Item Name : ${response[0].name}`);
            $("#hsnCode").text(`HSN Code : ${response[0].hsnCode}`);
            $("#itemCode").text(`Item Code : ${response[0].code}`);
            $("#cgst").text(`CGST : ${response[0].cgst}`);
            $("#igst").text(`IGST : ${response[0].igst}`);
            $("#sgst").text(`SGST : ${response[0].sgst}`); 
          }
      },
      error: function(error){
        console.log(error);
      }
    });
  });  
            
  $(".addButton").click(()=>{
    $("#exampleModal").modal('show');
    $("#select").empty();
    model.unitOfMeasurements.forEach((unitOfMeasurement)=>{
      $("#select").append(`<li id='${unitOfMeasurement.code}'>${unitOfMeasurement.name}</li>`);
    });
  });
            
  $("#addUomButton").click(()=>{
    var unitOfMeasurement=$("#addUom").val();
    if(unitOfMeasurement.length==0)
    {
      $("#uomAddError").text("Please enter uom");
      return;
    }
    if(unitOfMeasurement.length>5)
    {
      $("#uomAddError").text("Length should be less than 6");
      return;
    }
    alert(unitOfMeasurement);
  });
    
  $("#addData").click(function(){
    clearError();
    var code=0;
    var name=$("#item-name").val().trim();
    var hsnCode=$("#hsn-code").val();
    var cgst=$("#item-cgst").val();
    var sgst=$("#item-sgst").val();
    var igst=$("#item-igst").val();
    var errorCount=0;
    if(name.length==0) 
    {
      errorCount++;
      $("#nameError").html("Name is required");
      $("#item-name").focus();
    }
    if(!hsnCode)
    {
      errorCount++;
      $("#hsnCodeError").html("HSN Code required");
      if(name.length==0) $("#item-name").focus();
      else $("#hsn-code").focus();  
    }
    if(!cgst) 
    {
      errorCount++;
      $("#cgstError").html("CGST is required");
      if(name.length==0) $("#item-name").focus();
      else if(hsnCode.length==0) $("#hsn-code").focus();  
      else $("#item-cgst").focus();
    }
    if(sgst.length==0)
    {
      errorCount++;
      $("#sgstError").html("SGST is required");
      if(name.length==0) $("#item-name").focus();
      else if(hsnCode.length==0) $("#hsn-code").focus();  
      else if(cgst.length==0) $("#item-cgst").focus();
      else $("#item-sgst").focus();
    }
    if(igst.length==0)
    {
      errorCount++;
      $("#igstError").html("IGST is required");
      if(name.length==0) $("#item-name").focus();
      else if(hsnCode.length==0) $("#hsn-code").focus();  
      else if(cgst.length==0) $("#item-cgst").focus();
      else if(sgst.length==0) $("#item-sgst").focus();
      else $("#item-igst").focus();
    }
    var selectedItem=$("#unitOfMeasurements .ui-selected");
    if(selectedItem.length==0) 
    {
      errorCount++;
      $("#uomErrorSection").html("Select Atleast one UOM");
    }
    if(errorCount>0) return;
    var uoms=[];
    selectedItem.map(function(){
      $("#uomErrorSection").html("");
      var itemName=$(this).text();
      var itemCode=$(this).attr('id');
      uoms.push(itemName,itemCode);
    });
    var addData={
      "code": code,
      "name": name,
      "hsnCode": hsnCode,
      "cgst": cgst,
      "sgst": sgst,
      "igst": igst,
      "uom": uoms
    };
    var addDataStringified=JSON.stringify(addData);  
    $.ajax({
      url: "/addItem",
      type: "POST",
      contentType: "application/json",
      data: addDataStringified,
      success: function(response){
        if(response.error)
        {
          alert(response.error);
        }
        else
        {
          console.log(response.itemCode);
          addData.code = response.itemCode;
          $("#exampleModal").modal('hide');
          $("#notification").text("Item Added");
          clearForm();
          $("#itemTable tbody").empty();
          model.items.push(addData);
          updateItemView(model.items);
          $("#noticeBoard").fadeIn();               
          setTimeout(function(){
            $("#noticeBoard").fadeOut();
          },4000);
        }
      },
      error: function(error){
        alert("Some Error");
      }        
    });
  }); // addData click function ends here
    
  var sel=$("#select");
  sel.selectable({
    selected : function(ev,ui){
      var selectedItem=$('ui.selected');
      var itemName=selectedItem.text();
      var itemCode=selectedItem.data('code');
      //alert(itemCode+","+itemName);
      $(ui.selected).addClass("ui-selected").siblings().removeClass("ui-selected");
    }
  });
  var right=$("#unitOfMeasurements");
  right.selectable({
    selected : function(ev,ui) {
      $(ui.selected).addClass("ui-selected").siblings().removeClass("ui-selected");
      //alert(ev.target.id);
    }
  });
    
  $("#rightButton").click(function(){
    var selectedData=$("#select .ui-selected");
    if(selectedData.length > 0) 
    {
      selectedData.each(function(){
        $("#unitOfMeasurements").append($(this).clone());
        $(this).remove();
      });
    }
  });
  $("#leftButton").click(function(){
    var rightData=$("#unitOfMeasurements .ui-selected");
    if(rightData.length > 0) 
    {
      rightData.each(function(){
        $("#select").append($(this).clone());
        //$(ui.selected).addClass("ui-selected").siblings().removeClass("ui-selected");
        $(this).remove();
      });
    }
  });

}); // document load annonumous function ends here