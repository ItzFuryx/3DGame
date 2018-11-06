/** class representing ShootingTrap 
 * Extends from Trap
*/
class ShootingTrap extends Trap {
    /**
     * 
     * @param {number} amount 
     */
    constructor(amount) {
        super(turretGeometry, new THREE.MeshPhongMaterial({ color: 0xD3D3D3, transparent: true, opacity: .9 }));
        
        this.scale.set(5,5,5);
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
                this.position.x + this.directions[i].x * 2,
                this.position.y + 3.5,
                this.position.z +1 + this.directions[i].z * 2));
            this.projectiles.push(new Projectile(arrowGeometry, this.projectileSpawnPos[i], this.directions[i], level, this));
        }

        this.cooldown = Math.floor((Math.random() * (1) + (3)));
        this.timer = 0;
        this.name = "shootingTrap";
    }
    /**
     * @function Update
     * @param {deltatime} deltatime - timetick
     * if the trap is not on cooldown, shoot projectile
     */
    Update(deltatime) {
        if (this.timer <= this.cooldown)
            this.timer += deltatime;
        else {
            this.timer = 0;
            for (var i = 0; i < this.projectiles.length; i++) {
                this.projectiles[i].position.copy(this.projectileSpawnPos[i]);
                this.projectiles[i].Continue();                
                document.getElementById("shootarrowfx").play();
            }
        }

        this.projectiles.forEach(e => {
            e.Update(deltatime);
        });
    }
}