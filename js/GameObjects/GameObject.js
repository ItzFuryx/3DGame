class GameObject extends THREE.Mesh{
    constructor(Geometry, Material) {
        super(Geometry, Material);
        this.position = new THREE.Vector3(0,0,0);
    }
}