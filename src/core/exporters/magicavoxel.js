/* 
    Feb 2026
    @nimadez

    MagicaVoxel VOX Exporter
*/


class ExportersVox {
    constructor() {}

    exportVOX(voxels, dim) {
        const { palette, map } = this.buildPalette(voxels);

        const size = { x: dim.x, y: dim.z, z: dim.y };

        const sizeChunkBytes = 12;
        const xyziChunkBytes = 4 + voxels.length * 4;
        const rgbaChunkBytes = 256 * 4;
        const mainChildBytes = (12 + sizeChunkBytes) + (12 + xyziChunkBytes) + (12 + rgbaChunkBytes);
        const totalBytes = 8 + (12 + mainChildBytes);

        const buffer = new ArrayBuffer(totalBytes);
        const view = new DataView(buffer);

        let offset = 0;

        // Header
        this.writeString(view, offset, "VOX ");
        view.setUint32(offset + 4, 200, true);
        offset += 8;

        // MAIN
        offset = this.writeChunk(view, offset, "MAIN", 0, mainChildBytes);

        // SIZE
        offset = this.writeChunk(view, offset, "SIZE", sizeChunkBytes);
        view.setUint32(offset, size.x, true);
        view.setUint32(offset + 4, size.y, true);
        view.setUint32(offset + 8, size.z, true);
        offset += sizeChunkBytes;

        // XYZI
        offset = this.writeChunk(view, offset, "XYZI", xyziChunkBytes);
        view.setUint32(offset, voxels.length, true);
        offset += 4;

        let minX = Infinity, minY = Infinity, minZ = Infinity;
        let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

        for (let i = 0; i < voxels.length; i++) {
            const pos = voxels[i].position;
            minX = Math.min(minX, pos.x);
            minY = Math.min(minY, pos.y);
            minZ = Math.min(minZ, pos.z);
            maxX = Math.max(maxX, pos.x);
            maxY = Math.max(maxY, pos.y);
            maxZ = Math.max(maxZ, pos.z);
        }

        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;
        const centerZ = (minZ + maxZ) / 2;

        for (let i = 0; i < voxels.length; i++) {
            const pos = voxels[i].position;
            const adjustedX = pos.x - centerX;
            const adjustedY = pos.y - centerY;
            const adjustedZ = pos.z - centerZ;
            
            view.setUint8(offset++, adjustedX + (dim.x / 2));
            view.setUint8(offset++, -adjustedZ + (dim.z / 2));
            view.setUint8(offset++, adjustedY + (dim.y / 2));
            view.setUint8(offset++, map.get(hexToRgbaInt(voxels[i].color).join(",")));
        }

        // RGBA
        offset = this.writeChunk(view, offset, "RGBA", rgbaChunkBytes);
        for (let i = 0; i < palette.length; i++) {
            view.setUint8(offset++, palette[i][0]);
            view.setUint8(offset++, palette[i][1]);
            view.setUint8(offset++, palette[i][2]);
            view.setUint8(offset++, palette[i][3]);
        }

        return buffer;
    }

    buildPalette(voxels) {
        const palette = [[0, 0, 0, 0]]; // index 0
        const map = new Map();

        for (let i = 0; i < voxels.length; i++) {
            const rgba = hexToRgbaInt(voxels[i].color);
            const key = rgba.join(",");
            if (!map.has(key)) {
                map.set(key, palette.length + 1);
                palette.push(rgba);
            }
        }

        // Fill 256 colors
        while (palette.length < 256) {
            palette.push([0, 0, 0, 255]);
        }

        return { palette, map };
    }

    writeString(view, offset, str) {
        for (let i = 0; i < str.length; i++)
            view.setUint8(offset + i, str.charCodeAt(i));
    }

    writeChunk(view, offset, id, contentBytes, childrenBytes = 0) {
        this.writeString(view, offset, id);
        view.setUint32(offset + 4, contentBytes, true);
        view.setUint32(offset + 8, childrenBytes, true);
        return offset + 12;
    }
}


export const exportersVox = new ExportersVox();


function hexToRgbaInt(hex) {
    hex = hex.replace('#', '');
    return [
        parseInt(hex.slice(0, 2), 16),
        parseInt(hex.slice(2, 4), 16),
        parseInt(hex.slice(4, 6), 16),
        255
    ];
}
