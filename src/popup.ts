import { setBadgeText } from "./common"
import "./popup.css"

console.log("Hello, world from popup!")

// Handle the ON/OFF switch
const checkbox = document.getElementById("enabled") as HTMLInputElement
chrome.storage.sync.get("enabled", (data) => {
  checkbox.checked = !!data.enabled
  void setBadgeText(data.enabled)
})
checkbox.addEventListener("change", async (event) => {
  if (event.target instanceof HTMLInputElement) {
    void chrome.storage.sync.set({ enabled: event.target.checked })
    void setBadgeText(event.target.checked)
    // Send message to content script in all tabs
    const tabs = await chrome.tabs.query({})
    for (const tab of tabs) {
      // Note: tab properties such as tab.title or tab.url can only be accessed for
      // URLs in the host_permissions section of manifest.json
      chrome.tabs
        .sendMessage(tab.id!, { enabled: event.target.checked })
        .then((response) => {
          console.info(
            "Popup received response from tab with title '%s' and url %s",
            response.title,
            response.url,
          )
        })
        .catch((error) => {
          console.warn("Popup could not send message to tab %d", tab.id, error)
        })
    }
    chrome.runtime
      .sendMessage({ enabled: event.target.checked })
      .then((response) => {
        console.info("Popup received response", response)
      })
      .catch((error) => {
        console.warn("Popup could not send message", error)
      })
  }
})

// Handle the input field
const input = document.getElementById("item") as HTMLInputElement
chrome.storage.sync.get("item", (data) => {
  input.value = data.item || ""
})
input.addEventListener("change", (event) => {
  if (event.target instanceof HTMLInputElement) {
    void chrome.storage.sync.set({ item: event.target.value })
  }
})

// Options page
const optionsElement = document.querySelector("#go-to-options")
if (!optionsElement) {
  console.error("Could not find options element")
} else {
  optionsElement.addEventListener("click", function () {
    // This code is based on Chrome for Developers documentation
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage().catch((error: unknown) => {
        console.error("Could not open options page", error)
      })
    } else {
      window.open(chrome.runtime.getURL("options.html"))
    }
  })
}
