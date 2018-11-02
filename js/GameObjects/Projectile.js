class Projectile extends MoveAbleObject {
    constructor(geometry, material, position, direction, damage) {

        super(geometry, material);
        this.scale.set(.5, .5, .5);

        this.shootDirection = direction;
        this.position.copy(position);
        this.damage = damage;
        this.moveSpeed = 50;
        this.canHit = true;
        this.name = "projectile";
        this.SetRotation();
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

