/* 
    Jul 2025
    @nimadez

    Color Picker Dialog
*/


import { pointer, helper, tool, xformer, ui } from '../core.js';
import { ReinventedColorWheel } from "reinvented-color-wheel";


const onChange = new Event('change', { bubbles: true });
const onInput = new Event('input', { bubbles: true });


class ColorPicker {
    constructor() {
        this.parent = document.getElementById('color-picker');
        this.wheel = document.getElementById('color-picker-wheel');
        this.selected = document.getElementById('color-picker-selected');
        this.inputHex = document.getElementById('color-picker-hex');
        this.inputRGB_r = document.getElementById('color-picker-rgb-r');
        this.inputRGB_g = document.getElementById('color-picker-rgb-g');
        this.inputRGB_b = document.getElementById('color-picker-rgb-b');

        this.colorWheel = undefined;

        this.hex = "#FFFFFF";
        this.rgb = [ 255, 255, 255 ];
        this.current = "#FFFFFF";
        this.previous = "#000000";

        this.isActive = false;
        this.target = undefined;
    }

    init() {
        this.colorWheel = new ReinventedColorWheel({
            appendTo: this.wheel,
            hex: this.hex,
            wheelDiameter: 112,
            wheelThickness: 16,
            handleDiameter: 10,
            wheelReflectsSaturation: false,

            onChange: (col) => {
                this.inputHex.value = col.hex.toUpperCase();
                this.inputRGB_r.value = col.rgb[0];
                this.inputRGB_g.value = col.rgb[1];
                this.inputRGB_b.value = col.rgb[2];
                this.current = this.inputHex.value;
                this.selected.children[1].style.background = this.current;

                if (this.isActive && this.target) {
                    this.target.value = this.current;
                    this.target.dispatchEvent(onChange);
                    this.target.dispatchEvent(onInput);
                }
            },
        });

        this.colorWheel.redraw();

        this.inputHex.addEventListener('change', (ev) => {
            const hex = ev.target.value.toUpperCase();
            if (!hex.startsWith("#") || hex.length !== 7) {
                ui.errorMessage("invalid hex color [#RRGGBB]");
            } else {
                this.colorWheel.hex = hex;
            }
        }, false);

        this.inputRGB_r.addEventListener('change', (ev) => {
            (parseInt(ev.target.value) >= 0 && parseInt(ev.target.value) <= 255) ?
                this.colorWheel.rgb = [ parseInt(ev.target.value), parseInt(this.inputRGB_g.value), parseInt(this.inputRGB_b.value) ] :
                ui.errorMessage("invalid color (0-255)");
        }, false);

        this.inputRGB_g.addEventListener('change', (ev) => {
            (parseInt(ev.target.value) >= 0 && parseInt(ev.target.value) <= 255) ?
                this.colorWheel.rgb = [ parseInt(this.inputRGB_r.value), parseInt(ev.target.value), parseInt(this.inputRGB_b.value) ] :
                ui.errorMessage("invalid color (0-255)");
        }, false);

        this.inputRGB_b.addEventListener('change', (ev) => {
            (parseInt(ev.target.value) >= 0 && parseInt(ev.target.value) <= 255) ?
                this.colorWheel.rgb = [ parseInt(this.inputRGB_r.value), parseInt(this.inputRGB_g.value), parseInt(ev.target.value) ] :
                ui.errorMessage("invalid color (0-255)");
        }, false);

        this.selected.children[0].onclick = () => {
            this.colorWheel.hex = this.previous;
        };

        for (const elem of document.querySelectorAll('input[type="color"]')) {
            elem.onclick = async (ev) => {
                ev.preventDefault();
                this.target = ev.target;
                const result = await this.showDialog(ev.target.value);
                if (result) {
                    ev.target.value = result;
                    ev.target.dispatchEvent(onChange);
                    ev.target.dispatchEvent(onInput);
                }
                this.target = undefined;
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
        this.isActive = true;
        this.colorWheel.hex = hex;
        this.parent.style.display = 'unset';
        this.parent.style.transform = `translate(${ pointer.x }px, ${ pointer.y }px)`;
        ui.domConfirmBlocker.style.display = 'unset';

        this.offScreenCheck();

        return new Promise((resolve) => {
            ui.domConfirmBlocker.onclick = () => {
                this.parent.style.display = 'none';
                ui.domConfirmBlocker.style.display = 'none';
                resolve(this.colorWheel.hex.toUpperCase());

                this.selected.children[0].style.background = this.colorWheel.hex;
                this.previous = this.colorWheel.hex;

                this.isActive = false;
            };
        });
    }
}


export const colorPicker = new ColorPicker();


export function createColorPickerInScreen() {
    const colorWheel = new ReinventedColorWheel({
        appendTo: ui.domColorWheel,
        hex: tool.currentColor,
        wheelDiameter: 112,
        wheelThickness: 14,
        handleDiameter: 10,
        wheelReflectsSaturation: false,

        onChange: (col) => {
            tool.currentColor = col.hex.toUpperCase();
            ui.domColorPicker.value = tool.currentColor;
            helper.clearOverlays();
            xformer.colorSelected();
        },
    });

    colorWheel.redraw();
    return colorWheel;
}
