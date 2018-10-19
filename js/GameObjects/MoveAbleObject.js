class MoveAbleObject extends GameObject {
    constructor(Geometry, Material) {
        super(Geometry, Material);

        this.moveSpeed = .25;
        this.turnSpeed = Math.PI * 0.02;
        this.collisionObject;
        this.health = new Health(5);
    }

    DetectCollision (position) {
        this.collisionobj.position = position;
        var obj = this.collisionobj;
        var originPoint = this.collisionobj.position;
        var collide = false;

        for (var vertexIndex = 0; vertexIndex < obj.geometry.vertices.length; vertexIndex++) {
            var localVertex = obj.geometry.vertices[vertexIndex].clone();
            var globalVertex = localVertex.applyMatrix4(obj.matrix);
            var directionVector = globalVertex.sub(this.collisionobj.position);

            var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
            var collisionResults = ray.intersectObjects(collidableMeshList);

            if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
                console.log(collisionResults[0].object.name);
                if(collisionResults[0].object instanceof Trap){
                    var trap = collisionResults[0].object;

                    this.health.DeltaHealth(trap.damage);
                    collide = true;
                }
                if (collisionResults[0].object.name == "finish") {
                    world.CreateNewMaze();
                }
                collide = true;
            }
        }
        //console.log("Collided = " + collide);
        return collide;
    }
}