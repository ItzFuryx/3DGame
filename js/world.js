/** @function parseCommand
* @param {string} input
* @returns {command} returns the given command.
*/
function parseCommand(input = "") {
    return JSON.parse(input);
}
    var exampleSocket;
    var simplex = new SimplexNoise();
    /** @function window.onloads
    * Runs when the program starts.
    */
    window.onload = function () {
        /**
        * create the variables
        */
        var camera, scene, renderer;
        var cameraControls;

        var worldObjects = {};
        var waterObjects = [];

        var params = {
            lightColor: 0xe29822,
            waterSpeed: 0.01,
            balloonFlySpeed: 0.2,
            jitterSpeed: 0.1,
            minLightBrightness: 0.8,
            maxLightBrightness: 5,
            objSideBob: 0.04,
            waveSize: 0.3
        };

        var balloonObjects = [];
        var animatedLight = [];
        /**
        * Initialize 
        */
        function init() {
            //Sets the camera positions
            camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1500);
            cameraControls = new THREE.OrbitControls(camera);
            camera.position.z = 15;
            camera.position.y = 5;
            camera.position.x = 15;
            cameraControls.update();
            scene = new THREE.Scene();

            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight + 5);

            renderer.shadowMapEnabled = true;
            //If you want soft shadow maps (which is almost always the preferred type)
            renderer.shadowMapType = THREE.PCFSoftShadowMap;


            document.body.appendChild(renderer.domElement);

            window.addEventListener('resize', onWindowResize, false);

            //Add the ground and the water
            CreateGround();
            water = CreateWater();
            scene.add(water);

            //Add a skybox
            var sphericalSkyboxGeometry = new THREE.SphereGeometry(1000, 32, 32);
            var sphericalSkyboxMaterial = new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("textures/DIX0qdoXUAEx7Iw.jpg"), side: THREE.DoubleSide});
            var sphericalSkybox = new THREE.Mesh(sphericalSkyboxGeometry, sphericalSkyboxMaterial);
            scene.add(sphericalSkybox);

            //Browser controls
            var gui = new dat.GUI();

            gui.addColor(params, 'lightColor').onChange(function (value) {
                for (var i = 0; i < animatedLight.length; i++) {
                    var light = animatedLight[i];
                    light.color.setHex(value);
                }
            });

            gui.add(params, 'waterSpeed', 0.01, 1).step(0.01).onChange(function (value) {
                water.uniforms.uTime.value = value;
            });

            gui.add(params, 'waveSize', 0.01, 3).step(0.01).onChange(function (value) {
                water.uniforms.waveSize.value = value;
            })

            gui.add(params, 'balloonFlySpeed', 0.2, 2).step(0.01).onChange(function (value) {
                params.balloonFlySpeed = value;
            });

            gui.add(params, 'jitterSpeed', 0.1, 10).step(0.1).onChange(function (value) {
                params.jitterSpeed = value;
            });

            gui.add(params, "objSideBob", 0.01, 1).step(0.01).onChange(function (value) {
                params.objSideBob = value;
            });

            gui.open();

        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
        /**
        *   @function animate
        *   Run all functions that contains any form of animation.
        */
        function animate() {
            requestAnimationFrame(animate);
            UpdateWater();
            UpdateModelsMesh();
            BalloonAnimation();
            LightAnimation();
            cameraControls.update();
            renderer.render(scene, camera);
        }
        /**
        *   @function resolveAfterXSeconds
        *   @param {int} time in miliseconds
        *   @returns {promise} timeout
        */
        function resolveAfterXSeconds(ms) {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve('resolved');
                }, ms);
            });
        }
        /**
        *   @function CreateWater
        *   @return {water} return the water object
        */
        function CreateWater(){
          var vertShader = `
				uniform float uTime;
                uniform float waveSize;
				varying vec2 vUV;
				varying vec3 WorldPosition;
				void main() {
					vec3 pos = position;
					pos.z += cos(pos.x * 5.0 + uTime) * waveSize * sin(pos.y * 5.0 + uTime);
					WorldPosition = pos;
					vUV = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);
				}
				`;

        var fragShader = `
        varying vec2 vUV;

        uniform sampler2D uSurfaceTexture;
        uniform float uTime;

        void main(){

        vec4 color = vec4(0.0,0.7,1.0,0.5);
        vec2 pos = vUV * 2.0;

    		pos.y -= uTime * 0.002;

				vec4 WaterLines = texture2D(uSurfaceTexture,pos);
				color.rgba += WaterLines.r * 0.1;

        gl_FragColor = color;
				}

        `;
        /** places texture on the water */
        var waterLinesTexture = THREE.ImageUtils.loadTexture( 'textures/WaterTexture.png' );
				waterLinesTexture.wrapS = THREE.RepeatWrapping;
				waterLinesTexture.wrapT = THREE.RepeatWrapping;

        var uniforms = {
						uTime: { value: 0.0 },
            uSurfaceTexture: { type: "t", value: waterLinesTexture },
            waveSize: {value: 0.3}
					};

          var geometry = new THREE.PlaneGeometry(50, 50, 50, 50);
          geometry.dynamic = true;
          var material = new THREE.ShaderMaterial( {
					uniforms: uniforms,
					vertexShader: vertShader,
					fragmentShader: fragShader,
					transparent:true,
				    } );
          var water = new THREE.Mesh(geometry, material);
          water.rotation.x = -Math.PI / 2.0;

          water.uniforms = uniforms;
          water.material = material;

          return water;
        }
        /** @function UpdateWater */
        function UpdateWater() {
            water.uniforms.uTime.value += params.waterSpeed;
        }
        /** @function UpdateModelsMesh 
        *   Update all the objects laying in the water
        */
        function UpdateModelsMesh(){
				for(var i=0;i<waterObjects.length;i++){
					var obj = waterObjects[i];
					if(obj == undefined) continue;
					if(obj.time == undefined){
						obj.time = Math.random() * Math.PI * 2;
						obj.initialPosition = obj.position.clone();
						obj.initialRotation = obj.rotation.clone();
					}
					obj.time += 0.05;
					// Move object up and down
          if(obj.position.y <= -0.2){
					       obj.position.y = obj.initialPosition.y + Math.cos(obj.time) * 0.07;
          }
                    // Rotate object slightly
                    obj.rotation.x = obj.initialRotation.x + Math.cos(obj.time * 0.25) * params.objSideBob;
                    obj.rotation.z = obj.initialRotation.z + Math.sin(obj.time * 0.5) * 2 * params.objSideBob;
				}
        }
        /** @function CreateGround 
        *   Create the ground-layer beneath the water
        */
        function CreateGround(){
          var geometry = new THREE.PlaneGeometry(50, 50, 50, 50);
          var material = new THREE.MeshPhongMaterial({ color: 0xffffff });
          var ground = new THREE.Mesh(geometry, material);
          ground.rotation.x = -Math.PI / 2.0;
          ground.position.y = -2.5;

          scene.add(ground);
        }
        /** @function addPointLight 
        *   @param {object} object
        *   @param {string} color
        *   @param {int} x
        *   @param {int} y
        *   @param {int} z
        *   @param {int} intensity of the light
        *   @param {int} distance of the light
        *   @param {bool} castshadow If set to true the light will cast shadow
        *   @param {int} jitter
        *   @param {bool} animated If set to true the light object will be added to the animatedLight array
        */
        function addPointLight(object, color, x, y, z, intensity, distance, castshadow, jitter, animated){
            var light = new THREE.PointLight(color, intensity, distance);
            light.position.set(x, y, z);
            light.castshadow = castshadow;
            light.jitter = jitter;
            object.add(light);
            // var pointLightHelper = new THREE.PointLightHelper(light);
            // scene.add(pointLightHelper);
            if(animated)
                animatedLight.push(light);
        }

        exampleSocket = new WebSocket("ws://" + window.location.hostname + ":" + window.location.port + "/connect_client");
        exampleSocket.onmessage = function (event) {
            var command = parseCommand(event.data);

            if (command.command == "update") {
                if (Object.keys(worldObjects).indexOf(command.parameters.guid) < 0) {
                    if (command.parameters.type === "robot" && worldObjects[command.parameters.guid] == null) {
                        var robotG = new robot();
                        scene.add(robotG);
                        worldObjects[command.parameters.guid] = robotG;
                    }
                    if(command.parameters.type === "truck" && worldObjects[command.parameters.guid] == null){
                        var truckG = new truck();
                        truckG._amountOfPackages = 4;
                        var lanternG1 = new lantern(truckG.position.x + 1, truckG.position.y + 0.65, truckG.position.z);
                        addPointLight(truckG, params.lightColor, truckG.position.x + 1, truckG.position.y + 0.65, truckG.position.z, 2.5, 4, true, 0, true);

                        var lanternG2 = new lantern(truckG.position.x - 1.75, truckG.position.y + 1, truckG.position.z);
                        addPointLight(truckG, params.lightColor, truckG.position.x - 1.75, truckG.position.y + 1, truckG.position.z, 2.5, 4, true, 0, true);

                        truckG.add(lanternG1);
                        truckG.add(lanternG2);
                        scene.add(truckG);
                        worldObjects[command.parameters.guid] = truckG;
                        waterObjects.push(truckG);
                    }
                    if(command.parameters.type === "shelf" && worldObjects[command.parameters.guid] == null){
                            var shelfG = new shelf();
                            var _lantern = new lantern(shelfG.position.x, 0.8, shelfG.position.z);
                            var _balloon = new balloon();

                            _balloon.visibility = false;
                            _balloon.animation = false;

                                var FullCrate = new THREE.Group();

                                FullCrate.add(shelfG);
                                FullCrate.add(_lantern);
                                FullCrate.add(_balloon);

                        addPointLight(FullCrate, params.lightColor, FullCrate.position.x, 0.7, FullCrate.position.z, 2.5, 4,  true, 0, true);

                                scene.add(FullCrate);

                                worldObjects[command.parameters.guid] = FullCrate;
                                waterObjects.push(FullCrate);
                    }
                    if(command.parameters.type === "warehouse" && worldObjects[command.parameters.guid] == null){
                        var warehouseG = new warehouse();
                        scene.add(warehouseG);
                        worldObjects[command.parameters.guid] = warehouseG;
                    }
                    if (command.parameters.type === "airplane" && worldObjects[command.parameters.guid] == null) {
                        var airplaneG = new airplaine();

                        var lanternG1 = new lantern(airplaneG.position.x + 4.25, airplaneG.position.y + 1, airplaneG.position.z);
                        addPointLight(airplaneG, params.lightColor, airplaneG.position.x + 4.25, airplaneG.position.y + 1, airplaneG.position.z, 2.5, 4, true, 0, true);

                        var lanternG2 = new lantern(airplaneG.position.x - 0.007, airplaneG.position.y + 0.16, airplaneG.position.z + 0.7);
                        addPointLight(airplaneG, params.lightColor, airplaneG.position.x - 0.007, airplaneG.position.y + 0.16, airplaneG.position.z + 0.7, 2.5, 2, true, 0, true);

                        var lanternG3 = new lantern(airplaneG.position.x - 0.007, airplaneG.position.y + 0.16, airplaneG.position.z - 0.7);
                        addPointLight(airplaneG, params.lightColor, airplaneG.position.x - 0.007, airplaneG.position.y + 0.16, airplaneG.position.z - 0.7, 2.5, 2, true, 0, true);
                        addPointLight(airplaneG, params.lightColor, airplaneG.position.x, airplaneG.position.y + 2.5, airplaneG.position.z + 2.1, 2.5, 2, true, 0, true);
                        addPointLight(airplaneG, params.lightColor, airplaneG.position.x, airplaneG.position.y + 2.5, airplaneG.position.z - 2.1, 2.5, 2, true, 0, true);

                        airplaneG.add(lanternG1);
                        airplaneG.add(lanternG2);
                        airplaneG.add(lanternG3);
                        scene.add(airplaneG);
                        worldObjects[command.parameters.guid] = airplaneG;
                    }
                }

                UpdateWorldObjects();
                /**
                *   @async
                *   @function UpdateWorldObjects
                *   Update all the objects in the world.
                */
                async function UpdateWorldObjects(){
                    var object = worldObjects[command.parameters.guid];

                    object.position.x = command.parameters.x;
                    object.position.y = command.parameters.y;
                    object.position.z = command.parameters.z;

                    object.visible = command.parameters.visibility;


                    object.rotation.x = command.parameters.rotationX;
                    object.rotation.y = command.parameters.rotationY;
                    object.rotation.z = command.parameters.rotationZ;

                    /** 
                    *   Checks if the shelfs are falling from the plaine. 
                    *   If true, make the balloons appear.
                    */
                    if(command.parameters.isFlying){
                        for(var i = 0; i < object.children.length; i++){
                            var balloonObject = object.children[2];
                            balloonObject.animation = false;
                            if(balloonObjects.indexOf(balloonObject) < 0)
                            {
                                balloonObject.visibility = true;
                                balloonObjects.push(balloonObject);
                            }
                        }
                        /** Set the balloon animation on false */
                    } else if (!command.parameters.isFlying && !command.parameters.needsRestock && command.parameters.type === "shelf"){
                        for(var i = 0; i <object.children.length; i++){
                            var balloonObject = object.children[2];
                            balloonObject.animation = true;
                        }
                    }
                }
            }
        }
        /** 
        *   @function BalloonAnimation
        *   Make the balloons fall down - reset the balloons.
        */
        function BalloonAnimation(){

            for(var i = 0; i < balloonObjects.length; i++){
                child = balloonObjects[i];
                if(child.animation){
                    if (Math.round(child.position.y) < 15)
                        child.position.y += params.balloonFlySpeed;
                    else if (Math.round(child.position.y) >= 15){
                        child.position.y = 0;
                        child.visibility = false;
                        child.animation = false;
                        balloonObjects.splice(i, 1);
                    }
                }
            }
        }
        /**
        *   @function LightAnimation
        *   Create animation for the light
        */
        function LightAnimation(){
            for(var i = 0; i < animatedLight.length; i++){
                var light = animatedLight[i];
                var noise = simplex.noise2D(1, light.jitter);
                light.jitter += Math.random() * params.jitterSpeed;
                if (light.power <= params.minLightBrightness)
                    noise = noise * noise;
                if (light.power >= params.maxLightBrightness)
                  noise = noise * -1;

            light.power = light.power + noise;
          }
        }

        init();
        animate();
    }
