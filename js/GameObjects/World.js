class World {
    constructor() {
        this.CreateMaze();
        this.plane;
        this.maze;
        this.finishTargetPos;
    }

    CreateMaze() {
        console.log("level: " + level);

        collidableMeshList = [];
        scene = new THREE.Scene();
        var random = Math.floor((Math.random() * (level * 2) + (3 + level)));

        this.maze = new Maze(scene, random, 150, 150);
        this.maze.generate();
        this.maze.draw();
        var walls = this.maze.getElements();
        walls.forEach(function (e) { collidableMeshList.push(e) });

        // create the ground plane
        var planeGeometry = new THREE.PlaneGeometry(width, width, 40, 40);
        var planeMaterial = new THREE.MeshLambertMaterial({});
        planeMaterial.map = THREE.ImageUtils.loadTexture("assets/grasstundra-94x94.png");
        planeMaterial.map.wrapS = planeMaterial.map.wrapT = THREE.RepeatWrapping;
        planeMaterial.map.repeat.set(3, 3);
        this.plane = new THREE.Mesh(planeGeometry, planeMaterial);
        this.plane.receiveShadow = true;
        this.plane.rotation.x = -0.5 * Math.PI;
        scene.add(this.plane);

        var startWall = new THREE.BoxGeometry(2, 5, 1);
        var startMesh = new THREE.Mesh(startWall);
        startMesh.name = "start";
        startMesh.position.set(width / 2 - 5, 0, width / 2);
        collidableMeshList.push(startMesh);
        scene.add(startMesh);

        var endWall = new THREE.BoxGeometry(2, 5, 1);
        var endMesh = new THREE.Mesh(endWall);
        endMesh.name = "finish";
        endMesh.position.set(-width / 2 + 5, 0, -width / 2);
        collidableMeshList.push(endMesh);
        scene.add(endMesh);

        var finishLight = new THREE.AmbientLight(0xbbbbff);
        var finishTarget = new THREE.Object3D();
        finishTarget.position.set(-60, 0, -60);
        finishLight.target = finishTarget;
        this.finishTargetPos = finishTarget.position;

        var directionalLight = new THREE.DirectionalLight(0x0000ff, 0.5);
        scene.add(directionalLight);
        scene.add(finishLight);

        this.CreateDamageAbles();
        this.CreateSkyBox();

        stars = new THREE.Stars(scene, 1800);
        blood = new THREE.BloodFX(scene);
    }

    CreateNewMaze() {
        level++;
        this.CreateMaze();
        player.TeleportScene(scene);
    }

    CreateSkyBox() {
        var loader = new THREE.TextureLoader();
        loader.load('assets/skybox.jpg', function (texture) {
            var sphericalSkyboxGeometry = new THREE.SphereGeometry(500, 32, 32);
            var sphericalSkyboxMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
            var sphericalSkybox = new THREE.Mesh(sphericalSkyboxGeometry, sphericalSkyboxMaterial);
            scene.add(sphericalSkybox);
        });
    }

    CreateDamageAbles() {
        var amountOfTraps = Math.floor((Math.random() * (level * 10) + (level * 5)));
        
        /*for (var i = 0; i < amountOfTraps; i++) {
            new Trap();
            updatableTraps.push(new ShootingTrap());
        }*/
        for (var i = 0; i < 3; i++) {
            enemies.push(new Enemy());
        }        
    }
}