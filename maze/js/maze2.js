// global variables
var renderer;
var scene;
var sceneOrtho;
var camera;
var cameraOrtho;

var collidableMeshList = [];
var enemies = [];
var updatableTraps = [];
var arrows = [];
var width = 150;

var player;
var level = 1;
var enemy;

var world;
var enemy;
var clock;
var gamePanel;
var time;

/**
 * Models
 */
var arrowGeometry;
var arrowMaterial;
/**
 * Loaders
 */
const textureLoader = new THREE.TextureLoader();
const mtlLoader = new THREE.MTLLoader();
const objLoader = new THREE.OBJLoader();

/**
 * Particles
 */
var stars;
var blood;

/**
 * Initializes the scene, camera and objects. Called when the window is
 * loaded by using window.onload (see below)
 */
function Init() {

    LoadModels();
    world = new World();
    clock = new THREE.Clock;

    // create a camera, which defines where we're looking at.
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.rotation.order = 'YXZ';
    player = new Player(scene, camera);

    // create a render, sets the background color and the size
    renderer = new THREE.WebGLRenderer();
    renderer.autoClear = false; //needed for the HUD to work with Ortho;
    renderer.setClearColor(0x000000, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    // add the output of the renderer to the html element
    document.body.appendChild(renderer.domElement);

    // call the render function, after the first render, interval is determined
    // by requestAnimationFrame
    AnimateCam();
    Render();

    gamePanel = new GamePanel()

}

function LoadModels() {
    mtlLoader.load('assets/Arrow.MTL', function(materials) {
        materials.preload();
        objLoader.load('assets/Arrow.obj', function(object) {
            arrowGeometry = object.children[0].geometry;
            arrowMaterial = object.children[0].material;

            world.CreateObjectsWithModels();
        });
    });
}


/**
 * Called when the scene needs to be rendered. Delegates to requestAnimationFrame
 * for future renders
 */
function Render() {
    var deltatime = clock.getDelta();
    // and render the scene
    renderer.clear();
    renderer.render(scene, camera);
    renderer.clearDepth();
    player.Update(deltatime);
    stars.Update(deltatime);
    blood.Update(deltatime);
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].Update(deltatime);
    }
    for (var i = 0; i < updatableTraps.length; i++) {
        updatableTraps[i].Update(deltatime);
    }

    requestAnimationFrame(Render);
}


/**
 * Function handles the resize event. This make sure the camera and the renderer
 * are updated at the correct moment.
 */
function HandleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function AnimateCam() {
    requestAnimationFrame(AnimateCam);
    renderer.render(scene, camera);
}

// calls the init function when the window is done loading.
window.onload = Init;
// calls the handleResize function when the window is resized
window.addEventListener('resize', HandleResize, false);

function KeyDown(event) {
    player.keyboard[event.keyCode] = true;
}

function KeyUp(event) {
    player.keyboard[event.keyCode] = false;
}

window.addEventListener('keydown', KeyDown);
window.addEventListener('keyup', KeyUp);