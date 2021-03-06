/**
* Common functions to all FL modules 
	http://naveensnayak.wordpress.com/2013/06/26/dynamically-loading-css-and-js-files-using-jquery/
	http://stackoverflow.com/questions/950087/how-to-include-a-javascript-file-in-another-javascript-file
*/
var FL = FL || {};
FL["common"] = (function(){//name space FL.common
	var loadCSS = function(fileCss) {
		var cssLink = $("<link rel='stylesheet' type='text/css' href='FL_ui/css/"+fileCss+"'>");
		//    <link href="../bootstrap/css/cerulean.css" rel="stylesheet">
		$("head").append(cssLink);
		// $('#_css').editable("activate");
	};
	var fillMasterForTemplate = function(templateName,masterJson) {
		// returns masterJson with new values retrieved from the template for ids corresponding to the keys in masterJson
		//ex: if templateName="_A" and masterJson={entityName:"client",entityDescription:"someone we may invoice"}
		//      and if id="_A_entityName" has "xclient" and  id="_A_entityDescription" has "xsomeone we may invoice" 
		//		returns {entityName:"xclient",entityDescription:"xsomeone we may invoice"}
		//  
		// the same as:
		//		var singular = $("#_dictEditEntityTemplate_entityName").val();
		//		var description = $("#_dictEditEntityTemplate_entityDescription").val();
		_.each(masterJson, function(value,key){
			var domTarget = "#" + templateName + "_" + key;
			var newValue = $(domTarget).val();
			masterJson[key] = newValue;
		});
	};
	var fillDetailForTemplate = function(templateName,detailJson) {
		// returns the array detailJson with new values retrieved from the lines in the detailled section of template
		// equivalent to (example for line 1...similar for all other lines)
		//		var field1attr =  $("#_dictEditEntityTemplate__f1_attribute").val();
		//		var field1descr = $("#_dictEditEntityTemplate__f1_description").val();
		//		var field1stat = $("#_dictEditEntityTemplate__f1_statement").text();
		_.each(detailJson, function(element,index){
			_.each(element, function(value,key){
				var domTarget = "#" + templateName + "__f" + (index + 1) + "_" + key;
				var newValue = $(domTarget).val();
				element[key] = newValue;
			});
			detailJson[index] = element;
		});
	};
	return{
        editMasterDetail: function(id,title,templateName,masterDetailJson,options,editMasterDetailCB) {
			// returns masterDetailJson with new values collected from modal dialog  with title and templateName - options like makeModa()
			//  EXEMPLE OF FORMAT FOR masterDetailJson:
			//	var masterDetailItems = {
			//		master:{entityName:"client",entityDescription:"someone we may invoice"},
			//		detailHeader:["#","ZAttribute","what is it","Statement to validate"],
			//		detail:[
			//			{attribute:"name", description:"official designation",statement:"the name of the client is the official designation"},
			//			{attribute:"address", description:"place to send invoices",statement:"The address of the client is the place to send invoices"},
			//			{attribute:"city", description:"headquarters place", statement:"The city of the client is the headquarters place"},
			//			{attribute:"postal code", description:"postal reference for delivery",statement:"The postal code of the client is the postal reference for delivery"}
			//		]
			//	};
            // options - {type:"primary", icon:"send",button1:"Cancel",button2:"Send Newsletter",dropdown:{"#_sendNewsletter_templates":{arr:["op1","op2"],onSelect:function(){console.log("choise was "+selected);}}}
			//   notice the optional dropdown key in options. This is a way to send dropdown options yp edit masterdetail
            //     for each dropdown editmaster detail must receive: the set of values to present, the function to run on selection
            //     Example:
            //          dropdown:{
            //              "#dropdownId1":{ arr:['a','b','c','d','e'],
            //                                  default:"c",
            //                                  onSelect:function(selected){
            //                                        console.log("The choice was "+selected);    
            //                                  }
            //                             },                                   
            //              "#dropdownId2":{ arr:['a1','a2','a3','a4','a5'],
            //                                  default:"a3",
            //                                  onSelect:function(selected){
            //                                        console.log("For id2 the choice was "+selected);    
            //                                  }                                   
            //                            }
            //               }
            //          }
            var masterDetailItems = masterDetailJson ;
			this.makeModal(id,title,templateName,options,function(result){
				if(result){
					fillMasterForTemplate(templateName,masterDetailJson.master);
					fillDetailForTemplate(templateName,masterDetailJson.detail);
					return editMasterDetailCB(true);
				}else{
					return editMasterDetailCB(false);
				}
			},masterDetailJson);
        },
        makeModalInfo: function(message,makeModalInfoCB) {
            this.makeModal2("Information","<p>"+message+"</p>",{type:"primary",button1:"Ok",button2:null},makeModalInfoCB);//OK
        },
        makeModalConfirm: function(message,btn1,btn2,makeModalConfirmCB) {//button 2 is the default
            this.makeModal2("Confirmation","<p>"+message+"</p>",{type:"primary",button1:btn1,button2:btn2},makeModalConfirmCB);//OK
        },
		makeModal2: function(title,message,options,makeModalCB) {
			// version specific for makeModalInfo and makeModal confirm - does not use parsley
			// CONDITIONS NECESSARY FOR makeModal() to work:
            //      1 - THE BODY MUST HAVE A DEDICATED SLOT: <div id="_modalDialog"+{id}></div>
            //	title - Model window title
            //	message - Dialog content
            //	options  - JSON with icon and type
            //      icon - termination of http://getbootstrap.com/components/ -
            //          ex: glyphicon glyphicon-thumbs-up   =>"thumbs-up" 
            //              glyphicon glyphicon-search      =>"search" 
            //              glyphicon glyphicon-ok          =>"ok"   etc...
            //      type - success, primary, info, warning and danger
            //      button1 - name of first button
            //      button2 - name of second button (null =>only one button is available)
            //  callback - to return result example:
            //          makeModal(" Juakim","dictTemplate",{type:"primary", icon:"search",button1:"Close",button2:"Save Changes"},function(result){
            //              if(result){
            //                  alert("Yup");
            //              }else{
            //                  alert("Nope");
            //              }
            //          });
            //          NOTE: Callback argument result = true if button 2 is pressed, result = false if button 1 is pressed
            // http://www.sitepoint.com/understanding-bootstrap-modals/
			var $modalDialog = $("#_modalDialog");
			options = _.extend( {icon:null,type:"success",button1:"Cancel",button2:"Ok"},options);
            var modalId = "__FLmodalId";
            var iconHTML = "";
            if(options.icon){
                iconHTML = '<i class="glyphicon glyphicon-' + options.icon +'"></i>';
            }
            var button1HTML = "";
            if(options.button1){
                button1HTML = '<a href="#" id="__FLDialog_button1" data-dismiss="modal" class="btn">' + options.button1 + '</a>';
            }
            var button2HTML = "";
            if(options.button2){//this button has the parsley validate (like APPLE ->OK at right)
                button2HTML = '<a href="#" id="__FLDialog_button2" class="btn btn-' + options.type + ' validate">' + options.button2 + '</a>';
            }
            // var before = '<div class="modal fade" id="myModal">' +
            var before = '<div class="modal fade" id="' +modalId+ '">' +
                            '<div class="modal-dialog">' +
                                '<div class="modal-content">' +
                                    '<div class="modal-header modal-header-' + options.type + '">' +
                                        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
                                        // '<h3 style="color:white;" class="modal-title">' + title + '</h3>' +
                                        // '<h3 style="color:white;" class="modal-title"><i class="glyphicon glyphicon-thumbs-up"></i>' + title + '</h3>' +
                                        '<h3 style="color:white;" class="modal-title">' + iconHTML + title + '</h3>' +
                                    '</div>' +
                                    '<div class="modal-body">';
            var after =             '</div>' +
                                        '<div class="modal-footer">' +
                                            // '<a href="#button1" id="__FLDialog_button1" data-dismiss="modal" class="btn">Close</a>' +
                                            button1HTML +
                                             // '<a href="#button2" id="__FLDialog_button2" class="btn btn-primary">Save changes</a>' +
                                            button2HTML +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>';
            var fullHTML = before + message + after;
            $modalDialog.empty().append(fullHTML);
            var $modal = $('#' + modalId );
            if(makeModalCB){
                $modal.on("click","#__FLDialog_button1", function() {
                    // alert("makeModal - You clicked button1"); 
                    $modal.off('hidden.bs.modal');
                    $modal.modal('hide');
                    return makeModalCB(false);
                });
				$modal.on("click","#__FLDialog_button2", function() {
					$modal.off('hidden.bs.modal');
                    $modal.modal('hide');
					return makeModalCB(true);
                });
                $modal.on('hidden.bs.modal', function() {
                    // alert("makeModal - You closed the window !!!");
                    return makeModalCB(false);
                });
            }else{
                // $modal.off('hidden.bs.modal');              
				console.log("makeModal ----->No callback");
				$modal.modal('hide');
				$('body').removeClass('modal-open');
				$('.modal-backdrop').remove();
             }
            // $('#' + modalId ).modal('show');//to launch it immediatly when calling makeModal
            $modal.modal('show');//to launch it immediatly when calling makeModal	
		},
		makeModal: function(id,title,templateName,options,makeModalCB,dataStructureForSubstitution) {
			// CONDITIONS NECESSARY FOR makeModal() to work:
            //      1 - THE BODY MUST HAVE A DEDICATED SLOT: <div id="_modalDialog"+{id}></div>
            // title - Model window title
            // templateName - normally is a html template defined with  <script id="templateName" type="text/template"> 
            //     it can be a direct html string if first char is "<".
            // options  - JSON with icon and type
            //      icon - termination of http://getbootstrap.com/components/ -
            //          ex: glyphicon glyphicon-thumbs-up   =>"thumbs-up" 
            //              glyphicon glyphicon-search      =>"search" 
            //              glyphicon glyphicon-ok          =>"ok"   etc...
            //      type - success, primary, info, warning and danger
            //      button1 - name of first button
            //      button2 - name of second button (null =>only one button is available)
            //      dropdown - optional to be used when template has dropdowns
            //          dropdown:{ "#_sendNewsletter_templates":{ arr:["op1","op2"],default:"op2",onSelect:function(){console.log("choise was "+selected);} } }
            //
            //  callback - to return result example:
            //          makeModal(" Juakim","dictTemplate",{type:"primary", icon:"search",button1:"Close",button2:"Save Changes"},function(result){
            //              if(result){
            //                  alert("Yup");
            //              }else{
            //                  alert("Nope");
            //              }
            //          });
            //          NOTE: Callback argument result = true if button 2 is pressed, result = false if button 1 is pressed
            // http://www.sitepoint.com/understanding-bootstrap-modals/
			var masterDetailItems = null;
			if(dataStructureForSubstitution)
				window.masterDetailItems = dataStructureForSubstitution;//HACK for _.template()
			var $modalDialog = $("#_modalDialog"+id);
			if($modalDialog.length === 0) {//if it does not exist in DOM -THIS IS NO WORKING...WHY ??? -IT MUST EXIST ALREADY
				// alert("the id="+ ("#_modalDialog"+id) + " does not exist in DOM !!");
				//<div id='_modalDialogB'></div> -->
				var htmlId = "<div id='#_modalDialog" + id + "'></div>";
				console.log(htmlId);
				$(htmlId).prependTo('body');
				$modalDialog = $("#_modalDialog"+id);
				var z= 32;
			}
			options = _.extend( {icon:null,type:"success",button1:"Cancel",button2:"Ok"},options);


            var modalId = "__FLmodalId_"+id;
            var htmlIn = null;
            // alert("Inside:"+templateName.substring(0,0));
            var form = null;

            if( templateName.substring(0,1) == "<"){
                htmlIn = templateName;
            }else{
				var t1 = $("#" + templateName ).html();
				var f1 =  _.template(t1);
				var htmlT1 = f1();
                var templateFunc = _.template($("#" + templateName ).html());
                htmlIn = templateFunc({name:"Joao",age:58,occupation:"tangas"});
				form = $("#form_" + templateName );
				// form.parsley();
				// form.parsley().validate();
            }

            var iconHTML = "";
            if(options.icon){
                iconHTML = '<i class="glyphicon glyphicon-' + options.icon +'"></i>';
            }
            var button1HTML = "";
            if(options.button1){
                button1HTML = '<a href="#" id="__FLDialog_button1" data-dismiss="modal" class="btn">' + options.button1 + '</a>';
            }
            var button2HTML = "";
            if(options.button2){//this button has the parsley validate (like APPLE ->OK at right)
                button2HTML = '<a href="#" id="__FLDialog_button2" class="btn btn-' + options.type + ' validate">' + options.button2 + '</a>';
            }
            // var before = '<div class="modal fade" id="myModal">' +
            var before = '<div class="modal fade" id="' +modalId+ '">' +
                            '<div class="modal-dialog">' +
                                '<div class="modal-content">' +
                                    '<div class="modal-header modal-header-' + options.type + '">' +
                                        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
                                        // '<h3 style="color:white;" class="modal-title">' + title + '</h3>' +
                                        // '<h3 style="color:white;" class="modal-title"><i class="glyphicon glyphicon-thumbs-up"></i>' + title + '</h3>' +
                                        '<h3 style="color:white;" class="modal-title">' + iconHTML + title + '</h3>' +
                                    '</div>' +
                                    '<div class="modal-body">';
            var after =             '</div>' +
                                        '<div class="modal-footer">' +
                                            // '<a href="#button1" id="__FLDialog_button1" data-dismiss="modal" class="btn">Close</a>' +
                                            button1HTML +
                                             // '<a href="#button2" id="__FLDialog_button2" class="btn btn-primary">Save changes</a>' +
                                            button2HTML +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>';
            var fullHTML = before + htmlIn + after;
			// console.log("makeModal="+fullHTML);
            // var $modalDialog = $("#_modalDialog"+id);
            // $modalDialog.empty();// "#_modalDialog" is the DOM reserved slot for dialog boxes
            // $modalDialog.html(fullHTML);           
            $modalDialog.empty().append(fullHTML);
            if(options.dropdown){//dropdown is an object with one key per drop down - the key is #id of dropdown on template
                 _.each(options.dropdown, function(value,key){
                    if(value.default && value.arr && value.onSelect ){                      
                        // var arrOfObjs =_.map(value.arr,function(element,index){ //converted to format {value:0,text:arr[0]},{value:1,text:arr[1]}...etc
                        //     return {value:index,text:element};
                        // });
                        FL.login.selectBox({boxId: key,boxCurrent: value.default,boxArr: value.arr},value.onSelect);
                    }else{
                        alert("FLcommon2.js makeModal - Error dropdown definition missing - check default or arr or onselect");
                    }
                });                
            }            
            var $modal = $('#' + modalId );

			form = $("#form_" + templateName );
			form.parsley();
			form.parsley().validate();

            if(makeModalCB){
                $("#__FLDialog_button1").off('click');
                $modal.on("click","#__FLDialog_button1", function() {
                    // alert("makeModal - You clicked button1"); 
                    console.log("Button 1 was clicked");
                    $modal.off('hidden.bs.modal');
                    $modal.modal('hide');
                    window.masterDetailItems = null;
                    return makeModalCB(false);
                });
                $("#__FLDialog_button2").off('click');
                $modal.on("click","#__FLDialog_button2", function() {
/*				
					$modal.off('hidden.bs.modal');
                    $modal.modal('hide');
                    window.masterDetailItems = null;
                    return makeModalCB(true);
*/
					console.log("Button 2 was clicked");
					// var form = $("#form_" + templateName );
					// form.parsley();
					// form.parsley().validate();
					if(form.parsley().isValid()){//http://stackoverflow.com/questions/19821934/parsley-js-validation-not-triggering
						console.log('no client side errors!');
						$modal.off('hidden.bs.modal');
						$modal.modal('hide');
						window.masterDetailItems = null;
						return makeModalCB(true);						
					}else{
						console.log('Client side errors!!!!');
						$('.invalid-form-error-message')
							.html("You must correctly fill the fields...")
							.addClass("filled");
						event.preventDefault();
					}
                });
                $modal.on('hidden.bs.modal', function() {
                    // alert("makeModal - You closed the window !!!");
                    window.masterDetailItems = null;
                    return makeModalCB(false);
                });
            }else{
                // $modal.off('hidden.bs.modal');              
				console.log("makeModal ----->No callback");
				$modal.modal('hide');
				$('body').removeClass('modal-open');
				$('.modal-backdrop').remove();
             }
            // $('#' + modalId ).modal('show');//to launch it immediatly when calling makeModal
            $modal.modal('show');//to launch it immediatly when calling makeModal	
		},
		setStyleAndFont: function(styleName,fontName){//the css files FL<styleName>.css and FLfont_<fontName>.css must exist in FL_ui/css
			loadCSS("FL" + styleName + ".css");
			loadCSS("FLfont_" + fontName + ".css");
		},
		getTag: function(str,tagName,tagTerminator) {//returns the content of str after the last separator character or string - no separator found  =>null
			//get tag with name tagName embeded in string str - if several exist it takes the last one
			//ex. FL.common.getTag(fullUrl,"connectionString","#") -->returns  "abc" for fullUrl="#connectionString=abc#pag=home"
			var retTag = null;
			retTag = this.getLastTagInString(str,tagName+"=",tagTerminator);
            if(retTag){
                var firstChar = retTag.substring(0,1);
                if(firstChar == "{"){//tag is the string format of a JSON
                    retTag=retTag.replace(/%22/g,'"');
                    retTag=retTag.replace(/%20/g,' ');
                }
            }
			return retTag;
		},
		stringAfterLast: function(str,separator) {//returns the content of str after the last separator character or string - no separator found  =>null
			//ex. FL.common.stringAfterLast("http://www.framelink.co/app?d=myDomain1","=") -->returns  "myDomain1"
			var retStr = null;
            if(str){
    			var pos = str.lastIndexOf(separator);
    			var separatorLen = separator.length;
    			if(pos>=0)
    				retStr = str.substring(pos+separatorLen);               
            }
			return retStr;
		},
		stringBeforeLast: function(str,separator) {//simply returns the content of str before the last separator character or string - no separator found  =>null
			//ex. FL.common.stringBeforeLast("this is (one) or (two) values","(") -->returns  "this is (one) or "
			var retStr = null;
            if(str){
    			var pos = str.lastIndexOf(separator);
    			var separatorLen = separator.length;
    			if(pos>=0)
    				retStr = str.substring(0,pos);
            }    
			return retStr;
		},
		getLastTagInString: function(str,separator,tagTerminator) {//returns the content after the last separator until end or terminal char
			// str - string that will be processed
			// separator - last ocurrence to be identified in string
			// tagTerminator - character (or set of caracters) that define the end-of-tag
			//		if tagTerminator is a string any of the string chars will be considered a tag terminator ex "/#"
			//		if no tagTerminator is found the full string after the separator is returned
			//		ex. getTagInString("http://www.framelink.co/app?d=myDomain1#","=","#") -->returns  "myDomain1" (the "#" is excluded)
			var retStr = this.stringAfterLast(str,separator);
			var terminatorChar = null;
			var terminatorPos = null;
			if(retStr){	
				for(var i=0;i<tagTerminator.length;i++){
					terminatorChar = tagTerminator[i];
					// console.log("getLastTagInString -> char="+terminatorChar);
					terminatorPos = retStr.indexOf(terminatorChar);
					if(terminatorPos>=0){
						retStr = retStr.substring(0,terminatorPos);
						break;
					}
				}
			}
			return retStr;
		},
		repeat: function(str,n){//repeat str n times
			n = n || 1;
			if( n < 0 )
				n = 0;
			return Array(n+1).join(str);
		},
        validateEmail: function(email) {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        },
        clearSpaceBelowMenus: function() {
            $("#_placeHolder").empty();
            $("#personContent").empty();
            $("#csvcontent").empty();
            $("#grid").empty();
            $("#paginator").empty();
            $("#addGrid").empty();
            $("#addGrid").hide();
            $("#_newsletter").empty();
            $("#_newsletter").hide();
            $("#_editGrid").empty();
            $("#_editGrid").hide();
        },      
        buildDiff: function(arrOfObjA,arrOfObjB,pivotKey) {
            //given two arrays of objects A and B, both containing key pivotKey, returns an array with all the elements 
            //  existing in A whose pivotKey exists in A and not in B.
            //example
            //   A = [{_id:"abc1",name:"jojo",email:"jojo@j.com"},{_id:"abc2",name:"toto",email:"toto@t.com"},{_id:"abc3",name:"zozo",email:"zozo@z.com"}];
            //   B = [{_id:"abc1"]},{_id:"abc2"}];
            //   FL.common.buildDiff(A,B,"_id") ->[{_id:"abc3",name:"zozo",email:"zozo@z.com"}]
            var arrA = _.pluck(arrOfObjA, pivotKey) 
            var arrB = _.pluck(arrOfObjB, pivotKey) 
            var diffArr = _.difference(arrA, arrB); //returns the values of A not present in B
            var outArr = _.map(diffArr,function(element){
               //scn diffArr and return all arrObjA that match the same _id 
               index = _.find(arrOfObjA, function(elementOfA){return elementOfA[pivotKey] == element}); 
               return arrOfObjA[index-1];
            });
        },
        shortEmailName: function(email){
            var pos = email.indexOf("@");
            return email.substring(0,pos);
        },
        enc:  function(str,incr) {//FL.common.enc("o gato patolinas",1) =>fuzzy => FL.common.enc(fuzzy,-1))=>"o gato patolinas"
           //'H'.charCodeAt(0) =>72 , String.fromCharCode(72) =H
           // var encoded =  FL.common.enc('{Patolinas},:',1);
            // alert("Patolinas >"+encoded+"< - >"+FL.common.enc(encoded,-1)+"<");
            str = str.replace(/"/g,"'");
            var encoded = "";
            for (i=0; i<str.length;i++) {
                var a = str.charCodeAt(i);//returns a number
                // var b = a ^ 123;    // bitwise XOR with any number, e.g. 123

                encoded = encoded+String.fromCharCode(a+incr);//add a char to the string 
            }
            encoded = encoded.replace(/'/g,'"');
            return encoded;
        },
        loaderAnimationON: function(div) {
            var opts = {
                lines: 13, // The number of lines to draw
                length: 20, // The length of each line
                width: 10, // The line thickness
                radius: 30, // The radius of the inner circle
                corners: 1, // Corner roundness (0..1)
                rotate: 0, // The rotation offset
                direction: 1, // 1: clockwise, -1: counterclockwise
                color: '#000', // #rgb or #rrggbb or array of colors
                speed: 1, // Rounds per second
                trail: 60, // Afterglow percentage
                shadow: false, // Whether to render a shadow
                hwaccel: false, // Whether to use hardware acceleration
                className: 'spinner', // The CSS class to assign to the spinner
                zIndex: 2e9, // The z-index (defaults to 2000000000)
                top: '50%', // Top position relative to parent in px
                left: '50%' // Left position relative to parent in px
            };
            var target = document.getElementById(div);
            var spinner = new Spinner(opts).spin(target);
            return spinner;
        },
		testFunc: function(x) {
			alert("FL.common.test() -->"+x);
		}
	};
})();
FL["topics"] = {};
jQuery.Topic = function( id ) {//https://gist.github.com/addyosmani/1321768 publisher/subscriber
	//publishing ex.	$.Topic( 'signInDone' ).publish( 'hello Sign In !!!' );
	//subscribe example:
	// $.Topic( 'signInDone' ).subscribe( fn1 );//where-> var fn1 = function(par1){alert("par1 says:"+par1);};
	// $.Topic( 'signInDone' ).subscribe( fn2 );//where-> var fn2 = function(par1){alert("par2 ---->says:"+par1);};
	var callbacks,
		topic = id && FL.topics[ id ];
	if ( !topic ) {
		callbacks = jQuery.Callbacks();
		topic = {
			publish: callbacks.fire,
			subscribe: callbacks.add,
			unsubscribe: callbacks.remove
		};
		if ( id ) {
			FL.topics[ id ] = topic;
		}
	}
	return topic;
};
// BootstrapDialog.alert("FrameLink"); //http://nakupanda.github.io/bootstrap3-dialog/
// BootstrapDialog.confirm("FrameLink menus ?"); //http://nakupanda.github.io/bootstrap3-dialog/
//  BootstrapDialog.confirm = function(message, callback,options) {//http://nakupanda.github.io/bootstrap3-dialog/

// BootstrapDialog.confirm = function(message,callback,options) {//http://nakupanda.github.io/bootstrap3-dialog/	
// 	new BootstrapDialog({
// 		//element = _.extend(element,updatedElement);//passed by reference
// 		title: _.extend({title:"CONFIRMATION"},options).title,
// 		message: message,
// 		// form: '<label>Email </label><input type="text" id="titleDrop"><br><label>User Name</label><input type="text" id="descriptionDrop">',//form,
// 		// type: BootstrapDialog.TYPE_PRIMARY, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
// 		type: _.extend({type:'type-primary' },options).type, //'type-primary', 'type-info' .'type-success','type-warning','type-danger' 
// 		draggable:true,
// 		data: {
// 			'callback': callback
// 		},
// 		buttons: [{
// 				label: _.extend({button1:"Cancel"},options).button1,
// 				action: function(dialog) {
// 					typeof dialog.getData('callback') === 'function' && dialog.getData('callback')(false);
// 					dialog.close();
// 				}
// 			}, {
// 				label:  _.extend({button2:"Ok"},options).button2,
// 				cssClass: _.extend({cssButton2:"btn-primary"},options).cssButton2,
// 				action: function(dialog) {
// 					typeof dialog.getData('callback') === 'function' && dialog.getData('callback')(true);
// 					dialog.close();
// 				}
// 			}
// 		]
// 	}).open();
// };

FL["clone"] = function(obj) {//http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-clone-an-object/5344074#5344074
	var ss = JSON.stringify(obj);
	return JSON.parse(ss);
	// return JSON.parse(JSON.stringify(obj));
};
FL["domInject"] = function(id,htmlContent) {//clean and replace content by htmlContent
	var target="#" + id;
	var $id = $(target);
	$id.empty();//removes the child elements of the selected element(s).
	if(htmlContent)
		$id.append( $( htmlContent ) );//with $(htmlContent) we convert htmlStr to a JQuery object
};
// FL["validateEmail"] = function(email) {
// 	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// 	return re.test(email);
// };
FL["domain"]  = null;
FL["mixPanelEnable"]  = false;
FL["mix"] = function(mixEvent,propObj) {//if FL.mixPanelEnable = true, trigger  events  to mix panel
	//examples:
	//		FL.mix("Entering",{});
	//		FL.mix("ChangeStyle",{"newStyle":FL.currentStyle});
	//		FL.mix("TourIcon",{step:FL.setNextPrevOfCurrentStep()});
	if(FL.mixPanelEnable){
		// mixpanel.track("TourIcon", {//-----------------------------------------------mixpanel
		// 	"step":FL.setNextPrevOfCurrentStep()
		// });
		alert("calls mixpanel.track for event="+mixEvent+" ->props="+JSON.stringify(propObj));
		//mixpanel.track(mixEvent,propObj);
	}
};
FL["clearSpaceBelowMenus"] = function() {
	$("#_placeHolder").empty();
	$("#personContent").empty();
	$("#csvcontent").empty();
	$("#grid").empty();
	$("#paginator").empty();
    $("#addGrid").empty();
    $("#addGrid").hide();
    $("#_newsletter").empty();
    $("#_newsletter").hide();
    $("#_editGrid").empty();
    $("#_editGrid").hide();
};