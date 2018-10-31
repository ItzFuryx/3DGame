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

    DetectCollision(position) {
        this.collisionobj.position.copy(position);
        var obj = this.collisionobj;
        var originPoint = this.collisionobj.position;

        for (var vertexIndex = 0; vertexIndex < obj.geometry.vertices.length; vertexIndex++) {
            var localVertex = obj.geometry.vertices[vertexIndex].clone();
            var globalVertex = localVertex.applyMatrix4(obj.matrix);
            var directionVector = globalVertex.sub(this.collisionobj.position);

            var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
            var collisionResults = ray.intersectObjects(collidableMeshList);

            if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
                if (collisionResults[0].object != this) {
                    console.log(collisionResults[0].object.name);
                    return collisionResults[0].object;
                }
            }
        }
        return null;
    }

    OnDead() {
        console.log("A moveable object died.");
    }
}