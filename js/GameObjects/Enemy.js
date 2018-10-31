class Enemy extends MoveAbleObject {
    constructor() {
        var Geometry = new THREE.BoxGeometry(2, 2, 2);
        var Material = new THREE.MeshBasicMaterial({ color: 0x008000, transparent: true, opacity: 1 });
        var collision = new THREE.Mesh(Geometry, Material);
        super(Geometry, Material, collision);

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
        this.position = new THREE.Vector3(Math.floor((Math.random() * (width) + (-75))), 1, Math.floor((Math.random() * (width) + (-75))));
        this.spawnPos = this.position.clone();

        scene.add(this);
        collidableMeshList.push(this);
    }

    Update(deltatime) {
        if(this.headache > 100){
            this.headache = 0;
            this.MakeSpawnPos();
        }
        else{
            
        var newPos = this.position.clone();
        //if (this.moveForward) {
            //newPos.x += this.moveSpeed * deltatime;
            newPos.x -= Math.sin(this.moveAngle) * this.moveSpeed * deltatime;
            newPos.z -= Math.cos(this.moveAngle) * this.moveSpeed * deltatime;
        //}
        //else {
        //    newPos.x -= this.moveSpeed * deltatime;
        //}

        var collidedObject = this.DetectCollision(newPos.clone());

        if (collidedObject == null) {
            this.position = newPos;
            if(this.DetectCollision(this.position.clone()) != null){
                console.log("Gaat hard mis");
            }
            //if (newPos.x <= this.spawnPos.x - this.moveAmount || newPos.x >= this.spawnPos.x + this.moveAmount) {
            //    this.moveForward = !this.moveForward;
            //}
        }
        else {
                this.headache += 1;
            if (collidedObject.name == "player" && this.timer >= this.cooldown) {
                collidedObject.health.DeltaHealth(this.damage);
                this.timer = 0;
            }
            else{
                this.moveAngle = Math.random() * (Math.PI * 2);
                //this.moveAngle -= Math.PI / 2;
                /*if(this.moveAngle == 315 && this.moveRotation){
                    this.moveAngle -= Math.PI / 2;
                    this.moveRotation = !this.moveRotation;
                }
                else if(this.moveAngle == 45 && !this.moveRotation){
                    this.moveAngle += Math.PI / 2;
                    this.moveRotation = !this.moveRotation;
                }
                else if(this.moveRotation){
                    this.moveAngle += Math.PI / 2;
                }
                else{
                    this.moveAngle -= Math.PI / 2;
                }*/
                //this.Update(deltatime);
            }
            //this.moveForward = !this.moveForward;
        }

        if (this.timer <= this.cooldown) {
            this.timer += deltatime;
        }
        
        //if(this.DetectCollision(this.position.clone()) != null){
        //    this.MakeSpawnPos();
        //}
    }
    }

    MakeSpawnPos() {
        var randomPos = new THREE.Vector3(Math.floor((Math.random() * (width) + (-75))), 1, Math.floor((Math.random() * (width) + (-75))));
        
        var collidedObject = this.DetectCollision(randomPos);
        if (collidedObject == null) {
            this.position = randomPos.clone();
            this.spawnPos = this.position.clone();
            return;
        }
        else{
            this.MakeSpawnPos();
        }
    }
}