/* 
    Sep 2024
    @nimadez

    Floating panels
*/


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
        this.attachToolbarButtons();

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
        for (let i = 0; i < panels.length; i++) {
            this.addToolbarToPanel(i, panels[i]);
            this.panels.push({
                idx: i,
                elem: panels[i],
                x: 0, y: 0,
                detach: false
            });
        }
    }
    
    addToolbarToPanel(idx, elem) {
        const li = document.createElement('li');
        li.classList.add('row_panel');

        const div_move = document.createElement('div');
        const div_hide = document.createElement('div');
        const div_reset = document.createElement('div');
        div_move.innerHTML = '<i class="material-icons">open_with</i>';
        div_hide.innerHTML = '<i class="material-icons">remove_red_eye</i>';
        div_reset.innerHTML = '<i class="material-icons">exit_to_app</i>';
        div_move.title = 'Move';
        div_hide.title = 'Hide';
        div_reset.title = 'Reset';

        div_move.onpointerdown = () => {
            elem.style.borderRadius = '6px';
            elem.style.borderTop = 'solid 1px steelblue';
            this.panels[idx].detach = true;
            this.index = idx;
        };

        div_hide.onclick = () => {
            this.panels[idx].elem.style.display = 'none';
            this.panels[idx].button.style.textDecoration = 'none';
        };

        div_reset.onclick = () => {
            this.panels.forEach(panel => {
                if (!panel.detach && panel.x == 0 && panel.y == 0) {
                    panel.elem.style.display = 'none';
                    if (panel.button)
                        panel.button.style.textDecoration = 'none';
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

    // find and match a toolbar button for a panel by id
    attachToolbarButtons() {
        const buttons = document.querySelectorAll("button[id^='toolbar_btn_']");
        this.panels.forEach((panel) => {
            const panelId = panel.elem.id.split('-')[1];
            for (let b = 0; b < buttons.length; b++) {
                if (buttons[b].id.split('_')[2] === panelId) {
                    buttons[b].onclick = () => { this.switchPanel(panel, buttons[b]) };
                    panel.button = buttons[b];
                }
            }
        });
    }

    clearAllPanels(exclude) {
        this.panels.forEach(panel => {
            if (!panel.detach && panel.elem !== exclude) {
                panel.elem.style.display = 'none';
                if (panel.button)
                    panel.button.style.textDecoration = 'none';
            }
        });
    }

    switchPanel(panel) {
        this.clearAllPanels(panel.elem);

        if (panel.elem.style.display === 'unset') {
            panel.elem.style.display = 'none';
            panel.button.style.textDecoration = 'none';
        } else {
            panel.elem.style.display = 'unset';
            panel.button.style.textDecoration = 'underline';
            if (!panel.detach)
                this.panelToFront(panel);
        }
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
        this.panels[idx].elem.style.borderTop = 'none';
        this.panels[idx].elem.style.borderRadius = '3px';
        this.panels[idx].elem.style.borderTopLeftRadius = '0';
        this.panels[idx].elem.style.borderTopRightRadius = '0';
        this.panels[idx].elem.style.zIndex = 1000;
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
