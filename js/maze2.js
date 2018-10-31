// global variables
var renderer;
var scene;
var sceneOrtho;
var camera;
var cameraOrtho;

var collidableMeshList = [];
var enemies = [];
var updatableTraps = [];
var width = 150;

var player;
var level = 1;
var enemy;

var world;
var enemy;
var clock;

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
    world = new World();
    clock = new THREE.Clock;

    // create a camera, which defines where we're looking at.
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.rotation.order = 'YXZ';
    player = new Player(scene, camera);

    //experimental HUD garbage dumpsterfire
    cameraOrtho = new THREE.OrthographicCamera( - window.innerWidth / 2, window.innerWidth / 2, window.innerHeight / 2, - window.innerHeight / 2, 1, 10 );
    cameraOrtho.position.z = 10;
    DoHUD();

    // create a render, sets the background color and the size
    renderer = new THREE.WebGLRenderer();
    renderer.autoClear = false; //needed for the HUD to work with Ortho;
    renderer.setClearColor(0x000000, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;

    // add the output of the renderer to the html element
    document.body.appendChild(renderer.domElement);

    // call the render function, after the first render, interval is determined
    // by requestAnimationFrame
    AnimateCam();
    Render();
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
    renderer.render(sceneOrtho, cameraOrtho);
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
 * Experimental HUD. it works like this but honestly fuck putting it in classes everything breaks
 */
function DoHUD() {
    sceneOrtho = new THREE.Scene;

    var textureLoader = new THREE.TextureLoader;
    textureLoader.load("assets/sprites/heart.png", function (texture) {
        var material = new THREE.SpriteMaterial({map: texture});
        var width = material.map.image.width;
        var height = material.map.image.height;
        
        var sprite = new THREE.Sprite(material);
        sprite.scale.set(100, 100, 1);
    
        sceneOrtho.add(sprite);
    
        sprite.position.set(0,0,1);
    });

}

/**
 * Function handles the resize event. This make sure the camera and the renderer
 * are updated at the correct moment.
 */
function HandleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    cameraOrtho.left = - window.innerWidth / 2;
	cameraOrtho.right = window.innerWidth / 2;
	cameraOrtho.top = window.innerHeight / 2;
	cameraOrtho.bottom = - window.innerHeight / 2;
	cameraOrtho.updateProjectionMatrix();
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