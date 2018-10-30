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
        this.turnSpeed = Math.PI * 2;
        this.health = new Health(2, this);
        this.keyboard = {};
        this.respawnLocation = new THREE.Vector3(width / 2 - 10, 1, width / 2 - 10);
        this.position = this.respawnLocation.clone();
        this.goRespawn = false;

        scene.add(this);
        collidableMeshList.push(this);
    }

    Update(deltatime) {
        var newPosition = this.position.clone();

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

        var collidedObject = this.DetectCollision(newPosition);
        if (collidedObject == null) {
            this.position = newPosition;
        } else {
            if (collidedObject instanceof Trap || collidedObject instanceof Projectile) {
                if (collidedObject.canHit)
                    this.health.DeltaHealth(collidedObject.GetDamage());
            }
            else if (collidedObject.name == "finish") {
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
        this.camera.position = this.position.clone();
        this.camera.position.y = 5;
    }

    TeleportScene(scene) {
        scene.add(this.object);
        scene.add(this.collisionobj);
        this.position = this.respawnLocation.clone();
    }

    Respawn() {
        this.goRespawn = true;
    }

    OnDead() {
        this.Respawn();
        console.log("player Died");
    }    
    OnHit(){        
        blood.Hit(player.position);
    }
}