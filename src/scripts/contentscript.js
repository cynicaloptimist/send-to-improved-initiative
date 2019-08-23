import ext from "./utils/ext";

function getNameFrom(element) {
  return element.querySelector(".mon-stat-block__name a").innerHTML.trim();
}

function getHpFrom(element) {
  const label = Array.from(element.querySelectorAll(".mon-stat-block__attribute-label")).filter(e => e.innerHTML == "Hit Points")[0];
  const value = parseInt(label.parentElement.querySelector(".mon-stat-block__attribute-data-value").innerHTML.trim());
  const notes = label.parentElement.querySelector(".mon-stat-block__attribute-data-extra").innerHTML.trim();
  return {
    Value: value,
    Notes: notes
  };
}

var extractStatBlock = () => {
  const statBlockElement = document.querySelector(".mon-stat-block");

  const statBlock = {
    Name: getNameFrom(statBlockElement),
    HP: getHpFrom(statBlockElement)
  };

  return statBlock;
}

function onRequest(request, sender, sendResponse) {
  if (request.action === 'process-page') {
    sendResponse(extractStatBlock())
  }
}

ext.runtime.onMessage.addListener(onRequest);