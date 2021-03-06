$(function () {
  module("menu-login");

  test("basic test", function () { //one test can have several assertions
    var actual = '1';
    var expected = 1;
    ok( actual == expected,"Validated !!!" ); //bolean expression
    equal(actual,expected,"...are equal");//non strict assertion
    strictEqual(1,1,"they are strictly equal");//non strict assertion
    // deepEqual(item1,item2,"all the elements in the array are equal"); /recursively vompares array elements and objects 
  });
  // test("login test", function () { //one test can have several assertions
  //   var lastLoginStr = localStorage.login;// Retrieve format {email:x1,userName:x2,password:x3};
  //   var actual = null;
  //   var expected = null;
  //   if(lastLoginStr) { //login exists
  //     var lastLoginObj = JSON.parse(lastLoginStr);
  //     expected = lastLoginObj.email;
  //   }else{// not signed In
  //     expected = " Sign In";
  //   }
  //   var actual = '1';
  //   var expected = 1;
  //   equal(actual,expected,"...are equal");//non strict assertion
  // });  
  test("FL.menu primitives", function () { //one test can have several assertions
     var oMenu = {
      "menu" : [
          {
              "title" : "MenuA/T1",//0
              "uri":"http://www.microsoft.com"
          },
          {
              "title" : "MenuB/T1",//1
              "uri" : "#",
              "menu" : [
                  {
                      "title" : "MenuB/T2-I",//2
                      "uri":"#1"
                  },
                  {
                      "title" : "MenuB/T2-II",//3 Joachim
                      "uri":"#"
                  }
              ]
          },
          {
              "title" : "MenuC/T1",//4
              "uri":"#"
          }
      ]
    };
    var myMenu1 = new FL.menu({jsonMenu:oMenu,initialMenu:"_home",editable:false});
    ok( myMenu1.settings.jsonMenu.menu[1].title == "MenuB/T1","Getting menu title 'MenuB/T1' (at root)" );
    ok( myMenu1.settings.jsonMenu.menu[1].menu[1].title == "MenuB/T2-II","Getting menu title 'MenuB/T2-II' at second level" );
    myMenu1.settings.jsonMenu.menu[1].menu[1].title = "Joachim";
    ok( myMenu1.settings.jsonMenu.menu[1].menu[1].title == "Joachim","Setting menu 'MenuB/T2-II' to 'Joachim'");
    myMenu1.test_Add_Id_Top();
    ok( myMenu1.settings.jsonMenu.menu[1].menu[1].id == 3,"testAdd_Id_Top placed id=3 in menu 'Joachim'");
    ok( myMenu1.settings.jsonMenu.menu[2].id == 4,"testAdd_Id_Top placed id=4 in last menu");
    ok( myMenu1.settings.jsonMenu.menu[1].menu[1].top === false,"testAdd_Id_Top placed top = false in menu 'Joachim'");
    ok( myMenu1.settings.jsonMenu.menu[2].top === true,"testAdd_Id_Top placed top = true in last menu");

    // // var oEl = myMenu1.test_menuFindById(myMenu1.settings.jsonMenu.menu,4);
    var oEl = myMenu1.test_menuFindById(oMenu.menu,4);
    // var strOEl = JSON.stringify(oEl);
    // var strId4 = JSON.stringify(myMenu1.settings.jsonMenu.menu[2]);
    // alert("Compares " + strOEl + " ---> " + strId4);
    // ok( JSON.stringify(myMenu1.settings.jsonMenu.menu[2]) == strOEl,"menuFindById() got the last element");//OK
    // propEqual(myMenu1.settings.jsonMenu.menu[2],oEl,"menuFindById() got the last element");//OK
    deepEqual(myMenu1.settings.jsonMenu.menu[2],oEl,"menuFindById() got last menu element");
    oEl = myMenu1.test_menuFindById(oMenu.menu,3);
    deepEqual(myMenu1.settings.jsonMenu.menu[1].menu[1],oEl,"menuFindById() got menu element 'Joachim'");

    // oMenu.b = 34;
    // ok( myMenu1.settings.jsonMenu.menu[b == 34,"Updating original by reference " ); //bolean expression
    // myMenu1.settings.jsonMenu.b = 22;
    // ok( myMenu1.settings.jsonMenu.b == 22,"Setting jsonMenu.b " ); //bolean expression
    // oMenu={a:1,b:34};
    // var myMenu2 = new FL.menu({jsonMenu:{a:10,b:20},initialMenu:"_home",editable:false});
    // ok( myMenu2.settings.jsonMenu.b == 20,"Getting jsonMenu.b of a second instance " ); //bolean expression

  });
  test("FL.menu DOM editable=false", function () {
     var oMenu = {
      "menu" : [
          {
              "title" : "MenuA/T1",//0
              "uri":"http://www.microsoft.com"
          },
          {
              "title" : "MenuB/T1",//1
              "uri" : "#",
              "menu" : [
                  {
                      "title" : "MenuB/T2-I",//2
                      "uri":"_home"
                  },
                  {
                      "title" : "MenuB/T2-II",//3
                      "uri":"#"
                  }
              ]
          },
          {
              "title" : "MenuC/T1",//4
              "uri":"_mission"
          }
      ]
    };
    // ---- example for DOM testing --------------------------------------
    $('<input id="ResultTestBox" type="text"/>').appendTo('#qunit-fixture');//#qunit-fixture is the invisible DOM sandbox
    var add = function (a, b) { var result = a + b; $("input#ResultTestBox").val(result);};
    var result = add(2, 3);
    equal(5, $('input#ResultTestBox').val(), "DOM Dummy test -> testing result box value");
    // -----------------------------------------------------------------------
    // $('<ul id="begin_menu" class="nav navbar-nav"></ul>').appendTo('#qunit-fixture');//necessary for menuRefresh()
    $('<div id="menuContainer"><div id="toolbar"><ul id="main-menu"></ul><div></div>').appendTo('#qunit-fixture');//necessary for menuRefresh() and 
    $('<div id="_placeHolder"></div>').appendTo('#qunit-fixture');//necessary for menuRefresh()
    var myMenu1 = new FL.menu({jsonMenu:oMenu,initialMenu:"_home",editable:false});
    // ok( myMenu1.settings.jsonMenu.menu[1].title == "MenuB/T1","Getting menu title 'MenuB/T1' (at root)" );
    myMenu1.menuRefresh([//receives a menu array and displays it. If empty assumes settings.jsonMenu.menu
        {
          "title" : "MenuA/T1",//0
          "uri":"http://www.microsoft.com"
        },
        {
          "title" : "MenuB/T1",//1
          "uri" : "#",
          "menu" : [
            {
              "title" : "MenuB/T2-I",//2
              "uri":"_home"
            }
          ]
        },
        {
          "title" : "MenuC/T1",//3
          "uri":"#"
        }
      ]);
    // alert("--->"+$('#0').text());
    equal("MenuA/T1", $('#0').text(), "menuRefresh() with argument ->title 'MenuA/T1' was placed in DOM id=0");
    equal("MenuB/T2-I", $('#2').text(), "menuRefresh() title with argument ->'MenuA/T1' was placed in DOM id=2");
    myMenu1.menuRefresh();
    equal("MenuB/T2-II", $('#3').text(), "menuRefresh() no args ->title 'MenuB/T2-II' is on DOM id=3");
    equal("MenuC/T1", $('#4').text(), "menuRefresh() no args ->title 'MenuC/T1' is on DOM id=4");

    // -----------------------------------------------------------------------
    //test internal page loading 
    //  - ALL TESTS REFER TO THE oMenu STRUCTURE - (THE FIRST IN THIS CODE...)
    $('<div id="_placeHolder"></div>').appendTo('#qunit-fixture');//necessary to place FrameLink internal pages
    var $itemClicked = $( "#2" );
    // alert("for #2 $itemClicked.length=" + $itemClicked.length + " -->"+ $itemClicked.text());
    // $itemClicked.trigger( {type:"mousedown",which:3} );//the same as pressing the right mouse on #3 OK !!!
    $itemClicked.trigger( {type:"click"} );//the same as clicking the mouse on #2 OK !!!
    // the test need some type to wait for the page "_home.html" to load before checking for id="_home" 
    stop();//waits for a start() before continuing
    setTimeout(function(){
      // alert("1-->"+$("#_home").length);
      ok($("#_home").length !== 0, "the internal page '_home.html' was loaded");
      start();//stops test runner and waits for start to continue
      var $itemClicked = $( "#4" );
      // alert("for #4 $itemClicked.length="+$itemClicked.length+" -->"+$itemClicked.text());
      $itemClicked.trigger( {type:"click"} );//the same as clicking the mouse on #4 OK !!!
      // the test need some type to wait for the page "_mission.html" to load before checking for id="_mission" 
      stop();
      setTimeout(function(){ok($("#_mission").length !== 0, "the internal page '_mission.html' was loaded");start();},100);
    },100);
  });
  test("FL.menu DOM editable=true", function () {
     var oMenu = {
      "menu" : [
          {
              "title" : "MenuA/T1",//0
              "uri":"http://www.microsoft.com"
          },
          {
              "title" : "MenuB/T1",//1
              "uri" : "#",
              "menu" : [
                  {
                      "title" : "MenuB/T2-I",//2
                      "uri":"_home"
                  },
                  {
                      "title" : "MenuB/T2-II",//3
                      "uri":"#"
                  }
              ]
          },
          {
              "title" : "MenuC/T1",//4
              "uri":"_mission"
          }
      ]
    };
    // -----------------------------------------------------------------------
    // $('<ul id="begin_menu" class="nav navbar-nav"></ul>').appendTo('#qunit-fixture');//necessary for menuRefresh()
    $('<div id="menuContainer"><ul id="main-menu"></ul></div>').appendTo('#qunit-fixture');//necessary for menuRefresh() and 
    var myMenu1 = new FL.menu({jsonMenu:oMenu,initialMenu:"_home",editable:true});
    // alert("--->"+$('#0').text());
    var $itemClicked = $( "#toolbar" );
    // alert("for #2 $itemClicked.length=" + $itemClicked.length + " -->"+ $itemClicked.text());
    $itemClicked.trigger( {type:"mousedown",which:3} );//the same as pressing the right mouse on toolbar OK !!!
    // alert("is_menuHide="+myMenu1.is_menuHide+" is_contextOn="+myMenu1.is_contextOn);
    equal(true, myMenu1.is_menuHide, "right click in toolbar => myMenu1.is_menuHide=true ");
    equal(false, myMenu1.is_contextOn, "right click in toolbar => myMenu1.is_contextOn=false ");
    $itemClicked = $( "#2" );
    $itemClicked.trigger( {type:"mousedown",which:3} );//the same as pressing the right mouse on id=2 a 2nd level menu !!!
    // alert("is_menuHide="+myMenu1.is_menuHide+" is_contextOn="+myMenu1.is_contextOn);
  });
  test("FL.tour primitives", function () {
    // stepsChangeEvents: [ //these are the events that may change the 'natural' sequence
    //   {onEvent: "signInDone",onEventValue: false,suspend: false,tourMap:[1,1,0,0,0,0]},//if logout, tour only can be in brand or in login
    //   {onEvent: "signInDone",onEventValue: true,suspend: false,  tourMap:[1,0,1,1,1,1]},//if logout, tour can be everywhere e except login
    //   {onEvent: "sidePanelOpened",onEventValue: true,suspend: false,  tourMap:[1,0,1,0,1,1]},
    //   {onEvent: "sidePanelOpened",onEventValue: false,suspend: false,  tourMap:[1,1,1,1,0,0]},
    //   {onEvent: "inLogOnProcess",onEventValue: true,suspend: true},
    //   {onEvent: "inMenuEdition",onEventValue: false,suspend: true}
    // ],    
    var actual = FL.findTourMapFor("signInDone",true);
    var expected =[1,0,1,1,1,1,1,1,1,1,1,1];
    deepEqual( actual, expected,"FL.findTourMapFor found FL.tourSettings.stepsChangeEvents[1] !!!" );//1
    actual = FL.findTourMapFor("sidePanelOpened",false);
    expected =    [1,1,1,1,0,0,0,0,0,0,0,0];
    deepEqual( actual, expected,"FL.findTourMapFor found FL.tourSettings.stepsChangeEvents[3] !!!" );//2
    actual = FL.findTourMapFor("inMenuEdition",false);
    if(!actual)
      actual = "null";
    // alert(actual);
    expected = "null";
    deepEqual( actual, expected,"FL.findTourMapFor returned null in FL.tourSettings.stepsChangeEvents[5] !!!" );//3

    FL.eventRegister = [{eventName:"signInDone",status:true},{eventName:"sidePanelOpened",status:false},{eventName:"inLogOnProcess",status:null},{eventName:"inMenuEdition",status:null}];
    // FL.currentTourMap = [true,true,true,true,true,true,true,true,true,true,true,true];
    FL.mixinTourMap(FL.currentTourMap);
    expected = [true,false,true,true,false,false,false,false,false,false,false,false];
    deepEqual( FL.currentTourMap, expected,"FL.mixinTourMap for signin and sidePanelClosed OK" );//4

    FL.eventRegister = [{eventName:"signInDone",status:true},{eventName:"sidePanelOpened",status:true},{eventName:"inLogOnProcess",status:null},{eventName:"inMenuEdition",status:null}];
    // FL.currentTourMap = [true,true,true,true,true,true,true,true,true,true,true,true];
    FL.mixinTourMap(FL.currentTourMap);
    expected = [true,false,true,false,true,true,true,true,true,true,true,true];//the actual navigation area
    deepEqual( FL.currentTourMap, expected,"FL.mixinTourMap for signIn and sidePanelOpened OK" );//5

    FL.eventRegister = [{eventName:"signInDone",status:false},{eventName:"sidePanelOpened",status:false},{eventName:"inLogOnProcess",status:null},{eventName:"inMenuEdition",status:null}];
    // FL.currentTourMap = [true,true,true,true,true,true,true,true,true,true,true,true];
    FL.mixinTourMap(FL.currentTourMap);
    expected = [true,true,false,false,false,false,false,false,false,false,false,false];//the actual navigation area
    deepEqual( FL.currentTourMap, expected,"FL.mixinTourMap for signOut and sidePanelClosed OK" );//6

    FL.eventRegister = [{eventName:"signInDone",status:null},{eventName:"sidePanelOpened",status:null},{eventName:"inLogOnProcess",status:null},{eventName:"inMenuEdition",status:null}];
    FL.updatesEventRegister("signInDone",true);
    ok( FL.eventRegister[0].status === true,"FL.updatesEventRegister updated signInDone correctely !!!" );
    FL.updatesEventRegister("sidePanelOpened",true);
    ok( FL.eventRegister[1].status === true,"FL.updatesEventRegister updated sidePanelOpened correctely !!!" );
    FL.updatesEventRegister("signInDone",false);
    ok( FL.eventRegister[0].status === false,"FL.updatesEventRegister updated again signInDone correctely !!!" );

    FL.currentTourMap = [true,false,true,false,false,true];//the potential navigation area 
    actual = FL.nextOnTourMap(1);
    equal( actual,2,"FL.nextOnTourMap found position 2 correctely !!!" );//10

    actual = FL.nextOnTourMap(2);
    equal( actual,5,"FL.nextOnTourMap found position 5 correctely !!!" );//11

    actual = FL.nextOnTourMap(5);
    equal( actual,null,"FL.nextOnTourMap found position null correctely !!!" );//12

    actual = FL.nextOnTourMap(6);
    equal( actual,null,"FL.nextOnTourMap found position null correctely !!!" );//13

    actual = FL.nextOnTourMap(0);
    equal( actual,2,"FL.nextOnTourMap found position null correctely !!!" );//14

    actual = FL.prevOnTourMap(2);
    equal( actual,0,"FL.prevOnTourMap found position 1 correctely !!!" );//15

    actual = FL.prevOnTourMap(4);
    equal( actual, 2,"FL.prevOnTourMap found position 2 correctely !!!" );//16

    actual = FL.prevOnTourMap(0);
    equal( actual, null,"FL.prevOnTourMap found position null correctely !!!" );//17

    actual = FL.prevOnTourMap(6);
    equal( actual, 5,"FL.prevOnTourMap found position null correctely !!!" );//18

    actual = FL.prevOnTourMap(7);
    equal( actual, 5,"FL.prevOnTourMap found position null correctely !!!" );//19

    //------testing FL.setNextPrevOfCurrentStep()

    FL.currentTourMap = [true,false,true,true,false,false];//the potential navigation area 
    FL.setTourOn(true);//createsFL.tour object
    var currentStep = 2;
    FL.tour.setCurrentStep(currentStep);//in Tour forces 2 to be current
    // alert("current step is "+FL.tour.getCurrentStep());
    currentStep=FL.setNextPrevOfCurrentStep();//the tested method. adjust 2.next and 2.prev according to FL.currentTourMap
    actual = FL.tourSettings.steps[currentStep].next;
    equal( actual, 3,"FL.setNextPrevOfCurrentStep() updated next of step 2 to 3 correctely !!!" );//20
    actual = FL.tourSettings.steps[currentStep].prev;
    equal( actual, 0,"FL.setNextPrevOfCurrentStep() updated prev of step 2 to 0 correctely !!!" );//21
   
    currentStep = 3;
    FL.tour.setCurrentStep(currentStep);//in Tour forces 3 to be current
    // alert("current step is "+FL.tour.getCurrentStep());
    currentStep=FL.setNextPrevOfCurrentStep();//the tested method. adjust 3.next and 3.prev according to FL.currentTourMap
    actual = FL.tourSettings.steps[currentStep].next;
    equal( actual, 3,"FL.setNextPrevOfCurrentStep() updated next of step 3 to 3 correctely !!!" );//22
    actual = FL.tourSettings.steps[currentStep].prev;
    equal( actual, 2,"FL.setNextPrevOfCurrentStep() updated prev of step 3 to 2 correctely !!!" );//23

    // currentStep = 5;//a "false" position on FL.currentTourMap
    // FL.tour.setCurrentStep(currentStep);//in Tour forces 5 to be current
    // // alert("current step is "+FL.tour.getCurrentStep());
    // currentStep = FL.setNextPrevOfCurrentStep();//the tested method. adjust 5.next and 5.prev according to FL.currentTourMap
    // actual = FL.tourSettings.steps[currentStep].next;
    // equal( actual, 3,"FL.setNextPrevOfCurrentStep() updated next of step 5 to 3 correctely !!!" );//24 it is strange but correct when current position is false and no  next true is available
    // actual = FL.tourSettings.steps[currentStep].prev;
    // equal( actual, 2,"FL.setNextPrevOfCurrentStep() updated prev of step 5 to 3 correctely !!!" );//25

    currentStep = 0;
    FL.tour.setCurrentStep(currentStep);//in Tour forces 0 to be current
    // alert("current step is "+FL.tour.getCurrentStep());
    currentStep=FL.setNextPrevOfCurrentStep();//the tested method. adjust 0.next and 0.prev according to FL.currentTourMap
    actual = FL.tourSettings.steps[currentStep].next;
    equal( actual, 2,"FL.setNextPrevOfCurrentStep() updated next of step 0 to 2 correctely !!!" );//26
    actual = FL.tourSettings.steps[currentStep].prev;
    equal( actual, 0,"FL.setNextPrevOfCurrentStep() updated prev of step 0 to 0 correctely !!!" );//27

    // currentStep = 1;//a "false" position on FL.currentTourMap
    // FL.tour.setCurrentStep(currentStep);//in Tour forces 0 to be current
    // // alert("current step is "+FL.tour.getCurrentStep());
    // currentStep=FL.setNextPrevOfCurrentStep();//the tested method. adjust 0.next and 0.prev according to FL.currentTourMap
    // actual = FL.tourSettings.steps[currentStep].next;
    // equal( actual, 3,"FL.setNextPrevOfCurrentStep() updated next of step 1 to 3 correctely !!!" );//28
    
    // actual = FL.tourSettings.steps[currentStep].prev;
    // equal( actual, 0,"FL.setNextPrevOfCurrentStep() updated prev of step 1 to 0 correctely !!!" );//29   

    // ok( actual == expected,"found FL.tourSettings.stepsChangeEvents[1] !!!" ); //bolean expression
    // equal(actual,expected,"...are equal");//non strict assertion
    // strictEqual(1,1,"they are strictly equal");//non strict assertion
  });
  // ensure all the required form elements are in place
  // //http://blog.newrelic.com/2013/05/15/new-simple-javascript-testing-with-qunit/
  // test( "All required form elements exist", 7, function() {
  //     ok($("#originalAmount").length != 0, "original amount element exists");
  //     ok($("#repaymentFrequency").length != 0, "repayment frequency element exists");
  //     ok($("#loanTerm").length != 0, "loan term element exists");
  //     ok($("#interestRate").length != 0, "interest rate element exists");
  //     ok($("#submit").length != 0, "submit button element exists");
  //     ok($("#repaymentAmount").length != 0, "total repayment amount output element exists");
  //     ok($("#totalToRepay").length != 0, "total amount to repay output button element exists");
  // });
  test("client Dictionary tests", function () { //one test can have several assertions
    //client
    var success = FL.dd.createEntity("client","company we may invoice");
    ok(success === true , "createEntity operation successfull for first entity !" );
    actual = FL.dd.entities["client"];
    ok(actual.csingular == "01", "Compressed code for first entity = '01'");
    ok(actual.description == "company we may invoice", "description is correct");
    ok(actual.plural == "clients", "plural is clients");
    success = FL.dd.createEntity("client","another company we may invoice");
    ok(success === false , "createEntity refused because client exists already !" );

    //order
    success = FL.dd.createEntity("order","client's product request");
    ok(success === true , "createEntity operation successfull for 2nd entity !" );
    actual = FL.dd.entities["order"];
    ok(actual.csingular == "02", "Compressed code for 2nd entity = '02'");
    ok(actual.description == "client's product request", "description is correct for 2nd entity");
    ok(actual.plural == "orders", "plural is orders");

    success = FL.dd.updateEntityBySingular("client",{plural:"customers",description:"frequent buyer"});
    ok(success === true , "updateEntityBySingular operation successfull for client" );
    actual = FL.dd.entities["client"];
    ok(actual.csingular == "01", "Compressed code for first entity = '01'");
    ok(actual.description == "frequent buyer", "description was updated correctely");
    ok(actual.plural == "customers", "plural has changed to customers");

    success = FL.dd.updateEntityByCName("01",{plural:"clients",description:"very frequent buyer"});
    ok(success === true , "updateEntityByCName operation successfull for client" );
    actual = FL.dd.entities["client"];
    ok(actual.csingular == "01", "Compressed code for first entity = '01'");
    ok(actual.description == "very frequent buyer", "description was updated correctely");
    ok(actual.plural == "clients", "plural has changed back to clients");

    var entityCN = FL.dd.getCEntity("order");
    ok(entityCN == "02", "FL.dd.getCEntity ->Compressed code for 'order' is = '02'");
    entityCN = FL.dd.getCEntity("patolinas");
    ok(entityCN === null, "FL.dd.getCEntity ->Compressed code for patolinas is null - not existing");
    
    FL.dd.addAttribute("order","shipped","expedition status","Shipped","boolean",null);
    actual = FL.dd.getEntityBySingular("order");
    ok(actual.attributes.length == 2, "Order has 2 attributes");

    actual = FL.dd.countEntitiesBeginningBy("client");
    ok(actual == 1, "countEntitiesBeginningBy('client') is 1");

    success = FL.dd.createEntity("client1","another company we may invoice");
    actual = FL.dd.countEntitiesBeginningBy("client");
    ok(actual == 2, "countEntitiesBeginningBy('client') is 2");
    actual = FL.dd.countEntitiesBeginningBy("patolinas");
    ok(actual === 0, "countEntitiesBeginningBy('patolinas') is 0");
    actual = FL.dd.nextEntityBeginningBy("client");
    ok(actual === "client2", "nextEntityBeginningBy('client') is 'client2'");
    actual = FL.dd.nextEntityBeginningBy("patolinas");
    ok(actual === "patolinas", "nextEntityBeginningBy('patolinas') is 'patolinas'");//25
    
    actual = FL.dd.getEntityBySingular("order").sync;
    ok(actual === false, "order sync status is:'not synchronized'");//26
    FL.dd.setSync("order",true);
    actual = FL.dd.getEntityBySingular("order").sync;
    ok(actual === true, "FL.dd.setSync-->order sync status is now:'synchronized'");//27
    FL.dd.setSync("order",false);
    actual = FL.dd.getEntityBySingular("order").sync;
    ok(actual === false, "FL.dd.setSync-->order sync status is again:'not synchronized'");//28

    actual = FL.dd.getFieldCompressedName("order","id");
    ok(actual === "00", "FL.dd.getFieldCompressedName -->compressed name for id='00'");//29
    actual = FL.dd.getFieldCompressedName("order","shipped");
    ok(actual === "01", "FL.dd.getFieldCompressedName -->compressed name for shipped='01'");//30

    FL.dd.addAttribute("order","product","unique order item","product","string",null);
    actual = FL.dd.getFieldCompressedName("order","product");
    ok(actual === "02", "FL.dd.getFieldCompressedName -->compressed name is '02'");//31
    actual = FL.dd.isEntityInLocalDictionary("order");
    ok(actual === true, "FL.dd.isEntityInLocalDictionary -->'order' exists in local dictionary.");//32
    actual = FL.dd.isEntityInLocalDictionary("orderz");
    ok(actual === false, "FL.dd.isEntityInLocalDictionary -->'orderz' does not exists in local dictionary.");//33
    
    actual = FL.dd.getEntityByCName("02");
    ok(actual == "order", "FL.dd.getEntityByCName --> returns 'order' for entity compressed name = '02'");//34
    actual = FL.dd.getEntityByCName("0A");
    ok(actual === null, "FL.dd.getEntityByCName --> returns null for entity compressed name = '0A'");//35
    // FL.dd.displayEntities();
    actual = FL.dd.getEntityByCName("01");
    ok(actual === "client", "FL.dd.getEntityByCName --> returns 'client' for entity compressed name = '01'");//36

    //now testing relations functions
    actual = FL.dd.isRelation("client","01");
    ok(actual === false, "FL.dd.isRelation --> relation compressed name '01' does not exist");//37
    FL.dd.addRelation("client","01","order","orders","N");//(xSingular,rCN,withEntityName,verb,cardinality,side,storedHere)
    obj = FL.dd.entities["client"].relations[0];
    deepEqual( obj, {"rCN":"01","withEntity":"order","verb":"orders","cardinality":"N","semantic":"client orders many orders","side":null,"storedHere":null,"withEntityCN":null},"FL.dd.addRelation --> added relation client to order ");//38

    //FL.dd.displayEntities();

    // deepEqual( obj, {d:{ "00":3,"01":false,"02":"Super 3" },r:[]}, "FL.server.getSavingObjFromCsvStoreById correct for id=3" );

    //ok(actual === false, "FL.dd.isRelation --> relation compressed name '01' does not exist");//37


    var rowsArr = [
      // {id:1,shipped:true,product:"Super 1"},
      // {id:2,shipped:false,product:"Super 2"},
      // {id:3,shipped:false,product:"Super 3"},
      // {id:4,shipped:true,product:"Super 4"}
      {shipped:true,product:"Super 1"},
      {shipped:false,product:"Super 2"},
      {shipped:false,product:"Super 3"},
      {shipped:true,product:"Super 4"}
    ];
    utils.csvToStore(rowsArr);//id is injected here...
    console.log("---->csvStore.csvRows="+JSON.stringify(csvStore.csvRows));

    var obj = FL.server.preparePutRowFromCsvStoreById("order",1);
    console.log("---->preparePutRowFromCsvStoreById="+JSON.stringify(obj));
    deepEqual( obj, {d:{ "00":1,"01":true,"02":"Super 1" },r:[]}, "FL.server.preparePutRowFromCsvStoreById correct for id=1" );
    obj = FL.server.preparePutRowFromCsvStoreById("order",3);
    console.log("---->preparePutRowFromCsvStoreById="+JSON.stringify(obj));
    deepEqual( obj, {d:{ "00":3,"01":false,"02":"Super 3" },r:[]}, "FL.server.getSavingObjFromCsvStoreById correct for id=3" );
    arrOfObj = FL.server.preparePutAllCsvStore("order");
    console.log("---->preparePutAllCsvStore="+JSON.stringify(arrOfObj));
    
    //now we force compressed names to match those in server 
    console.log("before setFieldCompressedName ");
    FL.dd.displayEntities();
    FL.dd.setFieldCompressedName("order","id","62");
    FL.dd.setFieldCompressedName("order","shipped","63");
    FL.dd.setFieldCompressedName("order","product","64");
    console.log("after setFieldCompressedName ");
    FL.dd.displayEntities();

    csvStore.csvRows = {};
    FL.dd.setSync("order",true);//force sync
    console.log("test 0  convertToCsvStore csvStore.csvRows ="+JSON.stringify(csvStore.csvRows));
    // var simulObjFromServer = _.map(arrOfObj,function(element){return element.d;});
    var simulObjFromServer = arrOfObj;
    console.log("test 1 convertArrC2LForEntity ---->before function: simulObjFromServer="+JSON.stringify(simulObjFromServer));
    var csvStoreArray = FL.server.convertArrC2LForEntity("order",simulObjFromServer);
    //FL.server.loadCsvStoreFromEntity("order");
    console.log("test 2  convertArrC2LForEntity csvStoreArray ="+JSON.stringify(csvStoreArray));

    // console.log("---->convertToCsvStore="+JSON.stringify(obj));


    // FL.server.insertCsvStoreDataTo("order");
    // FL.dd.setSync("client1",true);//force sync
    // FL.server.loadCsvStoreFromEntity("client1");


    // ----------- test Nico Login ---------------
    // FL.server.offline = false;
    // FL.server.connect("Joao","oLiVeIrA",function(bSuccess){//TEST FL.server.createServerEntity_Fields OK
    //     // ok(bSuccess === true, "Good connection");
    //     if(bSuccess){
    //       console.log("Good connection--> begin createServerEntity_Fields-------------------");
    //       console.log("   --> before server synch");

    //       FL.dd.displayEntities();
    //       FL.server.createServerEntity_Fields("order",function(err){
    //           console.log("createServerEntity_Fields is done !!! Error:"+err);
    //           console.log("   --> after server synch");
    //           FL.dd.displayEntities();
    //           FL.server.disconnect();       
    //       });//singular, plural, description
    //     }else{
    //       console.log("Connection Error !!!");
    //     }
    // });
 
    // FL.server.offline = false;
    // FL.server.connect("Joao","oLiVeIrA",function(bSuccess){//TEST FL.server.insertCsvStoreDataTo OK
    //     // ok(bSuccess === true, "Good connection");
    //     if(bSuccess){
    //       console.log("Good connection--> begin insertCsvStoreDataTo(entity)-------------------");
    //       FL.server.insertCsvStoreDataTo("order",function(err){//all csvStore will be stored in server as "order" content
    //           console.log("insertCsvStoreDataTo is done !!! Error:"+err);
    //           FL.server.disconnect();       
    //       });//singular, plural, description
    //     }else{
    //       console.log("Connection Error !!!");
    //     }
    // });

    FL.server.offline = false;
    var oEntity =  FL.dd.getEntityBySingular("order");
    oEntity.csingular = "61";//we force entity compressed name for test
    //we need to force field compressed names for test

    FL.server.connect("Joao","oLiVeIrA",function(err){//TEST loadCsvStoreFromEntity
        // ok(err === true, "Good connection");
        if(err){
          if(err.status != "offline")
            console.log("Connection Error !!!"+err);
        }else{
          console.log("Good connection--> begin loadCsvStoreFromEntity(entity)-------------------");
          FL.server.loadCsvStoreFromEntity("order",function(err){//all csvStore will be stored in server as "order" content
              console.log("loadCsvStoreFromEntity is done !!! Error:"+err);
              FL.server.disconnect();
              console.log("show csvStore="+JSON.stringify(csvStore.csvRows));
          });
        }
    });


    // FL.server.connect("Joao","oLiVeIrA",false,function(err){
    //     // ok(bSuccess === true, "Good connection");
    //     if(bSuccess){
    //       console.log("Good connection--> begin createServerEntity_Fields-------------------");
    //       console.log("   --> before server synch");
    //       FL.dd.displayEntities();
    //       var fEnt = new FL.server.fl.entity();
    //       fEnt = fEnt.getAllWithField({"query":{}},function(err,entities){//standard callback err,data
    //           if(err){
    //              alert("fEnt.getAllWithField Error "+err);
    //              return;
    //           }
    //           FL.dd.loadClientDictionary(entities);
    //           console.log("Server Dictionary is loaded (if no errors)  Error:"+err);
    //           console.log("   -->entities:"+JSON.stringify(entities));
    //           FL.dd.displayEntities();
    //           FL.login.disconnectServer(false);//Parameter is Bypass         
    //       });//singular, plural, description
    //     }else{
    //       // console.log("Connection Error !!!");
    //       alert("Connection Error !!!");
    //     }
    // });
  });
  test("FL.server testing server interface functions (no connection need)", function () { //
    //--------------------- Test Setup ----------------------------------------
    //We need at least one entity in local dictionary
    var success = FL.dd.createEntity("order","client's product request");
    FL.dd.addAttribute("order","shipped","expedition status","Shipped","boolean",null);
    FL.dd.addAttribute("order","product","unique order item","product","string",null);
    //forcing compressed field names
    FL.dd.setFieldCompressedName("order","id","62");
    FL.dd.setFieldCompressedName("order","shipped","63");
    FL.dd.setFieldCompressedName("order","product","64");


    //rowsArr is the array to be stored in csvStore.csvRows
    var rowsArr = [
      {shipped:true,product:"Super 1"},
      {shipped:false,product:"Super 2"},
      {shipped:false,product:"Super 3"},
      {shipped:true,product:"Super 4"}
    ];
    utils.csvToStore(rowsArr);// store in csvStore() after converting keys to lowercase and injecting ids
    //--------------------------------------------------------------------------
    //Test 1 - Extract a single id from csvStore.csvRows and prepare it to be added to server
    // extract from format: {"1":{"shipped":true,"product":"Super 1","id":1},"2":{"shipped":false,"product":"Super 2"}}
    //            returns : {"d":{"01":true,"02":"Super 1","00":1},"r":[]} for id=1  
    var obj = FL.server.preparePutRowFromCsvStoreById("order",1);
    deepEqual( obj, {d:{ "62":1,"63":true,"64":"Super 1" },r:[]}, "FL.server.preparePutRowFromCsvStoreById correct for id=1" );
    obj = FL.server.preparePutRowFromCsvStoreById("order",3);
    deepEqual( obj, {d:{ "62":3,"63":false,"64":"Super 3" },r:[]}, "FL.server.preparePutRowFromCsvStoreById correct for id=3" );
    
    //Test 2 - Extract all lines from csvStore.csvRows and prepare it to be added to server
    // extract from format: {"1":{"shipped":true,"product":"Super 1","id":1},"2":{"shipped":false,"product":"Super 2"}}
    //            returns : [{"d":{"01":true,"02":"Super 1","00":1},"r":[]}, {"d":{"01":false,"02":"Super 2","00":2},"r":[]}]
    var arrOfObj = FL.server.preparePutAllCsvStore("order",1);
    deepEqual( arrOfObj, [{d:{ "62":1, "63":true,"64":"Super 1" },r:[]}, {d:{ "62":2,"63":false,"64":"Super 2" },r:[]}, {d:{ "62":3,"63":false,"64":"Super 3" },r:[]}, {d:{ "62":4,"63":true,"64":"Super 4" },r:[]} ], "FL.server.preparePutAllCsvStore correct" );
    
    //Test 3 - Using local Dictionary Converts array received from server (each line has keys=field compressed names) to equivalent array with logical names
    //           received from sever : [{d:{"01":true,"02":"Super 1","00":1},r:[]},{d:{"01":false,"02":"Super 2","00":2},r:[]}]
    //     array to store in csvStore: [{"shipped":true,"product":"Super 1","id":1},{"shipped":false,"product":"Super 2","id":2}]
    var simulObjFromServer = arrOfObj;
    var csvStoreArray = FL.server.convertArrC2LForEntity("order",simulObjFromServer);
    deepEqual( csvStoreArray, [{ "id":1,"shipped":true,"product":"Super 1" }, { "id":2,"shipped":false,"product":"Super 2" }, { "id":3,"shipped":false,"product":"Super 3" }, { "id":4,"shipped":true,"product":"Super 4" } ], "FL.server.convertArrC2LForEntity correct in case a id is compressed in the input array" );
    
    // In the case where no compressed field name is translatable into "id" convertArrC2LForEntity generates the id !!!
    simulObjFromServer = [{d:{ "63":true,"64":"Super 1" },r:[]}, {d:{ "63":false,"64":"Super 2" },r:[]}, {d:{"63":false,"64":"Super 3" },r:[]}, {d:{"63":true,"64":"Super 4" },r:[]} ];
    csvStoreArray = FL.server.convertArrC2LForEntity("order",simulObjFromServer);
    deepEqual( csvStoreArray, [{ "id":1,"shipped":true,"product":"Super 1" }, { "id":2,"shipped":false,"product":"Super 2" }, { "id":3,"shipped":false,"product":"Super 3" }, { "id":4,"shipped":true,"product":"Super 4" } ], "FL.server.convertArrC2LForEntity correct in case no field is translatable into 'id'" );
  });
});