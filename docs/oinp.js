try{
document.domain="gov.on.ca";
}catch(e){ console && console.log(e)}

function hidePopover(){
	 $('[data-toggle="popover"]').popover('hide');
}

function getNumberMask(input){
	    var num = $(input).attr('maxlength');
	    if(!num) num = 20;
	    else num = parseInt(num);
	    
	    if(num < 6) num = 6;
	    
	    var m = '';
	    var repeat = Math.floor((num -6)/4);
	    if(repeat > 0){
	    	for(x = 0; x < repeat ; x ++)	   m = '###,'+m;
	    }

	    m = '#,' + m + '##9.99';
	    return m;
}

$(document).ready(function(){
	/* $('form').not(".non-blocking-form").submit(function( event ) {
    	//$(event.target).attr('disabled',true);
    	$('input:submit').attr("disabled", true);
    	blockingUI();
    	
   	});
    */
	
    //$("input.money").mask("###,###,###,##9.99", {reverse: true});
	sessionTimer();

    $("input.money").each (function(){
    
	    $(this).mask(getNumberMask(this), {reverse: true});
		 
     })  ;
    
    $("input.wholenumber").each (function(){
    	    var num = $(this).attr('maxlength');
    	    if(!num) num = 20;
    	    else num = parseInt(num);
    	    
    		var P = new Array( num + 1 ).join( '9' ); 
            $(this).mask(P);
    })  ;
    
    $("input.decimal2").each (function(){
	    $(this).mask(getNumberMask(this), {reverse: true});

    })  ;

    $("input.percent").each (function(){
	    $(this).mask("##9.99", {reverse: true});
    })  ;
    
    $(".oinp-date").mask('00/00/9999');
    
	$(".dateicon").on('click',function(){
		var ctr = $("#"+$(this).attr('data-for'));
		if (!ctr.length) {
         	ctr = $("#"+$(this).attr('for'));
         }
         
        var mindate = new Date(1900,0,1);
		var maxdate = new Date(2050,0,1);   
		   
		var bdate = $(ctr) ;
		   
		if($(bdate).data('min-date')){
			   mindate = $(bdate).data('min-date'); 
		}
		if($(bdate).data('max-date')){
			maxdate = $(bdate).data('max-date'); 
		}
		
		ctr.datepicker( "setDate" , null );
		ctr.datepicker('destroy');
		ctr.datepicker({
			   startView : ctr.val() == '' ? 3 : 0,
			   showOnFocus: false,
			   language: locale,
			   autoclose: true,
			   startDate: mindate,
			    endDate: maxdate  
//			    defaultViewDate : {
//			    	year : 1950,
//			    	month : 0,
//			    	day: 1
//			    }
		   });		   
		ctr.datepicker('show');
	   });
	   
    $( document ).ajaxStart(function() {
      //   var img = oinpContextRoot + '/resources/img/loading_1.gif';    	
    //	 $.blockUI({ message: '<h1><img src="' + img  +'" /> Just a moment...</h1>' });
   	});

    $( document ).ajaxStop(function() {
    	// 	$.unblockUI();
   	});
	
    $('[data-toggle="tooltip"]').tooltip();
    
    $('[data-toggle="popover"]').popover({html:true,
    	template : '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div onfocusout="hidePopover()" tabindex="0" class="popover-content"></div></div>'
      	
    });

    $('body').on('click', function (e) {
        //only buttons
        if ($(e.target).data('toggle') !== 'popover' && $(e.target).parent().data('toggle')  !== 'popover' 
            && $(e.target).parents('.popover.in').length === 0) { 
            $('[data-toggle="popover"]').popover('hide');
          
        }
    });
    //$('[data-toggle="popover"]').hover(function(){
    //	$(this).popover('show');
    //});
    
    $("div.input-group.date .input-group-btn").hide();
    $("div.input-group.date").removeClass('input-group');

});

function validBeforeSubmit(e){
	return validBeforeSubmitWithBlockingMsg(e,null);
}


function validBeforeSubmitWithBlockingMsg(e, message){
	blockingUI(message);
	if ( e.isDefaultPrevented()) {
  	    // handle the invalid form...
		$.unblockUI();
  	    return false;
  	  } else {
  	    // everything looks good!
  		$('#waitspan').focus();
  		return true;
  	  }
}

function blockingUI(message){
	if (! message  ) {}
	else{
		$("#xthrobber span").html(message);
	}
	
	message = $("#xthrobber");
	
	$.blockUI({ 
        message: message ,  

		/*css: { 
        border: 'none', 
        padding: '15px', 
        backgroundColor: '#000', 
        '-webkit-border-radius': '10px', 
        '-moz-border-radius': '10px', 
        opacity: .5, 
        color: '#fff'

        } */
	
	}); 
	
}

function cleanMessage(message){
	return $('<div>').html(message).text();
}

function isDateTextValid(dateText){
	if (dateText.length != 10 ) return false;
	
	var comp = dateText.split('/');
	var d = parseInt(comp[0], 10);
	var m = parseInt(comp[1], 10);
	var y = parseInt(comp[2], 10);
	var date = new Date(y,m-1,d);
	if (date.getFullYear() == y && date.getMonth() + 1 == m && date.getDate() == d) {
	  return true;
	} else {
	  return false;
	}
}

function parseDate(dateText){
	var comp = dateText.split('/');
	var d = parseInt(comp[0], 10);
	var m = parseInt(comp[1], 10);
	var y = parseInt(comp[2], 10);
	var date = new Date(y,m-1,d);
	if (date.getFullYear() == y && date.getMonth() + 1 == m && date.getDate() == d) {
	  return date;
	} else {
	  return null;
	}
}

function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}



function log(line){
    	//if(console) console.log(line);
    }

function escapeJsExpression(expr){
	if(typeof expr === 'string')	return expr == null ? null : expr.replace(/\\/g,'\\\\').replace(/\'/g,"\\\'");
	else return expr;
}

    function getElementValueByMetaKey(metaKey){
    	var fg = $('#fg_'+metaKey); 
    	var val = '';
    	if(fg.length > 0){
    		 var radioInputs = $(fg).find("input[type='radio']"); 
		     if( radioInputs.length > 0  ){
		    	 if( radioInputs.filter(":checked").length > 0) val = radioInputs.filter(":checked").val();
		     }else{
		    	 var cbInputs = $(fg).find("input[type='checkbox']");	 
		    	 if( cbInputs.length > 0 ){
			    	 if(cbInputs.filter(":checked").length > 0) val = cbInputs.filter(":checked").val();
			     }else{
			    	 var input = $(fg).find("input,select");
			    	 if(input.length > 0) val = input.val();
			    	 else{
			    		 log("getElementValueByMetaKey - Not found :" + metaKey );
			    	 }
			     }
		    	 
		    	 
		     }
    		
    	}else{
    		if(formContextMap[metaKey] != undefined ){
    			val = formContextMap[metaKey].value;
    		}
    	}
    	
    	log("getElementValueByMetaKey - " + metaKey + '=' + val);
    	return val;
    }
    
    function evalFormContext(){
    	var script = '';
    	
    	for(key in formContextMap){
    		script = script  + "var "+ key + "='" + escapeJsExpression(getElementValueByMetaKey(key)) + "';\n";
    	};

    	for(key in formContextMap){
    		var value = formContextMap[key];
    		if(value.visibleCondition && value.visibleCondition != ''){
    			script = script + "formContextMap['"+key+"'].visible" + "= (" + value.visibleCondition + ");\n";
    		}
    		
    	};
    	
    	log(script);
    	
    	eval(script);
    	
    	for(key in formContextMap){
     		var val = eval(key);
     		log('store context var : '  + key + '=' + val + ", formContextMap["+ key +"].visible =" + formContextMap[key].visible);
     		contextVarMap[key] = eval(key);
     		
     		if($('#fg_' + key).hasClass('child-override')){
     			
     		}else{
     		
	     		if(formContextMap[key].visible){
	     			$("#fg_"+key).show();
	     		}else{
	     			$("#fg_"+key).hide();
	     			$("#fg_"+key +" input").each(function(){
	     				if($(this).is(':radio') && !$(this).hasClass('nginput')){
	     					$(this).prop('checked', false);
	     				//	log('uncheck radio - ' + key);
	     				}else if($(this).is(':checkbox')){
	     					$(this).prop('checked', false);
	     				}else if(!$(this).is(':disabled')){
	                        if (!$(this).hasClass('nginput')) {
	     					  //$(this).val('');
	                        }
	     					//console.log($(this).attr('id'));
	     				}
	     			});
	     			
	     			
	     			
	     		}
     		}
    	};

    	$("div.oinp-eval").each(function(){
    		var val = eval($(this).attr('data-expression'));
    		if(val) $(this).show();
    		else $(this).hide();
    	});
    }
    

	function validDynamicForm(){
		
		var allValid = true;
		/*
		$("#templateForm div.form-group.mandatory").filter(":visible").each(function(){
			 var valid = true;
			 var radioInputs = $(this).find("input[type='radio']"); 
		     if( radioInputs.length > 0 ){
		    	 valid = radioInputs.filter(":checked").length > 0;
		     }else if($(this).children("input.form-control").length ){
		    	 valid = $(this).children("input.form-control").first().val() != '';
		     }

			var label = $(this).find("label").first();
		     if(!valid){
					if(!$(label).data("bs.popover")){
    					label.popover({
    	                    placement:'right',
    	                    trigger:'manual',
    	                    html:true,
    	                    content: 'Required'
    	                });
					}
					label.popover('show');
					allValid = false;
	    	 }else{
					//if($(label).data("bs.popover")){
						label.popover('hide');
					//}
	    			
	    	}

		});
		*/
		return allValid;
		
	} 
	
function maskHumanName(selector, num){
	var P_NAME= new Array( num + 1 ).join( 'S' ); 

    $(selector).mask(P_NAME,{
		    translation: {
		        'S': {
		          pattern: /[a-z]|[A-Z]|\s|\.|\-/, optional: true
		        }
		    }
		 });
}	

function maskPhone(selector){
	   $(selector).mask("+000.(000).000.0000"
				  , {placeholder: "+000.(000).000.0000"}	   
			   );
			   
}

function replaceSpringIndex(input, index){
	
	try{
	 var id =  $(input).attr('id').replace(/(\d+)/, index);          
	 var name =  $(input).attr('name').replace(/(\d+)/, index);  
	 $(input).attr("id", id);
	 $(input).attr("name",name);
	 //$(input).attr("index",index);
	}
     catch(err){
    	 //alert(err);
     }	
	
}

function replaceSpringIndexWithPrefix(input, index, prefix){
	
	try{
	 var id =  $(input).attr('id').replace(prefix+'0', prefix+index);          
	 var name =  $(input).attr('name').replace(prefix+'[0]', prefix+'['+index+']');  
	 $(input).attr("id", id);
	 $(input).attr("name",name);
	 
	 //$(input).attr("index",index);
	}
     catch(err){
    	 //alert(err);
     }	
	
}

function replaceLabelSpringIndex(cloned, index){
	
	try{
		 $(cloned).find("label").each(function(){
			 var id =  $(this).attr('for').replace(/(\d+)/, index);          
			 $(this).attr("for", id);
		 });
	}
     catch(err){
     }	
	
}

function  parseIntNvl(val){
	if(val) return parseFloat(val);
	return 0;
}


function IsSafari() {

	  var is_safari = navigator.userAgent.toLowerCase().indexOf('safari/') > -1;
	  return is_safari;

}	

function validateFileSizeType(e, maxSize){
	    if(!e.value) return false;
	    
		var ext = e.value.match(/\.([^\.]+)$/)[1];
		if(ext) ext = ext.toLowerCase();
		switch(ext)
		{
			case 'doc':
			case 'docx':
			case 'pdf':
			case 'xls':
			case 'xlsx':
			case 'csv':
			case 'ppt':
			case 'pptx':
			case 'rtf':
			case 'txt':
			case 'jpeg':
			case 'bmp':
			case 'png':
			case 'gif':
			case 'tiff':
			case 'jpg':
				 break;
			default:
				alert("This type of file is not allowed!");
				if (!IsSafari()) {
				   e.type = "text";
				}
				e.value = "";
				e.type = "file";
		}
		if (e.value != "" && e.files[0].size > maxSize * 1024 *1024) {
		    alert("This file exceeds "+maxSize+" MB size!");
			if (!IsSafari()) {
			   e.type = "text";
			}
			e.value = "";
			e.type = "file";
		}
		
		if(!e.value || e.value == ''){
			return false;
		}else{
			return true;
		}
	}	

function validateAppDocFileSizeType(e){
	if(validateFileSizeType(e,10)){
		if($("form.uploadForm select[name='docType']").val()!='') $("#btnUpload").prop('disabled', false); 
	}else{
		$("#btnUpload").prop('disabled', true);
	}
}


function diffInMonths(toDate,fromDate){
	
	   
	   if(toDate==null ||toDate==''||fromDate==null ||fromDate==''||toDate.length<10||fromDate.length<10)
		   return;
	
	   var toDateMonth = parseInt(toDate.substring(3, 5));
	   var fromDateMonth = parseInt(fromDate.substring(3, 5));
	   
	   var toDateYear = parseInt(toDate.substring(6, 10));
	   var fromDateYear = parseInt(fromDate.substring(6, 10));
	  
	   
	    var months = toDateMonth - fromDateMonth + (12 * (toDateYear - fromDateYear));

	    return months;
	    
	}


 function updateTotalExpOnDateChanged() { 
	 
	
	 var expType=$("#fg_APP_BUSINESS_EXPR_TYPE :radio:checked").val();
	 var totalExp
	 if(expType=='OWNER')
		 totalExp=$("#totalBusExp").val();
		 else
		 totalExp=$("#totalManageExp").val();
	 //alert(expType);
	
	   var id = $(this).attr('id');
	   var next;
	   var val1 = $(this).val();
	   var oldVal = $(this).next().val();
	   var monthsDifftToReomve;
	   
	   if(oldVal!=null && oldVal==val1)
	    	 return;
	   
	   
	   var val2;
	   var monthsDiff;
	   if(totalExp==null||totalExp=='')
		   totalExp=0;
	   
	   if(id=='fromDate'){
		   
		   next =$(this).parent().next().children().first();
		   val2 = $(next).val()
		   monthsDiff=diffInMonths(val2,val1);
		   
           if(oldVal!=null && oldVal!=''&& oldVal!=val1){
        	    
			   monthsDifftToReomve=diffInMonths(val2,oldVal);
			   
		   }
		   
	   }
	   else{
		   
		   
		   next =$(this).parent().prev().children().first();
		   val2 = $(next).val()
		   monthsDiff=diffInMonths(val1,val2);
		   
		   if(oldVal!=null && oldVal!=''&& oldVal!=val2){
			   
			   monthsDifftToReomve=diffInMonths(oldVal,val2);
			  
		  }
		  
		   
	   }
	   
	   
	   if(monthsDiff>0)
		   totalExp=parseInt(totalExp)+parseInt(monthsDiff);
	   
	   if(monthsDifftToReomve!=null && monthsDifftToReomve>0)
		   totalExp=totalExp-monthsDifftToReomve;
	   
	   
	   
	   if(expType=='OWNER')
	      $("#totalBusExp").val(totalExp);
	   else
		   $("#totalManageExp").val(totalExp);
	   
	   $(this).next().val(val1);

}  
 
/* function updateProgramType(){
	   
	   var programOther =$(this).parent().next().children().first();

	   if (($(this).val() === 'Other')){
		    
	    	$(programOther).attr("required","true");
	    	$(programOther).attr("placeholder","(Required)");
	    	$("#programTypeLabel").addClass('mandatory-label');
	    	
	    	$(programOther).removeAttr('disabled');
	    }
	    else{
	    	
	     
	    	$(programOther).removeAttr("required");
	    	$(programOther).removeAttr("placeholder");
	    	$("#programTypeLabel").removeClass('mandatory-label');
	    	$(programOther). val("");
	    	$(programOther).attr('disabled','disabled');
	    	 
	    }
	    
	}*/
 
 function formatMoney(n, c, d, t){
	    c = isNaN(c = Math.abs(c)) ? 2 : c, 
	    d = d == undefined ? "." : d, 
	    t = t == undefined ? "," : t, 
	    s = n < 0 ? "-" : "", 
	    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
	    j = (j = i.length) > 3 ? j % 3 : 0;
	   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
	 };
	 
	 function updateTotalExperienceOnDelete(obj){
			
		 var fromDate =$(obj).parent().parent().parent().find("#fromDate").val();
		 var toDate =$(obj).parent().parent().parent().find("#toDate").val();
		 if(fromDate!=null &&fromDate!=''&&fromDate!=null &&fromDate!=''){
		 var diffInMonths=diffInMonths(toDate,fromDate); 
			 
		 }	
		
		   
		    
		} 
	 	 
	 
function attachAreyousure(){
	$('#dirtyFlag').val('1');
	$('#templateForm').trigger('rescan.areYouSure');
}	 

function logoutF5(autoJump){
	   $.get(oinpContextRoot +  "logoutSuccess",function(data){
	   }).
	   always(function(){
		 
		   $.get(_oneKeyLogoutUrl,function(data){
			   
		   }).always(function(){
			   if(autoJump)   location.href = oinp_logoutURL;
		   });
		   
	   });
}

function sessionTimer(){
	if(typeof _printMode != "undefined" && _printMode) return;
	
	if (!$('#a_logout').length) return;

	$("#btlogout").on('click',function(){
		logoutF5(true);
		$("#dialog").modal('hide');
	});
	
	$('#dialog2').on('hidden.bs.modal', function () {
		location.href = oinp_logoutURL;
		});
		
	//var my_buttons2 = {};
	//my_buttons2[label3] = function(){
	//	$(this).dialog('close');
		//window.location = $('div#div-logo a.header-link').filter(function(index) { return $(this).attr('href').indexOf('logout') > 0; }).attr('href'); 
	//};
	
	//$("#dialog").modal('show');

	// cache a reference to the countdown element so we don't have to query the DOM for it on each ping.
	var $countdown = $("#dialog-countdown");	
	
	$.idleTimeout('#dialog', '#btExtSession', {
		idleAfter: idle_after_seconds, // 1680, //28 minutes
		//idleAfter: 20, //1 minutes for local test
		pollingInterval: 60,
		keepAliveURL: oinpContextRoot + 'pingserver',
		serverResponseEquals: 'OK',
		titleMessage: '',
		onTimeout: function(){
			//window.location = 'home.htm?lang='+locale;
			logoutF5(false);
			$("#dialog").modal('hide');//.dialog("close");
			$('#dialog2').modal('show');
		},
		onIdle: function(){
			_lastFocus = $(':focus');
			$('#dialog').on('hidden.bs.modal', function () {
			   	  setTimeout(function(){
			   		  $(_lastFocus).focus();
			   	  },50);
			});
			$('#dialog').on('shown.bs.modal', function (e) {
				setTimeout(function(){
					$("#to_p1 ").focus();
			   	  },50);
			});
			$("#dialog").modal('show'); //.dialog("open");
			
			 //.dialog("open");
		},
		onCountdown: function(counter){
			$countdown.html(counter); // update the counter
		}
	});
	
	//$("#dialog2").modal('show');
}


function getTotalbusinessExperience1(val,index,dateType,expType){
	var idAppend = '';
    var divIdAppend = 'businessExp';
    if (expType == 'MANAGE') {
        idAppend = '\\.manage';
        divIdAppend = 'manageExpBox';
    }
    
    var totalExp = 0;
    
    var index = 0;
    var process = true;
    while (process) {
        var start = $('div#' + divIdAppend + ' input#fromDate\\.' + index + idAppend);
        var end = $('div#' + divIdAppend + ' input#toDate\\.' + index + idAppend);
        if (start.length > 0) {
            // exists
            if ((start.val() + '').split('/').length >= 3 && (end.val() + '').split('/').length >= 3) {
                // have value
                var sDate = new Date((start.val() + '').split('/')[2], parseInt((start.val() + '').split('/')[1]) - 1, (start.val() + '').split('/')[0]);
                var eDate = new Date((end.val() + '').split('/')[2], parseInt((end.val() + '').split('/')[1]) - 1, (end.val() + '').split('/')[0]);
                totalExp += parseInt( (eDate - sDate) / 1000 / 60 / 60 / 24 / 30);
            }
        } else {
            process = false;
        }
        index++;
    }
    
	return totalExp;
}

function getTotalbusinessExperience(val,index,dateType,expType){
	
	 
	 var url = 'getTotalbusinessExperience';
	 
	 var totalExp;
	  
	 if(val.length<10)
		 return;
	 $.ajax({
		    url : url,
		    data: {"dateValue" : val,"index":index ,"dateType":dateType,"expType":expType},
	        
		    type: "POST",
		    async: false,
		    success: function(response)
		    {
		        
		   		    	
		    	 
		    	 totalExp= response ;
		    		 
		 
		        
		    },
		    error: function ()
		    {
		 
		    	//alert("failed");
		    }
		});
	
	 
	 return totalExp;
}

function updateTotalExperience() {
	
	   
	   
	   var id = $(this).attr('id');
	   var val =$(this).val()
	   var comp = id.split('.');
	   var dateType = comp[0];
	   var index = parseInt(comp[1]);
	   
	 /*  if(dateType=='toDate'||dateType=='otherToDate') { //validate date
		   
	       var valid=validateBusExpDates($(this),dateType,val);
		   if(!validateBusExpDates($(this),dateType,val))
	          return ;
	   
	   }*/
	   validateFromToDate.call(this); 
	   
	   //var index=$(this).attr("index");
	   var expType=$("#fg_APP_BUSINESS_EXPR_TYPE :radio:checked").val();
	   
	   if(dateType=='otherFromDate'||dateType=='otherToDate')
		   return;
	   
        var totalExp = getTotalbusinessExperience1(val,index,dateType,expType);
	   
	   if(totalExp!=null&&totalExp!=''&&expType=='OWNER')
	     $("#totalBusExp").val(totalExp);
	   else if(totalExp!=null&&totalExp!=''&&expType=='MANAGE')
		   $("#totalManageExp").val(totalExp);  
	   
}

function initToDateCtrl(toDateCtrl){
	var mindate = new Date(1900,0,1);
	if($(toDateCtrl).hasClass('to-date')){
		var fromdatectr = $(this).closest(".row").find("input.from-date");
		if(fromdatectr.length == 10){
			var fromdate = fromdatectr.first().val();
			
			$(todatectr).data('min-date',sfromdate)

		}
		
	}
}

function validateFromToDate(){
	var mindate = new Date(1900,0,1);
    var maxdate=new Date();

	if($(this).hasClass('from-date')){
		var fromdate = $(this).val();
		
		var sfromdate = parseDate(fromdate);
		
		if($(this).data('max-date')){
			maxdate = $(this).data('max-date'); 
		}
		
		if (fromdate.length > 10 || (fromdate.length == 10 && ( sfromdate < mindate || sfromdate > maxdate) ) ){
			$(this).val('');
        	//$(todatectr).val('');
        }
		
		var todatectr = $(this).closest(".row").find("input.to-date");
		if(todatectr.length){
			var todatectr = todatectr.first();

			var stodate   = parseDate(todatectr.val());
			
			$(todatectr).data('min-date',sfromdate)

            if ( sfromdate > stodate && $(todatectr).val().length == 10   ){
            	$(todatectr).val('');
            }
		}
		
		
		
	}else if($(this).hasClass('to-date')){
		var fromdatectr = $(this).closest(".row").find("input.from-date");
		if(fromdatectr.length){
			if($(this).data('max-date')){
				maxdate = $(this).data('max-date'); 
			}
			
			var fromdate = fromdatectr.first().val();
			var todate = $(this).val();

			var sfromdate = parseDate(fromdate);
			var stodate   = parseDate(todate);

            if( $(this).val().length == 10 && (stodate > maxdate || sfromdate > stodate)){
            	$(this).val('');
            }

		}
		
	}
}

function validateEduHistDates(){
	   validateFromToDate.call(this); 

/*	 var id =$(this).attr("id");
	 var endDate;
	 var startDate;
	 var errordiv=$(this).parent().next();
	 
	 var idString =id.substring(0,9);
	 
	 if(idString=='startDate'){
		 
		 startDate=$(this).val();
		 endDate =$(this).parent().parent().next().children().first().children().first().val();
		 
	 }
	 else{
		  
		 endDate=$(this).val();
		 startDate =$(this).parent().parent().prev().children().first().children().first().val();
	 }
		 
	 
	 
	 
	    if(endDate==null||endDate==''||startDate==null||startDate=='')
	    	return;
	    
	    var sDate=parseDate(startDate);
	    var eDate=parseDate(endDate);
	    if(sDate >eDate){
	    	$(errordiv).css("color","#a94442"); 
	    	$(errordiv).html($("#endDateValidation").val());
	 	   if(idString!='startDate')
	 	     $(this).val("");
	    	
	    }
	    else
	    	$(errordiv).html("");
	    	*/
	    
}

function validateBusExpDates(o,dateType,val){
	 validateFromToDate.call(this); 
	 /*
	   var valid = true;
	   if(val.length<10)
		   return;
	   var fDate;
	   var fromDate =$(o).parent().parent().prev().children().first().children().first().val();
	   
	   var errordiv=$(o).parent().next().next();
	   $(errordiv).html("");
	   
	   if(dateType=='toDate'||dateType=='otherToDate'){ //check if this is later than today
	    	var tDate=parseDate(val);
	    	var curDate = new Date();
	    	
	    	if(tDate>curDate){
	    		$(errordiv).css("color","#a94442"); 
	    		$(o).val('');
	 	        $(errordiv).html("To date cannot be in future");
	 	       valid = false;
	 	        
	    	}
	    	else if(fromDate!=null && fromDate!=''){
	    		fDate=parseDate(fromDate);
	    		if(fDate >tDate){
	    	    	$(errordiv).css("color","#a94442"); 
	    	    	$(errordiv).html($("#toDateValidation").val());
	    	 	   $(o).val("");
	    	 	  valid = false;
	    	    	
	    	    }
	    	}
	    	else
	    		$(errordiv).html("");
	    	
	    	
	    	
	    }
	   return valid;
	    */
}


function validateExplVisitsDates(){
	validateFromToDate.call(this); 
	/*
	 var id =$(this).attr("id");
	 
	 var departureDate;
	 var arrivalDate;
	 var errordiv=$(this).parent().next();
	 var dateId = id.substring(0,11);
	 
	 
	 if(dateId=='arrivalDate'){
		 arrivalDate=$(this).val();
		 departureDate =$(this).parent().parent().next().children().first().children().first().val();
		 
	 }
	 else{
		 
		 departureDate=$(this).val();
		 arrivalDate =$(this).parent().parent().prev().children().first().children().first().val();
	 }
		 
	 
	 
	 
	    if(departureDate==null||departureDate==''||arrivalDate==null||arrivalDate=='')
	    	return;
	    
	    var sDate=parseDate(arrivalDate);
	    var eDate=parseDate(departureDate);
	    if(sDate >eDate){
	    	$(errordiv).css("color","#a94442"); 
	 	    $(errordiv).html($("#depDateValidation").val());
	 	   if(dateId!='arrivalDate') 
	 	      $(this).val("");
	    	
	    }
	    else
	    	$(errordiv).html("");
	    	*/
	
	
	    
}


function validateNAICCodes(event) {
	
	// Allow only backspace and delete
	var val = $(this).val().length;
   
   
	if ( event.keyCode == 46 || event.keyCode == 8|| event.keyCode == 9) {
		// let it happen, don't do anything
	}
	else {
		 
		// Ensure that it is a number and stop the keypress
		if (event.keyCode < 48 || (event.keyCode > 57 && event.keyCode<91)) {
			event.preventDefault();	
		}	
	}
	     
	   
}

function validatePercentage(event) {
	
	// Allow only backspace and delete
	var val = $(this).val();
   
	if(parseFloat(val) > 100) $(this).val('');
	
	/*
	
   
	if ( event.keyCode == 46 || event.keyCode == 8|| event.keyCode == 9) {
		// let it happen, don't do anything
	}
	else {
		 
		// Ensure that it is a number and stop the keypress
		if ((event.keyCode < 48 || event.keyCode > 57 && event.keyCode<91) && event.keyCode!= 190) {
			event.preventDefault();	
		}
		else if(val!=''){
			var twoPlacedFloat = parseFloat(val);
			
			if(val.length< 4 && (val=='100'||val=='100.00'||val=='100.0'))
				$(this).val("100.00");	
			else if(val.length>4){
				event.preventDefault();	
			    var i = val.indexOf('.');
			    if(i<0){
			    	 
			    	if(val=='100'||val=='100.00'||val=='100.0')
			    		$(this).val("100.00");	
			    	else
			    		$(this).val(val.substring(0,2)+"."+val.substring(3,5));
			    	
			    }
			    	
			    
			}
			
			 
		}
		
	}*/
	     
	   
}


function initArrows(alt_down, alt_hide, img_down, img_collapse){
	$(".spc-arrows , .arrows").unbind('click');
	$(".spc-arrows , .arrows").unbind('keypress');
	
	$(".spc-arrows").click(function(target){
		var target = this.getAttribute("data-target");
        togglePanelSpan($(this),target,alt_down,alt_hide,img_down,img_collapse);		
	});
	
	//for hide or collapse content
	$(".arrows").click(function(target){
		var target = this.getAttribute("data-target");
        togglePanel($(this),target,alt_down,alt_hide,img_down,img_collapse);		
	});
	
	$(".arrows").each(function(){
		$(this).attr('alt', $(this).attr('src').indexOf(img_down)>=0? alt_hide : alt_down );
	});
	
	var KEY_ENTER = 13;
	var KEY_SPACE = 32;
	
	$(".arrows ").keypress(function(event){
 		switch(event.which){
			case KEY_ENTER:
			case KEY_SPACE: {
				var target = this.getAttribute("data-target");
		        togglePanel($(this),target,alt_down,alt_hide,img_down,img_collapse);		
			}
		
		}//end switch
			
	});

	$(".spc-arrows ").keypress(function(event){
 		switch(event.which){
			case KEY_ENTER:
			case KEY_SPACE: {
				var target = this.getAttribute("data-target");
				togglePanelSpan($(this),target,alt_down,alt_hide,img_down,img_collapse);		
			}
		
		}//end switch
	    return false;
	});
	
	

	
}


function changeLanguage(lang, toUrl){
  	 location.href= toUrl;
}


function getEquivalentCLBScore(){

	 var url = oinpContextRoot + 'internalapp/appform/getEquivalentCLBScore';
	  
	 var clbScore;
	 var isCLBNumeric;  
	 var clbScoreLevel;
	
	 
	 var score =$(this).val();
	 if(score==null||score=='')
		 return;
	 
	 var isScoreNumeric =$.isNumeric(score);  
	
	 var id =$(this).attr("id");
	 
	 var tokens = id.split(".");
	 var token1 = tokens[0]
	 var token2 = tokens[1]
	 var token3 = tokens[2]
	 var testTypeCode ;
	 var subTypeCode;
	 
	 if(token2.indexOf("IELTS")>-1)
		 testTypeCode="IELTS" ;
	 
	 else if(token2.indexOf("CELPIP")>-1)
		 testTypeCode="CELPIP" ;
	 else if(token2.indexOf("TEF")>-1)
		 testTypeCode="TEF" ;
	 else if(token2.indexOf("TCF")>-1)
		 testTypeCode="TCF" ;
	 
	 if(token3=='speaking')
		 subTypeCode="S" ;
	 
	 else if(token3=='listening')
		 subTypeCode="L" ;
	 
	 else if(token3=='reading')
		 subTypeCode="R" ;
	 
	 else if(token3=='writting')
		 subTypeCode="W" ;
	 
	 if( (testTypeCode=='IELTS' ||testTypeCode=='TEF' ||testTypeCode=='TCF') && !isScoreNumeric ){
	 
		 $(this).val("");
		 return;
		 
	 }
	  
	 if(testTypeCode=='CELPIP' &&(isScoreNumeric==false && score!='M') ){
		 
		 $(this).val("");
		 return;
		 
	 }	 
		 
	 if (testTypeCode=='CELPIP' && score=='M'){
   		 
	       	
	       	clbScore= $("#LanguageLevelText").val()+' 2' ;
	       	 $(this).next().next().val(clbScore);
	       	return ;
	   	 }
	 
	 
	 $.ajax({
		    url : url,
		   // data: {"lowerValue" : lowerValue,"upperValue":upperValue ,"testTypeCode":testTypeCode,"subTypeCode":subTypeCode},
		    data: {"score":score ,"testTypeCode":testTypeCode,"subTypeCode":subTypeCode},
	        
		    type: "POST",
		    async: false,
		    success: function(response)
		    {
		        
		    	isCLBNumeric = $.isNumeric(response);
		    	clbScore= response ;
		    	if(response!=null && response!='' && isCLBNumeric)
		    		clbScoreLevel= $("#LanguageLevelText").val()+' '+response ;
		    	else {
		    		clbScoreLevel=$("#testScoreValidation").val();
		    		
		    		
		    	}
		    		 
		 
		        
		    },
		    error: function ()
		    {
		 
		    	//alert("failed");
		    }
		});
	
	 $(this).next().next().val(clbScoreLevel);
	 $(this).next().next().next().val("CLB " + clbScore);
	 //if(!isCLBNumeric)
		// $(this).val("");
	  
}


function updateLangProficiency(){
	
	var id = $(this).attr("id");
	var checked = $(this).is(':checked');

	if(checked) $(this).attr('value','1');

    if(id=='tefIndicator'){
    	if(checked)
    		$("#tef").show();
    	else
    		$("#tef").hide();
    	
    }
    
    if(id=='tcfIndicator'){
    	if(checked)
    		$("#tcf").show();
    	else
    		$("#tcf").hide();
    	
    }
   
    if(id=='ieltsIndicator'){
    	if(checked)
    		$("#ielts").show();
    	else
    		$("#ielts").hide();
    	
    }	
    
    if(id=='celpipIndicator'){
    	if(checked) {
    		$("#celpip").show();
    		 //$("#ieltsIndicator").removeAttr("required");
    		
    	}
    	else {
    		$("#celpip").hide();
    		//$("element").attr("required", "required");
    		
    	}
    	
    }  
}


function checkCitizenOrPR(){
	
	var value = $(this).val();
	
	var div =$(this).parent().parent().next().next(); 
	if(value=='1')
		$(this).parent().parent().next().next().hide();
	else
		$(this).parent().parent().next().show();
	 

	 
}


function hideOrShowSpousalInfoBasedOnRelationtype(){
	 var metaKey = $("#metakey").val();
	 var selection = $(this).val();
	 var thisID = $(this).attr("id");
	 var div1 =$("#1") ;
	 var isCitizen = $(this).parent().parent().next().next().children().first().children().first().is(':checked');
	 var accompaningIndicator = $(this).parent().parent().parent().parent().find(".acoompanying:checked").val();

	var idString =thisID.substring(0,thisID.indexOf('.'));
	var spouseID = '';
	var familyMembers = $("#familyInfoBox ").children().length;
	
	$("#familyInfoBox").find(".relation").each(function(){
		var thisID_ = $(this).attr("id");
		var selection_ = $(this).val();
		var idString_ = $(this).attr("id").substring(0,thisID.indexOf('.'));
		
		if ( selection_ =='Spouse common-law partner' ){
			spouseID = thisID_;
		}
	});
	
	var familyMemberHasSpouse = false;
	if (spouseID){
		familyMemberHasSpouse = true;
	} 
	
	var currentFamilyMemberIsSpouse = false;
	if ( thisID == spouseID ){
		currentFamilyMemberIsSpouse = true;
	} 
	
	if ( familyMemberHasSpouse && !currentFamilyMemberIsSpouse ){
		return;
	} 

//	 var spouseworkdiv =$("#mainPersonalAndWorkHistoryBox") ;
//	 var spouseworkdivTitle =$("#fg_APP_SPOUSE_WORK_EXP_B") ;
//	 
//	 var spouseworkdiv =$("#fg_APP_SPOUSAL_WORK_HISTORY") ;
//	 var spouseworkdivTitle =$("#fg_APP_SPOUSAL_WORK_HISTORY") ;
//	 
//	 var spouseworkdiv =$("#fg_APP_SPOUSE_EDU_B") ;
//	 var spouseworkdivTitle =$("#fg_APP_SPOUSE_EDU_B") ;
	 
	 if(metaKey=='APP_FAMILY_INFO_FRENCH_STREAM' && selection!='Spouse common-law partner'){
		 log('here1');
		 div1.hide();
		
		 $('#fg_APP_SPOUSE_WORK_EXP_B input:radio:nth(1)').attr('checked',true);
		 $('#fg_APP_SPOUSE_EDU_B input:radio:nth(1)').attr('checked',true);
		 $('#fg_APP_SPOUSE_LANG_TEST_B input:radio:nth(1)').attr('checked',true);
		 
	 }
	 else if(metaKey=='APP_FAMILY_INFO_FRENCH_STREAM' && selection=='Spouse common-law partner' ) {
		 
		 /*if(isCitizen==null ||accompaningIndicator==null || isCitizen ||accompaningIndicator=='0')
			 div1.hide();
		 
		 else if (!isCitizen && accompaningIndicator=='1')
			 div1.show();*/
		 
		  
		 if (!isCitizen && accompaningIndicator=='1')
			 div1.show();
		 
	 }
}


function hideOrShowSpousalInfoBasedOnAccompaningIndicator(){
	
	var metaKey = $("#metakey").val();
	 var accompaningIndicator = $(this).val();
	 var relation =  $(this).parent().parent().parent().parent().find(".relation").val();
	 var prOrCitizen =  $(this).parent().parent().parent().parent().find(".citizen:checked").val();
	 
	 var div1 =$("#1") ;
	 var thisID = $(this).attr("id").substring(0, $(this).attr("id").indexOf('.'));
	 var spouseID = '';
	 var familyMembers = $("#familyInfoBox ").children().length;

	 $("#familyInfoBox").find(".relation").each(function(){
	 	var thisID_ = $(this).attr("id");
	 	var selection_ = $(this).val();
	 	var idString_ = $(this).attr("id").substring(0, thisID_.indexOf('.'));
	 	
	 	if ( selection_ =='Spouse common-law partner' ){
	 		spouseID = idString_;
	 	}
	 });

	 var familyMemberHasSpouse = false;
	 if (spouseID){
	 	familyMemberHasSpouse = true;
	 } 

	 var currentFamilyMemberIsSpouse = false;
	 if ( thisID == spouseID ){
	 	currentFamilyMemberIsSpouse = true;
	 } 

	 if ( familyMemberHasSpouse && !currentFamilyMemberIsSpouse ){
	 	return;
	 } 
	 
	 if(metaKey=='APP_FAMILY_INFO_FRENCH_STREAM'  && relation=='Spouse common-law partner' && accompaningIndicator=='0'){
		 div1.hide();
	 }
     else if(metaKey=='APP_FAMILY_INFO_FRENCH_STREAM' && relation=='Spouse common-law partner' && prOrCitizen=='0' && accompaningIndicator=='1'){
		 div1.show();
	 }
}



function hideOrShowSpousalInfoOnCitizenStatus(){
	 var metaKey = $("#metakey").val();
	 var isCitizen = $(this).val();
	 var relation =  $(this).parent().parent().parent().children().find(".relation").val();
	 var div1 =$("#1") ;
	 var accompaningIndicator = $(this).parent().parent().parent().parent().find(".acoompanying:checked").val();
	 
	var thisID = $(this).attr("id").substring(0, $(this).attr("id").indexOf('.'));
	var spouseID = '';
	var familyMembers = $("#familyInfoBox ").children().length;
	
	$("#familyInfoBox").find(".relation").each(function(){
		var thisID_ = $(this).attr("id");
		var selection_ = $(this).val();
		var idString_ = $(this).attr("id").substring(0, thisID_.indexOf('.'));
		
		if ( selection_ =='Spouse common-law partner' ){
			spouseID = idString_;
		}
	});
	
	var familyMemberHasSpouse = false;
	if (spouseID){
		familyMemberHasSpouse = true;
	} 
	
	var currentFamilyMemberIsSpouse = false;
	if ( thisID == spouseID ){
		currentFamilyMemberIsSpouse = true;
	} 
	
	if ( familyMemberHasSpouse && !currentFamilyMemberIsSpouse ){
		return;
	} 

	 if(metaKey=='APP_FAMILY_INFO_FRENCH_STREAM' && relation!='Spouse common-law partner'){
		 div1.hide();
	 }
	 else if(metaKey=='APP_FAMILY_INFO_FRENCH_STREAM' && relation=='Spouse common-law partner' && isCitizen=='1'){
		 div1.hide();
	 }
    else if(metaKey=='APP_FAMILY_INFO_FRENCH_STREAM' && relation=='Spouse common-law partner' && isCitizen=='0' && accompaningIndicator=='1' ){
		 div1.show();
	 }
    
}

function hideOrShowSpousalInfoBasedOnRelationtypeAndPRStatus(){
	
	var metaKey = $("#metakey").val();
	var donotHide; 
	var div1 =$("#1") ;
	div1.hide();
	
	$("#familyInfoBox").find(".relation").each(function(){
		var thisID_ = $(this).attr("id");
		var relation = $(this).val();
		
		if ( relation =='Spouse common-law partner' ){
			var isCitizen = $(this).parent().parent().next().next().children().first().children().first().is(':checked');
			var accompaningIndicator = $(this).parent().parent().parent().parent().find(".acoompanying:checked").val();
			if (isCitizen || isCitizen==null) {
				 div1.hide();
			} else if (accompaningIndicator=='0') {
				 div1.hide();
			} else {
				 div1.show();
			}
		}
	});
	
}


function validateSignedDate(){
	
	 if(!validate1900Up($(this))) return;
	 
	 var signedDate=$(this).val();
	 var errordiv=$(this).parent().next();
		 
	    if(signedDate==null||signedDate=='')
	    	return;
	    
	    var sDate=parseDate(signedDate);
	    var todayDate=new Date();
	    
	    
	    if(todayDate < sDate){
	     
	    	$(errordiv).css("color","#a94442"); 
	    	$(errordiv).html($("#signedDateValidation").val());
	 	    $(this).val("");
	    	
	    }
	    else
	    	$(errordiv).html("");
	    
}

function validateAge(){
	 
	 var dob=$(this).val();
	 var errordiv=$(this).parent().next();
		 
	    if(dob==null||dob=='')
	    	return;
	    
	    var bDate=parseDate(dob);
	    var today=new Date();
	    var age = today.getFullYear() - bDate.getFullYear();
	    var m = today.getMonth() - bDate.getMonth();
	    if (m < 0 || (m === 0 && today.getDate() < bDate.getDate())) {
	        age--;
	    }
	     
	    if(age < 18){
	    
	    	$(errordiv).css("color","#a94442"); 
	    	$(errordiv).html($("#dobValidation").val());
	 	    $(this).val("");
	    	
	    }
	    else
	    	$(errordiv).html("");
	    
}

function attachLogoutToLinks(){
	   $("a").each(function(){
			  //console.log($(this).attr('href'));
			  if(   $(this).attr('target') ||
					  ( !$(this).parent("#footer").length && 
					     $(this).parent("#div_content").length) ){
				  
			  }else{
				  var href=$(this).attr('href');
				  if(href && href.substr(0,4) == 'http'){
				     navigateOut(this,href);
				  }
			  }
		   });
}

function navigateOut(ctr,href){
	 
		  $(ctr).on('click',function(){
			  $.get(oinpContextRoot+'doNavigateOut').always(function() {
				    location.href = href;
			  });
			  return false;
		  });
	   
}

 
function onLandingOinp(){
	
}

function demo(id){
/*	if(id == 'rep')
	  location.href = '/register_enu/dynamicform/demo/rep/submitresult';
	else
		location.href = '/register_enu/dynamicform/demo/eoi/submitresult';	
	
	return true;*/
	return false;
}

function validate1900Up ($el){
	if($el.val().length != 10) return true;
	
  	var mindate = new Date(1900,0,1);
 	var date = $el.val().split("/");

	var date = new Date(date[2], date[1] - 1, date[0]).getTime();

	 if(date < mindate) {
 		 $el.val('')
 		 return false;
 	 }
 	 
	 return true;

 }


function validateBentPartnerEmail($el) {
	 var url = oinpContextRoot + '/rest/pnp/main/validatePartner';
	 var eoiFileNum = $('#caseNum00').val();
	 var emailText = $el.val();
	 
     var valid = false;
     var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
     var emailformat = regex.test(emailText);
     
     if (!eoiFileNum || !emailformat){
    	 return true;
     }
     
	 $.ajax({
		    url : url,

		    data: JSON.stringify({"email": emailText ,"eoiFileNum":eoiFileNum }),
		    type: "POST",
		    contentType: "application/json; charset=utf-8",
		    dataType: "json",
		    async: false,
		    success: function(response)
		    {
		    	valid = response.data;
		    },
		    error: function ()
		    {
		 
		    }
		});
	 
	 return valid;
	
}

function enableSortablebyKeyBySelector (){//suppress js error. not useful
	
}