/** 
 * class represents trap 
 * extends ImmovAbleObject
 */
class Trap extends ImmovAbleObject {
    /**
     * 
     * @param {object} geometry 
     * @param {object} material 
     */
    constructor(geometry, material) {
        //Sets a random position for the trap
        var randomPosX = Math.floor((Math.random() * (width) + (-75)));
        var randomPosZ = Math.floor((Math.random() * (width) + (-75)));

        if (geometry == null)
            geometry = spikeGeometry;
        
        if (material == null)
            material = new THREE.MeshPhongMaterial({ color: 0x000000, transparent: true, opacity: 0.9 });
        

        material.needsUpdate = true;
        super(geometry, material);
        this.scale.set(0.0003, 0.0003, 0.0003);
        this.damage = Math.round((Math.random() * (level * 1.5) + (level * 0.5)));
        this.castShadow = true;
        this.name = 'trap';
        this.position.set(randomPosX, 1, randomPosZ);
        this.canHit = true;
        this.MakeSpawnPos();
        scene.add(this);
        collidableMeshList.push(this);
    }
    /**
     * @function GetDamage
     * returns the damage dealt by the trap
     */
    GetDamage() {
        this.canHit = false;
        return this.damage;
    }
    /**
     * @function MakeSpawnPos
     * Creates a new spawn position for the trap
     * and checks if the position collides with anything, if so create a new spawn position
     */
    MakeSpawnPos() {
        var randomPos = new THREE.Vector3(Math.floor((Math.random() * (width) + (-75))), .1, Math.floor((Math.random() * (width) + (-75))));

        var results = [];
        results.push(this.CheckCollision(randomPos, this.directionUp));
        results.push(this.CheckCollision(randomPos, this.directionDown));
        results.push(this.CheckCollision(randomPos, this.directionLeft));
        results.push(this.CheckCollision(randomPos, this.directionRight));

        results.forEach(e => {
            if (e != null) {
                if (e.distance <= 3) {
                    this.MakeSpawnPos();
                    return;
                }
            }
        });

        this.position.copy(randomPos);
    }
}