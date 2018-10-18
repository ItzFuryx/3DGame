class Enemy extends MoveAbleObject {
    constructor(scene) {
        var Geometry = new THREE.BoxGeometry(5, 5, 5);
        var Material = new THREE.MeshBasicMaterial({ color: 0x00FF00, transparent: true, opacity: 0.1 });
        var object = new THREE.Mesh(Geometry, Material);
        var collision = new THREE.Mesh(Geometry, Material);
        object.castShadow = true;
        object.name = 'enemy';
        object.position = new THREE.Vector3(width / 2, 1, width / 2);

        super(object);

        this.moveSpeed = .25;
        this.turnSpeed = 5;
        this.health = new Health(3);
        
        this.collisionobj = collision;
        scene.add(object);
        scene.add(collision);
    }

    Update() {

    }
}