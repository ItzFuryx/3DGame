class Player extends MoveAbleObject {
    constructor(scene, camera) {
        var Geometry = new THREE.BoxGeometry(2, 10, 2);
        var Material = new THREE.MeshBasicMaterial({ color: 0x008000, transparent: true, opacity: 1 });
        super(Geometry, Material);

        this.castShadow = true;
        this.name = 'player';
        this.camera = camera;
        this.moveSpeed = 15;
        this.turnSpeed = Math.PI * 1;
        this.health = new Health(5, this);
        this.experience = new Experience(this);
        this.level = 1;
        this.keyboard = {};
        this.respawnLocation = new THREE.Vector3(width / 2 - 10, 1, width / 2 - 10);
        this.position.copy(this.respawnLocation);
        this.goRespawn = false;
        this.damage = 1;
        this.lookDirection = new THREE.Vector3(0, 0, 0);
        this.attacked = false;
        this.attackTimer = 0;
        this.attackCooldown = 1;
        scene.add(this);
        collidableMeshList.push(this);
    }

    Update(deltatime) {
        var newPosition = this.position.clone();
        camera.getWorldDirection(this.lookDirection);

        if (this.keyboard[32] && !this.attacked) {
            this.lookDirection.y = 0;
            var collidedObject = this.CheckCollision(this.position, this.lookDirection);

            if (collidedObject != null) {
                if (collidedObject.object instanceof Enemy && collidedObject.distance < 10) {
                    collidedObject.object.health.DeltaHealth(this.damage);
                    this.attacked = true;
                }
            }
        }
        if (this.keyboard[87]) { // W key
            newPosition.x -= Math.sin(this.camera.rotation.y) * this.moveSpeed * deltatime;
            newPosition.z -= Math.cos(this.camera.rotation.y) * this.moveSpeed * deltatime;
        }
        if (this.keyboard[83]) { // S key
            newPosition.x += Math.sin(this.camera.rotation.y) * this.moveSpeed * deltatime;
            newPosition.z += Math.cos(this.camera.rotation.y) * this.moveSpeed * deltatime;
        }
        if (this.keyboard[65]) { // A key
            newPosition.x -= Math.sin(this.camera.rotation.y + Math.PI / 2) * this.moveSpeed * deltatime;
            newPosition.z -= Math.cos(this.camera.rotation.y + Math.PI / 2) * this.moveSpeed * deltatime;
        }

        if (this.keyboard[68]) { // D key
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
            if (this.camera.rotation.x > 0.3)
                this.camera.rotation.x = this.camera.rotation.x
            else
                this.camera.rotation.x += this.turnSpeed * deltatime * 0.7;
        }

        if (this.keyboard[40]) { // down arrow key
            if (this.camera.rotation.x < -0.4)
                this.camera.rotation.x = this.camera.rotation.x
            else
                this.camera.rotation.x -= this.turnSpeed * deltatime * 0.7;
        }

        var direction = new THREE.Vector3(
            newPosition.x - this.position.x,
            newPosition.y - this.position.y,
            newPosition.z - this.position.z);

        var collidedObject = this.CheckCollision(this.position, direction);
        if (collidedObject != null) {
            if (collidedObject.distance < 1) {
                if (collidedObject.object instanceof Trap) {
                    if (collidedObject.object.canHit) {
                        this.health.DeltaHealth(collidedObject.object.GetDamage());
                    }
                } else if (collidedObject.object.name == "finish") {
                    console.log("collide is finish");
                    world.CreateNewMaze();
                }
            } else {
                this.position.copy(newPosition);
            }
        } else {
            this.position.copy(newPosition);
        }

        if (this.attacked) {
            this.attackTimer += deltatime;
            if (this.attackTimer >= this.attackCooldown) {
                this.attackTimer = 0;
                this.attacked = false;
            }
        }

        if (this.goRespawn) {
            this.position.copy(this.respawnLocation);
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
        scene.add(this);
        this.position.copy(this.respawnLocation);
        collidableMeshList.push(this);
    }

    Respawn() {
        this.goRespawn = true;
    }
    LevelUp() {
        console.log("leveled up!");
        this.level++;
        this.health = new Health(this.health.maxHealth * this.level, this);
        gamePanel.LevelUp();
    }

    OnDead() {
        this.Respawn();
        console.log("player Died");

        enemies.forEach(e => {
            e.MakeSpawnPos();
        });
    }
    OnHit() {
        blood.Hit(this.position);
        document.getElementById("playerhitfx").play();
        gamePanel.MoveHealthProgress();
    }
}