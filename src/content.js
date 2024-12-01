import html2canvas from "html2canvas";

// Utility function for logging
function log(message, ...args) {
  console.log(`[FullPageScreenshot] ${message}`, ...args);
}

// Utility function for error logging
function logError(message, error) {
  console.error(`[FullPageScreenshot] ${message}`, error);
}

// Capture full page screenshot
async function captureFullPage() {
  try {
    // Ensure we're at the top of the page
    window.scrollTo(0, 0);

    // Get full page dimensions
    const fullHeight = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    );

    const fullWidth = Math.max(
      document.body.scrollWidth,
      document.body.offsetWidth,
      document.documentElement.clientWidth,
      document.documentElement.scrollWidth,
      document.documentElement.offsetWidth
    );

    log("Capturing full page", { width: fullWidth, height: fullHeight });

    // Capture the entire page
    const canvas = await html2canvas(document.documentElement, {
      allowTaint: true,
      useCORS: true,
      logging: true,
      scrollX: 0,
      scrollY: -window.scrollY,
      windowWidth: fullWidth,
      windowHeight: fullHeight,
      scale: window.devicePixelRatio,
      onclone: (document) => {
        // Optional: Modify cloned document if needed
        // For example, hide scrollbars or modify styles
        const style = document.createElement("style");
        style.textContent = `
          body { 
            overflow: visible !important; 
            max-width: none !important; 
          }
        `;
        document.body.appendChild(style);
      },
    });

    // Convert to data URL
    const dataUrl = canvas.toDataURL("image/png");
    log("Screenshot captured successfully");
    return dataUrl;
  } catch (error) {
    logError("Full page capture failed", error);
    throw error;
  }
}

// Main message listener
function setupMessageListener() {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Verify the message is for full page capture
    if (message.action !== "capture_full_page") return false;

    log("Full page capture requested");

    // Capture and send
    captureFullPage()
      .then((dataUrl) => {
        // Generate unique filename
        const url = new URL(window.location.href);
        const hostName = url.hostname.replace(/\./g, "_");
        const timestamp = new Date().toISOString().replace(/:/g, "-");
        const fileName = `${hostName}-fullpage-${timestamp}.png`;

        log("Sending screenshot for download", { fileName });

        // Send download message to background script
        chrome.runtime.sendMessage(
          {
            action: "download_screenshot",
            dataUrl: dataUrl,
            fileName: fileName,
          },
          (response) => {
            // Handle response from background script
            if (chrome.runtime.lastError) {
              logError("Message sending error", chrome.runtime.lastError);
              sendResponse({
                success: false,
                error: chrome.runtime.lastError.message,
              });
              return;
            }

            log("Download message response", response);
            sendResponse(response);
          }
        );

        return true; // Indicates async response
      })
      .catch((error) => {
        logError("Screenshot capture process failed", error);
        sendResponse({
          success: false,
          error: error.message,
        });
      });

    return true; // Allow async responses
  });
}

// Initialize the message listener
setupMessageListener();

// Optional: Add error boundary for unexpected errors
window.addEventListener("error", (event) => {
  logError("Unhandled error in content script", event.error);
});
