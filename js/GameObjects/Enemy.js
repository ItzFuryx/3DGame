class Enemy extends MoveAbleObject {
    constructor() {
        var Geometry = new THREE.BoxGeometry(2, 2, 2);
        var Material = new THREE.MeshBasicMaterial({ color: 0x008000, transparent: true, opacity: 1 });
        var collision = new THREE.Mesh(Geometry, Material);
        super(Geometry, Material, collision);

        this.damage = Math.floor((Math.random() * (level * 1.5) + (level * 0.5)));
        this.castShadow = true;
        this.name = 'enemy';
        this.cooldown = 2;
        this.timer = 0;
        this.damage = 1;
        this.moveSpeed = 2;
        this.moveAmount = Math.floor((Math.random() * (2) + (5)));
        this.moveForward = true;
        this.position = new THREE.Vector3(Math.floor((Math.random() * (width) + (-75))), 1, Math.floor((Math.random() * (width) + (-75))));
        this.spawnPos = this.position.clone();

        scene.add(this);
        collidableMeshList.push(this);
    }

    Update(deltatime) {
        var newPos = this.position.clone();
        if (this.moveForward) {
            newPos.x += this.moveSpeed * deltatime;
        }
        else {
            newPos.x -= this.moveSpeed * deltatime;
        }

        var collidedObject = this.DetectCollision(newPos);

        if (collidedObject == null) {
            this.position = newPos;

            if (newPos.x <= this.spawnPos.x - this.moveAmount || newPos.x >= this.spawnPos.x + this.moveAmount) {
                this.moveForward = !this.moveForward;
            }
        }
        else {
            if (collidedObject.name == "player" && this.timer >= this.cooldown) {
                collidedObject.health.DeltaHealth(this.damage);
                this.timer = 0;
            }
            this.moveForward = !this.moveForward;
        }

        if (this.timer <= this.cooldown) {
            this.timer += deltatime;
        }
        
        if(this.DetectCollision(this.position.clone()) != null){
            this.MakeSpawnPos();
        }
    }

    MakeSpawnPos() {
        var randomPos = new THREE.Vector3(Math.floor((Math.random() * (width) + (-75))), 1, Math.floor((Math.random() * (width) + (-75))));
        
        var collidedObject = this.DetectCollision(randomPos);
        if (collidedObject == null) {
            this.position = randomPos.clone();
            this.spawnPos = this.position.clone();
            return;
        }
    }
}