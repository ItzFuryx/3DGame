class GameObject extends THREE.Mesh{
    constructor(Geometry, Material) {
        super(Geometry, Material);
        
        this.directionUp = new THREE.Vector3(1, 0, 0);
        this.directionDown = new THREE.Vector3(-1, 0, 0);
        this.directionRight = new THREE.Vector3(0, 0, 1);
        this.directionLeft = new THREE.Vector3(0, 0, -1);

        this.enabled = true;
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