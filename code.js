"use strict";
// This shows the HTML page in "ui.html".
figma.showUI(__html__, { themeColors: true, width: 625, height: 720 });
// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
    // keep running, which shows the cancel button at the bottom of the screen.
    figma.closePlugin();
};
