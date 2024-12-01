chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "capture_full_page") {
    console.log("Full page screenshot requested");
    sendResponse({ success: true });
  }
});
