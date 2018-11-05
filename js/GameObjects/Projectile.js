class Projectile extends MoveAbleObject {
    constructor(geometry, position, direction, damage, parent) {
        super(geometry, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .9 }));
        this.scale.set(.5, .5, .5);
        this.trap = parent;
        this.shootDirection = direction;
        this.position.copy(position);
        this.damage = damage;
        this.moveSpeed = 40;
        this.canHit = true;
        this.SetRotation();
        this.name = "projectile";

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
                if (collisionResult.object != this.trap) {
                    if (collisionResult.object.name == "wall") {
                        this.HitObject();
                    } else if (collisionResult.object instanceof Player) {
                        collisionResult.object.health.DeltaHealth(this.GetDamage());
                        this.HitObject();
                    }
                    return;
                }
            }
        }

        var newPosition = this.position.clone();
        newPosition.x += this.shootDirection.x * this.moveSpeed * deltatime;
        newPosition.z += this.shootDirection.z * this.moveSpeed * deltatime;
        this.position.copy(newPosition);
    }

    SetRotation() {
        var rot = 0;
        if (this.shootDirection.x == this.directionUp.x) {
            rot = -Math.PI / 2;
        }
        if (this.shootDirection.x == this.directionDown.x) {
            rot = Math.PI / 2;
        }
        if (this.shootDirection.z == this.directionRight.z) {
            rot = Math.PI;
        }
        this.rotation.set(0, rot, 0, 0);
    }

    GetDamage() {
        this.canHit = false;
        return this.damage;
    }

    HitObject() {
        this.collided = true;
    }

    Continue() {
        this.collided = false;
        this.canHit = true;
    }
}

