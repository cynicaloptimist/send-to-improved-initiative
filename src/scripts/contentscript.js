import ext from "./utils/ext";

function getNameFrom(element) {
  return element.querySelector(".mon-stat-block__name a").innerHTML.trim();
}

var extractStatBlock = () => {
  const statBlockElement = document.querySelector(".mon-stat-block");

  const statBlock = {
    Name: getNameFrom(statBlockElement)
  };

  return statBlock;
}

function onRequest(request, sender, sendResponse) {
  if (request.action === 'process-page') {
    sendResponse(extractStatBlock())
  }
}

ext.runtime.onMessage.addListener(onRequest);