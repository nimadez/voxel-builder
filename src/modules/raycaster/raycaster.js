/* 
    Nov 2023
    @nimadez

    BVH Raycaster
*/
import { THREE } from '../three.js';


const nullMaterial = new THREE.MeshBasicMaterial();
const directions = [
    new THREE.Vector3(1,0,0),
    new THREE.Vector3(0,1,0),
    new THREE.Vector3(0,0,1),
    new THREE.Vector3(-1,0,0),
    new THREE.Vector3(0,-1,0),
    new THREE.Vector3(0,0,-1)
];


class Raycaster {
    constructor() {
        this.geom = undefined;
        this.mesh = undefined;
        this.ray = new THREE.Ray();
        this.box = new THREE.Box3();
        this.position = new THREE.Vector3();
        this.invMat = new THREE.Matrix4();
    }

    create() {
        builder.fillArrayBuffers();
        this.geom = new THREE.BufferGeometry();
        this.geom.setAttribute('position', new THREE.BufferAttribute(builder.positions, 3));
        this.geom.setIndex(new THREE.BufferAttribute(builder.indices, 1));
        this.buildBvh(this.geom, 25);
    }

    createFromData(positions, indices) {
        this.buildGeometry(new Float32Array(positions), new Uint32Array(indices), null);
    }

    createFromDataWithColor(positions, colors, indices) {
        this.buildGeometry(new Float32Array(positions), new Uint32Array(indices), new Float32Array(colors));
    }

    buildGeometry(positions, indices, colors = null) {
        if (this.geom) {
            this.geom.boundsTree.geometry.dispose();
            this.geom.dispose();
        }

        this.geom = new THREE.BufferGeometry();
        this.geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        if (colors) this.geom.setAttribute('color', new THREE.BufferAttribute(colors, 4));
        this.geom.setIndex(new THREE.BufferAttribute(indices, 1));
        this.buildBvh(this.geom);

        this.mesh = new THREE.Mesh(this.geom, nullMaterial);
        this.invMat.copy(this.mesh.matrixWorld).invert();
    }

    buildBvh(geometry, maxDepth = 40) {
        geometry.computeBoundsTree({
            //strategy: CENTER,
            maxDepth: maxDepth, // def: 40
            maxLeafTris: 10,    // def: 10
            indirect: true
        });
    }

    raycast(ox, oy, oz, dx, dy, dz) {
        this.ray.origin.set(ox, oy, oz);
        this.ray.direction.set(dx, dy, dz);
        return this.geom.boundsTree.raycastFirst(this.ray, THREE.DoubleSide);
    }

    raycastToPoint(ox, oy, oz, px, py, pz) {
        this.ray.origin.set(ox, oy, oz);
        this.ray.direction = new THREE.Vector3(px, py, pz).sub(this.ray.origin).normalize();
        return this.geom.boundsTree.raycastFirst(this.ray, THREE.DoubleSide);
    }

    raycastOmni(x, y, z) {
        this.ray.origin.set(x, y, z);
        let res = null;               // workaround for bakery cap-face-direction issue
        for (let i = 0; i < 6; i++) { // the first two directions will return the result
            this.ray.direction = directions[i]; // but in problematic cases, more is needed
            res = this.geom.boundsTree.raycastFirst(this.ray, THREE.DoubleSide);
            if (res && res.face.normal.dot(this.ray.direction) > 0)
                break;
        }
        return res;
    }

    boxHit(x, y, z) {
        this.position.set(x, y, z);
        this.box.min.setScalar(-0.5).add(this.position);
        this.box.max.setScalar(0.5).add(this.position);
        return this.geom.boundsTree.intersectsBox(this.box, this.invMat);
    }

    debug(isHit, ray = this.ray, dist = 1) {
        if (isHit) {
            const org = new BABYLON.Vector3(ray.origin.x, ray.origin.y, ray.origin.z);
            const dir = new BABYLON.Vector3(ray.direction.x, ray.direction.y, ray.direction.z);
            const helper = new BABYLON.RayHelper(new BABYLON.Ray(org, dir, dist));
            helper.show(uix.utilLayer.utilityLayerScene, BABYLON.Color3.Teal());
            setTimeout(() => {
                helper.dispose();
            }, 5000);
        }
    }

    dispose() {
        if (this.geom) {
            this.geom.boundsTree.geometry.dispose();
            this.geom.dispose();
            this.geom = null;
            this.mesh = null;
            this.ray = null;
            this.box = null;
            this.position = null;
            this.invMat = null;
        }
    }
}

export const rc = new Raycaster();

export function voxelizeMesh(mesh, scale, color) {
    const rcv = new Raycaster();
    
    rcv.createFromData(
        mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind),
        mesh.getIndices()
    );

    const data = [];
    const size = scale * 2;

    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            for (let z = 0; z < size; z++) {
                if (rcv.boxHit(x, y, z)) {
                    data.push({
                        position: new BABYLON.Vector3(x, y, z),
                        color: color,
                        visible: true
                    });
                }
            }
        }
    }
    
    rcv.dispose();
    return data;
}

export function voxelizeBake(mesh) {
    const rcv = new Raycaster();

    rcv.createFromDataWithColor(
        mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind),
        mesh.getVerticesData(BABYLON.VertexBuffer.ColorKind),
        mesh.getIndices()
    );

    const size = new THREE.Vector3();
    rcv.geom.boundingBox.getSize(size);
    size.x = (size.x / 2) - 0.5;
    size.y = (size.y / 2) - 0.5;
    size.z = (size.z / 2) - 0.5;

    const color = new THREE.Color();
    const data = [];

    for (let x = -size.x; x <= size.x; x++) {
        for (let y = -size.y; y <= size.y; y++) {
            for (let z = -size.z; z <= size.z; z++) {
                
                const res = rcv.raycastOmni(x, y, z);
                if (res && res.face.normal.dot(rcv.ray.direction) > 0) {
                    
                    const hex = color.fromBufferAttribute(rcv.geom.attributes.color, res.face.a)
                        .getHexString(THREE.SRGBColorSpace).toUpperCase();

                    data.push({
                        position: new BABYLON.Vector3(
                            mesh.position.x + x,
                            mesh.position.y + y,
                            mesh.position.z + z),
                        color: '#' + hex,
                        visible: true
                    });
                }
            }
        }
    }
    
    rcv.dispose();
    return data;
}
