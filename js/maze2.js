// global variables
var renderer;
var scene;
var camera;
var control;
var stats;
var controls;

var cubePos;
var collidableMeshList = [];

var width = 150;

var finishTargetPos;
var player;
var maze;
var level;
var enemy;

var plane;
var finishLight;
var endMesh;
var startMesh;
var enemy;

/**
 * Particles
 */
var stars;
/**
 * Initializes the scene, camera and objects. Called when the window is
 * loaded by using window.onload (see below)
 */
function init() {
    
    // create a scene, that will hold all our elements such as objects, cameras and lights.
    // generate a maze
    //var maze = new Maze(scene,15, width, width);    
    level = 1;

    createMaze();
    stars = new THREE.Stars(scene, 1800);

    enemy = new Enemy(scene);
    // create a camera, which defines where we're looking at.
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    player = new Player(scene, camera);
    //camera = new THREE.PerspectiveCamera(90, 1280/720, 0.1, 1000);

    // create a render, sets the background color and the size
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x000000, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;

    camera.position.x = player.position.x;
    camera.position.y = player.position.y + 4;
    camera.position.z = player.position.z;
    
    // add the output of the renderer to the html element
    document.body.appendChild(renderer.domElement);

    // call the render function, after the first render, interval is determined
    // by requestAnimationFrame
    animateCam();
    render();
}

/**
 * Called when the scene needs to be rendered. Delegates to requestAnimationFrame
 * for future renders
 */
function render() {
    // and render the scene
    renderer.render(scene, camera);
    player.Update();
    stars.Update();
    //enemy.update();
    // render using requestAnimationFrame
    requestAnimationFrame(render);
}

/**
 * Function handles the resize event. This make sure the camera and the renderer
 * are updated at the correct moment.
 */
function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
function animateCam() {
    requestAnimationFrame(animateCam);
    renderer.render(scene, camera);
}

function createMaze(){
    scene = null;
    
    collidableMeshList = [];

    var random = Math.floor((Math.random() * (level * 2) + (level * 1)));

    if (random < 4)
        random = 4;

    scene = new THREE.Scene();

    var maze = new Maze(scene, random, 150, 150);
    maze.generate();
    maze.draw();
    var walls = maze.getElements();
    walls.forEach(function (e) { collidableMeshList.push(e) });

    // create the ground plane
    var planeGeometry = new THREE.PlaneGeometry(width, width, 40, 40);
    var planeMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    planeMaterial.map = THREE.ImageUtils.loadTexture("assets/wood_1-1024x1024.png")
    planeMaterial.map.wrapS = planeMaterial.map.wrapT = THREE.RepeatWrapping;
    planeMaterial.map.repeat.set(4, 4);
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    // rotate and position the plane
    plane.rotation.x = -0.5 * Math.PI;
    //        plane.position.y = ;

    // add the plane to the scene
    scene.add(plane);

    var startWall = new THREE.BoxGeometry(10, 13, 1);
    var startMesh = new THREE.Mesh(startWall);
    startMesh.name = "start";
    startMesh.position.set(width / 2 - 5, 0, width / 2);
    scene.add(startMesh);
    collidableMeshList.push(startMesh);

    var endWall = new THREE.BoxGeometry(10, 13, 1);
    var endMesh = new THREE.Mesh(endWall);
    endMesh.name = "finish";
    endMesh.position.set(-width / 2 + 5, 0, -width / 2);
    scene.add(endMesh);
    collidableMeshList.push(endMesh);    

    var finishLight = new THREE.AmbientLight(0xbbbbff);
    var finishTarget = new THREE.Object3D();
    finishTarget.position.set(-60, 0, -60);
    finishTargetPos = finishTarget.position;
    finishLight.target = finishTarget;

    scene.add(finishLight);
}

function CreateNewMaze(){
    createMaze();
    level++;
    player.TeleportScene(scene);
    player.position = new THREE.Vector3(width / 2 - 10, 1, width / 2 - 10);
    camera.position = new THREE.Vector3(width / 2 - 10, 4, width / 2 - 10);
}
// calls the init function when the window is done loading.
window.onload = init;
// calls the handleResize function when the window is resized
window.addEventListener('resize', handleResize, false);

function KeyDown(event) {
    player.keyboard[event.keyCode] = true;
}

function KeyUp(event) {
    player.keyboard[event.keyCode] = false;
}

window.addEventListener('keydown', KeyDown);
window.addEventListener('keyup', KeyUp);