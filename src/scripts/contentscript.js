import ext from "./utils/ext";

var extractStatBlock = () => {
  const statBlockElement = document.querySelector(".mon-stat-block");

  const statBlock = {
    Name: statBlockElement.querySelector(".mon-stat-block__name a").innerHTML.trim()
  };

  console.log(statBlock);
  return statBlock;
}

function onRequest(request, sender, sendResponse) {
  if (request.action === 'process-page') {
    sendResponse(extractStatBlock())
  }
}

ext.runtime.onMessage.addListener(onRequest);