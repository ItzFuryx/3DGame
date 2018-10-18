THREE.Player = function (scene) {
    var _this = this;
    this.enabled = true;
    this.scene = scene;
    this.position = new THREE.Vector3(0, 0, 0);
    this.object;
    this.height = 1.8;
    this.speed = .25;
    this.turnSpeed = Math.PI * 0.02;
    this.collisionobj;
    this.health = new Health(5);
    var keyboard = {};

    var Geometry = new THREE.BoxGeometry(2, 2, 2);
    var Material = new THREE.MeshPhongMaterial({ color: 0x008000, transparent: false, opacity: 0.8 });
    var object = new THREE.Mesh(Geometry, Material);
    var collision = new THREE.Mesh(Geometry, Material);
    object.castShadow = true;
    object.name = 'player';
    object.position = new THREE.Vector3(width / 2 - 1, 1, width / 2 - 3);

    this.position = object.position;
    this.object = object;
    this.collisionobj = collision;
    scene.add(object);
    scene.add(collision);

    this.update = function () {

        if (keyboard[87]) {// W key
            var newPosition = camera.position.clone();

            newPosition.x -= Math.sin(camera.rotation.y) * player.speed;
            newPosition.z -= Math.cos(camera.rotation.y) * player.speed;

            if (!player.detectCollision(newPosition)) {
                camera.position = newPosition;
                player.position.x = newPosition.x;
                player.position.z = newPosition.z;
            }
        }
        if (keyboard[83]) {// S key
            var newPosition = camera.position.clone();

            newPosition.x += Math.sin(camera.rotation.y) * player.speed;
            newPosition.z += Math.cos(camera.rotation.y) * player.speed;

            if (!player.detectCollision(newPosition)) {
                camera.position = newPosition;
                player.position.x = newPosition.x;
                player.position.z = newPosition.z;
            }
        }
        if (keyboard[65]) {// A key
            var newPosition = camera.position.clone();
            newPosition.x -= Math.sin(camera.rotation.y + Math.PI / 2) * player.speed;
            newPosition.z -= Math.cos(camera.rotation.y + Math.PI / 2) * player.speed;

            if (!player.detectCollision(newPosition)) {
                camera.position = newPosition;
                player.position.x = newPosition.x;
                player.position.z = newPosition.z;
            }
        }
        if (keyboard[68]) {// D key
            var newPosition = camera.position.clone();

            newPosition.x -= Math.sin(camera.rotation.y - Math.PI / 2) * player.speed;
            newPosition.z -= Math.cos(camera.rotation.y - Math.PI / 2) * player.speed;

            if (!player.detectCollision(newPosition)) {
                camera.position = newPosition;
                player.position.x = newPosition.x;
                player.position.z = newPosition.z;
            }
        }

        if (keyboard[37]) { // left arrow key
            camera.rotation.y += player.turnSpeed;
        }

        if (keyboard[39]) { // right arrow key
            camera.rotation.y -= player.turnSpeed;
        }
    }

    this.detectCollision = function (position) {
        this.collisionobj.position = position;
        var obj = this.collisionobj;
        var originPoint = this.collisionobj.position;
        var collide = false;

        for (var vertexIndex = 0; vertexIndex < obj.geometry.vertices.length; vertexIndex++) {
            var localVertex = obj.geometry.vertices[vertexIndex].clone();
            var globalVertex = localVertex.applyMatrix4(obj.matrix);
            var directionVector = globalVertex.sub(this.collisionobj.position);

            var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
            var collisionResults = ray.intersectObjects(collidableMeshList);

            if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
                if (collisionResults[0].object.name == "finish") {
                    CreateNewMaze();
                }
                this.health.DeltaHealth(1);
                collide = true;
            }
        }
        console.log("Collided = " + collide);
        return collide;
    }

    this.TeleportScene = function (scene) {
        scene.add(this.object);
        scene.add(this.collisionobj);
    }

    this.OnDead = function () {
        console.log("died");
    }

    function keyDown(event) {
        if (_this.enabled === false) return;
        keyboard[event.keyCode] = true;
    }

    function keyUp(event) {
        if (_this.enabled === false) return;
        keyboard[event.keyCode] = false;
    }

    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);
}