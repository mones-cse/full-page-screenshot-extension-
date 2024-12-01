chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("[Background] Received message:", message);

  if (message.action === "download_screenshot") {
    try {
      chrome.downloads.download(
        {
          url: message.dataUrl,
          filename: message.fileName,
          saveAs: false,
        },
        (downloadId) => {
          console.log("[Background] Download initiated:", downloadId);

          // Optional download tracking
          chrome.downloads.onChanged.addListener((downloadDelta) => {
            if (downloadDelta.id === downloadId) {
              if (
                downloadDelta.state &&
                downloadDelta.state.current === "complete"
              ) {
                console.log("[Background] Download completed");
              }
              if (downloadDelta.error) {
                console.error(
                  "[Background] Download failed:",
                  downloadDelta.error.current
                );
              }
            }
          });

          sendResponse({
            success: true,
            message: "Download initiated",
            downloadId: downloadId,
          });
        }
      );

      return true; // Async response
    } catch (error) {
      console.error("[Background] Download error:", error);
      sendResponse({
        success: false,
        error: error.message,
      });
      return true;
    }
  }
});
