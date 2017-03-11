"use strict";

function init() {
  if (typeof (Storage) === "undefined") {
    var currentFile = document.getElementById("currentFile");
    currentFile.textContent = "Sorry! No web storage support.\nIf you're using Internet Explorer, you must load the page from a server for local storage to work.";
  }

// setup the menubar    
jQuery( "#menuui" ).menu();
jQuery(function() {
    jQuery( "#menuui" ).menu({ position: { my: "left top", at: "left top+30" } });
});
jQuery( "#menuui" ).menu({
  icons: { submenu: "ui-icon-triangle-1-s" }
});

 jQuery("#dragBar").height(jQuery("#myDiagram").height());

  // ³õÊ¼Ê±£¬Òþ²Ø¸÷¸öµ¯³ö¿ò
  var docConfiguration = document.getElementById("div1");
  docConfiguration.style.visibility = "hidden";

  var deviceEventConfig = document.getElementById("div2");
  deviceEventConfig.style.visibility = "hidden";

  var timerEventConfig = document.getElementById("div9");
  timerEventConfig.style.visibility = "hidden";

  var lightOnOff = document.getElementById("div3");
  lightOnOff.style.visibility = "hidden";

  var lightColor = document.getElementById("div4");
  lightColor.style.visibility = "hidden";

  var linkConfig = document.getElementById("div5");
  linkConfig.style.visibility = "hidden";

  var proConfig = document.getElementById("div6");
  proConfig.style.visibility = "hidden";

  var subProConfig = document.getElementById("div7");
  subProConfig.style.visibility = "hidden";

  var callActivityConfig = document.getElementById("div8");
  callActivityConfig.style.visibility = "hidden";

  var serviceConfig = document.getElementById("div10");
  serviceConfig.style.visibility = "hidden";

  var resultAnalysis = document.getElementById("div11");
  resultAnalysis.style.visibility = "hidden";

  var modelConfig = document.getElementById("div12");
  modelConfig.style.visibility = "hidden";

  var applicationConfig = document.getElementById("div13");
  applicationConfig.style.visibility = "hidden";


  var $ = go.GraphObject.make;  // for more concise visual tree definitions

  // constants for design choices
  var GradientYellow = $(go.Brush, "Linear", { 0: "LightGoldenRodYellow", 1: "#FFFF66" });  // ÑÕÉ«½éÓÚ0-1Ö®¼ä£¬½¥±ä
  var GradientLightGreen = $(go.Brush, "Linear", { 0: "#E0FEE0", 1: "PaleGreen" });
  var GradientLightGray = $(go.Brush, "Linear", { 0: "White", 1: "#DADADA" });

  var ActivityNodeFill = $(go.Brush, "Linear", { 0: "OldLace", 1: "PapayaWhip" });
  var ActivityNodeStroke = "#CDAA7D";
  var ActivityMarkerStrokeWidth = 1.5;
  var ActivityNodeWidth = 100;
  var ActivityNodeHeight = 70;
  var ActivityNodeWidthForPalette = 120;
  var ActivityNodeHeightForPalette = 80;
  var ActivityNodeStrokeWidth = 1;
  var ActivityNodeStrokeWidthIsCall = 4;

  var SubprocessNodeFill = ActivityNodeFill;
  var SubprocessNodeStroke = ActivityNodeStroke;

  var EventNodeSize = 42;
  var EventNodeInnerSize = EventNodeSize - 6;
  var EventNodeSymbolSize = EventNodeInnerSize - 14;
  var EventEndOuterFillColor = "pink";
  var EventBackgroundColor = GradientLightGreen;
  var EmptyEventBackgroundColor = ActivityNodeFill;
  var EventSymbolLightFill = "white";
  var EventSymbolDarkFill = "dimgray";
  var EventDimensionStrokeColor = "green";
  var EmptyEventDimensionStrokeColor = ActivityNodeStroke;
  var EventDimensionStrokeEndColor = "red";
  var EventNodeStrokeWidthIsEnd = 4;

  var GatewayNodeSize = 80;
  var GatewayNodeSymbolSize = 45;
  var GatewayNodeFill = GradientYellow;
  var GatewayNodeStroke = "darkgoldenrod";
  var GatewayNodeSymbolStroke = "darkgoldenrod";
  var GatewayNodeSymbolFill = GradientYellow;
  var GatewayNodeSymbolStrokeWidth = 3;

  // custom figures for Shapes
  // define own named figures by calling the static function Shape.defineFigureGenerator.(×Ô¶¨ÒåÍ¼ÐÎÐÎ×´)
  go.Shape.defineFigureGenerator("Empty", function(shape, w, h) {    // ¶¨ÒåÒ»¸öFigure£¬Ãû×ÖÎª"Empty"
   // function(shape, w, h):shape -->Éú³ÉµÄ¼¯ºÏÐÎ×´, w,h -->width & height
    return new go.Geometry();
  });

 go.Shape.defineFigureGenerator("startEvent", function(shape, w, h) {
     return new go.Geometry();
 });

go.Shape.defineFigureGenerator("endEvent", function(shape, w, h) {
    return new go.Geometry();
})

  // ¶¨ÒåAnnotationµÄÍ¼±ê£¨Ä¿Ç°Î´Ê¹ÓÃ£©
  var annotationStr = "M 150,0L 0,0L 0,600L 150,600 M 800,0";
  var annotationGeo = go.Geometry.parse(annotationStr);
  annotationGeo.normalize();
  go.Shape.defineFigureGenerator("Annotation", function(shape, w, h) {
    var geo = annotationGeo.copy();
    // calculate how much to scale the Geometry so that it fits in w x h
    var bounds = geo.bounds;    // bounds: returns a rectangle that contains all points within thew Geometry.
    var scale = Math.min(w / bounds.width, h / bounds.height);
    geo.scale(scale, scale);   // ·µ»Ø¸Ä±äºóµÄGeometry
    return geo;    // geo is a figure
  });

  // ³ÝÂÖÍ¼±ê£¨serviceTask£©
  var gearStr = "F M 391,5L 419,14L 444.5,30.5L 451,120.5L 485.5,126L 522,141L 595,83L 618.5,92L 644,106.5" +
    "L 660.5,132L 670,158L 616,220L 640.5,265.5L 658.122,317.809L 753.122,322.809L 770.122,348.309L 774.622,374.309" +
    "L 769.5,402L 756.622,420.309L 659.122,428.809L 640.5,475L 616.5,519.5L 670,573.5L 663,600L 646,626.5" +
    "L 622,639L 595,645.5L 531.5,597.5L 493.192,613.462L 450,627.5L 444.5,718.5L 421.5,733L 393,740.5L 361.5,733.5" +
    "L 336.5,719L 330,627.5L 277.5,611.5L 227.5,584.167L 156.5,646L 124.5,641L 102,626.5L 82,602.5L 78.5,572.5" +
    "L 148.167,500.833L 133.5,466.833L 122,432.5L 26.5,421L 11,400.5L 5,373.5L 12,347.5L 26.5,324L 123.5,317.5" +
    "L 136.833,274.167L 154,241L 75.5,152.5L 85.5,128.5L 103,105.5L 128.5,88.5001L 154.872,82.4758L 237,155" +
    " L 280.5,132L 330,121L 336,30L 361,15L 391,5 Z M 398.201,232L 510.201,275L 556.201,385L 505.201,491L 399.201,537" +
    "L 284.201,489L 242.201,385L 282.201,273L 398.201,232 Z";
  var gearGeo = go.Geometry.parse(gearStr);
  gearGeo.normalize();

  // ¶¨ÒåService TaskµÄÐÎ×´
  go.Shape.defineFigureGenerator("BpmnTaskService", function(shape, w, h) {
    var geo = gearGeo.copy();
    // calculate how much to scale the Geometry so that it fits in w x h
    var bounds = geo.bounds;
    var scale = Math.min(w / bounds.width, h / bounds.height);
    geo.scale(scale, scale);
    // text should go in the hand
    geo.spot1 = new go.Spot(0, 0.6, 10, 0);
    geo.spot2 = new go.Spot(1, 1);
    return geo;
  });

  // conversion functions used by data Bindings
  function nodeActivityTaskTypeConverter(s) {
    var tasks = ["Empty",
        // BpmnTaskMessage,BpmnTaskUser,BpmnTaskScript¶¼ÊÇGoJSÔ¤¶¨ÒåÍ¼ÐÎ
                  "BpmnTaskMessage",
                  "BpmnTaskUser",
                  "BpmnTaskScript",
                  "BpmnTaskService",  // Custom gear symbol
                  "BpmnTaskMessage",  // should be black on white
                  "InternalStorage"];
    if (s < tasks.length) return tasks[s];
    return "NotAllowed"; // error
  }

  function nodeActivityTaskTypeColorConverter(s) {
    return (s == 5) ? "dimgray" : "white";
  }

  function nodeEventTypeConverter(s) {  // order here from BPMN 2.0 poster
    var tasks = [ "NotAllowed",
                  "startEvent",
                  "BpmnTaskService",
        // NotAllowed ÒÔ¼°ÒÔÏÂÕâÐ©Í¼ÐÎ¶¼ÊÇGoJSµÄÔ¤¶¨ÒåÍ¼ÐÎ¡£
                  "BpmnEventTimer",
                  "Empty",
                  "BpmnTaskMessage",
                  "BpmnEventConditional",
                  "BpmnEventEscalation",
                  "endEvent",
                  "Arrow",
                  "BpmnEventError",
                  "ThinX",
                  "BpmnActivityCompensation",
                  "Triangle",
                  "Pentagon",     // Îå½ÇÐÎ
                  "ThickCross",
                  "Circle"];
    if (s < tasks.length) return tasks[s];
    return "NotAllowed"; // error
  }

  function nodeEventDimensionStrokeColorConverter(s) {
    if (s === 8) return EventDimensionStrokeEndColor;
    else if ( s === 2 || s === 4) return EmptyEventDimensionStrokeColor;
    return EventDimensionStrokeColor;
  }

  function nodeEventDimensionSymbolFillConverter(s) {
    if (s <= 6) return EventSymbolLightFill;
    return EventSymbolDarkFill;
  }

  // location of event on boundary of Activity is based on the index of the event in the boundaryEventArray
  // Spot:µã£¬µØµã¡£Spot(x,y,offx,offy)      Spot(0,0,0,0)<-->the top-left corner
 // ±ß½çÊÂ¼þÔÚ½áµãÉÏµÄ·ÅÖÃÎ»ÖÃ
  function nodeActivityBESpotConverter(s) {     // ¼ÆËãÔÚ½ÚµãÉÏÌí¼Ó±ß½çÊÂ¼þµÄÎ»ÖÃ
    var x = 10 + (EventNodeSize / 2);
    if (s === 0) return new go.Spot(0, 1, x, 0);    // bottom left
    if (s === 1) return new go.Spot(1, 1, -x, 0);   // bottom right
    if (s === 2) return new go.Spot(1, 0, -x, 0);   // top right
    return new go.Spot(1, 0, -x - (s - 2) * EventNodeSize, 0);    // top ... right-to-left-ish spread
  }
  // make all ports on a node visible when the mouse is over the node
  function showPorts(node, show) {
       var diagram = node.diagram;
       if(!diagram || diagram.isReadOnly || !diagram.allowLink) return;
       node.ports.each(function(port) {
           port.stroke = (show ? "black" : null);
       });
   }

  function makePort(name, spot, output, input) {
        // the port is basically just a samll circle that has a white stroke when it is made visible.
        return $(go.Shape, "Circle",
            {
                fill: "transparent",
                stroke: null,   // this is changed to "white" in the showPorts function
                desiredSize: new go.Size(5, 5),
                alignment: spot, alignmentFocus: spot,   // align the port on the main Shape
                portId: name,      // declare this object to be a "port"
                fromSpot: spot, toSpot: spot,     // declare where links may connect at this port
                fromLinkable: output, toLinkable: input,   // declare whether the user may draw links to/from here
                cursor: "pointer"    // show a different cursor to indicate potential link point
            });
    }

  function makeSubButton(sub) {
        if (sub)
            return [$("SubGraphExpanderButton"),
                { margin: 2, visible: false },
                new go.Binding("visible", "isSubProcess")];
        return [];
    }

  // ½«diagramÍ¼ÐÎÖÐµÄgo.Point£¨×ø±êµã£¬ÀýÈç(1,2)£©ÀàÐÍlocation×ª»»³É¸¡µãÊý×éloc´«¸ømodelÊý¾Ý
  function fromLocation(location,loc) {
      loc = go.Point.stringify(location);
      var stringArray = loc.split(" ");
      var floatArray = [];
      for(var i=0; i<stringArray.length; i++){
          floatArray[i] = parseFloat(stringArray[i]);
      }
      return floatArray;
  }

  // ½«modelÊý¾ÝµÄ¸¡µãÊý×éloc×ª»»³ÉdiagramÍ¼ÐÎÖÐµÄgo.PointÀàÐÍlocation×ø±êµã
  function toLocation(loc,location){
      location = loc.join(" ");
      return go.Point.parse(location);
  }

  var boundaryNodeMenu =
      $(go.Adornment, "Vertical",
          $("ContextMenuButton",
              $(go.TextBlock, "Remove"),
              { click: function(e, obj) { removeBoundaryEvent(obj.part.adornedObject); } }));

  function removeBoundaryEvent(obj) {
      myDiagram.startTransaction("removeBoundaryEvent");
      var pid = obj.portId;
      var arr = obj.panel.itemArray;
      for(var i=0;i<arr.length; i++){
          if(arr[i].portId === pid) {
              myDiagram.model.removeArrayItem(arr, i);
              break;
          }
      }
      myDiagram.commitTransaction("removeBoundaryEvent");
  }

  var boundaryEventItemTemplate =
      $(go.Panel, "Spot",
        {
            alignmentFocus: go.Spot.Center,
            fromLinkable: true,  toLinkable: false,
            cursor: "pointer",
            fromSpot: go.Spot.Bottom,
            fromMaxLinks: 1,  toMaxLinks: 0,
            contextMenu: boundaryNodeMenu
        },
          new go.Binding("portId", "portId"),
          new go.Binding("alignment", "alignmentIndex", nodeActivityBESpotConverter),
          $(go.Shape, "Circle",
              { desiredSize: new go.Size(EventNodeSize, EventNodeSize) },
              new go.Binding("strokeDashArray", "gType", function(s) { return (s === 6) ? [4, 2] : null; }),
              new go.Binding("fromSpot", "alignmentIndex",
                  function(s) {
                      //  nodeActivityBEFromSpotConverter, 0 & 1 go on bottom, all others on top of activity
                      if (s < 2) return go.Spot.Bottom;
                      return go.Spot.Top;
                  }),
              new go.Binding("fill", "color")),
          $(go.Shape, "Circle",
              { alignment: go.Spot.Center,
                  desiredSize: new go.Size(EventNodeInnerSize, EventNodeInnerSize), fill: null },
              new go.Binding("strokeDashArray", "gType", function(s) { return (s === 6) ? [4, 2] : null; })
          ),
          $(go.Shape, "NotAllowed",
              { alignment: go.Spot.Center,
                  desiredSize: new go.Size(EventNodeSymbolSize, EventNodeSymbolSize), fill: "white" },
              new go.Binding("figure", "gType", nodeEventTypeConverter)
          )
      );

  // ÓÒ¼üµ¥»÷½áµãÏÔÊ¾µÄµ¯³ö¿òÄÚÈÝ
    var taskNodeMenu =
        $(go.Adornment, "Vertical",
            $("ContextMenuButton",
                $(go.TextBlock, "Add Email Event", { margin: 3 }),
                { click: function(e, obj) { addBoundaryEvent(5); } }),
            $("ContextMenuButton",
                $(go.TextBlock, "Add Timer Event", { margin: 3 }),
                { click: function(e, obj) { addBoundaryEvent(3); } }),
            $("ContextMenuButton",
                $(go.TextBlock, "Add Escalation Event", { margin: 3 }),
                { click: function(e, obj) { addBoundaryEvent(7); } }),
            $("ContextMenuButton",
                $(go.TextBlock, "Add Error Event", { margin: 3 }),
                { click: function(e, obj) { addBoundaryEvent(10); } }),
            $("ContextMenuButton",
                $(go.TextBlock, "Add Signal Event", { margin: 3 }),
                { click: function(e, obj) { addBoundaryEvent(13); } })
        );

  //--------------------------------Activity nodes template-----------------------------------
    var taskNodeTemplate =
        $(go.Node, "Spot",
            {   locationObjectName: "SHAPE",
                locationSpot: go.Spot.Center,   // the Node.location is at the center of each node
                resizable: true,    // µã»÷½áµãÊ±£¬½áµãÉÏ»áÏÔÊ¾°Ë¸öhandles(ÓÃÓÚµ÷Õû½áµãµÄ´óÐ¡).
                resizeObjectName: "PANEL",   // resize the panel,not the node.ÉèÖÃpanelµÄdesiredSize
                selectionAdorned: false,    // by default,the selection adornment is just a simple blue box around the Part.
                doubleClick: function (e, obj) { addConfiguration(obj);},
                contextMenu: taskNodeMenu,
                itemTemplate: boundaryEventItemTemplate
                //mouseEnter: function(e,obj) {showPorts(obj.part, true);},
                //mouseLeave: function(e,obj) {showPorts(obj.part, false);}
            },

             new go.Binding("itemArray", "boundaryEventArray"),
             new go.Binding("location", "loc", toLocation).makeTwoWay(fromLocation),
             new go.Binding("layerName", "isSelected", function(s) { return s ? "Foreground" : ""; }).ofObject(),
          $(go.Panel, "Auto",
              {   name: "PANEL",
                  minSize: new go.Size(ActivityNodeWidth, ActivityNodeHeight),
                  desiredSize: new go.Size(ActivityNodeWidth, ActivityNodeHeight)
              },
              new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
              $(go.Panel, "Spot",
                  $(go.Shape, "RoundedRectangle",
                      {   name: "SHAPE",
                          fill: ActivityNodeFill,  stroke: ActivityNodeStroke,
                          parameter1: 10,  // corner size
                          portId: "",
                          fromLinkable: true,  toLinkable: true,
                          cursor: "pointer"
                      },
                      new go.Binding("fill", "color"),
                      new go.Binding("strokeWidth", "isCall", function(s) {
                          return s ? ActivityNodeStrokeWidthIsCall : ActivityNodeStrokeWidth; })
                  ),
                  $(go.Shape, "BpmnTaskScript",   // will be None, Script, Manual, Service, etc via converter
                      {   alignment: new go.Spot(0, 0, 5, 5),  alignmentFocus: go.Spot.TopLeft,
                          width: 22,  height: 22
                      },
                      new go.Binding("fill", "gType", nodeActivityTaskTypeColorConverter),
                      new go.Binding("figure", "gType", nodeActivityTaskTypeConverter)
                   )),
              $(go.TextBlock,
                  {   alignment: new go.Spot(0.5, 0.7),
                      textAlign: "center",
                      margin: 12,
                      editable:false
                  },
                  new go.Binding("text", "name").makeTwoWay())
          )
          //makePort("T", go.Spot.Top, true, true),
          //makePort("L", go.Spot.Left, true, true),
          //makePort("R", go.Spot.Right, true, true),
          //makePort("B", go.Spot.Bottom, true, true)
      );

    var subProcessGroupTemplate =
        $(go.Group, "Spot",
            {   locationSpot: go.Spot.Center,
                locationObjectName: "SHAPE",
                resizable: true, resizeObjectName: "SHAPE",
                isSubGraphExpanded: true,
                selectionAdorned: false,
                mouseDrop: function(e, grp) {
                    var ok = grp.addMembers(grp.diagram.selection, true);
                    if (!ok) grp.diagram.currentTool.doCancel();
                },
                doubleClick: function(e,obj) { addSubProConfiguration(obj); },
                mouseEnter: function(e, obj) { showPorts(obj.part, true); },
                mouseLeave: function(e, obj) { showPorts(obj.part, false); }
            },
            new go.Binding("location", "loc", toLocation).makeTwoWay(fromLocation),

            $(go.Panel, "Auto",
                $(go.Shape, "RoundedRectangle",
                    {
                        name: "SHAPE", fill: SubprocessNodeFill, stroke: SubprocessNodeStroke,
                        minSize: new go.Size(ActivityNodeWidth, ActivityNodeHeight)
                    },
                    new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
                    new go.Binding("strokeWidth", "isCall", function(s) { return s ? ActivityNodeStrokeWidthIsCall : ActivityNodeStrokeWidth; })
                ),
                $(go.Panel, "Vertical",
                    { defaultAlignment: go.Spot.Left },
                    $(go.TextBlock,  // label
                        { margin: 3, editable: false },
                        new go.Binding("text", "name").makeTwoWay(),
                        new go.Binding("alignment", "isSubGraphExpanded", function(s) { return s ? go.Spot.TopLeft : go.Spot.Center; })
                    ),
                    // create a placeholder to represent the area where the contents of the group are
                    $(go.Placeholder,
                        { padding: new go.Margin(5, 5) }),
                    $(go.Panel, "Horizontal",
                            {
                                alignment: go.Spot.MiddleBottom,
                                alignmentFocus: go.Spot.MiddleBottom
                            },
                            makeSubButton(true)
                    )// end activity markers horizontal panel
                )  // end Vertical Panel
            ),

            makePort("T", go.Spot.Top, true, true),
            makePort("L", go.Spot.Left, true, true),
            makePort("R", go.Spot.Right, true, true),
            makePort("B", go.Spot.Bottom, true, true)
        );  // end Group

    var callActivityTemplate =
        $(go.Group, "Spot",
            {   locationSpot: go.Spot.Center,
                locationObjectName: "SHAPE",
                resizable: true, resizeObjectName: "SHAPE",
                isSubGraphExpanded: false,
                selectionAdorned: false,
                mouseDrop: function(e, grp) {
                    var ok = grp.addMembers(grp.diagram.selection, true);
                    if (!ok) grp.diagram.currentTool.doCancel();
                },
                doubleClick: function(e,obj) { addCallActivityConfiguration(obj); },
                mouseEnter: function(e, obj) { showPorts(obj.part, true); },
                mouseLeave: function(e, obj) { showPorts(obj.part, false); }
            },
            new go.Binding("location", "loc", toLocation).makeTwoWay(fromLocation),

            $(go.Panel, "Auto",
                $(go.Shape, "RoundedRectangle",
                    {
                        name: "SHAPE", fill: SubprocessNodeFill, stroke: SubprocessNodeStroke,
                        strokeWidth: ActivityNodeStrokeWidthIsCall,
                        minSize: new go.Size(ActivityNodeWidth, ActivityNodeHeight)
                    },
                    new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify)
                ),
                $(go.Panel, "Vertical",
                    { defaultAlignment: go.Spot.Left },
                    $(go.TextBlock,  // label
                        { margin: 3, editable: false },
                        new go.Binding("text", "name").makeTwoWay()
                    ),

                    $(go.Panel, "Horizontal",
                        {
                            alignment: go.Spot.MiddleBottom,
                            alignmentFocus: go.Spot.MiddleBottom
                        },
                        makeSubButton(false)
                    )// end activity markers horizontal panel
                )  // end Vertical Panel
            ),

            makePort("T", go.Spot.Top, true, true),
            makePort("L", go.Spot.Left, true, true),
            makePort("R", go.Spot.Right, true, true),
            makePort("B", go.Spot.Bottom, true, true)
        );  // end Group

    var serviceMenu =
        $(go.Adornment, "Vertical");

    function loadServicesData() {
        serviceMenu.rebuildItemElements();
       jQuery.getJSON("https://raw.githubusercontent.com/only93/Pictures/master/services.json", function(json){
            jQuery.each(json.result, function(i,sv) {
                var service = sv.name;
                var sId = sv.id;
                serviceMenu.add(
                    $("ContextMenuButton",
                        $( go.TextBlock, {text: service, margin: 3 }),
                        { click: function(e,obj) { addService(obj,service,sId); } }));
            });
        });
  }

    function addService(obj, name,sId) {
        currentNodeData = obj.part.data;
        currentName = name;
        currentId = sId;

        document.getElementById("div10").style.visibility = "visible";

        var cmd = currentNodeData.nConfig.config.taskArgs.cmd;
        if(cmd === ""){
            document.getElementById("serviceConfig").value = "online";
        }else{
            document.getElementById("serviceConfig").value = cmd;
        }
    }

  // ------------------------------- template for Activity / Task node in Diagram  -------------------------------
  var serviceNodeTemplate =
      $(go.Node, "Spot",
          {   locationObjectName: "SHAPE",
              locationSpot: go.Spot.Center,
              resizable: true,   // µã»÷½áµãÊ±£¬½áµãÉÏ»áÏÔÊ¾°Ë¸öhandles(ÓÃÓÚµ÷Õû½áµãµÄ´óÐ¡).
              resizeObjectName: "PANEL",
              selectionAdorned: false,  // use a Binding on the Shape.stroke to show selection
              contextMenu: serviceMenu,
              contextClick: function() { loadServicesData(); },
              mouseEnter: function (e,obj) {showPorts(obj.part, true);},
              mouseLeave: function (e,obj) {showPorts(obj.part, false)}
          },
          new go.Binding("location", "loc", toLocation).makeTwoWay(fromLocation),
          new go.Binding("layerName", "isSelected", function(s) { return s ? "Foreground" : ""; }).ofObject(),

          $(go.Panel, "Auto",
              {   name: "PANEL",
                  minSize: new go.Size(ActivityNodeWidth, ActivityNodeHeight),
                  desiredSize: new go.Size(ActivityNodeWidth, ActivityNodeHeight) },
              new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
              $(go.Panel, "Spot",
                  $(go.Shape, "RoundedRectangle",
                      {   name: "SHAPE",
                          fill: ActivityNodeFill,
                          stroke: ActivityNodeStroke,
                          parameter1: 10 // corner size
                      },
                      new go.Binding("fill", "color"),
                      new go.Binding("strokeWidth", "isCall", function(s) {
                          return s ? ActivityNodeStrokeWidthIsCall : ActivityNodeStrokeWidth; })
                  )
              ),  // end main body rectangles spot panel
              $(go.TextBlock,
                  {    alignment: go.Spot.Center, textAlign: "center",
                      margin: 12, editable: false
                  },
                  new go.Binding("text","name").makeTwoWay())
          ),
          makePort("T", go.Spot.Top, true, true),
          makePort("L", go.Spot.Left, true, true),
          makePort("R", go.Spot.Right, true, true),
          makePort("B", go.Spot.Bottom, true, true)
      );

    var modelMenu =
        $(go.Adornment, "Vertical");

    function loadModelsData() {
        modelMenu.rebuildItemElements();
        jQuery.getJSON("models.json", function (json) {
            jQuery.each(json.msg, function (i,mod) {
                var model = mod.mName;
                var mId = mod.mId;
                modelMenu.add(
                    $("ContextMenuButton",
                        $(go.TextBlock, {text: model, margin: 3}),
                        {
                            click: function (e, obj) { addModel(obj, model,mId); }
                        }));
            });
        });
    }

    function addModel(obj, name,mId) {
        currentNodeData = obj.part.data;
        currentName = name;
        currentId = mId;

        document.getElementById("div12").style.visibility = "visible";
        var cmd = currentNodeData.nConfig.config.taskArgs.cmd;
        if(cmd === ""){
            document.getElementById("modelConfig").value = "online";
        }else{
            document.getElementById("modelConfig").value = cmd;
        }
    }

    var modelNodeTemplate =
        $(go.Node, "Spot",
            {   locationObjectName: "SHAPE",
                locationSpot: go.Spot.Center,
                resizable: true,   // µã»÷½áµãÊ±£¬½áµãÉÏ»áÏÔÊ¾°Ë¸öhandles(ÓÃÓÚµ÷Õû½áµãµÄ´óÐ¡).
                resizeObjectName: "PANEL",
                selectionAdorned: false,  // use a Binding on the Shape.stroke to show selection
                contextMenu: modelMenu,
                contextClick: function(){ loadModelsData(); },
                mouseEnter: function (e,obj) {showPorts(obj.part, true);},
                mouseLeave: function (e,obj) {showPorts(obj.part, false)}
            },
            new go.Binding("location", "loc", toLocation).makeTwoWay(fromLocation),
            new go.Binding("layerName", "isSelected", function(s) { return s ? "Foreground" : ""; }).ofObject(),

            $(go.Panel, "Auto",
                {   name: "PANEL",
                    minSize: new go.Size(ActivityNodeWidth, ActivityNodeHeight),
                    desiredSize: new go.Size(ActivityNodeWidth, ActivityNodeHeight) },
                new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
                $(go.Panel, "Spot",
                    $(go.Shape, "RoundedRectangle",
                        {   name: "SHAPE",
                            fill: ActivityNodeFill,
                            stroke: ActivityNodeStroke,
                            parameter1: 10 // corner size
                        },
                        new go.Binding("fill", "color"),
                        new go.Binding("strokeWidth", "isCall", function(s) {
                            return s ? ActivityNodeStrokeWidthIsCall : ActivityNodeStrokeWidth; })
                    )
                ),  // end main body rectangles spot panel
                $(go.TextBlock,
                    {    alignment: go.Spot.Center, textAlign: "center",
                        margin: 12, editable: false
                    },
                    new go.Binding("text","name").makeTwoWay())
            ),
            makePort("T", go.Spot.Top, true, true),
            makePort("L", go.Spot.Left, true, true),
            makePort("R", go.Spot.Right, true, true),
            makePort("B", go.Spot.Bottom, true, true)
        );

    //var applicationMenu =
    //        $(go.Adornment, "Vertical");
    //
    //function loadApplicationsData() {
    //    applicationMenu.rebuildItemElements();
    //    jQuery.getJSON("applications.json", function (json) {
    //        jQuery.each(json.msg, function (i,app) {
    //            var application = app.aName;
    //            var aId = app.aId;
    //            applicationMenu.add(
    //                $("ContextMenuButton",
    //                    $(go.TextBlock, {text: application, margin: 3}),
    //                    {
    //                        click: function (e, obj) { addApplication(obj, application, aId);  }
    //                    }));
    //        });
    //    });
    //}
    //
    //function addApplication(obj, name, aId) {
    //      currentNodeData = obj.part.data;
    //      currentName = name;
    //      currentId = aId;
    //      document.getElementById("div13").style.visibility = "visible";
    //    var cmd = currentNodeData.nConfig.config.taskArgs.cmd;
    //    if(cmd === ""){
    //        document.getElementById("appConfig").value = "online";
    //    }else{
    //        document.getElementById("appConfig").value = cmd;
    //    }
    //
    //}

    var applicationNodeTemplate =
        $(go.Node, "Spot",
            {   locationObjectName: "SHAPE",
                locationSpot: go.Spot.Center,
                resizable: true,   // µã»÷½áµãÊ±£¬½áµãÉÏ»áÏÔÊ¾°Ë¸öhandles(ÓÃÓÚµ÷Õû½áµãµÄ´óÐ¡).
                resizeObjectName: "PANEL",
                selectionAdorned: false,  // use a Binding on the Shape.stroke to show selection
                doubleClick: function(e,obj) { addAppConfiguration(obj); },
                //contextMenu: applicationMenu,
               // contextClick: function(){ loadApplicationsData(); },
                mouseEnter: function (e,obj) {showPorts(obj.part, true);},
                mouseLeave: function (e,obj) {showPorts(obj.part, false)}
            },
            new go.Binding("location", "loc", toLocation).makeTwoWay(fromLocation),
            new go.Binding("layerName", "isSelected", function(s) { return s ? "Foreground" : ""; }).ofObject(),

            $(go.Panel, "Auto",
                {   name: "PANEL",
                    minSize: new go.Size(ActivityNodeWidth, ActivityNodeHeight),
                    desiredSize: new go.Size(ActivityNodeWidth, ActivityNodeHeight) },
                new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
                $(go.Panel, "Spot",
                    $(go.Shape, "RoundedRectangle",
                        {   name: "SHAPE",
                            fill: ActivityNodeFill,
                            stroke: ActivityNodeStroke,
                            parameter1: 10 // corner size
                        },
                        new go.Binding("fill", "color"),
                        new go.Binding("strokeWidth", "isCall", function(s) {
                            return s ? ActivityNodeStrokeWidthIsCall : ActivityNodeStrokeWidth; })
                    )
                ),  // end main body rectangles spot panel
                $(go.TextBlock,
                    {    alignment: go.Spot.Center, textAlign: "center",
                        margin: 12, editable: false
                    },
                    new go.Binding("text","name").makeTwoWay())
            ),
            makePort("T", go.Spot.Top, true, true),
            makePort("L", go.Spot.Left, true, true),
            makePort("R", go.Spot.Right, true, true),
            makePort("B", go.Spot.Bottom, true, true)
        );

    var testResultMenu =
        $(go.Adornment, "Vertical",
            $("ContextMenuButton",
                $(go.TextBlock, "ResultA", { margin: 3 }),
                { click: function(e, obj) { analysisResult(obj, "ResultA"); } }),
            $("ContextMenuButton",
                $(go.TextBlock, "ResultB", {margin: 3}),
                {click: function(e, obj) { analysisResult(obj, "ResultB")}}),
            $("ContextMenuButton",
                $(go.TextBlock, "ResultC", {margin: 3}),
                {click: function(e, obj) { analysisResult(obj, "ResultC")}}),
            $("ContextMenuButton",
                $(go.TextBlock, "ResultD", {margin: 3}),
                {click: function(e, obj) { analysisResult(obj, "ResultD")}}),
            $("ContextMenuButton",
                $(go.TextBlock, "ResultE", {margin: 3}),
                {click: function(e, obj) { analysisResult(obj, "ResultE")}}));

    function analysisResult(obj, name){
        currentNodeData = obj.part.data;
        document.getElementById("resultName").innerHTML = name;
        document.getElementById("div11").style.visibility = "visible";

        var nConfig = {
            aId: currentNodeData.key,
            aName: name,
            aDesc: currentNodeData.desc,
            type: "task",
            userId: g_userId,
            behavior: "immediate",
            config: {
                tType: "AnalysisTask",
                taskArgs: {
                    resultId: name,
                    analysis: currentNodeData.nConfig.config.taskArgs.analysis
                }
            }
        };

        myDiagram.model.setDataProperty(currentNodeData, "name",name);
        myDiagram.model.setDataProperty(currentNodeData, "nConfig", nConfig);
    }

    var testResultAnalysisNodeTemplate =
        $(go.Node, "Spot",
            {   locationObjectName: "SHAPE",
                locationSpot: go.Spot.Center,
                resizable: true,   // µã»÷½áµãÊ±£¬½áµãÉÏ»áÏÔÊ¾°Ë¸öhandles(ÓÃÓÚµ÷Õû½áµãµÄ´óÐ¡).
                resizeObjectName: "PANEL",
                selectionAdorned: false,  // use a Binding on the Shape.stroke to show selection
                contextMenu: testResultMenu,
                mouseEnter: function (e,obj) {showPorts(obj.part, true);},
                mouseLeave: function (e,obj) {showPorts(obj.part, false)}
            },
            new go.Binding("location", "loc", toLocation).makeTwoWay(fromLocation),
            new go.Binding("layerName", "isSelected", function(s) { return s ? "Foreground" : ""; }).ofObject(),

            $(go.Panel, "Auto",

                {   name: "PANEL",
                    minSize: new go.Size(ActivityNodeWidth, ActivityNodeHeight),
                    desiredSize: new go.Size(ActivityNodeWidth, ActivityNodeHeight) },
                new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
                $(go.Panel, "Spot",
                    $(go.Shape, "RoundedRectangle",
                        {   name: "SHAPE",
                            fill: ActivityNodeFill,
                            stroke: ActivityNodeStroke,
                            parameter1: 10 // corner size
                        },
                        new go.Binding("fill", "color"),
                        new go.Binding("strokeWidth", "isCall", function(s) {
                            return s ? ActivityNodeStrokeWidthIsCall : ActivityNodeStrokeWidth; })
                    )
                ),  // end main body rectangles spot panel
                $(go.TextBlock,
                    {    alignment: go.Spot.Center, textAlign: "center",
                        margin: 12, editable: false
                    },
                    new go.Binding("text","name").makeTwoWay())
            ),
            makePort("T", go.Spot.Top, true, true),
            makePort("L", go.Spot.Left, true, true),
            makePort("R", go.Spot.Right, true, true),
            makePort("B", go.Spot.Bottom, true, true)
        );


  // ------------------------------- template for Activity / Task node in Palette  -------------------------------
  var palscale = 2;
    var taskNodeTemplateForPalette =
        $(go.Node, "Vertical",
            {   locationObjectName: "SHAPE",
                locationSpot: go.Spot.Center,
                selectionAdorned: false
            },
            $(go.Panel, "Spot",

                {   name: "PANEL",
                    desiredSize: new go.Size(ActivityNodeWidthForPalette / palscale, ActivityNodeHeightForPalette / palscale)
                },

                $(go.Shape, "RoundedRectangle",  // the outside rounded rectangle
                    {   name: "SHAPE",
                        fill: ActivityNodeFill,
                        stroke: ActivityNodeStroke,
                        strokeWidth: ActivityNodeStrokeWidth,
                        parameter1: 10 / palscale  // corner size (default 10)
                    }),

                $(go.Shape, "RoundedRectangle",  // the inner "Transaction" rounded rectangle
                    {   margin: 3,
                        stretch: go.GraphObject.Fill,
                        stroke: ActivityNodeStroke,
                        parameter1: 8 / palscale,
                        fill: null,
                        visible: false
                    },
                    new go.Binding("visible", "isTransaction")),

                $(go.Shape, "BpmnTaskScript",    // will be None, Script, Manual, Service, etc via converter
                    {   alignment: new go.Spot(0, 0, 5, 5),
                        alignmentFocus: go.Spot.TopLeft,
                        width: 22 / palscale,
                        height: 22 / palscale
                    },
                    new go.Binding("fill", "gType", nodeActivityTaskTypeColorConverter),
                    new go.Binding("figure", "gType", nodeActivityTaskTypeConverter))
            ), // End Spot panel
            $(go.TextBlock,
                { alignment: go.Spot.Center, textAlign: "center", margin: 8 },
                  new go.Binding("text","name"))
        );  // End Task Node

    var subProcessGroupTemplateForPalette =
    $(go.Group, "Vertical",
        {   locationObjectName: "SHAPE",
            locationSpot: go.Spot.Center,
            isSubGraphExpanded: false,
            selectionAdorned: false
        },
        $(go.Panel, "Spot",
            {   name: "PANEL",
                desiredSize: new go.Size(ActivityNodeWidth / palscale, ActivityNodeHeight / palscale)
            },
            $(go.Shape, "RoundedRectangle",  // the outside rounded rectangle;
                { name: "SHAPE",
                    fill: ActivityNodeFill, stroke: ActivityNodeStroke,
                    strokeWidth: ActivityNodeStrokeWidth,
                    parameter1: 10 / palscale  // corner size (default 10)
                }
            ),
            $(go.Shape, "RoundedRectangle",  // the inner "Transaction" rounded rectangle
                {   margin: 3,
                    stretch: go.GraphObject.Fill,
                    stroke: ActivityNodeStroke,
                    parameter1: 8 / palscale, fill: null, visible: false
                },
                new go.Binding("visible", "isTransaction")),
            $(go.Panel, "Horizontal",
                {
                    alignment: go.Spot.MiddleBottom,
                    alignmentFocus: go.Spot.MiddleBottom
                },
                makeSubButton(true)
            )// end activity markers horizontal panel
        ), // end main body rectangles spot panel
        $(go.TextBlock,  // the center text
            { alignment: go.Spot.Center, textAlign: "center", margin: 8 },
            new go.Binding("text", "name"))
    );  // end go.Group

    var callActivityGroupTemplateForPalette =
        $(go.Group, "Vertical",
            {   locationObjectName: "SHAPE",
                locationSpot: go.Spot.Center,
                isSubGraphExpanded: false,
                selectionAdorned: false
            },
            $(go.Panel, "Spot",
                {   name: "PANEL",
                    desiredSize: new go.Size(ActivityNodeWidth / palscale, ActivityNodeHeight / palscale)
                },
                $(go.Shape, "RoundedRectangle",  // the outside rounded rectangle;
                    { name: "SHAPE",
                        fill: ActivityNodeFill, stroke: ActivityNodeStroke,
                        strokeWidth: ActivityNodeStrokeWidthIsCall,
                        parameter1: 10 / palscale  // corner size (default 10)
                    }
                ),
                $(go.Shape, "RoundedRectangle",  // the inner "Transaction" rounded rectangle
                    {   margin: 3,
                        stretch: go.GraphObject.Fill,
                        stroke: ActivityNodeStroke,
                        parameter1: 8 / palscale, fill: null, visible: false
                    },
                    new go.Binding("visible", "isTransaction")),
                $(go.Panel, "Horizontal",
                    {
                        alignment: go.Spot.MiddleBottom,
                        alignmentFocus: go.Spot.MiddleBottom
                    },
                    makeSubButton(false)
                )// end activity markers horizontal panel
            ), // end main body rectangles spot panel
            $(go.TextBlock,  // the center text
                { alignment: go.Spot.Center, textAlign: "center", margin: 8 },
                new go.Binding("text", "name"))
        );  // end go.Group

    var serviceAndModelNodeTemplateForPalette =
        $(go.Node, "Vertical",
            {   locationObjectName: "SHAPE",
                locationSpot: go.Spot.Center,
                selectionAdorned: false
            },
            $(go.Panel, "Spot",
                {   name: "PANEL",
                    desiredSize: new go.Size(ActivityNodeWidthForPalette / palscale, ActivityNodeHeightForPalette / palscale)
                },
                $(go.Shape, "RoundedRectangle",  // the outside rounded rectangle
                    {   name: "SHAPE", fill: ActivityNodeFill,
                        stroke: ActivityNodeStroke, strokeWidth: ActivityNodeStrokeWidth,
                        parameter1: 10 / palscale  // corner size (default 10)
                    })
            ),
            $(go.TextBlock,
                { alignment: go.Spot.Center, textAlign: "center", margin: 8 },
                new go.Binding("text","name"))
        );

  //------------------------------------------  Event Nodes(Start¡¢End Event) Template  ----------------------------------------------
  var eventNodeTemplate =
    $(go.Node, "Spot",
      { locationObjectName: "SHAPE",
        locationSpot: go.Spot.Center,
        selectionAdorned: false,
        resizable: false,
        resizeObjectName: "SHAPE",
        doubleClick: function(e,obj){ addConfiguration(obj);},
        mouseEnter: function(e,obj){showPorts(obj.part, true);},
        mouseLeave: function(e,obj){showPorts(obj.part, false);}
      },
      new go.Binding("location", "loc", toLocation).makeTwoWay(fromLocation),
      // move a selected part into the Foreground layer, so it isn't obscured by any non-selected parts
      new go.Binding("layerName", "isSelected", function(s) { return s ? "Foreground" : ""; }).ofObject(),

        $(go.Panel, "Spot",
          $(go.Shape, "Circle",  // Outer circle
            { name: "SHAPE", strokeWidth: 1,
              desiredSize: new go.Size(EventNodeSize, EventNodeSize)
            },
            // allows the color to be determined by the node data
            new go.Binding("fill", "gType", function(s) {
                if(s === 2 || s === 4) { return EmptyEventBackgroundColor; }
                else { return (s === 8) ? EventEndOuterFillColor : EventBackgroundColor; }}),
            new go.Binding("strokeWidth", "gType", function(s) {
                return s === 8 ? EventNodeStrokeWidthIsEnd : 1; }),
            new go.Binding("stroke", "gType", nodeEventDimensionStrokeColorConverter),
            //new go.Binding("strokeDashArray", "eventDimension", function(s) {
            //    return (s === 3 || s === 6) ? [4, 2] : null; }),
            new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify)
          ),  // end main shape

          $(go.Shape, "Circle",  // Inner circle
              { alignment: go.Spot.Center, desiredSize: new go.Size(EventNodeInnerSize, EventNodeInnerSize), fill: null },
              new go.Binding("stroke", "gType", nodeEventDimensionStrokeColorConverter),
              new go.Binding("strokeDashArray", "gType", function(s) {
                  return (s === 3 || s === 6) ? [4, 2] : null; }), // dashes for non-interrupting
              new go.Binding("visible", "gType", function(s) { return s > 3 && s <= 7; }) // inner  only visible for 4 thru 7
            ),
          $(go.Shape, "NotAllowed",
              { alignment: go.Spot.Center, desiredSize: new go.Size(EventNodeSymbolSize, EventNodeSymbolSize), stroke: "black" },
                // nodeEventTypeConverterº¯ÊýµÄ²ÎÊýÊÇeventType£¬º¯Êý·µ»ØÖµÎªÊÂ¼þµÄÐÎ×´¡£¸ù¾ÝÊÂ¼þÀàÐÍ£¨eventType£©¾ö¶¨ÊÂ¼þµÄÐÎ×´
                new go.Binding("figure", "gType", nodeEventTypeConverter),
                // ¸ù¾ÝnodeEventDimensionSymbolFillConverterº¯Êý·µ»ØÖµ¾ö¶¨Ìî³äÑÕÉ«
                new go.Binding("fill", "gType", nodeEventDimensionSymbolFillConverter)
            )
        ),  // end Auto Panel
        $(go.TextBlock,
          { alignment:  new go.Spot(0.5,1.2), textAlign: "center", margin: 5, editable: false },
          new go.Binding("text", "name").makeTwoWay()),

        makePort("T", go.Spot.Top, true, true),
        makePort("L", go.Spot.Left, true, true),
        makePort("R", go.Spot.Right, true, true),
        makePort("B", go.Spot.Bottom, true, true)
      );

    var eventNodeTemplateForPalette =
        $(go.Node, "Vertical",
            {   locationObjectName: "SHAPE",
                locationSpot: go.Spot.Center,
                selectionAdorned: false
            },
            $(go.Panel, "Spot",
                $(go.Shape, "Circle",  // Outer circle
                    {   name: "SHAPE",  strokeWidth: 1,
                        desiredSize: new go.Size(EventNodeSize, EventNodeSize)
                    },
                    // allows the color to be determined by the node data
                    new go.Binding("fill", "gType", function(s) {
                        if(s === 2 || s === 4) { return EmptyEventBackgroundColor; }
                        else { return (s === 8) ? EventEndOuterFillColor : EventBackgroundColor; } } ),
                    new go.Binding("strokeWidth", "gType", function(s) { return s === 8 ? EventNodeStrokeWidthIsEnd : 1; }),
                    new go.Binding("stroke", "gType", nodeEventDimensionStrokeColorConverter),
                  //  new go.Binding("strokeDashArray", "eventDimension", function(s) { return (s === 3 || s === 6) ? [4, 2] : null; }),
                    new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify)
                ),  // end main shape

                $(go.Shape, "Circle",  // Inner circle
                    { alignment: go.Spot.Center, desiredSize: new go.Size(EventNodeInnerSize, EventNodeInnerSize), fill: null },
                    new go.Binding("stroke", "gType", nodeEventDimensionStrokeColorConverter),
                    new go.Binding("strokeDashArray", "gType", function(s) {
                        return (s === 3 || s === 6) ? [4, 2] : null; }), // dashes for non-interrupting
                    new go.Binding("visible", "gType", function(s) { return s > 3 && s <= 7; }) // inner  only visible for 4 thru 7
                ),

                $(go.Shape, "NotAllowed",
                    { alignment: go.Spot.Center, desiredSize: new go.Size(EventNodeSymbolSize, EventNodeSymbolSize), stroke: "black" },
                    // nodeEventTypeConverterº¯ÊýµÄ²ÎÊýÊÇeventType£¬º¯Êý·µ»ØÖµÎªÊÂ¼þµÄÐÎ×´¡£¸ù¾ÝÊÂ¼þÀàÐÍ£¨eventType£©¾ö¶¨ÊÂ¼þµÄÐÎ×´
                    new go.Binding("figure", "gType", nodeEventTypeConverter),
                    new go.Binding("fill", "gType", nodeEventDimensionSymbolFillConverter)
                )
            ),  // end Auto Panel
            $(go.TextBlock,
                { alignment:  go.Spot.Center, textAlign: "center", margin: 8, editable: false },
                new go.Binding("text","name").makeTwoWay())
        );

  //------------------------------------------  Gateway Nodes Template   ----------------------------------------------
  function nodeGatewaySymbolTypeConverter(s) {
    var tasks =  ["NotAllowed",
                  "ThinCross",      // 1 - Parallel
                  "Circle",         // 2 - Inclusive
                  "AsteriskLine",   // 3 - Complex
                  "ThinX",          // 4 - Exclusive  (exclusive can also be no symbol, just bind to visible=false for no symbol)
                  "Pentagon",       // 5 - double cicle event based gateway   Îå±ßÐÎ
                  "Pentagon",       // 6 - exclusive event gateway to start a process (single circle)
                  "ThickCross"]     // 7 - parallel event gateway to start a process (single circle)
    if (s < tasks.length) return tasks[s];
    return "NotAllowed"; // error
  }

  // tweak the size of some of the gateway icons
  function nodeGatewaySymbolSizeConverter(s) {
    var size = new go.Size(GatewayNodeSymbolSize, GatewayNodeSymbolSize);
    if (s === 4) {
      size.width = size.width / 4 * 3;
      size.height = size.height / 4 * 3;
    }
    else if (s > 4) {
      size.width = size.width / 1.6;
      size.height = size.height / 1.6;
    }
    return size;
  }

  function nodePalGatewaySymbolSizeConverter(s) {
    var size = nodeGatewaySymbolSizeConverter(s);
    size.width = size.width / 2;
    size.height = size.height / 2;
    return size;
  }

  var gatewayNodeTemplate =
    $(go.Node, "Spot",
      { locationObjectName: "SHAPE",
        locationSpot: go.Spot.Center,
        selectionAdorned: false,
        resizable: false,
        resizeObjectName: "SHAPE",
        mouseEnter: function(e,obj){showPorts(obj.part, true); },
        mouseLeave: function(e,obj){showPorts(obj.part, false); }
      },
      new go.Binding("location", "loc", toLocation).makeTwoWay(fromLocation),
      // move a selected part into the Foreground layer, so it isn't obscured by any non-selected parts
      new go.Binding("layerName", "isSelected", function(s) { return s ? "Foreground" : ""; }).ofObject(),

        $(go.Panel, "Spot",
          $(go.Shape, "Diamond",     // ÁâÐÎ
            { name: "SHAPE", strokeWidth: 1, fill: GatewayNodeFill, stroke: GatewayNodeStroke,
              desiredSize: new go.Size(GatewayNodeSize, GatewayNodeSize)
              //portId: "", cursor: "pointer",  fromLinkable: true, toLinkable: true,
              //fromSpot: go.Spot.NotLeftSide, toSpot: go.Spot.MiddleLeft
            },
            new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify)),

          // Gateway ½áµãÖÐ¼äÇ¶Ì×µÄÍ¼ÐÎ£¨Symbol£©µÄÐÎ×´
          $(go.Shape, "NotAllowed",
              { alignment: go.Spot.Center, stroke: GatewayNodeSymbolStroke, fill: GatewayNodeSymbolFill },
                new go.Binding("figure", "gType", nodeGatewaySymbolTypeConverter),
                new go.Binding("strokeWidth", "gType", function(s) {
                    return (s <=4 ) ? GatewayNodeSymbolStrokeWidth : 1; }),
                new go.Binding("desiredSize", "gType", nodeGatewaySymbolSizeConverter)),

          // the next 2 circles only show up for event gateway
          $(go.Shape, "Circle",  // Outer circle
            { strokeWidth: 1, stroke: GatewayNodeSymbolStroke, fill: null, desiredSize: new go.Size(EventNodeSize, EventNodeSize)
            },
            new go.Binding("visible", "gType", function(s) { return s >= 5; }) // only visible for > 5
          ),  // end main shape

          $(go.Shape, "Circle",  // Inner circle
              { alignment: go.Spot.Center, stroke: GatewayNodeSymbolStroke,
                desiredSize: new go.Size(EventNodeInnerSize, EventNodeInnerSize),
                fill: null },
              new go.Binding("visible", "gType", function(s) { return s === 5; }) // inner  only visible for == 5
            )
         ),
        $(go.TextBlock,
          { alignment: new go.Spot(0.5, 1.1), textAlign: "center", margin: 5, editable: false },
          new go.Binding("text", "name").makeTwoWay()),

        makePort("T", go.Spot.Top, true, true),
        makePort("L", go.Spot.Left, true, true),
        makePort("R", go.Spot.Right, true, true),
        makePort("B", go.Spot.Bottom, true, true)
      );

  var gatewayNodeTemplateForPalette =
    $(go.Node, "Vertical",
      {   locationObjectName: "SHAPE",
          locationSpot: go.Spot.Center,
          selectionAdorned: false
      },

      $(go.Panel, "Spot",
         // Use the Shape class to paint a geometrical figure(Ê¹ÓÃShapeÀàÀ´»­¼¸ºÎÍ¼ÐÎ)
        $(go.Shape, "Diamond",
          { strokeWidth: 1, fill: GatewayNodeFill, stroke: GatewayNodeStroke, name: "SHAPE",
            desiredSize: new go.Size(GatewayNodeSize / 2, GatewayNodeSize / 2)
          }),

        $(go.Shape, "NotAllowed",
            {   alignment: go.Spot.Center, stroke: GatewayNodeSymbolStroke,
                strokeWidth: GatewayNodeSymbolStrokeWidth, fill: GatewayNodeSymbolFill
            },
              new go.Binding("figure", "gType", nodeGatewaySymbolTypeConverter),
              new go.Binding("strokeWidth", "gType", function(s) { return (s <=4 ) ? GatewayNodeSymbolStrokeWidth : 1; }),
              new go.Binding("desiredSize", "gType", nodePalGatewaySymbolSizeConverter)),

          // the next 2 circles only show up for event gateway
          $(go.Shape, "Circle",  // Outer circle
            {   stroke: GatewayNodeSymbolStroke, strokeWidth: 1,  fill: null,
                desiredSize: new go.Size(EventNodeSize/2, EventNodeSize/2)
            },

            new go.Binding("visible", "gType", function(s) { return s >= 5; }) // only visible for > 5
          ),  // end main shape

          $(go.Shape, "Circle",  // Inner circle
              { alignment: go.Spot.Center, stroke: GatewayNodeSymbolStroke,
                desiredSize: new go.Size(EventNodeInnerSize/2, EventNodeInnerSize/2), fill: null
              },
              new go.Binding("visible", "gType", function(s) { return s === 5; }) // inner  only visible for == 5
            )),
          $(go.TextBlock,
              { alignment: go.Spot.Center, textAlign: "center", margin: 8, editable: false },
              new go.Binding("text", "name"))
    );

    //----------------------------nodeTemplate for nodes in Palette2 -------------------------------

    var lightNodeTemplate =
        $(go.Node, "Spot",    // Node(type)£º¹¹ÔìÒ»¸ö¿ÕµÄNode½áµã¡£type£ºcontrols how the Panel's elements are measured and arranged.
            {   locationObjectName: "SHAPE",
                locationSpot: go.Spot.Center,
                resizable: true,   // µã»÷½áµãÊ±£¬½áµãÉÏ»áÏÔÊ¾°Ë¸öhandles(ÓÃÓÚµ÷Õû½áµãµÄ´óÐ¡).
                resizeObjectName: "PANEL",
                selectionAdorned: false,  // use a Binding on the Shape.stroke to show selection
                doubleClick: function(e,obj){addLightConfiguration(obj);},
                mouseEnter: function (e,obj) {showPorts(obj.part, true);},
                mouseLeave: function (e,obj) {showPorts(obj.part, false)}
            },
            new go.Binding("location", "loc", toLocation).makeTwoWay(fromLocation),
            new go.Binding("layerName", "isSelected", function(s) { return s ? "Foreground" : ""; }).ofObject(),

            $(go.Panel, "Auto",

                {   name: "PANEL",
                    minSize: new go.Size(ActivityNodeWidth, ActivityNodeHeight),
                    desiredSize: new go.Size(ActivityNodeWidth, ActivityNodeHeight) },
                new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
                $(go.Panel, "Spot",
                    $(go.Shape, "RoundedRectangle",
                        {   name: "SHAPE",
                            fill: ActivityNodeFill,
                            stroke: ActivityNodeStroke,
                            parameter1: 10 // corner size
                        },
                        new go.Binding("fill", "color"),
                        new go.Binding("strokeWidth", "isCall", function(s) {
                            return s ? ActivityNodeStrokeWidthIsCall : ActivityNodeStrokeWidth; })
                    )
                ),  // end main body rectangles spot panel
                $(go.TextBlock,
                    {    alignment: go.Spot.Center, textAlign: "center",
                         margin: 12, editable: false
                    },
                    new go.Binding("text","name").makeTwoWay())
            ),
            makePort("T", go.Spot.Top, true, true),
            makePort("L", go.Spot.Left, true, true),
            makePort("R", go.Spot.Right, true, true),
            makePort("B", go.Spot.Bottom, true, true)
        ); // end go.Node Vertical

    var lightNodeTemplateForPalette =
        $(go.Node, "Spot",
            {   locationObjectName: "SHAPE",
                locationSpot: go.Spot.Center,
                selectionAdorned: false
            },
            $(go.Panel, "Spot",
                {   name: "PANEL",
                    desiredSize: new go.Size(ActivityNodeWidthForPalette / palscale, ActivityNodeHeightForPalette / palscale)
                },
                $(go.Shape, "RoundedRectangle",  // the outside rounded rectangle
                    {   name: "SHAPE", fill: ActivityNodeFill,
                        stroke: ActivityNodeStroke, parameter1: 10 / palscale  // corner size (default 10)
                    },
                    new go.Binding("strokeWidth", "isCall",  function(s) {
                        return s ? ActivityNodeStrokeWidthIsCall : ActivityNodeStrokeWidth; }))
            ),
            $(go.TextBlock,
                { alignment: new go.Spot(0.5,0.5), textAlign: "center", margin: 8 },
                new go.Binding("text","name"))
        );

    // ±ß½çÊÂ¼þµ¥¶À³ÉÒ»¸ö½Úµã¡ª¡ª¶ÔÓ¦µÄÍ¼±ê£¨ÔÚdiagramÖÐ²»¿É¼û£©
    var invisibleNodeTemplate =
        $(go.Node, "Spot",
          $(go.Panel, "Spot",
            new go.Binding("visible", "gType", function(s) {return s < 0;})
          ));

  //------------------------------------------ Node Template Maps  ----------------------------------------------

  var nodeTemplateMap = new go.Map("string", go.Node);
  nodeTemplateMap.add("task", taskNodeTemplate);
  nodeTemplateMap.add("event", eventNodeTemplate);
  nodeTemplateMap.add("zgateway",gatewayNodeTemplate);
  nodeTemplateMap.add("exTask",lightNodeTemplate);
  nodeTemplateMap.add("bEvent", invisibleNodeTemplate);

  nodeTemplateMap.add("p-service", serviceNodeTemplate);
  nodeTemplateMap.add("model", modelNodeTemplate);
  nodeTemplateMap.add("r-application", applicationNodeTemplate);
  nodeTemplateMap.add("resultAnalysis", testResultAnalysisNodeTemplate);

  var groupTemplateMap = new go.Map("string", go.Group);
  groupTemplateMap.add("s-subprocess", subProcessGroupTemplate);
  groupTemplateMap.add("s-callactivity", callActivityTemplate);

  // create the nodeTemplateMap, holding special palette "mini" node templates:
  var palNodeTemplateMap = new go.Map("string", go.Node);
  palNodeTemplateMap.add("task", taskNodeTemplateForPalette);
  palNodeTemplateMap.add("event", eventNodeTemplateForPalette);
  palNodeTemplateMap.add("zgateway", gatewayNodeTemplateForPalette);
  palNodeTemplateMap.add("exTask",lightNodeTemplateForPalette);
  palNodeTemplateMap.add("bEvent", invisibleNodeTemplate);

  palNodeTemplateMap.add("p-service", serviceAndModelNodeTemplateForPalette);
  palNodeTemplateMap.add("model", serviceAndModelNodeTemplateForPalette);
  palNodeTemplateMap.add("r-application", serviceAndModelNodeTemplateForPalette);
  palNodeTemplateMap.add("resultAnalysis", serviceAndModelNodeTemplateForPalette);

  var palGroupTemplateMap = new go.Map("string", go.Group);
  palGroupTemplateMap.add("s-subprocess", subProcessGroupTemplateForPalette);
  palGroupTemplateMap.add("s-callactivity", callActivityGroupTemplateForPalette);

  //----------------------------------------------------  Link Templates   ---------------------------------------------------

  // template for link from exclusive gateway
  var exGatewayLinkTemplate =
        $(go.Link,
            {
                routing: go.Link.AvoidsNodes,
                curve: go.Link.JumpOver,
                corner: 5,
                reshapable: true,
                relinkableFrom: true,  relinkableTo: true,
                resegmentable: true,  // add/remove segments from links.µã»÷Á¬ÏßÊ±Á¬ÏßÉÏÏÔÊ¾µÄÐ¡ÁâÐÎ
                toEndSegmentLength: 20,
                doubleClick: function(e,obj){addLinkConfiguration(obj);},
                // mouse-overs subtly highlight links:
                mouseEnter: function(e, link) { link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)"; },
                mouseLeave: function(e, link) { link.findObject("HIGHLIGHT").stroke = "transparent"; }
            },
            new go.Binding("points").makeTwoWay(),
            $(go.Shape,      // the highlight shape, normally transparent
                { isPanelMain: true, strokeWidth: 8, stroke: "transparent", name: "HIGHLIGHT"}),
            $(go.Shape, { isPanelMain: true, stroke: "black", strokeWidth: 1 }),
            $(go.Shape, { toArrow: "Standard", scale: 1.2, fill: "black", stroke: null }),
            $(go.Shape, { fromArrow: "", scale: 1.5, stroke: "black", fill: "white" },
                new go.Binding("fromArrow", "isDefault", function(s) {
                    if (s){ return "BackSlash"; }
                    return ""; }),
                new go.Binding("segmentOffset", "isDefault", function(s) {
                    return s ? new go.Point(3, 0) : new go.Point(0, 0);
                })),
            $(go.TextBlock,
                { editable: false,
                  segmentOffset: new go.Point(-10, -10),
                  visible: true },
                new go.Binding("text","condition").makeTwoWay())
        );

  var sequenceLinkTemplate =
    $(go.Link,
        {
            routing: go.Link.AvoidsNodes,
            curve: go.Link.JumpOver,
            corner: 5,
            relinkableFrom: true, // ÒÑ¾­´æÔÚµÄÁ¬ÏßµÄ¶Ëµã¿ÉÒÔ¸Ä±ä£¨Ä¬ÈÏÖµÎªfalse£¬´ËÊ±Á¬ÏßµÄÆðÊ¼½áµã²»ÄÜ¸Ä±ä£¬½áÊø½áµã¿ÉÒÔ¸Ä±ä£©
            relinkableTo: true,   // Ä¬ÈÏÖµÎªfalse£¬´ËÊ±£¬Á¬ÏßµÄÆðÊ¼½áµã¿ÉÒÔ¸Ä±ä£¬½áÊø½áµã²»¿É±ä
            reshapable: true,
            resegmentable: true,
            toEndSegmentLength: 20,
            // mouse-overs subtly highlight links:
            mouseEnter: function(e, link) { link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)"; },
            mouseLeave: function(e, link) { link.findObject("HIGHLIGHT").stroke = "transparent"; }
        },
      new go.Binding("points").makeTwoWay(),
      $(go.Shape,      // the highlight shape, normally transparent
          { isPanelMain: true, strokeWidth: 8, stroke: "transparent", name: "HIGHLIGHT"}),
      $(go.Shape,      // the link path shape
          { isPanelMain: true, stroke: "black", strokeWidth: 1 }),
      $(go.Shape, { toArrow: "Standard", scale:1.2, fill: "black", stroke: null })

    );

  var linkTemplateMap = new go.Map("string", go.Link);
    linkTemplateMap.add("zgateway", exGatewayLinkTemplate);
    linkTemplateMap.add("", sequenceLinkTemplate);  // default

  //------------------------------------------the main Diagram----------------------------------------------

  window.myDiagram =
    $(go.Diagram, "myDiagram",
      {
        initialContentAlignment: go.Spot.Center,
        nodeTemplateMap: nodeTemplateMap,
        linkTemplateMap: linkTemplateMap,
        groupTemplateMap: groupTemplateMap,

        allowDrop: true,  // accept drops from palette
        "LinkRelinked": showLinkLabel,     // this DiagramEvent listener is defined below
        "undoManager.isEnabled": true,

        // CommandHandler¶ÔÏóÎªDiagramÌí¼ÓÒ»Ð©¼üÅÌÃüÁî£¬Èçµã»÷Delete¼üÉ¾³ýÔªËØ£¬Ctrl+C¸´ÖÆ£¬Ctrl+VÕ³Ìù£¬Ctrl+Z³·ÏúµÈ
          commandHandler: new DrawCommandHandler(),  // defined in DrawCommandHandler.js
          "commandHandler.arrowKeyBehavior": "move",  // default to having arrow keys move selected nodes

        mouseDrop: function(e) {
          // when the selection is dropped in the diagram's background,
          // make sure the selected Parts no longer belong to any Group
          var ok = myDiagram.commandHandler.addTopLevelParts(myDiagram.selection, true);
          if (!ok) myDiagram.currentTool.doCancel();
        },

        linkingTool: new BPMNLinkingTool(), // defined in BPMNClasses.js
        // set these kinds of Diagram properties after initialization, not now
        "InitialLayoutCompleted": loadDiagramProperties,  // defined below
        "SelectionMoved": relayoutDiagram,  // defined below
        "SelectionCopied": relayoutDiagram
      }
     );

    myDiagram.toolManager.mouseDownTools.insertAt(0, new LaneResizingTool());

    myDiagram.model.copiesArrays = true;
    myDiagram.model.copiesArrayObjects = true;
    myDiagram.model.linkFromPortIdProperty = "fromPort";
    myDiagram.model.linkToPortIdProperty = "toPort";

    myDiagram.model.setDataProperty(myDiagram.model.modelData, "isMultiple", false);

    myDiagram.addDiagramListener("LinkDrawn", function(e) {

       var label = e.subject.findObject("LABEL");
        if(label !== null){
            label.visible = (e.subject.fromNode.data.figure === "Diamond");
        }
        var linkId = createUUID();
        // ÎªÂ·¾¶Ìí¼ÓÂ·¾¶Id
        myDiagram.model.setDataProperty(e.subject.data, "tId", linkId);

    if (e.subject.fromNode.category === "zgateway") {
      e.subject.category = "zgateway";
    }
  });

    myDiagram.addDiagramListener("SubGraphCollapsed", function(e){
        e.subject.each(function(group){
            if(!(group instanceof go.Group)) return;
            currentSize = group.findObject("SHAPE").desiredSize;
            group.findObject("SHAPE").desiredSize = new go.Size(ActivityNodeWidth, ActivityNodeHeight);
        });
    });

    myDiagram.addDiagramListener("SubGraphExpanded", function(e){
        e.subject.each(function(group){
            if(!(group instanceof go.Group)) return;

            if(currentSize != "undefined" && currentSize != go.Size(NaN, NaN)){
                group.findObject("SHAPE").desiredSize = currentSize;
            }
        });
    });

    function showLinkLabel(e) {
        var label = e.subject.findObject("LABEL");
        if(label !== null){
            label.visible = (e.subject.fromNode.data.figure === "Diamond");
        }
    }
    //temporary links used by LinkingTool are also orthogonal:
    myDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;

    //----------------------------------------------------------------  Palette   ------------------------------------------------------------

    // Make sure the pipes are ordered by their key in the palette inventory
    // keyCompareµÄÁ½¸ö²ÎÊý´ú±íÁ½¸ö²»Í¬µÄpart¡£
    function keyCompare(a, b) {
      var at = a.data.category;
      var bt = b.data.category;
      if (at < bt) return -1;
      if (at > bt) return 1;
      return 0;
    }

    var myPaletteLevel1 =
      $(go.Palette, "myPaletteLevel1",
        { nodeTemplateMap: palNodeTemplateMap,
          groupTemplateMap: palGroupTemplateMap,
          layout: $(go.GridLayout,
                    {cellSize: new go.Size(1, 1),
                     spacing: new go.Size(15, 15),
                     wrappingColumn: 1,       // Ê¼ÖÕÔÚÒ»ÁÐÉÏÏÔÊ¾Í¼±ê£¬²»»»ÁÐ
                     comparer: keyCompare      // comparer: Gets or sets the comparison function used to sort the parts.£¨¹æ¶¨ÅÅÐò·½Ê½£©
                    })
        }
      );

    var myPaletteLevel2 =
      $(go.Palette, "myPaletteLevel2",
         {nodeTemplateMap: palNodeTemplateMap,
          layout: $(go.GridLayout,
              {
                  cellSize: new go.Size(1, 1),
                  spacing: new go.Size(15, 15),
                  wrappingColumn: 1,
                  comparer: keyCompare
              })
         });

    // #id: idÑ¡ÔñÆ÷¡£  .class: classÑ¡ÔñÆ÷
   jQuery("#accordion").accordion({
      activate: function(event, ui) {
        myPaletteLevel1.requestUpdate();
        myPaletteLevel2.requestUpdate();
      }
    });

   myPaletteLevel1.model = $(go.GraphLinksModel,
    {
      nodeDataArray: [
        { key: createUUID(), nType: "start", category: "event", name: "¿ªÊ¼", desc: "", nConfig: {},gType: 1},
        { key: createUUID(), nType: "end", category: "event", name: "½áÊø", desc: "", nConfig: {}, gType: 8},
        { key: createUUID(), nType: "event", category: "event", name: "¶¨Ê±ÊÂ¼þ", desc: "", gType: 3,
          nConfig: {
                  eId: "", eName: "", eDesc: "", type: "timer",
                  config: { timer: "*/20 * * * * ?" }
          }
        },

        { key: createUUID(), nType: "event", category: "event", name: "Éè±¸ÊÂ¼þ", desc: "", gType: 4,
          nConfig: {
                  eId: "", eName: "", eDesc: "", type: "device",
                  config: { deviceId: "123456",  deviceCmd: 8907 }
          }
        },

       { key: createUUID(), nType: "activity", category: "p-service", name: "·þÎñ", desc: "", gType:0,
         nConfig:{
                 aId: "", aName: "", aDesc: "", type: "task", behavior: "immediate", userId: "",
                 config: {
                     tType: "ServiceTask",
                     taskArgs: { serviceId: "" , cmd: ""}
                 }
         }
       },

       { key: createUUID(), nType: "activity", category: "model", name: "Ä£ÐÍ", desc: "", gType:0,
         nConfig:{
                 aId: "", aName: "", aDesc: "", type: "task", behavior: "immediate", userId: "",
                 config: {
                     tType: "ModelTask",
                     taskArgs: { modelId: "", cmd: "" }
                 }
         }
       },

       { key: createUUID(), nType: "activity", category: "r-application", name: "Ó¦ÓÃ", desc: "", gType: 0,
         nConfig: {
             aId: "", aName: "", aDesc: "", type: "task", behavior: "immediate", userId: "",
             config: {
                 tType: "ApplicationTask",
                 taskArgs: { applicationId: "abcdef", cmd: ""}
             }
         }},

       { key: createUUID(), nType: "activity", category: "resultAnalysis", name: "½á¹û·ÖÎö", desc: "", gType: 0,
         nConfig:{
                 aId: "", aName: "", aDesc: "", type: "task", behavior: "immediate", userId: "",
                 config: {
                     tType: "AnalysisTask",
                     taskArgs: { resultId: "", analysis: ""}
                 }
         }
       },

       { key: createUUID(), nType: "activity", category: "task", name: "Éè±¸ÈÎÎñ", desc: "", gType: 4,
          nConfig: {
                  aId: "", aName: "", aDesc: "", type: "task", userId: "",
                  behavior: "immediate", behaviorConfig: {exeTimes: 4, cron: "*/20 * * * * ?"},
                  config: {
                      tType: "DanaleDeviceTask",
                      taskArgs: {
                          userId: "skdjfhw23", userPass: "1232321",
                          cmd: "IotRunCmd", appDid: "xxxxxxx", appCore: 2, coreCode: "8888888888",
                          deviceId: "10002AXG", subDevId: "10002AXG", cmdId: "" + 903501,
                          argInt32: [1], argDouble: [0], argString: [0], argByte: "",
                          page: 0, pageSize: 0
                      }
                  }
          }
        },

        { key: createUUID(), nType: "activity", category: "task", name: "½Å±¾ÈÎÎñ", desc: "", gType: 3,
          nConfig: {
                  aId: "", aName: "", aDesc: "", type: "task", userId: "",
                  behavior: "immediate", behaviorConfig: {exeTimes: 4, cron: "*/20 * * * * ?"},
                  config: {
                      tType: "ScriptTask",
                      taskArgs: {
                          userId: "skdjfhw23", userPass: "1232321",
                          cmd: "IotRunCmd", appDid: "xxxxxxx", appCore: 2, coreCode: "8888888888",
                          deviceId: "10002AXG", subDevId: "10002AXG", cmdId: "" + 903501,
                          argInt32: [1], argDouble: [0], argString: [0], argByte: "",
                          page: 0, pageSize: 0
                      }
                  }
          }
        },

        { key: createUUID(), nType: "activity", category: "task", name: "ÈË¹¤ÈÎÎñ", desc: "", gType: 2,
          nConfig: {
                  aId: "", aName: "", aDesc: "", type: "task", userId: "",
                  behavior: "immediate", behaviorConfig: { exeTimes: 4, cron: "*/20 * * * * ?"},
                  config: {
                      tType: "UserTask",
                      taskArgs :{
                          userId: "skdjfhw23", userPass: "1232321",
                          cmd: "IotRunCmd", appDid: "xxxxxxx", appCore: 2, coreCode: "8888888888",
                          deviceId: "10002AXG", subDevId:"10002AXG", cmdId: "" +903501,
                          argInt32:[1], argDouble:[0], argString:[0], argByte: "",
                          page: 0, pageSize: 0  }
                  }
          }
        },

        { key: createUUID(), nType: "activity", category: "s-subprocess", name: "×ÓÁ÷³Ì", desc: "",
          isGroup: true, isSubProcess: true, gType: 0,
            nConfig: {
                    aId: "", aName: "", aDesc: "", type: "subProcess", userId: "",
                    behavior: "immediate", behaviorConfig: { exeTimes: 4, cron: "*/20 * * * * ?"},
                    config: { groupId: ""}
            }
        },

        { key: createUUID(), nType: "activity", category: "s-callactivity", name: "µ÷ÓÃ»î¶¯", desc: "",
          isGroup: true, isSubProcess: true, gType: 0,
          nConfig: {
                  aId: "", aName: "", aDesc: "", type: "callActivity", userId: "",
                  behavior: "immediate", behaviorConfig: { exeTimes: 4, cron: "*/20 * * * * ?"},
                  config: { callId: ""}
          }
        },

        { key: createUUID(), nType: "gateway", category: "zgateway", name: "²¢ÐÐÍø¹Ø", desc: "", gType: 1,
          nConfig: { type: "parallel" }
        },
        { key: createUUID(), nType: "gateway", category: "zgateway", name: "ÅÅËûÍø¹Ø", desc: "", gType: 4,
          nConfig: { type: "exclusive" }
        },
        { key: createUUID(), nType: "gateway", category: "zgateway", name: "ÊÂ¼þÍø¹Ø", desc: "", gType: 5,
          nConfig: { type: "event" }
        },
        { key: createUUID(), nType: "gateway", category: "zgateway", name: "ÏàÈÝÍø¹Ø", desc: "", gType: 2,
          nConfig: { type: "inclusive" }
        },
        { key: createUUID(), nType: "gateway", category: "zgateway", name: "ÅÅËûÊÂ¼þÍø¹Ø", desc: "", gType: 6,
          nConfig: { type: "exclusiveEvent" }
        },
        { key: createUUID(), nType: "gateway", category: "zgateway", name: "²¢ÐÐÊÂ¼þÍø¹Ø", desc: "", gType: 7,
          nConfig: { type: "parallelEvent" }
        }
      ]
    });

    myPaletteLevel2.model = $(go.GraphLinksModel,
        {
            nodeDataArray: [ ]
        });

    for(var i=1; i<=extraArray.length; i++) {
        var Ei = extraArray[i - 1];
        myPaletteLevel2.model.addNodeData(Ei);
    }
} // end init

//------------------------------------------  some shared functions   ----------------------------------------------

// this is called after nodes have been moved or lanes resized, to layout all of the Pool Groups again
function relayoutDiagram() {
  myDiagram.layout.invalidateLayout();
  myDiagram.findTopLevelGroups().each(function(g) { if (g.category === "Pool") g.layout.invalidateLayout(); });
  myDiagram.layoutDiagram();
}

// define a custom ResizingTool to limit how far one can shrink a lane Group
function LaneResizingTool() {
  go.ResizingTool.call(this);
}
go.Diagram.inherit(LaneResizingTool, go.ResizingTool);


//------------------------------------------  Commands for this application  ----------------------------------------------

function addBoundaryEvent(evType) {
    myDiagram.startTransaction("addBoundaryEvent");

        var events = ["NotAllowed",
            "Start",
            "Empty",
            "Timer",
            "Service",
            "Message",
            "Conditional",
            "Escalation",
            "End",
            "Arrow",
            "Error",
            "ThinX",
            "Compensation",
            "Triangle",
            "Pentagon",
            "ThickCross",
            "Circle"];
        var appendEventName = events[evType];

    myDiagram.selection.each(function(node) {
            if(!(node instanceof go.Node)) return;
            if(node.data && (node.data.category === "task")) {
                var i = 0;
                var defaultPort = node.findPort("");       // defaultPort·µ»ØµÄÊÇÕû¸ö½Úµã¶ÔÏó

                while(node.findPort("be" + i.toString()) !== defaultPort ) i++;
                var name = "be" + i.toString();
                if(!node.data.boundaryEventArray) {
                    myDiagram.model.setDataProperty(node.data, "boundaryEventArray", []);
                }

                var newportdata = {
                    eId: createUUID(),
                    portId: name,
                    gType: evType,
                    color: "white",
                    alignmentIndex: i,
                    cancelActivity: false
                };
                myDiagram.model.insertArrayItem(node.data.boundaryEventArray, -1, newportdata);

                var boundaryEventData = {
                    key: newportdata.eId,
                    nType: "event",
                    category: "bEvent",
                    name: appendEventName,
                    gType: evType,
                    nConfig: {}
                };

                myDiagram.model.addNodeData(boundaryEventData);
                }
            });

    myDiagram.commitTransaction("addBoundaryEvent");


}

// ¼ì²â¶ÔÏóÊÇ·ñÊÇ¿Õ¶ÔÏó£¨²»°üº¬ÈÎºÎ¿É¶ÁÊôÐÔ£©
function isEmpty(obj) {
    for(var name in obj) {
        return false;
    }
    return true;
}

// configuration for the task
function addConfiguration(obj) {
    myDiagram.startTransaction("addConfiguration");

    currentObj = obj;
    currentNodeData = obj.part.data;

    if (currentNodeData.category === "event" && !isEmpty(currentNodeData.nConfig) && currentNodeData.nConfig.type === "device" ){

        var doc1 = document.getElementById("div2");
        doc1.style.visibility = "visible";

        var data = currentNodeData.nConfig.config;

        document.getElementById("deviceEventName").value = currentNodeData.name;
        document.getElementById("deviceEvent_id").value = data.deviceId;
        document.getElementById("deviceCmd").value = data.deviceCmd;
    }
    else if(currentNodeData.category === "event" && !isEmpty(currentNodeData.nConfig) && currentNodeData.nConfig.type === "timer"){
        var doc = document.getElementById("div9");
        doc.style.visibility = "visible";

        var data = currentNodeData.nConfig.config;

        document.getElementById("timerEventName").value = currentNodeData.name;
        document.getElementById("timer").value = data.timer;
    }
    else if(currentNodeData.category === "task"){

        var doc = document.getElementById("div1");
        doc.style.visibility = "visible";

        var activityData = currentNodeData.nConfig;
        var configData = currentNodeData.nConfig.config.taskArgs;

        document.getElementById("taskName").value = currentNodeData.name;
        document.getElementById("behavior").value = activityData.behavior;
        document.getElementById("executions").value = activityData.behaviorConfig.exeTimes;
        document.getElementById("cron").value = activityData.behaviorConfig.cron;
        document.getElementById("userID").value = configData.userId;
        document.getElementById("userPass").value = configData.userPass;
        document.getElementById("cmd").value = configData.cmd;
        document.getElementById("deviceId").value = configData.deviceId;
        document.getElementById("subDevId").value = configData.subDevId;
        document.getElementById("appDid").value = configData.appDid;
        document.getElementById("appCore").value = configData.appCore;
        document.getElementById("coreCode").value = configData.coreCode;
        document.getElementById("cmdId").value = configData.cmdId;
        document.getElementById("argInt32").value = configData.argInt32;
        document.getElementById("argDouble").value = configData.argDouble;
        document.getElementById("argString").value = configData.argString;
        document.getElementById("argByte").value = configData.argByte;
        document.getElementById("page").value = configData.page;
        document.getElementById("pageSize").value = configData.pageSize;
    }

    myDiagram.commitTransaction("addConfiguration");
}

function addSubProConfiguration(obj) {
    myDiagram.startTransaction("subProConfig");

    currentNodeData = obj.part.data;

    var div = document.getElementById("div7");
    div.style.visibility = "visible";
    var data = currentNodeData.nConfig;

    document.getElementById("subProName").value = currentNodeData.name;
    document.getElementById("subProcessBehavior").value = data.behavior;
    document.getElementById("subProExeTimes").value = data.behaviorConfig.exeTimes;
    document.getElementById("subProCron").value = data.behaviorConfig.cron;

    myDiagram.commitTransaction("subProConfig");
}

function addCallActivityConfiguration(obj) {
    myDiagram.startTransaction("callActivityConfig");

    currentNodeData = obj.part.data;

    var div = document.getElementById("div8");
    div.style.visibility = "visible";
    var data = currentNodeData.nConfig;

    document.getElementById("callActivityName").value = currentNodeData.name;
    document.getElementById("callId").value = data.config.callId;
    document.getElementById("callActivityBehavior").value = data.behavior;
    document.getElementById("callActivityExeTimes").value = data.behaviorConfig.exeTimes;
    document.getElementById("callActivityCron").value = data.behaviorConfig.cron;

    myDiagram.commitTransaction("callActivityConfig");
}

function addAppConfiguration(obj) {
    myDiagram.startTransaction("addAppConfiguration");

    currentNodeData = obj.part.data;

    var div = document.getElementById("div13");
    div.style.visibility = "visible";

    document.getElementById("appName").value = currentNodeData.name;
    document.getElementById("appId").value = currentNodeData.nConfig.config.taskArgs.applicationId;

    myDiagram.commitTransaction("addAppConfiguration");
}

// add configuration to the node in palette2
function addLightConfiguration(obj) {
    myDiagram.startTransaction("addConfiguration");

    currentNodeData = obj.part.data;
    var data = currentNodeData.nConfig.config.taskArgs;

    if (currentNodeData.gType === 11){

        var div = document.getElementById("div3");
        div.style.visibility = "visible";

        document.getElementById("devId").value = data.deviceId;
        document.getElementById("onOff").value = data.argInt32.join("");
    }
    else if(currentNodeData.gType === 12){
        var div1 = document.getElementById("div4");
        div1.style.visibility = "visible";

        document.getElementById("device").value = data.deviceId;
        document.getElementById("color").value = data.argInt32.join(",");
    }

    myDiagram.commitTransaction("addConfiguration");
}

function addLinkConfiguration(obj){
    myDiagram.startTransaction("linkConfiguration");
    currentLinkData = obj.part.data;
    currentObj = obj;

    if(obj.fromNode.data.gType !== 4){
        document.getElementById("div5").style.visibility = "hidden";
    }
    else {
        document.getElementById("div5").style.visibility = "visible";

        // ÒòÎª³õÊ¼Ê±Ã¿ÌõlinkµÄcondition×Ö¶Î¶¼Î´¶¨Òå£¬ËùÒÔÒ³ÃæÏÔÊ¾undefined£¬Í¨¹ýifÌõ¼þÅÐ¶Ï½«³õÊ¼µÄundefined¸ÄÎª¡°${}¡±
        if (currentLinkData.condition === undefined) {
            document.getElementById("condition").value = "${}";
        } else {
            document.getElementById("condition").value = currentLinkData.condition;
        }
        if (currentLinkData.isDefault === undefined) {
            document.getElementById("defaultFlow").value = false;
        } else {
            document.getElementById("defaultFlow").value = currentLinkData.isDefault;
        }
    }

    myDiagram.commitTransaction("linkConfiguration");
}

// save the node's domentation configuration
function saveTaskConfiguration(docId) {

    myDiagram.startTransaction("aa");

    var name = document.getElementById("taskName").value.toString();
    var behavior = document.getElementById("behavior").value.toString();
    var exeTimes = document.getElementById("executions").value.toString();
    var exe = parseInt(exeTimes);
    var cron = document.getElementById("cron").value.toString();
    var userId = document.getElementById("userID").value.toString();
    var userPass = document.getElementById("userPass").value.toString();

    var cmd = document.getElementById("cmd").value.toString();
    var deviceId = document.getElementById("deviceId").value.toString();
    var subDevId = document.getElementById("subDevId").value.toString();
    var appDid = document.getElementById("appDid").value.toString();
    var appCore = document.getElementById("appCore").value.toString();
    var app_core = parseInt(appCore);
    var coreCode = document.getElementById("coreCode").value.toString();
    var cmdId = parseInt(document.getElementById("cmdId").value.toString());
    var argInt = document.getElementById("argInt32").value.toString();
    var argDouble = document.getElementById("argDouble").value.toString();
    var argString = document.getElementById("argString").value.toString();
    var argByte = document.getElementById("argByte").value.toString();
    var page = parseInt(document.getElementById("page").value);
    var pageSize = parseInt(document.getElementById("pageSize").value);

    var intArray = argInt.split(",");
    var ArgIntArray = [];
    for(var i=0;i<intArray.length;i++){
        ArgIntArray[i] = parseInt(intArray[i]);

    }
    var doubleArray = argDouble.split(",");
    var ArgDoubleArray = [];
    for(var i=0;i<doubleArray.length;i++){
        ArgDoubleArray[i] = parseFloat(doubleArray[i]);
    }

    var taskArg = {
        userId : userId,
        userPass: userPass,
        cmd: cmd,
        appDid: appDid,
        appCore: app_core,
        coreCode: coreCode,
        deviceId: deviceId,
        subDevId: subDevId,
        cmdId: cmdId,
        argInt32: ArgIntArray,
        argDouble: ArgDoubleArray,
        argString: argString.split(","),
        argByte: argByte,
        page: page,
        pageSize: pageSize
    };

    var nConfig = {
            aId: currentNodeData.key,
            aName: name,
            aDesc: currentNodeData.desc,
            type: "task",
            userId: g_userId,
            behavior: behavior,
            behaviorConfig: {
                exeTimes: exe,
                cron: cron
            },
            config: {
                tType: currentNodeData.nConfig.config.tType,
                taskArgs: taskArg
            }
    };

    myDiagram.model.setDataProperty(currentNodeData,"name",name);
    myDiagram.model.setDataProperty(currentNodeData,"nConfig",nConfig);

    myDiagram.commitTransaction("aa");
    closeElement(docId);
}

// save the node's domentation configuration
function saveDeviceEventConfiguration(docId) {

    myDiagram.startTransaction("saveDeviceEventConfiguration");

    var name = document.getElementById("deviceEventName").value.toString();
    var deviceId = document.getElementById("deviceEvent_id").value.toString();
    var deviceCmd = document.getElementById("deviceCmd").value.toString();

    var nConfig = {
            eId: currentNodeData.key,
            eName: name,
            eDesc: currentNodeData.desc,
            type: "device",
            config: {
                deviceId: deviceId,
                deviceCmd: deviceCmd
            }
    };

    myDiagram.model.setDataProperty(currentNodeData,"name",name);
    myDiagram.model.setDataProperty(currentNodeData,"nConfig",nConfig);

    myDiagram.commitTransaction("saveDeviceEventConfiguration");
    closeElement(docId);
}

function saveTimerEventConfiguration(docId) {

    myDiagram.startTransaction("saveTimerEventConfiguration");

    var name = document.getElementById("timerEventName").value.toString();
    var timer = document.getElementById("timer").value.toString();

    var nConfig = {
            eId: currentNodeData.key,
            eName: name,
            eDesc: currentNodeData.desc,
            type: "timer",
            config: { timer: timer}
    };

    myDiagram.model.setDataProperty(currentNodeData,"name",name);
    myDiagram.model.setDataProperty(currentNodeData, "nConfig", nConfig);

    myDiagram.commitTransaction("saveTimerEventConfiguration");
    closeElement(docId);
}

function saveSubProcessConfig(id){

    var name = document.getElementById("subProName").value.toString();
    var behavior = document.getElementById("subProcessBehavior").value.toString();
    var exeTimes = document.getElementById("subProExeTimes").value.toString();
    var exe = parseInt(exeTimes);
    var cron = document.getElementById("subProCron").value.toString();

    var nConfig = {
            aId: currentNodeData.key,
            aName: name,
            aDesc: currentNodeData.desc,
            type: "subProcess",
            userId: g_userId,
            behavior: behavior,
            behaviorConfig: {
                exeTimes: exe,
                cron: cron
            },
            config: { groupId: currentNodeData.key }
    };

    myDiagram.model.setDataProperty(currentNodeData, "name", name);
    myDiagram.model.setDataProperty(currentNodeData, "nConfig", nConfig);


    closeElement(id);
}

function saveCallActivityConfig(id){

    var name = document.getElementById("callActivityName").value.toString();
    var callId = document.getElementById("callId").value.toString();
    var behavior = document.getElementById("callActivityBehavior").value.toString();
    var exeTimes = document.getElementById("callActivityExeTimes").value.toString();
    var exe = parseInt(exeTimes);
    var cron = document.getElementById("callActivityCron").value.toString();

    var nConfig = {
            aId: currentNodeData.key,
            aName: name,
            aDesc: currentNodeData.desc,
            type: "callActivity",
            userId: g_userId,
            behavior: behavior,
            behaviorConfig: {
                exeTimes: exe,
                cron: cron
            },
            config: { callId: callId }
    };

    myDiagram.model.setDataProperty(currentNodeData, "name", name);
    myDiagram.model.setDataProperty(currentNodeData, "nConfig", nConfig);

    closeElement(id);
}

function saveServiceConfig(id){
    myDiagram.startTransaction("saveServiceConfig");

    var service = document.getElementById("serviceConfig").value.toString();

    var nConfig = {
            aId: currentNodeData.key,
            aName: currentName,
            aDesc: currentNodeData.desc,
            type: "task",
            userId: g_userId,
            behavior: "immediate",
            config: {
                tType: "ServiceTask",
                taskArgs: {
                    serviceId: currentId,
                    cmd: service  }
            }
    };

    var name = currentName + "_" + service;

    myDiagram.model.setDataProperty(currentNodeData, "name", name);
    myDiagram.model.setDataProperty(currentNodeData, "nConfig", nConfig);

    myDiagram.commitTransaction("saveServiceConfig");

    closeElement(id);

}

function saveModelConfig(id){
    myDiagram.startTransaction("saveModelConfig");

    var model = document.getElementById("modelConfig").value.toString();

    var nConfig = {
        aId: currentNodeData.key,
        aName: currentName,
        aDesc: currentNodeData.desc,
        type: "task",
        userId: g_userId,
        behavior: "immediate",
        config: {
            tType: "ModelTask",
            taskArgs: {
                modelId: currentId,
                cmd: model  }
        }
    };

    var name = currentName + "_" + model;

    myDiagram.model.setDataProperty(currentNodeData, "name", name);
    myDiagram.model.setDataProperty(currentNodeData, "nConfig", nConfig);

    myDiagram.commitTransaction("saveModelConfig");

    closeElement(id);
}

function saveApplicationConfig(id){
    myDiagram.startTransaction("saveAppConfig");
   // var application = document.getElementById("appConfig").value.toString();
    var appCmd = document.getElementById("appCmd").value.toString();
    var currentName = document.getElementById("appName").value.toString();
    var currentId = document.getElementById("appId").value.toString();
    var nConfig = {
        aId: currentNodeData.key,
        aName: currentName,
        aDesc: currentNodeData.desc,
        type: "task",
        userId: g_userId,
        behavior: "immediate",
        config: {
            tType: "ApplicationTask",
            taskArgs: {
                applicationId: currentId,
                cmd: appCmd  }
        }
    };
   // var name = currentName + "_" + application;
    var name = currentName + "_" + appCmd;

    myDiagram.model.setDataProperty(currentNodeData, "name", name);
    myDiagram.model.setDataProperty(currentNodeData, "nConfig", nConfig);

    myDiagram.commitTransaction("saveAppConfig");

    closeElement(id);
}

function saveAnalysisConfig(id) {
    var anlysisResult = document.getElementById("analysisResult").value.toString();

    var nConfig = {
        aId: currentNodeData.key,
        aName: currentNodeData.name,
        aDesc: currentNodeData.desc,
        type: "task",
        userId: g_userId,
        behavior: "immediate",
        config: {
            tType: "AnalysisTask",
            taskArgs: {
                resultId: currentNodeData.name,
                analysis: anlysisResult  }
        }
    };
    myDiagram.model.setDataProperty(currentNodeData, "nConfig", nConfig);
    closeElement(id);
}

function savelightOnOffConfiguration(id){
    myDiagram.startTransaction("lightOnOff");

    var deviceId = document.getElementById("devId").value.toString();
    var onOff = document.getElementById("onOff").value.toString();

    var array = onOff.split("");
    var ArgIntArray = [];
    for(var i=0;i<array.length;i++){
        ArgIntArray[i] = parseInt(array[i]);
    }

    var configData = currentNodeData.nConfig.config;

    var nConfig = {
            aId: currentNodeData.key,
            aName: currentNodeData.name,
            aDesc: currentNodeData.desc,
            type: "task",
            userId: g_userId,
            behavior: currentNodeData.nConfig.behavior,
            behaviorConfig: currentNodeData.nConfig.behaviorConfig,
            config: {
                tType: configData.tType,
                taskArgs:{
                    userId: "skdjfhw23", userPass: "1232321",
                    cmd: "IotRunCmd", appDid: "xxxxxxx", appCore: 2, coreCode: "8888888888",
                    deviceId: deviceId, subDevId: deviceId, cmdId: "" + 903501,
                    argInt32: ArgIntArray, argDouble: [0], argString: [0], argByte: "",
                    page: 0, pageSize: 0
                }
            }
    };

    myDiagram.model.setDataProperty(currentNodeData, "nConfig", nConfig);

    myDiagram.commitTransaction("lightOnOff");
    closeElement(id);
}

function savelightColorConfiguration(id){

    myDiagram.startTransaction("lightColor");

    var deviceId = document.getElementById("device").value.toString();
    var color = document.getElementById("color").value.toString();

    var array = color.split(",");
    var ArgIntArray = [];
    for(var i=0;i<array.length;i++){
        ArgIntArray[i] = parseInt(array[i]);
    }

    var configData = currentNodeData.nConfig.config;

    var nConfig = {
            aId: currentNodeData.key,
            aName: currentNodeData.name,
            aDesc: currentNodeData.desc,
            type: "task",
            userId: g_userId,
            behavior: currentNodeData.nConfig.behavior,
            behaviorConfig: currentNodeData.nConfig.behaviorConfig,
            config: {
                tType: configData.tType,
                taskArgs:{
                    userId: "skdjfhw23", userPass: "1232321",
                    cmd: "IotRunCmd", appDid: "xxxxxxx", appCore: 2, coreCode: "8888888888",
                    deviceId: deviceId, subDevId: deviceId, cmdId: "" + 903501,
                    argInt32: ArgIntArray, argDouble: [0], argString: [0], argByte: "",
                    page: 0, pageSize: 0
                }
        }
    };

    myDiagram.model.setDataProperty(currentNodeData,"nConfig",nConfig);

    myDiagram.commitTransaction("lightColor");
    closeElement(id);

}

function saveLinkConfig (id) {

    var condition = document.getElementById("condition").value.toString();
    myDiagram.model.setDataProperty(currentLinkData, "condition", condition);

    if(document.getElementById("defaultFlow").value === "true"){
        myDiagram.model.setDataProperty(currentLinkData, "isDefault", true);
        currentObj.fromNode.findLinksOutOf().each(function(link) {
            if (link !== currentObj && link.data.isDefault) {
                myDiagram.model.setDataProperty(link.data, "isDefault", false);
            }
        });
    }
    else{
        myDiagram.model.setDataProperty(currentLinkData, "isDefault", false);
    }
    closeElement(id);
}

// save and Return
function  saveAndReturn() {
    var saveReturn = document.getElementById("div6");
    saveReturn.style.visibility = "visible";

    var data = myDiagram.model.modelData;
    if( data.pName === undefined && data.pDesc === undefined)
    {
        document.getElementById("proName").value = "defaultName";
        document.getElementById("proDes").value = "";
    }
    else{
        document.getElementById("proName").value = data.pName;
        document.getElementById("proDes").value = data.pDesc;
    }
    document.getElementById("multiple").value = data.isMultiple;
}

// save the process's configuration
function saveProConfiguration(saveReturnId) {

    var proId = createUUID();
    var proName = document.getElementById("proName").value.toString();
    var multiple = document.getElementById("multiple").value;
    var proDes = document.getElementById("proDes").value.toString();
    var isMultiple;

    if(multiple === "false"){
        isMultiple = false;
    }
    else if(multiple === "true"){
        isMultiple = true;
    }

    myDiagram.model.setDataProperty(myDiagram.model.modelData, "pId", proId);
    myDiagram.model.setDataProperty(myDiagram.model.modelData, "pName", proName);
    myDiagram.model.setDataProperty(myDiagram.model.modelData, "isMultiple", isMultiple);
    myDiagram.model.setDataProperty(myDiagram.model.modelData, "pDesc", proDes);
    myDiagram.model.setDataProperty(myDiagram.model.modelData, "hasStartParams", false);

    var data = {
        pId: proId,
        pName: proName,
        pDesc: proDes,
        isMultiple: isMultiple,
        hasStartParams: false
    };

    closeElement(saveReturnId);

   saveData(data);

}

function loadJSONDataPass(file) {
    jQuery.getJSON(file, function (jsondata) {
    myDiagram.model = go.Model.fromJson(jsondata);
    myDiagram.model.undoManager.isEnabled = true;
    myDiagram.isModified = false;

    var modeldata = {
        pId: jsondata.pId,
        pName: jsondata.pName,
        pDesc: jsondata.pDesc,
        isMultiple: jsondata.isMultiple,
        hasStartParams: jsondata.hasStartParams
    };

    myDiagram.model.setDataProperty(myDiagram.model, "modelData", modeldata);
    });
  }

// NOT directly by loadFile.
function loadDiagramProperties(e) {
  var pos = myDiagram.model.modelData.position;
  if (pos) myDiagram.position = go.Point.parse(pos);
}

function closeElement(id) {
  var panel = document.getElementById(id);
  if (panel.style.visibility === "visible") {
    panel.style.visibility = "hidden";
  }
}

