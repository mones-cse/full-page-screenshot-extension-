chrome.runtime.onMessage.addListener((function(o,e,n){if(console.log("[Background] Received message:",o),"download_screenshot"===o.action)try{return chrome.downloads.download({url:o.dataUrl,filename:o.fileName,saveAs:!1},(function(o){console.log("[Background] Download initiated:",o),chrome.downloads.onChanged.addListener((function(e){e.id===o&&(e.state&&"complete"===e.state.current&&console.log("[Background] Download completed"),e.error&&console.error("[Background] Download failed:",e.error.current))})),n({success:!0,message:"Download initiated",downloadId:o})})),!0}catch(o){return console.error("[Background] Download error:",o),n({success:!1,error:o.message}),!0}}));