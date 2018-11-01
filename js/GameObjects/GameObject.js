class GameObject extends THREE.Mesh{
    constructor(Geometry, Material) {
        super(Geometry, Material);
    }

    CheckCollision(position, direction){
        var ray = new THREE.Raycaster(position, direction.normalize());
        var collisionResults = ray.intersectObjects(collidableMeshList);
        if(collisionResults.length > 0){
            return collisionResults[0];
        }
        return null;
    }
}