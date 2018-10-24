class Projectile extends MoveAbleObject {
    constructor(position, direction, damage) {
        var Geometry = new THREE.BoxGeometry(1, .5, 1);
        var Material = new THREE.MeshPhongMaterial({ ambient: 0x00cc00, transparent: true, opacity: 0.9 });
        var collision = new THREE.Mesh(Geometry, Material);
        Material.needsUpdate = true;
        super(Geometry, Material, collision);

        this.shootDirection = direction;
        this.position = position;
        this.damage = damage;
        this.moveSpeed = 10;
        this.canHit = true;
        scene.add(this);
        collidableMeshList.push(this);
    }

    Update(deltatime) {
        var newPosition = this.position.clone();
        newPosition.x += this.shootDirection.x * this.moveSpeed * deltatime;
        newPosition.z += this.shootDirection.z * this.moveSpeed * deltatime;
        this.position = newPosition;
    }

    GetDamage() {
        this.canHit = false;
        return this.damage;
    }
}