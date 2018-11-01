class Projectile extends MoveAbleObject {
    constructor(geometry, material, position, direction, damage) {
        super(geometry, material);
        this.rotation.set(0, -Math.PI / 2, 0, 0);
        this.scale.set(.5, .5, .5);

        this.shootDirection = direction;
        this.position.copy(position);
        this.damage = damage;
        this.moveSpeed = 20;
        this.canHit = true;
        this.name = "projectile";
        for(var i =0; i < arrowMaterial.length; i++){
            this.material[i].setValues(arrowMaterial[i]);
        }
        this.material.opacity = 1;
        console.log(this);
        scene.add(this);
        collidableMeshList.push(this);

        this.collided = false;
    }

    Update(deltatime) {
        if (this.collided) {
            return;
        }
        var collisionResult = this.CheckCollision(this.position, this.shootDirection);;
        if (collisionResult != null) {
            if (collisionResult.distance < 1) {
                if (collisionResult.object.name == "wall") {
                    this.HitObject();
                } else if (collisionResult.object instanceof Player) {
                    collisionResult.object.health.DeltaHealth(this.GetDamage());
                    this.HitObject();
                }
                return;
            }
        }

        var newPosition = this.position.clone();
        newPosition.x += this.shootDirection.x * this.moveSpeed * deltatime;
        newPosition.z += this.shootDirection.z * this.moveSpeed * deltatime;
        this.position.copy(newPosition);
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

