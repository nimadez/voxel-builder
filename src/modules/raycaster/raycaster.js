/* 
    Nov 2023
    @nimadez

    Raycasters
*/

import { THREE } from '../three.js';
import { Vector3, PositionKind, ColorKind } from '../babylon.js';


const nullMaterial = new THREE.MeshBasicMaterial();
const directions = [
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(0, -1, 0),
    new THREE.Vector3(0, 0, -1)
];


// Raycast Mesh


class RaycastMesh {
    constructor() {
        this.mesh = undefined;
        this.ray = new THREE.Ray();
        this.box = new THREE.Box3();
        this.position = new THREE.Vector3();
        this.invMat = new THREE.Matrix4();
    }

    createFromData(positions, indices) {
        this.buildGeometry(new Float32Array(positions), new Uint32Array(indices), null);
    }

    createFromDataWithColor(positions, colors, indices) {
        this.buildGeometry(new Float32Array(positions), new Uint32Array(indices), new Float32Array(colors));
    }

    buildGeometry(positions, indices, colors = null) {
        if (this.mesh) {
            this.mesh.geometry.boundsTree.geometry.dispose();
            this.mesh.geometry.dispose();
        }

        const geom = new THREE.BufferGeometry();
        geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        if (colors) geom.setAttribute('color', new THREE.BufferAttribute(colors, 4));
        geom.setIndex(new THREE.BufferAttribute(indices, 1));

        this.buildBvh(geom);

        this.mesh = new THREE.Mesh(geom, nullMaterial);
        this.invMat.copy(this.mesh.matrixWorld).invert();
    }

    buildBvh(geometry) {
        geometry.computeBoundsTree({
            strategy: 0,
            maxDepth: 40,
            maxLeafTris: 10,
            indirect: true
        });
    }

    // The first two directions will return the result
    // but in problematic cases more is needed
    raycastOmni(x, y, z) {
        this.ray.origin.set(x, y, z);
        for (const direction of directions) {
            this.ray.direction.copy(direction);
            const res = this.mesh.geometry.boundsTree.raycastFirst(this.ray, THREE.DoubleSide);
            if (res && res.face.normal.dot(this.ray.direction) > 0)
                return res;
        }
        return undefined;
    }

    boxHit(x, y, z) {
        this.position.set(x, y, z);
        this.box.min.setScalar(-0.5).add(this.position);
        this.box.max.setScalar(0.5).add(this.position);
        return this.mesh.geometry.boundsTree.intersectsBox(this.box, this.invMat);
    }

    raycastFace(ox, oy, oz, dx, dy, dz) {
        this.ray.origin.set(ox, oy, oz);
        this.ray.direction.set(dx, dy, dz);
        return this.mesh.geometry.boundsTree.raycastFirst(this.ray, THREE.DoubleSide);
    }

    dispose() {
        if (this.mesh) {
            this.mesh.geometry.boundsTree.geometry.dispose();
            this.mesh.geometry.dispose();
            this.mesh = null;
            this.ray = null;
            this.box = null;
            this.position = null;
            this.invMat = null;
        }
    }
}


// Raycast Voxelize


class RaycastVoxelize {
    constructor() {}

    mesh_voxel(mesh, color) {
        const rcm = new RaycastMesh();
        
        rcm.createFromData(
            mesh.getVerticesData(PositionKind),
            mesh.getIndices()
        );

        const size = new THREE.Vector3();
        rcm.mesh.geometry.boundingBox.getSize(size);
        size.addScalar(0.5);
    
        const data = [];
    
        for (let x = 0; x < size.x; x++) {
            for (let y = 0; y < size.y; y++) {
                for (let z = 0; z < size.z; z++) {

                    if (rcm.boxHit(x, y, z)) {

                        data.push({
                            position: Vector3(x, y, z),
                            color: color,
                            visible: true
                        });
                    }
                }
            }
        }
        
        rcm.dispose();
        return data;
    }
    
    bake_voxel(mesh) {
        const rcm = new RaycastMesh();
    
        rcm.createFromDataWithColor(
            mesh.getVerticesData(PositionKind),
            mesh.getVerticesData(ColorKind),
            mesh.getIndices()
        );
    
        const size = new THREE.Vector3();
        rcm.mesh.geometry.boundingBox.getSize(size);
        size.x = (size.x / 2) - 0.5;
        size.y = (size.y / 2) - 0.5;
        size.z = (size.z / 2) - 0.5;
    
        const color = new THREE.Color();
        const data = [];
    
        for (let x = -size.x; x <= size.x; x++) {
            for (let y = -size.y; y <= size.y; y++) {
                for (let z = -size.z; z <= size.z; z++) {
                    
                    const res = rcm.raycastOmni(x, y, z);
                    if (res) {
                        const hex = color.fromBufferAttribute(
                            rcm.mesh.geometry.attributes.color, res.face.a)
                                .getHexString(THREE.SRGBColorSpace).toUpperCase();
    
                        data.push({
                            position: Vector3(
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
        
        rcm.dispose();
        return data;
    }    
}

export const rcm = new RaycastMesh();
export const rcv = new RaycastVoxelize();
