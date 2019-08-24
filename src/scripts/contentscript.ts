import ext from "./utils/ext";
import jQuery from "jquery";

function getNameFrom(element: JQuery<Element>) {
  return element.find(".mon-stat-block__name a").text().trim();
}

function getHpFrom(element: JQuery<Element>) {
  const label = element.find(".mon-stat-block__attribute-label:contains(Hit Points)")
    .filter((_, e) => e.innerHTML.trim() == "Hit Points" ).first();
  const value = parseInt(label.parent().find(".mon-stat-block__attribute-data-value").text().trim());
  const notes = label.parent().find(".mon-stat-block__attribute-data-extra").text().trim();
  return {
    Value: value,
    Notes: notes
  };
}

var extractStatBlock = () => {
  const doc = jQuery(document);
  const statBlockElement = doc.find(".mon-stat-block") as unknown as JQuery<Element>;

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