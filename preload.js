'use strict';

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('WQISLocalAI', {
  analyzeWeldImage(base64) {
    return ipcRenderer.invoke('wqis:yolo-analyze', { base64 });
  },
});
