import ext from "./ext";

const storage: chrome.storage.StorageArea = ext.storage.sync
  ? ext.storage.sync
  : ext.storage.local;
export default storage;
