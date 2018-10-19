class Trap extends ImmovAbleObject {
    constructor(level, width) {
        var randomPosX = Math.floor((Math.random() * (75) + (-75)));
        var randomPosZ = Math.floor((Math.random() * (75) + (-75)));

        var Geometry = new THREE.BoxGeometry(2, 2, 2);
        var Material = new THREE.MeshBasicMaterial({ color: 0xFF0000, transparent: true, opacity: 0.6 });
        Material.needsUpdate = true;
        var object = new THREE.Mesh(Geometry, Material);
        object.castShadow = true;
        object.name = 'trap';
        object.position = new THREE.Vector3(randomPosX, 1, randomPosZ);
        console.log("trap position:");
        console.log(object.position);
        scene.add(object);
        collidableMeshList.push(object);
        super(object);
    }

    Update() {

    }

    Create() {

    }
}