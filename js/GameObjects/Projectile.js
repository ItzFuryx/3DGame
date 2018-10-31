class Projectile extends MoveAbleObject {
    constructor(position, direction, damage) {
        // var Geometry = new THREE.BoxGeometry(1, .5, 1);
        var Geometry = new THREE.BoxGeometry(2, 2, 2);
        var Material = new THREE.MeshPhongMaterial({ ambient: 0x00cc00, transparent: true, opacity: 0.9 });
        var collision = new THREE.Mesh(Geometry, Material);
        Material.needsUpdate = true;
        super(Geometry, Material, collision);

        this.shootDirection = direction;
        this.position = position;
        this.damage = damage;
        this.moveSpeed = 10;
        this.canHit = true;
        this.name = "projectile";
        scene.add(this);
        collidableMeshList.push(this);

        this.collided = false;
    }

    Update(deltatime) {
        if(this.collided){
            return;
        }
        var ray = new THREE.Raycaster(this.position.clone(), this.shootDirection.clone().normalize());

        var collisionResults = ray.intersectObjects(collidableMeshList);
        
        if (collisionResults.length > 0 && collisionResults[0].distance < 1) {
            if(collisionResults[0].object.name == "wall"){
                this.HitObject();
            } else if(collisionResults[0].object instanceof Player){
                collisionResults[0].object.health.DeltaHealth(this.GetDamage());
                this.HitObject();
            }
        } else {
            var newPosition = this.position.clone();
            newPosition.x += this.shootDirection.x * this.moveSpeed * deltatime;
            newPosition.z += this.shootDirection.z * this.moveSpeed * deltatime;
            this.position = newPosition;
        }
    }

    GetDamage() {
        this.canHit = false;
        return this.damage;
    }

    HitObject(){
        this.collided = true;
        this.material.opacity = 0;
    }

    Continue(){
        this.collided = false;
        this.canHit = true;
        this.material.opacity = 0.9;
    }
}

