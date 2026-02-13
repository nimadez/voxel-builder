/* 
    Sep 2024
    @nimadez

    Floating panels
*/


import { preferences } from "../core.js";


class Panels {
    constructor() {
        this.isActive = false;

        this.panels = [];
        this.index = -1;
        this.zIndex = 1000;
        
        this.initialX = 0;
        this.initialY = 0;
        this.currentX = 0;
        this.currentY = 0;

        this.init();
    }

    init() {
        this.registerPanels();
        this.attachPanelsToButtons();

        document.body.addEventListener("mousedown", this.dragStart, false);
        document.body.addEventListener("mouseup", this.dragEnd, false);
        document.body.addEventListener("mousemove", this.drag, false);
        document.body.addEventListener("touchstart", this.dragStart, false);
        document.body.addEventListener("touchend", this.dragEnd, false);
        document.body.addEventListener("touchmove", this.drag, false);
    }

    dragStart(ev) {
        if (panels.index == -1) return false;

        if (ev.type === "touchstart") {
            panels.initialX = ev.touches[0].clientX - panels.panels[panels.index].x;
            panels.initialY = ev.touches[0].clientY - panels.panels[panels.index].y;
        } else {
            panels.initialX = ev.clientX - panels.panels[panels.index].x;
            panels.initialY = ev.clientY - panels.panels[panels.index].y;
        }

        panels.isActive = ev.target == panels.panels[panels.index].elem.children[0].firstChild;
    }

    drag(ev) {
        if (panels.isActive) {
            if (ev.type === "touchmove") {
                panels.currentX = ev.touches[0].clientX - panels.initialX;
                panels.currentY = ev.touches[0].clientY - panels.initialY;
            } else {
                panels.currentX = ev.clientX - panels.initialX;
                panels.currentY = ev.clientY - panels.initialY;
            }

            panels.setTranslate(panels.index, panels.currentX, panels.currentY);
        }
    }

    dragEnd() {
        panels.isActive = false;
        panels.initialX = panels.currentX;
        panels.initialY = panels.currentY;
    }

    registerPanels() {
        const panels = document.querySelectorAll('.panel');
        for (let i = 0; i < panels.length; i++)
            this.addPanel(i, undefined, panels[i], false);
    }

    // find and match a toolbar button for a panel by id
    attachPanelsToButtons() {
        const buttons = document.querySelectorAll("button[id^='toolbar_btn_']");
        this.panels.forEach((panel) => {
            const panelId = panel.elem.id.split('-')[1];
            for (let b = 0; b < buttons.length; b++) {
                if (buttons[b].id.split('_')[2] === panelId) {
                    buttons[b].onclick = () => { this.switchPanel(panel) };
                    panel.button = buttons[b];
                }
            }
        });
    }

    addPanel(idx, button, elem, isDetach) {
        this.addToolbar(idx, elem);
        
        this.panels.push({
            idx: idx,
            button: button,
            elem: elem,
            x: 0, y: 0,
            detach: isDetach
        });

        if (isDetach)
            this.detachPanel(idx, elem);
    }
    
    addToolbar(idx, elem) {
        const li = document.createElement('li');
        li.classList.add('row_panel');

        const div_move = document.createElement('div');
        const div_hide = document.createElement('div');
        const div_reset = document.createElement('div');
        div_move.innerHTML = '<i class="material-icons">games</i>';
        div_hide.innerHTML = '<i class="material-icons">remove</i>';
        div_reset.innerHTML = '<i class="material-icons">close</i>';
        div_move.title = 'Move';
        div_hide.title = 'Minimize';
        div_reset.title = 'Reset/Exit';

        div_move.onpointerdown = () => {
            this.detachPanel(idx, elem);
        };

        div_hide.onclick = () => {
            this.panels[idx].elem.style.display = 'none';
            this.panels[idx].button.classList.remove('panel_select');
        };

        div_reset.onclick = () => {
            this.panels.forEach(panel => {
                if (!panel.detach && panel.x == 0 && panel.y == 0) {
                    panel.elem.style.display = 'none';
                    if (panel.button)
                        panel.button.classList.remove('panel_select');
                }
            });
            this.resetPanel(idx);
        };
        
        li.appendChild(div_move);
        li.appendChild(div_hide);
        li.appendChild(div_reset);
        
        elem.classList.add('panel');
        elem.insertBefore(li, elem.firstChild);
        elem.onpointerdown = () => {
            this.panelToFront(this.panels[idx]);
        };
    }

    resetAllPanels(exclude) {
        this.panels.forEach(panel => {
            if (!panel.detach && panel.elem !== exclude) {
                panel.elem.style.display = 'none';
                if (panel.button)
                    panel.button.classList.remove('panel_select');
            }
        });
    }

    switchPanel(panel) {
        (panel.elem.style.display === 'unset') ?
            this.closePanel(panel) : this.openPanel(panel);
    }

    openPanel(panel) {
        panel.elem.style.display = 'unset';
        panel.button.classList.add('panel_select');
        if (!panel.detach) {
            panel.elem.firstChild.children[2].firstChild.innerHTML = 'close';
            this.resetAllPanels(panel.elem);
            this.panelToFront(panel);
        }
    }

    closePanel(panel) {
        panel.elem.style.display = 'none';
        panel.elem.firstChild.children[2].firstChild.innerHTML = 'open_in_new';
        panel.button.classList.remove('panel_select');
    }

    detachPanel(idx, elem) {
        elem.firstChild.children[2].firstChild.innerHTML = 'open_in_new';
        elem.style.borderRadius = '6px';
        elem.style.borderTop = 'solid 1px steelblue';
        elem.style.display = 'unset';
        this.panels[idx].detach = true;
        this.index = idx;
    }

    panelToFront(panel) {
        panel.elem.style.zIndex = this.zIndex + 1;

        this.zIndex += 1;
        if (this.zIndex > 2000)
            this.zIndex = 1000;
    }

    resetPanel(idx) {
        this.panels[idx].x = 0;
        this.panels[idx].y = 0;
        this.panels[idx].detach = false;
        this.panels[idx].elem.style.transform = 'none';
        this.panels[idx].elem.style.borderTop = `solid 1px ${getComputedStyle(document.querySelector(':root')).getPropertyValue('--cat-bg')}`;
        this.panels[idx].elem.style.borderTopLeftRadius = '0';
        this.panels[idx].elem.style.borderTopRightRadius = '0';
        this.panels[idx].elem.style.zIndex = 1000;
        this.panels[idx].elem.firstChild.children[2].firstChild.innerHTML = 'close';
    }

    setPositionLeft(val) {
        this.panels.forEach(panel => {
            panel.elem.style.left = `${val}px`;
        });
    }

    setTranslate(idx, x, y) {
        this.panels[idx].x = x;
        this.panels[idx].y = y;
        this.panels[idx].elem.style.transform = `translate(${ x }px, ${ y }px)`;
    }

    resetTranslate(idx) {
        this.panels[idx].x = 0;
        this.panels[idx].y = 0;
        this.panels[idx].elem.style.transform = "translate(0, 0)";
    }

    showHelpLabels(isDisplay) {
        const elems = document.getElementsByClassName('help');
        for (let i = 0; i < elems.length; i++)
            elems[i].parentElement.style.display = isDisplay ? 'unset' : 'none';
    }
}


export const panels = new Panels();
