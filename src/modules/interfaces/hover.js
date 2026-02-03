/* 
    Sep 2024
    @nimadez

    Floating hover menu
*/


import { tool } from '../core.js';


class Hover {
    constructor() {
        this.elem = document.getElementById('hover');
        this.elemDrag = this.elem.children[0];
        this.elemItems = this.elem.children[1].children;

        this.isActive = false;
        this.isShowMenu = true;

        this.offset = { x: 0, y: 0 };
        this.initialX = 0;
        this.initialY = 0;
        this.currentX = 0;
        this.currentY = 0;

        this.init();
    }

    init() {
        this.elemDrag.addEventListener("dblclick", this.toggleMenu, false);
        this.elemDrag.addEventListener("contextmenu", this.toggleMenu, false);
        this.elemDrag.addEventListener("mousedown", this.dragStart, false);
        document.body.addEventListener("mouseup", this.dragEnd, false);
        document.body.addEventListener("mousemove", this.drag, false);
        this.elemDrag.addEventListener("touchstart", this.dragStart, false);
        document.body.addEventListener("touchend", this.dragEnd, false);
        document.body.addEventListener("touchmove", this.drag, false);
    
        this.showMenu();
    }

    dragStart(ev) {
        if (ev.type === "touchstart") {
            hover.initialX = ev.touches[0].clientX - hover.offset.x;
            hover.initialY = ev.touches[0].clientY - hover.offset.y;
        } else {
            hover.initialX = ev.clientX - hover.offset.x;
            hover.initialY = ev.clientY - hover.offset.y;
        }

        if (ev.target === hover.elemDrag) {
            hover.isActive = true;
            tool.toolSelector('camera', true);
        }
    }

    drag(ev) {
        if (hover.isActive) {
            if (ev.type === "touchmove") {
                hover.currentX = ev.touches[0].clientX - hover.initialX;
                hover.currentY = ev.touches[0].clientY - hover.initialY;
            } else {
                hover.currentX = ev.clientX - hover.initialX;
                hover.currentY = ev.clientY - hover.initialY;
            }

            hover.setTranslate(hover.currentX, hover.currentY);
        }
    }

    dragEnd() {
        hover.isActive = false;
        hover.initialX = hover.currentX;
        hover.initialY = hover.currentY;
    }

    showMenu() {
        this.elemItems[0].style.transform = 'translate(34px, 0)';
        this.elemItems[1].style.transform = 'translate(-34px, 0)';
        this.elemItems[2].style.transform = 'translate(0, -34px)';
        this.elemItems[3].style.transform = 'translate(0, 34px)';

        for (let i = 0; i < this.elemItems.length; i++)
            this.elemItems[i].classList.remove("hover_item_hide");
    }

    hideMenu() {
        for (let i = 0; i < this.elemItems.length; i++) {
            this.elemItems[i].style.transform = "translate(0, 0)";
            this.elemItems[i].classList.add("hover_item_hide");
        }
    }

    toggleMenu() {
        hover.isShowMenu = !hover.isShowMenu;
        (hover.isShowMenu) ? hover.showMenu() : hover.hideMenu();
    }

    setTranslate(x, y) {
        this.offset.x = x;
        this.offset.y = y;
        this.elem.style.transform = `translate(${ x }px, ${ y }px)`;
    }

    resetTranslate() {
        this.offset.x = 0;
        this.offset.y = 0;
        this.elem.style.transform = "translate(0, 0)";
    }
}


export const hover = new Hover();
