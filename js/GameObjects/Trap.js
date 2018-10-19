class Trap extends ImmovAbleObject {
    constructor(level, width) {
        var count = 0;
        var object2 = "test";
        super(object2);

        var random = Math.floor((Math.random() * (level * 2) + (level * 1)));
        for(var i = 0; i < random; i++){
            count++;
            var randomPosX = Math.floor((Math.random() * (75) + (-75)));
            var randomPosZ = Math.floor((Math.random() * (75) + (-75)));
    
            var Geometry = new THREE.BoxGeometry(2, 2, 2);
            var Material = new THREE.MeshBasicMaterial({ color: 0xFF0000, transparent: true, opacity: 0.6 });
            Material.needsUpdate = true;
            var object = new THREE.Mesh(Geometry, Material);
            object.castShadow = true;
            object.name = 'trap';
            object.position = new THREE.Vector3(randomPosX, 2, randomPosZ);
            console.log("trap position:");
            console.log(object.position);
            scene.add(object);
            collidableMeshList.push(object);
        }
        console.log(collidableMeshList);
        console.log("amount of traps: " + count);
    }

    Update() {

    }

    Create(){

    }
}