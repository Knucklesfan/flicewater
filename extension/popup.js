 
browser.tabs
  .executeScript({ file: "main.js" })
  .then(listenForClicks)
  .catch(reportExecuteScriptError);
