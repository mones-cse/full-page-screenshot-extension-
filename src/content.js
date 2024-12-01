import html2canvas from "html2canvas";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "capture_full_page") {
    captureFullPage()
      .then((dataUrl) => {
        const url = new URL(window.location.href);
        const hostName = url.hostname.replace(/\./g, "_");
        const timestamp = new Date().toISOString().replace(/:/g, "-");
        const fileName = `${hostName}-fullpage-${timestamp}.png`;

        chrome.downloads.download({
          url: dataUrl,
          filename: fileName,
        });

        sendResponse({ success: true });
      })
      .catch((error) => {
        console.error("Screenshot capture failed:", error);
        sendResponse({ success: false, error: error.message });
      });

    return true; // Indicates async response
  }
});

async function captureFullPage() {
  const canvas = await html2canvas(document.body, {
    scrollX: 0,
    scrollY: -window.scrollY,
    windowWidth: document.documentElement.scrollWidth,
    windowHeight: document.documentElement.scrollHeight,
    useCORS: true,
    scale: window.devicePixelRatio,
  });

  return canvas.toDataURL("image/png");
}
