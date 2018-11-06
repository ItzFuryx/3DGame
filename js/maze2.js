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
var hitOverlay;

/**
 * Models
 */
var arrowGeometry;
var slimeGeometry;
var slimeMaterial;
var turretGeometry;
var spikeGeometry;
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

 /**
  * Score
  */

  var deaths = 0;
  var kills = 0;
  var time = "10:30";

function Init() {
    LoadModels();
    world = new World();
    clock = new THREE.Clock;
    sceneOrtho = new THREE.Scene();

    // create a camera, which defines where we're looking at.
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.rotation.order = 'YXZ';
    player = new Player(scene, camera);

    //experimental gamefeel garbage dumpsterfire
    cameraOrtho = new THREE.OrthographicCamera(- window.innerWidth / 2, window.innerWidth / 2, window.innerHeight / 2, - window.innerHeight / 2, 1, 10);
    cameraOrtho.position.z = 10;

    var hitOverlayGeo = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight, 1, 1);
    var hitOverlayColor = new THREE.MeshBasicMaterial({color:0xff0000, side:THREE.DoubleSide, opacity:0.0, transparent:true})
    hitOverlay = new THREE.Mesh(hitOverlayGeo, hitOverlayColor);
    sceneOrtho.add(hitOverlay);
    //hitOverlay.material.opacity = 1.0;

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

    gamePanel = new GamePanel();
    //world.CreateNewMaze();

}
/**
 * @function LoadModels
 * Loads the object models.
 * When all the models are loaded, create the objects.
 */
function LoadModels() {
    mtlLoader.load('assets/slime/Materials.MTL', function (materials) {
        materials.preload();
        objLoader.load('assets/slime/model.obj', function (object) {
            slimeGeometry = object.children[0].geometry;
            slimeMaterial = object.children[0].material;
            world.CreateEnemies();
        });
    });
    
    objLoader.load('assets/tower/Turret.obj', function (object) {
        turretGeometry = object.children[0].geometry;
    });
    objLoader.load('assets/spikes/Spike.obj', function (object) {
        spikeGeometry = object.children[0].geometry;
        world.CreateTraps();
    });

    objLoader.load('assets/Arrow.obj', function (object) {
        arrowGeometry = object.children[0].geometry;
        world.CreateShootingTraps();
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
    renderer.render(sceneOrtho, cameraOrtho)
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
/**
 * @function AnimateCam
 * Updates the camera
 */
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