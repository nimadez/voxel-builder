//
// This example create a custom panel
//


import { panels } from '../modules/modules.js';


const idx = panels.panels.length;


const myPanel = document.createElement('div');
myPanel.id = 'menu-user'; // "menu-" is important
myPanel.classList.add('panel');
myPanel.innerHTML = 'My Panel!';
myPanel.style.position = 'fixed';
myPanel.style.top = '200px';
myPanel.style.left = '200px';
myPanel.style.zIndex = 2000;
myPanel.style.display = 'none';
myPanel.style.background = '#FF0000AA';
myPanel.style.width = '100px';
myPanel.style.height = '200px';
document.body.appendChild(myPanel);


const button = document.createElement('button');
button.id = 'toolbar_btn_user'; // "toolbar_btn_" is important
button.style.position = 'fixed';
button.style.top = '100px';
button.style.left = '100px';
button.style.zIndex = 3000;
button.style.padding = '10px';
button.innerHTML = 'Open my panel';
button.onclick = () => { panels.switchPanel(panels.panels[idx]) };
document.body.appendChild(button);


panels.addToolbarToPanel(idx, myPanel);
panels.panels.push({
    idx: idx,
    button: button,
    elem: myPanel,
    x: 0, y: 0,
    detach: false
});
