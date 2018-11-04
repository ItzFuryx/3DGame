class ShootingTrap extends Trap {
    constructor(amount) {
        super();
        if (amount > 4)
            amount = 4;

        this.projectiles = [];
        this.projectileSpawnPos = [];
        this.directions = [];
        this.directions.push(this.directionUp);
        this.directions.push(this.directionDown);
        this.directions.push(this.directionRight);
        this.directions.push(this.directionLeft);

        for (var i = 0; i < amount; i++) {
            this.projectileSpawnPos.push(new THREE.Vector3(
                this.position.x + this.directions[i].x,
                this.position.y + this.directions[i].y,
                this.position.z + this.directions[i].z));
            this.projectiles.push(new Projectile(arrowGeometry, arrowMaterial, this.projectileSpawnPos[i], this.directions[i], level));
        }

        this.cooldown = Math.floor((Math.random() * (1) + (3)));
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
            for (var i = 0; i < this.projectiles.length; i++) {
                this.projectiles[i].position.copy(this.projectileSpawnPos[i]);
                this.projectiles[i].Continue();
            }
        }

        this.projectiles.forEach(e => {
            e.Update(deltatime);
        });
    }
}