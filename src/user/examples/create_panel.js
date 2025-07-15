//
// This example create a custom panel
//


import { panels } from '../modules/modules.js';


const idx = panels.panels.length;
const name = 'user';


const button = document.createElement('button');
button.id = 'toolbar_btn_' + name; // "toolbar_btn_" is important
button.style.position = 'fixed';
button.style.top = '100px';
button.style.left = '300px';
button.style.zIndex = 2000;
button.style.padding = '10px';
button.innerHTML = 'Open my panel';
button.onclick = () => { panels.switchPanel(panels.panels[idx]) };
document.body.appendChild(button);


const myPanel = document.createElement('div');
myPanel.id = 'menu-' + name; // "menu-" is important
myPanel.classList.add('panel');
myPanel.innerHTML = '<ul><li style="padding: 10px;">My Panel!</li></ul>';
myPanel.style.position = 'fixed';
myPanel.style.top = '150px';
myPanel.style.left = '300px';
myPanel.style.zIndex = 2000;
myPanel.style.display = 'none';
myPanel.style.background = '#2e3542EE';
myPanel.style.color = '#636f85';
myPanel.style.borderRadius = '3px';
myPanel.style.width = '100px';
myPanel.style.height = '200px';
document.body.appendChild(myPanel);


panels.addPanel(idx, button, myPanel, false); // is detach?
