class ShootingTrap extends Trap {
    constructor() {
        super();
        this.projectileStartPos = new THREE.Vector3(this.position.x + 2, this.position.y, this.position.z);

        this.shootObject = new Projectile(this.projectileStartPos.clone(), new THREE.Vector3(1, 0, 0), 1);

        this.cooldown = 3;
        this.timer = 0;
        this.name = "shootingTrap";
        scene.add(this);
        collidableMeshList.push(this);
    }

    Update(deltatime) {
        if (this.timer <= this.cooldown)
            this.timer += deltatime;
        else {
            this.timer = 0;
            this.shootObject.position = this.projectileStartPos;
            this.shootObject.Continue();
        }
        
           
        
        this.shootObject.Update(deltatime);
    }
}