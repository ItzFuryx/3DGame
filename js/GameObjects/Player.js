class Player extends MoveAbleObject {
    constructor(scene, camera) {
        var Geometry = new THREE.BoxGeometry(2, 10, 2);
        var Material = new THREE.MeshBasicMaterial({ color: 0x008000, transparent: true, opacity: 1 });
        var collision = new THREE.Mesh(Geometry, Material);
        super(Geometry, Material, collision);

        this.castShadow = true;
        this.name = 'player';
        this.camera = camera;
        this.moveSpeed = 15;
        this.turnSpeed = Math.PI * 1;
        this.health = new Health(2, this);
        this.experience = new Experience(this);
        this.keyboard = {};
        this.respawnLocation = new THREE.Vector3(width / 2 - 10, 1, width / 2 - 10);
        this.position.copy(this.respawnLocation);
        this.goRespawn = false;
        this.damage = 10;

        scene.add(this);
        collidableMeshList.push(this);
    }

    Update(deltatime) {
        var newPosition = this.position.clone();

        if (this.keyboard[32]) {
            console.log("space ");
        }
        if (this.keyboard[87]) {// W key
            newPosition.x -= Math.sin(this.camera.rotation.y) * this.moveSpeed * deltatime;
            newPosition.z -= Math.cos(this.camera.rotation.y) * this.moveSpeed * deltatime;
        }
        if (this.keyboard[83]) {// S key
            newPosition.x += Math.sin(this.camera.rotation.y) * this.moveSpeed * deltatime;
            newPosition.z += Math.cos(this.camera.rotation.y) * this.moveSpeed * deltatime;
        }
        if (this.keyboard[65]) {// A key
            newPosition.x -= Math.sin(this.camera.rotation.y + Math.PI / 2) * this.moveSpeed * deltatime;
            newPosition.z -= Math.cos(this.camera.rotation.y + Math.PI / 2) * this.moveSpeed * deltatime;
        }

        if (this.keyboard[68]) {// D key
            newPosition.x -= Math.sin(this.camera.rotation.y - Math.PI / 2) * this.moveSpeed * deltatime;
            newPosition.z -= Math.cos(this.camera.rotation.y - Math.PI / 2) * this.moveSpeed * deltatime;
        }

        if (this.keyboard[37]) { // left arrow key
            this.camera.rotation.y += this.turnSpeed * deltatime;
        }

        if (this.keyboard[39]) { // right arrow key
            this.camera.rotation.y -= this.turnSpeed * deltatime;
        }

        if (this.keyboard[38]) { // up arrow key
            this.camera.rotation.x += this.turnSpeed * deltatime * 0.7;
        }

        if (this.keyboard[40]) { // down arrow key
            this.camera.rotation.x -= this.turnSpeed * deltatime * 0.7;
        }

        var collidedObject = this.DetectCollision(newPosition);
        if (collidedObject == null) {
            this.position.copy(newPosition);
        } else {
            if (collidedObject instanceof Trap) {
                if (collidedObject.canHit)
                    this.health.DeltaHealth(collidedObject.GetDamage());
            }
            else if (collidedObject.name == "finish") {
                console.log("collide is finish");
                world.CreateNewMaze();
            }
        }
        if (this.goRespawn) {
            this.position = this.respawnLocation.clone();
            this.goRespawn = false;
        }
        this.MoveCamera();
    }

    MoveCamera() {
        this.camera.position.x = this.position.x;
        this.camera.position.y = this.position.y + 4;
        this.camera.position.z = this.position.z;
    }

    TeleportScene(scene) {
        scene.add(this.object);
        scene.add(this.collisionobj);
        this.position = this.respawnLocation.clone();
    }

    Respawn() {
        this.goRespawn = true;
    }
    LevelUp() {
        console.log("leveled up!");
    }

    OnDead() {
        this.Respawn();
        console.log("player Died");
    }
    OnHit() {
        blood.Hit(player.position);
    }
}