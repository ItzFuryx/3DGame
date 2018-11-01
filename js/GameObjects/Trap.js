class Trap extends ImmovAbleObject {
    constructor() {
        var randomPosX = Math.floor((Math.random() * (width) + (-75)));
        var randomPosZ = Math.floor((Math.random() * (width) + (-75)));

        var Geometry = new THREE.BoxGeometry(2, 2, 2);
        var Material = new THREE.MeshPhongMaterial({ color: 0xFF0000, transparent: true, opacity: 0.9 });
        Material.needsUpdate = true;
        super(Geometry, Material);

        this.damage = Math.floor((Math.random() * (level * 1.5) + (level * 0.5)));
        this.castShadow = true;
        this.name = 'trap';
        this.position.set(randomPosX, 1, randomPosZ);
        this.canHit = true;

        scene.add(this);
        collidableMeshList.push(this);
    }

    GetDamage() {
        this.canHit = false;
        return this.damage;
    }

    MakeSpawnPos() {
        var randomPos = new THREE.Vector3(Math.floor((Math.random() * (width) + (-75))), 1, Math.floor((Math.random() * (width) + (-75))));

        var results = [];
        results.add(CheckCollision(randomPos, THREE.Vector3(1, 0, 0)));
        results.add(CheckCollision(randomPos, THREE.Vector3(-1, 0, 0)));
        results.add(CheckCollision(randomPos, THREE.Vector3(0, 0, 1)));
        results.add(CheckCollision(randomPos, THREE.Vector3(0, 0, -1)));

        results.forEach(e => {
            if (e != null) {
                if (e.distance < 1 && e.object.name == "wall") {
                    this.MakeSpawnPos();
                }
            }
        });

        this.position.copy(randomPos);
    }
}