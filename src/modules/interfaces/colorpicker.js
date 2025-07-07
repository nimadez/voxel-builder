/* 
    Jul 2025
    @nimadez

    Color Picker Dialog
*/

import { pointer, ui } from '../core.js';
import { ReinventedColorWheel } from '../modules.js';


const onChange = new Event('change', { bubbles: true });
const onInput = new Event('input', { bubbles: true });


class ColorPicker {
    constructor() {
        this.parent = document.getElementById('color-picker');
        this.wheel = document.getElementById('color-picker-wheel');
        this.selected = document.getElementById('color-picker-selected');
        this.inputHex = document.getElementById('color-picker-hex');
        this.inputRGB = document.getElementById('color-picker-rgb');
        this.buttons = document.getElementById('color-picker-buttons');

        this.colorWheel = undefined;

        this.hex = "#FFFFFF";
        this.rgb = [ 255, 255, 255 ];
        this.current = "#FFFFFF";
        this.previous = "#000000";
    }

    init() {
        this.colorWheel = new ReinventedColorWheel({
            appendTo: this.wheel,
            hex: this.hex,
            wheelDiameter: 112,
            wheelThickness: 16,
            handleDiameter: 12,
            wheelReflectsSaturation: false,

            onChange: (col) => {
                this.inputHex.value = col.hex.toUpperCase();
                this.inputRGB.value = col.rgb;
                this.current = this.inputHex.value;
                this.selected.children[1].style.background = this.inputHex.value;
            },
        });

        this.colorWheel.redraw();

        this.inputHex.addEventListener('change', (ev) => {
            this.colorWheel.hex = ev.target.value.toUpperCase();
        }, false);

        this.inputRGB.addEventListener('change', (ev) => {
            this.colorWheel.rgb = ev.target.value.split(',');
        }, false);

        this.selected.children[0].onclick = () => {
            this.colorWheel.hex = this.previous;
        };

        for (const elem of document.querySelectorAll('input[type="color"]')) {
            elem.onclick = async (ev) => {
                ev.preventDefault();
                const result = await this.showDialog(ev.target.value);
                if (result) {
                    ev.target.value = result;
                    ev.target.dispatchEvent(onChange);
                    ev.target.dispatchEvent(onInput);
                }
            };
        }
    }

    offScreenCheck(pad = 10) {
        const rect = this.parent.getBoundingClientRect();
        if (rect.x + rect.width > window.innerWidth)
            this.parent.style.transform = `translate(${ window.innerWidth - rect.width - pad }px, ${ pointer.y }px)`;
        if (rect.y + rect.height > window.innerHeight)
            this.parent.style.transform = `translate(${ pointer.x }px, ${ window.innerHeight - rect.height - pad }px)`;
        if (rect.x + rect.width > window.innerWidth && rect.y + rect.height > window.innerHeight)
            this.parent.style.transform = `translate(${ window.innerWidth - rect.width - pad }px, ${ window.innerHeight - rect.height - pad }px)`;
    }

    async showDialog(hex) {
        this.colorWheel.hex = hex;
        this.parent.style.display = 'unset';
        this.parent.style.transform = `translate(${ pointer.x }px, ${ pointer.y }px)`;
        ui.domConfirmBlocker.style.display = 'unset';

        this.offScreenCheck();

        return new Promise((resolve) => {
            this.buttons.children[0].onclick = () => {
                this.parent.style.display = 'none';
                ui.domConfirmBlocker.style.display = 'none';
                resolve(undefined);
            };
            this.buttons.children[1].onclick = () => {
                this.parent.style.display = 'none';
                ui.domConfirmBlocker.style.display = 'none';
                resolve(this.colorWheel.hex.toUpperCase());

                this.selected.children[0].style.background = this.colorWheel.hex;
                this.previous = this.colorWheel.hex;
            };
            ui.domConfirmBlocker.onclick = () => {
                this.parent.style.display = 'none';
                ui.domConfirmBlocker.style.display = 'none';
                resolve(undefined);
            };
        });
    }
}

export const colorPicker = new ColorPicker();
