/* 
    Aug 2019
    @nimadez

    Palette
*/

import { builder, xformer, ui, preferences } from "../core.js";


class Palette {
    constructor() {
        this.canvas = document.getElementById('canvas_palette');
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        
        this.width = 35;
        this.height = 25;
        this.pad = 2;
        this.wPad = this.width + this.pad;
        
        this.init();
    }
    
    init() {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;

        this.canvas.addEventListener("pointerdown", (ev) => {
            const hex = this.getCanvasColor(this.ctx, ev.offsetX, ev.offsetY);
            if (hex && builder.uniqueColors.includes(hex))
                ui.colorWheel.hex = hex;
        }, false);
                
        this.canvas.addEventListener("contextmenu", (ev) => {
            ev.preventDefault();
            if (xformer.isActive) return;
            const hex = this.getCanvasColor(this.ctx, ev.offsetX, ev.offsetY);
            if (hex && builder.uniqueColors.includes(hex)) {
                const index = builder.invisibleColors.indexOf(hex);
                (index > -1) ?
                    builder.invisibleColors.splice(index, 1) :
                    builder.invisibleColors.push(hex);
                builder.setVoxelsVisibilityByColor(hex, index > -1);
                builder.create();
            }
        }, false);

        this.canvas.addEventListener("dblclick", (ev) => {
            if (xformer.isActive) return;
            const hex = this.getCanvasColor(this.ctx, ev.offsetX, ev.offsetY);
            if (hex && builder.uniqueColors.includes(hex)) {
                const index = builder.invisibleColors.indexOf(hex);
                (index > -1) ?
                    builder.invisibleColors.splice(index, 1) :
                    builder.invisibleColors.push(hex);
                builder.setVoxelsVisibilityByColor(hex, index > -1);
                builder.create();
            }
        }, false);

        new ResizeObserver(() => {
            this.create();
        }).observe(this.canvas);
    }

    create() {
        const wPadSize = this.wPad * parseInt(preferences.getPaletteSize());

        ui.domPalette.style.width = 8 + wPadSize + "px";
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;

        let col = 0;
        let row = this.pad;

        for (const hex of builder.uniqueColors) {
            this.addColor(col + this.pad, row, hex);

            col += this.wPad;
            if (col >= wPadSize) {
                col = 0;
                row += this.height + this.pad;
            }
        }
    }

    expand(num) {
        ui.domPalette.style.width = 8 + ((this.width + this.pad) * num) + "px";
        this.canvas.width = ui.domPalette.clientWidth;
    }
    
    addColor(x, y, hex) {
        this.ctx.strokeStyle = 'transparent';
        if (builder.invisibleColors.indexOf(hex) > -1) {
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = 'orange';
            this.ctx.strokeRect(x, y, this.width, this.height);
        }
        this.ctx.fillStyle = hex;
        this.ctx.fillRect(x, y, this.width, this.height);
    }

    getCanvasColor(context, x, y) {
        const data = context.getImageData(x, y, 1, 1).data;
        return (data[3] > 0) ? rgbIntToHex(data[0], data[1], data[2]) : undefined;
    }
}

export const palette = new Palette();


function rgbIntToHex(r, g, b) {
    return '#' + (0x1000000 + b | (g << 8) | (r << 16)).toString(16).slice(1).toUpperCase();
}
