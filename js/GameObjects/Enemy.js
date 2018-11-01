class Enemy extends MoveAbleObject {
    constructor() {
        var Geometry = new THREE.BoxGeometry(2, 2, 2);
        var Material = new THREE.MeshBasicMaterial({ color: 0x008000, transparent: true, opacity: 1 });
        var collision = new THREE.Mesh(Geometry, Material);
        super(Geometry, Material, collision);

        this.health = new Health(2, this);
        this.damage = Math.floor((Math.random() * (level * 1.5) + (level * 0.5)));
        this.castShadow = true;
        this.name = 'enemy';
        this.cooldown = 2;
        this.timer = 0;
        this.damage = 1;
        this.moveSpeed = 10;
        this.moveAngle = Math.PI / 4;
        this.headAche = 0;
        this.moveAmount = Math.floor((Math.random() * (2) + (5)));
        this.position.copy(new THREE.Vector3(Math.floor((Math.random() * (width) + (-75))), 1, Math.floor((Math.random() * (width) + (-75)))));
        this.MakeSpawnPos();
        scene.add(this);
        collidableMeshList.push(this);
        this.tmpcolcheck = null;
    }

    Update(deltatime) {
        if (this.timer <= this.cooldown) {
            this.timer += deltatime;
        }

        if (this.headAche > 100) {
            this.headAche = 0;
            this.MakeSpawnPos();
        }
        else {
            var directiontoPlayer = new THREE.Vector3(
                this.position.x - player.position.x,
                0,
                this.position.z - player.position.z);

            directiontoPlayer.x = -directiontoPlayer.x;
            directiontoPlayer.z = -directiontoPlayer.z;
            var objectinWay = this.CheckCollision(this.position, directiontoPlayer);
            if (this.tmpcolcheck == 1) {
                this.tmpcolcheck = null;
            }
            if (objectinWay != null) {
                if (objectinWay.object instanceof Player) {
                    this.position.x += directiontoPlayer.x * this.moveSpeed * deltatime;
                    this.position.y = 1;
                    this.position.z += directiontoPlayer.z * this.moveSpeed * deltatime;
                    if (objectinWay.distance < 1 && this.timer >= this.cooldown) {
                        objectinWay.object.health.DeltaHealth(this.damage);
                        if(objectinWay.object.health.IsFullHealth()){
                            this.MakeSpawnPos();
                        }
                        this.timer = 0;
                    }
                    return;
                }
            }

            var newPos = this.position.clone();
            newPos.x -= Math.sin(this.moveAngle) * this.moveSpeed * deltatime;
            newPos.z -= Math.cos(this.moveAngle) * this.moveSpeed * deltatime;
            newPos.y = 1;

            var direction = new THREE.Vector3(
                newPos.x - this.position.x,
                newPos.y - this.position.y,
                newPos.z - this.position.z);

            var collidedObject = this.CheckCollision(this.position, direction);

            if (collidedObject == null || collidedObject.distance > 3) {
                this.position.copy(newPos);
            }
            else {
                this.headAche += 1;
                this.moveAngle = Math.random() * (Math.PI * 2);
                this.tmpcolcheck = 1;
            }
        }
    }

    MakeSpawnPos() {
        var randomPos = new THREE.Vector3(Math.floor((Math.random() * (width) + (-75))), 1, Math.floor((Math.random() * (width) + (-75))));

        var results = [];
        results.push(this.CheckCollision(randomPos, this.directionUp));
        results.push(this.CheckCollision(randomPos, this.directionDown));
        results.push(this.CheckCollision(randomPos, this.directionLeft));
        results.push(this.CheckCollision(randomPos, this.directionRight));

        results.forEach(e => {
            if (e != null) {
                if (e.distance < 1 && e.object.name == "wall") {
                    this.MakeSpawnPos();
                }
            }
        });

        this.position.copy(randomPos);
    }

    OnDead() {
        console.log("Enemy Died");
        player.experience.DeltaExp(this.health.maxHealth);
    }
    OnHit() {
        console.log("Enemy Hit");
    }
}