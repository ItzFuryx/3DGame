class MoveAbleObject extends GameObject {
    constructor(Geometry, Material, collision) {
        super(Geometry, Material);

        this.moveSpeed = .25;
        this.turnSpeed = Math.PI * 0.02;
        this.health = new Health(5, this);
        this.collisionobj = collision;
        this.collisionobj.position.copy(this.position.clone());

        scene.add(collision);
    }

    OnDead() {
        console.log("A moveable object died.");
    }
}