/* 
    Dec 2023
    @nimadez

    Utilities
*/

function numToColor(num) {
    return [ 
        ((num & 0xff0000) >> 16),
        ((num & 0x00ff00) >>  8),
        ((num & 0x0000ff) >>  0)
     ];
}

function readTexturePixels(gl, texture, x, y, w, h) {
    const frameBuffer = gl.createFramebuffer();
    const pixels = new Uint8Array(w * h * 4);
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.readPixels(x, y, w, h, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    return pixels;
}

function removeDuplicatesArray(arr) {
    return arr.filter((value, index, self) =>
        index === self.findIndex(i =>
            i.position.x == value.position.x &&
            i.position.y == value.position.y &&
            i.position.z == value.position.z
        ));
}

function loadUrl(url, callback, onerror = null) {
    fetch(url).then((res) => {
        if (res.status !== 200) {
            if (onerror) onerror();
            return;
        }
        res.text().then((data) => {
            callback(data);
        });
    }).catch((err) => {
        if (onerror) onerror();
    });
}

function downloadText(txt, filename) {
    const blob = new Blob([ txt ], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

function downloadImage(imgSrc, filename) {
    const a = document.createElement("a");
    a.href = imgSrc;
    a.download = filename;
    a.click();
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

async function saveFile(blob, filename, reject) {
    // to show a file dialog in Chrome
    if (!isElectron() && !isMobile) {
        try {
            const fileHandle = await self.showSaveFilePicker({
                suggestedName: filename,
                types: [ { description: "File" } ]
            });
            const writeFile = async (fileHandle, contents) => {
                const writable = await fileHandle.createWritable();
                await writable.write(contents);
                await writable.close();
            };
            writeFile(fileHandle, blob).then(() => {
                //
            });
        } catch (err) {
            // canceled
        }
    } else { // showSaveFilePicker browser compatibility
        reject();
    }
}

function saveDialog(data, filename) {
    const blob = new Blob([ data ], { type: "text/plain" });
    saveFile(blob, filename, () => {
        downloadText(data, filename);
    });
}

function saveDialogImage(data, filename) {
    const blob = dataURItoBlob(data);
    saveFile(blob, filename, () => {
        downloadImage(data, filename);
    });
}

function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ ab ], { type: mimeString });
    return blob;
}

function toggleFullscreen() {
    (document.fullscreenElement) ? document.exitFullscreen() : document.body.requestFullscreen();
}

function isMobileDevice() {
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
        return true;
    }
    return false;
}

function isElectron() {
    if (typeof window !== 'undefined' && typeof window.process === 'object' && window.process.type === 'renderer') return true;
    if (typeof process !== 'undefined' && typeof process.versions === 'object' && !!process.versions.electron) return true;
    if (typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0) return true;
    return false;
}

function isOffScreen(elem, minPad = 20) {
    const rect = elem.getBoundingClientRect();
    return ((rect.x + (rect.width/2) - minPad) < 0 || (rect.x + minPad) > window.innerWidth ||
            (rect.y + minPad) < 0 || (rect.y + minPad) > window.innerHeight);
}

function aspectRatioFit(srcW, srcH, maxW, maxH) {
    const ratio = Math.min(maxW / srcW, maxH / srcH);
    return { width: srcW * ratio, height: srcH * ratio };
}

function getStyleRoot(key) {
    return getComputedStyle(document.querySelector(':root')).getPropertyValue(key);
}

function evenNumberIndicatorInt(elem) {
    (Math.abs(parseInt(elem.value) % 2) == 1) ? // detect odd numbers
        elem.style.color = 'indianred' :
        elem.style.color = getStyleRoot('--input-color');
}

function rgbIntToHex(r, g, b) {
    return '#' + (0x1000000 + b | (g << 8) | (r << 16)).toString(16).slice(1).toUpperCase();
}

function rgbFloatToHex(r, g, b) { // thanks to @labris
    const hr = Math.max(0, Math.min(255, Math.round(r * 255))).toString(16);
    const hg = Math.max(0, Math.min(255, Math.round(g * 255))).toString(16);
    const hb = Math.max(0, Math.min(255, Math.round(b * 255))).toString(16);
    return ("#" +
        (hr.length<2?"0":"") + hr +
        (hg.length<2?"0":"") + hg +
        (hb.length<2?"0":"") + hb).toUpperCase();
}

function hexToRgbFloat(hex, gamma = 2.2) { // 1 / 0.4545
    return {
        r: Math.pow(parseInt(hex.substring(1, 3), 16) / 255, gamma),
        g: Math.pow(parseInt(hex.substring(3, 5), 16) / 255, gamma),
        b: Math.pow(parseInt(hex.substring(5, 7), 16) / 255, gamma)
    }
}

function randomHexColor() {
    return "#000000".replace(/0/g, () => {
        return (~~(Math.random()*16)).toString(16).toUpperCase();
    });
}

function gradientHexArray(hexStart, hexEnd, count) {
    const start = hexToRgbFloat(hexStart);
    const end = hexToRgbFloat(hexEnd);
    const arr = [];
    let a = 0;
    for (let i = 0; i < count; i++) {
        a += (1 / count);
        arr.push(rgbFloatToHex(
            start.r * a + (1 - a) * end.r,
            start.g * a + (1 - a) * end.g,
            start.b * a + (1 - a) * end.b
        ));
    }
    return arr;
}

function getCanvasColor(context, x, y) {
    const data = context.getImageData(x, y, 1, 1).data;
    if (data[3] > 0) return rgbIntToHex(data[0], data[1], data[2]);
    return null;
}

function randomRangeInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function parseBool(val) {
    return val === true || val === "true";
}

function timeFormat(t) {
    const sec_num = parseInt(t, 10);
    let h = Math.floor(sec_num / 3600);
    let m = Math.floor((sec_num - (h * 3600)) / 60);
    let s = sec_num - (h * 3600) - (m * 60);
    if (h < 10) { h = "0" + h; }
    if (m < 10) { m = "0" + m; }
    if (s < 10) { s = "0" + s; }
    return h + ':' + m + ':' + s;
}

function parseINI(data) {
    const regex = {
        section: /^\s*\[\s*([^\]]*)\s*\]\s*$/,
        param: /^\s*([^=]+?)\s*=\s*(.*?)\s*$/,
        comment: /^\s*;.*$/
    };
    const value = {};
    const lines = data.split(/[\r\n]+/);
    let section = null;
    lines.forEach((line) => {
        if (regex.comment.test(line)) {
            return;
        } else if (regex.param.test(line)) {
            const match = line.match(regex.param);
            if (section) {
                value[section][match[1]] = match[2];
            } else{
                value[match[1]] = match[2];
            }
        } else if (regex.section.test(line)) {
            const match = line.match(regex.section);
            value[match[1]] = {};
            section = match[1];
        } else if (line.length == 0 && section) {
            section = null;
        }
    });
    return value;
}
