class Player extends MoveAbleObject {
    constructor(scene, camera) {
        var Geometry = new THREE.BoxGeometry(2, 10, 2);
        var Material = new THREE.MeshBasicMaterial({ color: 0x008000, transparent: true, opacity: 0 });
        var collision = new THREE.Mesh(Geometry, Material);
        super(Geometry, Material);

        this.castShadow = true;
        this.name = 'player';
        this.camera = camera;
        this.moveSpeed = .25;
        this.turnSpeed = Math.PI * 0.02;
        this.health = new Health(5);
        this.keyboard = {};
        this.respawnLocation = new THREE.Vector3(width / 2 - 10, 1, width / 2 - 10);
        this.position = this.respawnLocation.clone();
        this.collisionobj = collision;

        scene.add(this);
        scene.add(collision);
    }

    Update() {
        var hasclicked = false;
        var newPosition = this.position.clone();

        if (this.keyboard[87]) {// W key
            hasclicked = true;
            newPosition.x -= Math.sin(this.camera.rotation.y) * this.moveSpeed;
            newPosition.z -= Math.cos(this.camera.rotation.y) * this.moveSpeed;
        }
        if (this.keyboard[83]) {// S key
            hasclicked = true;
            newPosition.x += Math.sin(this.camera.rotation.y) * this.moveSpeed;
            newPosition.z += Math.cos(this.camera.rotation.y) * this.moveSpeed;
        }
        if (this.keyboard[65]) {// A key
            hasclicked = true;
            newPosition.x -= Math.sin(this.camera.rotation.y + Math.PI / 2) * this.moveSpeed;
            newPosition.z -= Math.cos(this.camera.rotation.y + Math.PI / 2) * this.moveSpeed;
        }

        if (this.keyboard[68]) {// D key
            hasclicked = true;
            newPosition.x -= Math.sin(this.camera.rotation.y - Math.PI / 2) * this.moveSpeed;
            newPosition.z -= Math.cos(this.camera.rotation.y - Math.PI / 2) * this.moveSpeed;
        }

        if (this.keyboard[37]) { // left arrow key
            this.camera.rotation.y += this.turnSpeed;
        }

        if (this.keyboard[39]) { // right arrow key
            this.camera.rotation.y -= this.turnSpeed;
        }

        if (hasclicked) {
            if (!this.DetectCollision(newPosition)) {
                this.position = newPosition;
            }
        }
        this.MoveCamera();
    }

    MoveCamera() {
        this.camera.position = this.position;
        this.camera.position.y = 5;
    }

    TeleportScene(scene) {
        scene.add(this.object);
        scene.add(this.collisionobj);
        this.position = this.respawnLocation.clone();
    }
    Respawn() {
        this.position = this.respawnLocation;
    }
}