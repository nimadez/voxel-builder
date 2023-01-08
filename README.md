# Voxel Builder

![banner](https://repository-images.githubusercontent.com/565157149/a9fc7534-727b-4b8c-8f5d-03fa42091f0b "banner")

### **Voxel-based 3D modeling application**
A 3D modeling application for designers, artists and architects, to explore and develop ideas quickly, easily, and creatively, written in JavaScript using Babylon.js and available for both desktop and mobile devices

**Version 3.9.4 Beta 2023**

[ [Try now](https://nimadez.github.io/voxel-builder) ]<br>
[Changelog](https://github.com/nimadez/voxel-builder/blob/main/CHANGELOG) | [Bug report](https://github.com/nimadez/voxel-builder/issues/) | [Discussions](https://github.com/nimadez/voxel-builder/discussions/)

## Features

+ **MODEL**<br>Create, manipulate, draw and paint voxel particles
+ **BAKE**<br>Bake voxel particles into mesh, transform, replicate and setup materials
+ **RENDER**<br>Take screenshot, or export to GLB for more advanced use cases
- File I/O, custom VBX format
- Load from MagicaVoxel *(voxel and color)*
- Export to GLB or render to pixel perfect PNG
- Quick save and load, undo and redo
- Terrain, cube, sphere, oval, plane, isometric room generator
- OBJ and image voxelization *(JPG, PNG, SVG)*
- Symmetric drawing and painting, symmetrize and mirror
- Modeling toolset, shape drawing and painting *(e.g. box and wall)*
- Transformable workplane to draw anywhere in the space
- Axis view *(similar to Blender)*
- Bake voxel particles into mesh
- Clone, instance, replicate, merge bakes and parts
- Simple PBR rendering, HDR image, camera and post-process settings
- WASD controls on desktop, joystick controls on touchscreen
- Asset viewer *(load OBJ, GLB, STL, FBX, HDR, EXR, export OBJ/GLB)*
- Pixel Monk *(integrated pixel editor)*
- Clean handcrafted user-interface
- Single HTML file

##### ***Supported Platforms***
- Electron
- Google Chrome for desktop
- Google Chrome for mobile devices *(partially)*
<br><sub>* *Tablet recommended for best experience*</sub>
<br><sub>* *Optimized for desktop and high-end mobile devices*</sub>

## Known Issues
```
[ Voxel is a Particle ]
Each voxel is a particle, we used particles to build the world!
Pros: higher performance on desktop and mobile
Cons: unable to remove shared faces

[ Max. 64.000 (40x40x40) Voxel Particles ]
You may go up to 256K but you can't interact with voxels:
- Picking issue (need a GPU picking shader)
- SPS rebuild delay (CPU issue)

https://nimadez.github.io/voxel-builder/tests/sps-pick
https://nimadez.github.io/voxel-builder/tests/sps-rebuild
Pick test: 24 fps | Rebuild test: 800~1000 ms delay
(Intel Core i5 8600K 3.6Ghz, nVidia GTX-1050-Ti 4GB)

Workaround: bake to mesh, 64K voxels per bake!

[ The Challenge ]
Minimum dependency, single "index.html" file
Babylon.js and Three.js (addons) only
```

## History
```
3.8.0 -> advancing to the next level
3.6.0 -> major code rewrite
3.4.0 -> new features and ui/ux overhaul
3.0.0 -> SPS particles to build the world
0.0.0 -> start a playground to learn Babylon.js
```

###### 3.0.0 *(BJS 4)* to 3.8.0<br>
![screenshot](media/devshots.jpg?raw=true "Screenshot")
## License
Code released under the [MIT license](https://github.com/nimadez/voxel-builder/blob/main/LICENSE).

## Credits
<a href="https://www.babylonjs.com/"><img width="200" src="https://raw.githubusercontent.com/BabylonJS/Brand-Toolkit/master/babylonjs_identity/fullColor/babylonjs_identity_color.svg"></a>
- [Babylon.js](https://www.babylonjs.com/)
- [Three.js](https://threejs.org/) *(asset-viewer)*
- [MagicaVoxel](https://ephtracy.github.io/)
- [Electron](https://www.electronjs.org/)
- [Google Material Icons](https://github.com/google/material-design-icons)
- [Droid Sans Font](https://www.android.com/)
- [Blender](https://blender.org/)
- [KhronosGroup glTF-Sample-Models](https://github.com/KhronosGroup/glTF-Sample-Models)
- [KhronosGroup glTF-Sample-Environments](https://github.com/KhronosGroup/glTF-Sample-Environments)

###### This project is available at [Babylon.js Demos](https://www.babylonjs.com/community/) and [Babylon.js Forum](https://forum.babylonjs.com/t/voxel-builder-voxel-based-3d-modeling/)
