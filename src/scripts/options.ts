import storage from "./utils/storage";

var targetUrlInput = document.querySelectorAll("input.target-url");

storage.get("target-url", values => {
  targetUrlInput.forEach((i: HTMLInputElement) => {
    i.value = values["target-url"];
    i.addEventListener("change", e => {
      const input = e.target as HTMLInputElement;
      const newTargetUrl = input.value;
      storage.set({
        "target-url": newTargetUrl
      });
    });
  });
})

