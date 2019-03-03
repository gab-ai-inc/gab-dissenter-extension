console.log("manager is running")
var tabInfo = {panelTabCurrent:null,suspectTabCurrent:null};

__BROWSER__.runtime.onMessage.addListener(

  function (request, sender, sendResponse) {

    if (request.parentPanel){
      tabInfo.panelTabCurrent = request.parentPanel;
      sendResponse("recieved",tabInfo.panelTabCurrent);
    }

    if (request.parentSuspect){
      tabInfo.suspectTabCurrent = request.parentSuspect;
      sendResponse("recieved",tabInfo.suspectTabCurrent);
    }
  }
);
