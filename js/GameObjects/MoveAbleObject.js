class MoveAbleObject extends GameObject {
    constructor(Geometry, Material) {
        super(Geometry, Material);

        this.moveSpeed = .25;
        this.turnSpeed = Math.PI * 0.02;
        this.health = new Health(5, this);
    }

    OnDead() {
        console.log("A moveable object died.");
    }
}