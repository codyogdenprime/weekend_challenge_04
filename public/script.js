function imageExists(a,b){var c=new Image;c.onload=function(){b(!0)},c.onerror=function(){b(!1)},c.src=a}console.log("00_image_exists.js sourced");var findImages=function(){console.log("find images"),$(".list").each(function(){console.log("list"),$(this).find("ul > li").each(function(){var a=$(this).find("input"),b=($(this).find("input").data("id"),$(this).find("input").data("content"));imageExists(b,function(c){if(console.log(c),c&&0===a.siblings("img").length&&!a.parent().hasClass("item-complete")){var d=$("<img />",{class:"preview-image"}).attr("src",b);d.insertAfter(a)}})})})};console.log("02_genList.js sourced");var genList=function(a){for(var b=$(),c=0;c<a.length;c++){var d=$("<div />",{class:"list-container"}),e=$("<div />",{class:"list",data:a[c]}),f=$("<div />",{class:"list-title"}),g=$("<input />",{class:"list-title-input",data:a[c]}).attr("type","text").val(a[c].name),h=$("<button />",{class:"list-menu"}).html("..."),i=$("<ul />").attr("id",a[c].id),j=genItem(a[c].items),k=$("<div />",{class:"list-new-item"}),l=$("<input />",{class:"new-item-input",data:a[c]}).attr("placeholder","Add new item...");f.append([g,h]),e.append(f),i.append(j),e.append(i),k.append(l),e.append(k),d.append(e),b=b.add(d)}b.insertBefore(".list-container.add-list"),findImages()};console.log("03_genItem.js sourced");var genItem=function(a){var b=[];if(a)for(var c=0;c<a.length;c++){var d=a[c],e=$("<li />");console.log("item status",d.status),d.status,d.complete&&e.addClass("item-complete");var f=$("<input />",{class:"item-input",data:d,id:d.id}).attr("type","text").val(d.content).attr("disabled","true");e.append(f),b.push(e)}return b};console.log("01_add_item.js sourced");var addList=function(){var a=$(".input-new-list");return""!==a.val()&&void $.ajax({url:"/list",type:"POST",dataType:"json",data:{name:a.val()},success:function(b){console.log("List Added",b),a.val(""),a.blur(),genList(b)}})};console.log("11_editlist.js sourced");var editList=function(){console.log("This data:",$(this).data()),$(this).blur();var a=$(this).data("id"),b=String("/list/"+a);$.ajax({url:b,type:"PUT",dataType:"json",data:{name:$(this).val()},success:function(a){console.log("Edited list!",a)}})};console.log("20_addItem.js sourced");var addItem=function(){console.log("Add Item:",$(this));var a=$(this);console.log("List ID:",$(this).data("id"));var b=a.data("id");console.log("URL","/list/"+b+"/items"),$.ajax({url:"/list/"+b+"/items",type:"POST",dataType:"json",data:{content:$(this).val()},success:function(c){console.log("Added Item!",c);a.val();a.val(""),$("#"+b).append(genItem(c)),refreshList(b)}})};console.log("21_editItem.js sourced");var editItem=function(){console.log("edit item",$(this).closest(".list").data("id"));var a=$(this);$(this).addClass("in-focus");var b=$(this).data("id");console.log("Item ID:",b);var c=$(this).closest(".list").data("id"),d=String("/list/"+c+"/items");console.log("url",d),$.ajax({url:d,type:"PUT",dataType:"json",data:{id:a.data("id"),content:a.val()},success:function(b){console.log("Edited item!",b),a.blur(),a.trigger("mouseleave"),$(window).trigger("click")}})};console.log("22_completeItem.js");var completeItem=function(){console.log("Complete item");var a=$(this).closest(".list").data("id");console.log(a);var b=$(this).data();console.log(b);var c="/list/"+a+"/items/complete";$(this).data("complete")?method="DELETE":method="PUT",console.log("ajUrl",c),console.log("data.id",b.id),$.ajax({url:c,type:method,dataType:"json",data:{id:b.id},success:function(){console.log("Completed item!"),refreshList(a)}})};console.log("23_trashItem.js");var trashItem=function(){console.log("Trash item");var a=window.confirm("Are you sure you'd like to delete that?");if(!a)return!1;var b=$(this).closest(".list").data("id"),c=$(this).data(),d="/list/"+c+"/items/trash";$.ajax({url:d,type:"PUT",dataType:"json",data:{id:c.id},success:function(){console.log("Moved item to trash!"),refreshList(b)}})},archiveItem=function(){console.log("archive item")};console.log("50_refreshList.js sourced");var refreshList=function(a){console.log("Reload list",a);var b="/list/"+a,c=$("#"+a);$.ajax({url:b,type:"GET",dataType:"json",success:function(a){var b=a[0].items;c.empty(),c.append(genItem(b)),findImages()}})};console.log("70_genActions.js sourced");var genActions=function(){console.log("Generate action buttons",$(this));var a=$(this);a.removeAttr("disabled"),a.blur().focus(),a.val(a.val()),$(".item-buttons").empty();var b=$("<div />",{class:"item-buttons"}),c=$("<button />",{class:"done-button"}).html("Complete");c.on("click",completeItem),c.data(a.data());var d=$("<button />",{class:"trash-button"}).html("Trash");d.on("click",trashItem),d.data(a.data()),a.closest("li").hasClass("item-complete")&&(a.closest("li").removeClass("item-complete"),c.html("To List"),a.on("blur",function(){$(this).closest("li").addClass("item-complete")})),b.append([c,d]),b.insertAfter(a),a.on("mouseleave",function(){$(window).on("click",function(){a.attr("disabled","true"),b.detach()}),a.parent().on("click",function(a){a.stopPropagation()})})};console.log("98_load_lists.js sourced");var loadLists=function(){$.ajax({url:"/list",type:"GET",dataType:"json",success:function(a){console.log("genList data:",a);genList(a)}})};console.log("99_main.js sourced"),$(document).ready(function(){loadLists(),$("body").on("change",".new-item-input",addItem),$("body").on("change",".item-input",editItem),$("body").on("dblclick",".item-input",genActions),$("body").on("change",".list-title-input",editList),$(".input-new-list").on("enterKey",addList),$(".input-new-list").on("keyup",function(a){13==a.keyCode&&$(this).trigger("enterKey")})});