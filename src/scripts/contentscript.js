import ext from "./utils/ext";

var extractTags = () => {
  const statBlockElement = document.querySelector(".mon-stat-block");

  const statBlock = {
    Name: statBlockElement.querySelector(".mon-stat-block__name a").innerHTML.trim()
  };

  console.log(statBlock);
  return statBlock;
}

function onRequest(request, sender, sendResponse) {
  if (request.action === 'process-page') {
    sendResponse(extractTags())
  }
}

ext.runtime.onMessage.addListener(onRequest);