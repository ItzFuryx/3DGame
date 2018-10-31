class Projectile extends MoveAbleObject {
    constructor(geometry, material, position, direction, damage) {
        var Geometry = new THREE.BoxGeometry(3, 3, 3);
        var Material = new THREE.MeshPhongMaterial({ color: 0x00cc00, transparent: true, opacity: 0.9 });
        var collision = new THREE.Mesh(Geometry, Material);
        Material.needsUpdate = true;

        super(geometry, material, collision);
        this.rotation.set(0, -Math.PI / 2, 0, 0);
        this.scale.set(.5, .5, .5);

        this.shootDirection = direction;
        this.position.copy(position);
        this.damage = damage;
        this.moveSpeed = 20;
        this.canHit = true;
        this.name = "projectile";
        scene.add(this);
        collidableMeshList.push(this);

        this.collided = false;
    }

    Update(deltatime) {
        if (this.collided) {
            return;
        }
        var ray = new THREE.Raycaster(this.position.clone(), this.shootDirection.clone().normalize());

        var collisionResults = ray.intersectObjects(collidableMeshList);

        if (collisionResults.length > 0 && collisionResults[0].distance < 1) {
            if (collisionResults[0].object.name == "wall") {
                this.HitObject();
            } else if (collisionResults[0].object instanceof Player) {
                collisionResults[0].object.health.DeltaHealth(this.GetDamage());
                this.HitObject();
            }
        } else {
            var newPosition = this.position.clone();
            newPosition.x += this.shootDirection.x * this.moveSpeed * deltatime;
            newPosition.z += this.shootDirection.z * this.moveSpeed * deltatime;
            this.position.copy(newPosition);
        }
    }

    GetDamage() {
        this.canHit = false;
        return this.damage;
    }

    HitObject() {
        this.collided = true;
        this.material.opacity = 0;
    }

    Continue() {
        this.collided = false;
        this.canHit = true;
        this.material.opacity = 0.9;
    }
}

