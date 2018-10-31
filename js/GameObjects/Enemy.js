class Enemy extends MoveAbleObject {
    constructor() {
        var Geometry = new THREE.BoxGeometry(2, 2, 2);
        var Material = new THREE.MeshBasicMaterial({ color: 0x008000, transparent: true, opacity: 1 });
        var collision = new THREE.Mesh(Geometry, Material);
        super(Geometry, Material, collision);

        this.health = new Health(2, this);
        this.damage = Math.floor((Math.random() * (level * 1.5) + (level * 0.5)));
        this.castShadow = true;
        this.name = 'enemy';
        this.cooldown = 2;
        this.timer = 0;
        this.damage = 1;
        this.moveSpeed = 10;
        this.moveAngle = Math.PI / 4;
        this.headache = 0;
        //this.moveRotation = true;
        this.moveAmount = Math.floor((Math.random() * (2) + (5)));
        //this.moveForward = true;
        this.position.copy(new THREE.Vector3(Math.floor((Math.random() * (width) + (-75))), 1, Math.floor((Math.random() * (width) + (-75)))));
        this.spawnPos = new THREE.Vector3(0,0,0);
        this.spawnPos.copy(this.position.clone());

        scene.add(this);
        collidableMeshList.push(this);
    }

    Update(deltatime) {
    }

    MakeSpawnPos() {
        var randomPos = new THREE.Vector3(Math.floor((Math.random() * (width) + (-75))), 1, Math.floor((Math.random() * (width) + (-75))));
        
        var collidedObject = this.DetectCollision(randomPos);
        if (collidedObject == null) {
            this.position.copy(randomPos.clone());
            this.spawnPos.copy(this.position.clone());
            return;
        }
        else{
            this.MakeSpawnPos();
        }
    }
}