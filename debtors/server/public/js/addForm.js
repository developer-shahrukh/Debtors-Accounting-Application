$(()=>{    
    $("#addData").click(function(){
        var code=$("#code").val();
        var name=$("#itemName").val();
        var cgst=$("#cgst").val();
        var sgst=$("#sgst").val();
        var igst=$("#igst").val();
        var uom=$("#uom").val();
        var selectedItem=$("#unitOfMeasurements .ui-selected").map(function(){
            var itemName=$(this).text();
            var code=$(this).data('code');
            //alert(itemName+","+code);
        });
        //alert(name);
        //alert(cgst);
        //alert(sgst);
        //alert(igst);
        //alert(uom);
    });

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
          if(selectedData.length > 0) {
            selectedData.each(function(){
              $("#unitOfMeasurements").append($(this).clone());
              $(this).remove();
            });
          }
        });
        $("#leftButton").click(function(){
          var rightData=$("#unitOfMeasurements .ui-selected");
          if(rightData.length > 0) {
            rightData.each(function(){
              $("#select").append($(this).clone());
              //$(ui.selected).addClass("ui-selected").siblings().removeClass("ui-selected");
              $(this).remove();
            });
          }
        });
    

   
});


