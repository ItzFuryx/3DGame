class Enemy extends MoveAbleObject {
    constructor(object) {
        super(object);

        this.moveSpeed = .25;
        this.turnSpeed = 5;
        this.health = new Health(3);
    }

    Update() {

    }
}