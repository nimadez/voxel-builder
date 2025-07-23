/* 
    Jul 2025
    @nimadez

    Swipe Confirm
*/

import { ui } from '../core.js';


class Confirm {
    constructor() {
        this.isAccept = false;
        this.isDragging = false;
        this.startX = 0;
        this.maxSwipe = 0;
        this.currentLeft = 0;

        this.completion = 0.65;

        this.interval = undefined;
    }

    init() {
        ui.domConfirm.children[0].addEventListener('mousedown', this.onPointerDown, false);
        document.addEventListener('mousemove', this.onPointerMove, false);
        document.addEventListener('mouseup', this.onPointerUp, false);

        ui.domConfirm.children[0].addEventListener('touchstart', this.onPointerDown, false);
        document.addEventListener('touchmove', this.onPointerMove, false);
        document.addEventListener('touchend', this.onPointerUp, false);
    }

    onPointerDown(ev) {
        confirm.isDragging = true;
        confirm.startX = (ev.touches) ? ev.touches[0].clientX : ev.clientX;

        ui.domConfirm.children[0].style.left = '0px';
        ui.domConfirm.children[0].style.transition = 'none';
    }

    onPointerMove(ev) {
        if (confirm.isDragging) {
            const deltaX = ((ev.touches) ? ev.touches[0].clientX : ev.clientX) - confirm.startX;

            // constrain within bounds
            confirm.maxSwipe = ui.domConfirm.offsetWidth - ui.domConfirm.children[0].offsetWidth;
            confirm.currentLeft = Math.max(0, Math.min(deltaX, confirm.maxSwipe));
            ui.domConfirm.children[0].style.left = `${ confirm.currentLeft }px`;
        }
    }

    onPointerUp(ev) {
        if (confirm.isDragging) {
            confirm.isDragging = ev.touches;

            ui.domConfirm.children[0].style.transition = 'left 0.3s ease-out';

            const completionThreshold = confirm.maxSwipe * confirm.completion;
            
            if (confirm.currentLeft >= completionThreshold) {
                ui.domConfirm.children[0].style.left = `${ confirm.maxSwipe }px`;
                ui.domConfirm.children[0].style.transition = 'none';
                confirm.isAccept = true;
            } else {
                ui.domConfirm.children[0].style.left = '0px';
                ui.domConfirm.children[0].style.transition = 'none';
                confirm.isAccept = false;
            }
        }
    }

    confirm() {
        this.isAccept = false;

        ui.domConfirm.children[0].style.left = '0px';
        ui.domConfirm.children[0].style.transition = 'none';

        return new Promise(resolve => {
            clearInterval(this.interval);
            this.interval = setInterval(() => {
                if (this.isAccept) {
                    clearInterval(this.interval);
                    resolve();
                }
            }, 200);
        });
    }
}

export const confirm = new Confirm();
