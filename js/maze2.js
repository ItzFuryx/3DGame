


    // global variables
    var renderer;
    var scene;
    var camera;
    var control;
    var stats;
    var isTweening = false;
    var controls;

    var cubePos;
    var collidableMeshList = [];

    var width = 150;

    var keyboard = {};
    var player = { height: 1.8, speed: 0.3, turnSpeed:Math.PI * 0.02};
    
    var cubeBase;
    var finishTargetPos;
    function createCube() {
        var cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
        var cubeMaterial = new THREE.MeshPhongMaterial({color: 0x008000, transparent: false, opacity: 0.8});
        var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.castShadow = true;
        cube.name = 'cube';
        cube.position = new THREE.Vector3(width/2 - 3, 1, width/2 - 3);

        //temp
        cubeBase = cube.position;

        cubePos  = cube.position;
        scene.add(cube);
       
        return cube;
    }

    /**
     * Initializes the scene, camera and objects. Called when the window is
     * loaded by using window.onload (see below)
     */
    function init() {



        // create a scene, that will hold all our elements such as objects, cameras and lights.
        scene = new THREE.Scene();
        // generate a maze
        //var maze = new Maze(scene,15, width, width);

        var level = 5;
        
        var random = Math.floor((Math.random() * (level * 2) + (level * 1)));

        if(random < 4) 
            random = 4;
        var maze = new Maze(scene, random, 150,150);
        maze.generate();
        maze.draw();
        var walls = maze.getElements();
        walls.forEach(function(e) {collidableMeshList.push(e)});
        


        // add cube
        createCube();

        //setupKeyboardControls();

        // create a camera, which defines where we're looking at.
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        //camera = new THREE.PerspectiveCamera(90, 1280/720, 0.1, 1000);
     
        // create a render, sets the background color and the size
        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(0x000000, 1.0);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMapEnabled = true;

        // create the ground plane
        
        var planeGeometry = new THREE.PlaneGeometry(width, width, 40, 40);
        var planeMaterial = new THREE.MeshPhongMaterial({color: 0xffffff});
        planeMaterial.map = THREE.ImageUtils.loadTexture("assets/wood_1-1024x1024.png")
        planeMaterial.map.wrapS = planeMaterial.map.wrapT = THREE.RepeatWrapping;
        planeMaterial.map.repeat.set( 4, 4 );
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.receiveShadow = true;
        // rotate and position the plane
        plane.rotation.x = -0.5 * Math.PI;
//        plane.position.y = ;

        // add the plane to the scene
        scene.add(plane);

        var startWall = new THREE.BoxGeometry(10,2,1);
        var startMesh = new THREE.Mesh(startWall);
        startMesh.position.set(width/2-5,0,width/2);
        scene.add(startMesh);
        collidableMeshList.push(startMesh);

        var endWall = new THREE.BoxGeometry(10,2,1);
        var endMesh = new THREE.Mesh(endWall);
        endMesh.position.set(-width/2+5,0,-width/2);
        scene.add(endMesh);
        collidableMeshList.push(endMesh);
       
        //  position and point the camera to the center of the scene
        camera.position.x = cubePos.x;
        camera.position.y = cubePos.y + 4;
        camera.position.z = cubePos.z;
        // camera.lookAt(new THREE.Vector3(0, cubePos.y ,0));

        // camera.position.x = 70;
        // camera.position.y = 130;
        // camera.position.z = 130;
        // camera.lookAt(new THREE.Vector3(10,0,35));
        // controls = new THREE.TrackballControls( camera );

        // add spotlight for the finish line
        var finishLight = new THREE.AmbientLight(0xbbbbff );
        // finishLight.position.set(-50, 70, -50);
        // finishLight.shadowCameraNear = 20;
        // finishLight.shadowCameraFar = 50;
        // finishLight.castShadow = true;
        // finishLight.intensity = 0.5;
        
        var finishTarget = new THREE.Object3D();
        finishTarget.position.set(-60,0,-60);
        finishTargetPos = finishTarget.position;
        finishLight.target = finishTarget;
        // var finishTarget = new THREE.Object3D();
        // finishTarget.position.set(-60,0,-60);
        // finishLight.target = finishTarget;
        
        scene.add(finishLight);

        // add spotlight for the starting point
        // var startLight = new THREE.SpotLight(0x00ff00);
        // startLight.position.set(50, 70, 50);
        // startLight.shadowCameraNear = 10;
        // startLight.shadowCameraFar = 50;
        // startLight.castShadow = true;
        // startLight.intensity = 0.5;

        // var startTarget = new THREE.Object3D();
        // startTarget.position.set(60,0,60);
        // startLight.target = startTarget;

        // scene.add(startLight);

        // // add directionlight for general illumination
        // var directionalLight = new THREE.DirectionalLight({color:0xaaaaaa});
        // directionalLight.castShadow = true;
        // directionalLight.position.set(0,50,50);
        // directionalLight.intensity = 0.6;

        // scene.add(directionalLight);



        // setup the control object for the control gui

        // setup the control object for the control gui
        control = new function () {
            this.forward = function () {
                takeStepForward(scene.getObjectByName('cube'), 0, 0.5 * Math.PI, 100);
            };
            this.back = function () {
                takeStepBackward(scene.getObjectByName('cube'), 0, 0.5 * Math.PI, 400);
            };
            this.left = function () {
                takeStepLeft(scene.getObjectByName('cube'), 0, 0.5 * Math.PI, 400);
            };
            this.right = function () {
                takeStepRight(scene.getObjectByName('cube'), 0, 0.5 * Math.PI, 400);
            };
        };

        // add extras
        addControlGui(control);
        addStatsObject();


        // add the output of the renderer to the html element
        document.body.appendChild(renderer.domElement);

        // call the render function, after the first render, interval is determined
        // by requestAnimationFrame
        animateCam();
        render();
    }


    function addControlGui(controlObject) {
        var gui = new dat.GUI();
        gui.add(controlObject,'forward');
        gui.add(controlObject,'back');
        gui.add(controlObject,'left');
        gui.add(controlObject,'right');

    }

    function addStatsObject() {
        stats = new Stats();
        stats.setMode(0);

        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';

        document.body.appendChild( stats.domElement );
    }


    /**
     * Called when the scene needs to be rendered. Delegates to requestAnimationFrame
     * for future renders
     */
    function render() {

        // update stats
        stats.update();

        // and render the scene
        renderer.render(scene, camera);

        TWEEN.update();


        //controls.update();

        // render using requestAnimationFrame
        requestAnimationFrame(render);
    }

    // function detectCollision() {
    //     // collision detection:
    //     //   determines if any of the rays from the cube's origin to each vertex
    //     //		intersects any face of a mesh in the array of target meshes
    //     //   for increased collision accuracy, add more vertices to the cube;
    //     //		for example, new THREE.BoxGeometry( 64, 64, 64, 8, 8, 8, wireMaterial )
    //     //   HOWEVER: when the origin of the ray is within the target mesh, collisions do not occur
    //     var cube = scene.getObjectByName('cube');
    //     var originPoint = cube.position.clone();


    //     for (var vertexIndex = 0; vertexIndex < cube.geometry.vertices.length; vertexIndex++)
    //     {
    //         var localVertex = cube.geometry.vertices[vertexIndex].clone();
    //         var globalVertex = localVertex.applyMatrix4( cube.matrix );
    //         var directionVector = globalVertex.sub( cube.position );

    //         var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
    //         var collisionResults = ray.intersectObjects( collidableMeshList );

    //         if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() )
    //         {

    //             // if we've got a hit, we just stop the current walk and reset to base point
    //             var tweens = TWEEN.getAll();

    //             if (tweens.length > 0) {

    //                 tweens[0].stop();
    //                 TWEEN.removeAll();
    //                 isTweening = false;

    //                 scene.remove(cube);
    //                 cube = createCube();
    //             }
    //         }
    //     }
    // }

    // function setupKeyboardControls() {
    //     document.onkeydown = checkKey;
    
    //     function checkKey(e) {
    
    //         e = e || window.event;
    
    //         if (e.keyCode == '37') {
    //             // left
                // takeStepLeft(scene.getObjectByName('cube'), 0, 0.5 * Math.PI, 100);
    //         }
    //         if (e.keyCode == '38') {
    //             // up
    //             takeStepForward(scene.getObjectByName('cube'), 0, 0.5 * Math.PI, 100);
    //         }
    //         if (e.keyCode == '39') {
    //             // right
    //             takeStepRight(scene.getObjectByName('cube'), 0, 0.5 * Math.PI, 100);
    //         }
    //         else if (e.keyCode == '40') {
    //             // down
    //             takeStepBackward(scene.getObjectByName('cube'), 0, 0.5 * Math.PI, 100);
    //         }
    //     }
    //}
    function detectCollision() {
        
        // collision detection:
        //   determines if any of the rays from the cube's origin to each vertex
        //		intersects any face of a mesh in the array of target meshes
        //   for increased collision accuracy, add more vertices to the cube;
        //		for example, new THREE.BoxGeometry( 64, 64, 64, 8, 8, 8, wireMaterial )
        //   HOWEVER: when the origin of the ray is within the target mesh, collisions do not occur
        var cube = scene.getObjectByName('cube');
        var originPoint = cube.position.clone();
        //console.log(cube.geometry.verticles.length);
        
        if(cube.position == finishTargetPos){
            console.log("finish");
        }    
        for (var vertexIndex = 0; vertexIndex < cube.geometry.vertices.length; vertexIndex++)
        { 
            var localVertex = cube.geometry.vertices[vertexIndex].clone();
            var globalVertex = localVertex.applyMatrix4( cube.matrix );
            var directionVector = globalVertex.sub( cube.position );
    
            var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );

            var collisionResults = ray.intersectObjects( collidableMeshList );
            
            if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() )
            {
                console.log(collisionResults[0].object.position);
                if(collisionResults[0].object.position.x == -70 && collisionResults[0].object.position.y == 0 && collisionResults[0].object.position.z == -75){
                    console.log("Finish");
                } else {
                    console.log("regular wall");
                }
                console.log("collided yea");
                // cube.position.set(72,1,72);
                // camera.position.set(72,5,72);
                return true;
                // if we've got a hit, we just stop the current walk and reset to base point
                // var tweens = TWEEN.getAll();
    
                // if (tweens.length > 0) {
    
                //     tweens[0].stop();
                //     TWEEN.removeAll();
                //     isTweening = false;
    
                //     scene.remove(cube);
                //     cube = createCube();
                // }
            }
        }
        return false;
    }
    
    function takeStepRight(cube, start, end, time) {
        var pos = scene.getObjectByName('cube').position;

        var cubeGeometry = cube.geometry;
        var widht = 4;
        if (!isTweening) {
            var tween = new TWEEN.Tween({ x: start, cube: cube, previous: 0})
                    .to({ x: end }, time )
                    .easing(TWEEN.Easing.Linear.None)
                    .onStart(function () {
                        isTweening = true;
                        cube.position.y += -widht / 2;
                        cube.position.z += -widht / 2;
                        cubeGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, widht / 2, widht / 2));
                    })
                    .onUpdate(function () {
                        cube.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-(this.x - this.previous)));
                        cube.geometry.verticesNeedUpdate = true;
                        cube.geometry.normalsNeedUpdate = true;
                        this.previous = this.x;
                    })
                    .onComplete(function () {
                        cube.position.y += 2;
                        cube.position.z += -2;
                        cubeGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, -widht / 2, widht / 2));
                        cube.position.x = Math.round(cube.position.x);
                        cube.position.y = Math.round(cube.position.y);
                        cube.position.z = Math.round(cube.position.z);
                        isTweening = false;
                    })
                    .start();
        }
    }

    function takeStepLeft(cube, start, end, time) {
        var pos = scene.getObjectByName('cube').position;
        var cubeGeometry = cube.geometry;
        var widht = 4;
        if (!isTweening) {
            var tween = new TWEEN.Tween({ x: start, cube: cube, previous: 0})
                    .to({ x: end }, time )
                    .easing(TWEEN.Easing.Linear.None)
                    .onStart(function () {
                        isTweening = true;
                        cube.position.y += -widht / 2;
                        cube.position.z += widht / 2;
                        cubeGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, widht / 2, -widht / 2));
                    })
                    .onUpdate(function () {
                        cube.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(this.x - this.previous));
                        cube.geometry.verticesNeedUpdate = true;
                        cube.geometry.normalsNeedUpdate = true;
                        this.previous = this.x;
                    })
                    .onComplete(function () {
                        cube.position.y += 2;
                        cube.position.z += 2;
                        cubeGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, -widht / 2, -widht / 2));
                        cube.position.x = Math.round(cube.position.x);
                        cube.position.y = Math.round(cube.position.y);
                        cube.position.z = Math.round(cube.position.z);
                        isTweening = false;
                    })
                    .start();
        }
    }

    function takeStepBackward(cube, start, end, time) {
        var widht = 4;
        var cubeGeometry = cube.geometry;
        var pos = scene.getObjectByName('cube').position;
        console.log(pos);
        if (!isTweening) {
            var tween = new TWEEN.Tween( { x: start, cube: cube, previous: 0} )
                    .to( { x: end }, time )
                    .easing( TWEEN.Easing.Linear.None )
                    .onStart( function() {

                        isTweening = true;
                        cube.position.y+=-widht/2;
                        cube.position.x+=widht/2;
                        cubeGeometry.applyMatrix(new THREE.Matrix4().makeTranslation( -widht/2,  widht/2, 0 ) );
                    })
                    .onUpdate( function () {
                        cube.geometry.applyMatrix( new THREE.Matrix4().makeRotationZ( -(this.x-this.previous) ) );
                        cube.geometry.verticesNeedUpdate=true;
                        cube.geometry.normalsNeedUpdate = true;
                        cube.previous = this.x;
                        this.previous = this.x;
                    } )
                    .onComplete(function() {
                        cube.position.y+=2;
                        cube.position.x+=2;

                        cubeGeometry.applyMatrix(new THREE.Matrix4().makeTranslation( -widht/2, -widht/2, 0 ) );

                        cube.position.x=Math.round(cube.position.x);
                        cube.position.y=Math.round(cube.position.y);
                        cube.position.z=Math.round(cube.position.z);

                        isTweening = false;
                    })
                    .start();
        }
    }

    function takeStepForward(cube, start, end, time) {
        var widht = 2;
        var cubeGeometry = cube.geometry;
    
    
    
        if (!isTweening) {
            var tween = new TWEEN.Tween( { x: start, cube: cube, previous: 0} )
                    .to( { x: end }, time )
                    .easing( TWEEN.Easing.Linear.None )
                    .onStart( function() {
                        isTweening = true;
                        cube.position.y+=-widht/2;
                        cube.position.x+=-widht/2;
                        cubeGeometry.applyMatrix(new THREE.Matrix4().makeTranslation( widht/2,  widht/2, 0 ) );
                    })
                    .onUpdate( function () {
                        cube.geometry.applyMatrix( new THREE.Matrix4().makeRotationZ( (this.x-this.previous) ) );
    
                        cube.geometry.verticesNeedUpdate=true;
                        cube.geometry.normalsNeedUpdate = true;
    
                        cube.previous = this.x;
                        this.previous = this.x;
                    } )
                    .onComplete(function() {
                        cube.position.y+=widht/2;
                        cube.position.x+=-widht/2;
                        cubeGeometry.applyMatrix(new THREE.Matrix4().makeTranslation( widht/2, -widht/2, 0 ) );
    
                        cube.position.x=Math.round(cube.position.x);
                        cube.position.y=Math.round(cube.position.y);
                        cube.position.z=Math.round(cube.position.z);
    
                        isTweening = false;
                    })
                    .start();
        }
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
    function animateCam(){
        
        requestAnimationFrame(animateCam);

        if(keyboard[87]) {// W key
            var positionOld = camera.position.clone();

            camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
            camera.position.z -= Math.cos(camera.rotation.y) * player.speed;
            scene.getObjectByName('cube').position.x = camera.position.x;
            scene.getObjectByName('cube').position.z = camera.position.z;

            if(detectCollision()){
                camera.position.x = positionOld.x;
                camera.position.z = positionOld.z;
                scene.getObjectByName('cube').position.x = positionOld.x;
                scene.getObjectByName('cube').position.z = positionOld.z;
            }
        }
        if(keyboard[83]) {// S key
            var positionOld = camera.position.clone();

            camera.position.x += Math.sin(camera.rotation.y) * player.speed;
            camera.position.z += Math.cos(camera.rotation.y) * player.speed;
            scene.getObjectByName('cube').position.x = camera.position.x;
            scene.getObjectByName('cube').position.z = camera.position.z;

            if(detectCollision()){
                camera.position.x = positionOld.x;
                camera.position.z = positionOld.z;
                scene.getObjectByName('cube').position.x = positionOld.x;
                scene.getObjectByName('cube').position.z = positionOld.z;
            }
        }
        if(keyboard[65]) {// A key
            var positionOld = camera.position.clone();
            console.log("test a");
            camera.position.x -= Math.sin(camera.rotation.y + Math.PI/2) * player.speed;
            camera.position.z -= Math.cos(camera.rotation.y + Math.PI/2) * player.speed;
            scene.getObjectByName('cube').position.x = camera.position.x;
            scene.getObjectByName('cube').position.z = camera.position.z;

            if(detectCollision()){
                camera.position.x = positionOld.x;
                camera.position.z = positionOld.z;
                scene.getObjectByName('cube').position.x = positionOld.x;
                scene.getObjectByName('cube').position.z = positionOld.z;
            }
        }
        if(keyboard[68]) {// D key
            var positionOld = camera.position.clone();

            camera.position.x -= Math.sin(camera.rotation.y - Math.PI/2) * player.speed;
            camera.position.z -= Math.cos(camera.rotation.y - Math.PI/2) * player.speed;
            scene.getObjectByName('cube').position.x = camera.position.x;
            scene.getObjectByName('cube').position.z = camera.position.z;
            
            if(detectCollision()){
                camera.position.x = positionOld.x;
                camera.position.z = positionOld.z;
                scene.getObjectByName('cube').position.x = positionOld.x;
                scene.getObjectByName('cube').position.z = positionOld.z;
            }
        }
    
        if(keyboard[37]){ // left arrow key
            camera.rotation.y += player.turnSpeed;
            console.log("test cl");
        }
    
        if(keyboard[39]){ // right arrow key
            camera.rotation.y -= player.turnSpeed;
        }
        renderer.render(scene, camera);
    }
    function keyDown(event){
        keyboard[event.keyCode] = true;
    }
    
    function keyUp(event){
        keyboard[event.keyCode] = false;
    }
    
    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);
    // calls the init function when the window is done loading.
    window.onload = init;
    // calls the handleResize function when the window is resized
    window.addEventListener('resize', handleResize, false);
