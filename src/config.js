//
// Notice: Backup before updating, or use the "update.py" script.
//
// - Electron is required to load environment maps from file://
// - Changes are applied with a refresh (F5) and there is no need to restart Electron.

export const config = {

    default_environment_map: "./assets/hdr_overcast_soil_puresky_1k.hdr",
    custom_environment_maps: [
        "https://media.githubusercontent.com/media/KhronosGroup/glTF-Sample-Environments/main/footprint_court.hdr",
        "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/equirectangular/venice_sunset_1k.hdr",
        "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/equirectangular/pedestrian_overpass_1k.hdr",
        "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/equirectangular/blouberg_sunrise_2_1k.hdr",
        "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/equirectangular/quarry_01_1k.hdr",
        // "file:///path/to/envmap.hdr"
    ],

    cdn_babylonjs_inspector: "https://cdn.babylonjs.com/v9.3.1/inspector/babylon.inspector.bundle.js",

    debug_clear_localstorage: false,
    debug_force_mobile: false,
    debug_gpu_probe: false,

};
