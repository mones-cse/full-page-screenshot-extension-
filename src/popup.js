document.getElementById("fullpage-btn").addEventListener("click", () => {
  // Explicitly query the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) {
      console.error("No active tab found");
      return;
    }

    const activeTab = tabs[0];

    // Inject content script first
    chrome.scripting.executeScript(
      {
        target: { tabId: activeTab.id },
        files: ["content.bundle.js"],
      },
      () => {
        // After script injection, send message
        chrome.tabs.sendMessage(
          activeTab.id,
          { action: "capture_full_page" },
          (response) => {
            // Check for Chrome runtime errors
            if (chrome.runtime.lastError) {
              console.error("Runtime error:", chrome.runtime.lastError);
              document.getElementById("status").textContent =
                "Error: Unable to capture screenshot. Check console for details.";
              return;
            }

            if (response && response.success) {
              document.getElementById("status").textContent =
                "Full-page screenshot saved successfully.";
            } else {
              document.getElementById("status").textContent =
                "Failed to capture full-page screenshot.";
            }
          }
        );
      }
    );
  });
});

document.getElementById("screen-btn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
      const url = new URL(tabs[0].url);
      const hostName = url.hostname.replace(/\./g, "_");
      const timestamp = new Date().toISOString().replace(/:/g, "-");
      const fileName = `${hostName}-${timestamp}.png`;

      chrome.downloads.download({
        url: dataUrl,
        filename: fileName,
      });
    });
  });
});
