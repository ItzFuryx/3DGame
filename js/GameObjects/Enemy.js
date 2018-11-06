/** Class representing an enemy */
class Enemy extends MoveAbleObject {
    /** 
     * Creates a new enemy
     * @param {Object} Geometry - The Geometry of the enemy
     * @param {Object} Material - The Material of the enemy
     */
    constructor(Geometry, Material) {
        /** Define variables for the enemy class */
        var Material = new THREE.MeshBasicMaterial({ color: 0x008000, transparent: true, opacity: 1 });
        var collision = new THREE.Mesh(Geometry, Material);
        /** Calls the MoveAbleObject
         * @param {Object} Geometry - The Geometry of the enemy
         * @param {Object} Material - The Material of the enemy
         * @param {Object} collision - The collision object
         */
        super(Geometry, Material, collision);

        /** Define variables for the enemy class */
        this.health = new Health((2 * level), this);
        this.damage = Math.floor(Math.random() * (level * 1.2) + (level * 0.5));
        this.castShadow = true;
        this.name = 'enemy';
        this.cooldown = 2;
        this.timer = 0;
        this.moveSpeed = 10;
        this.moveAngle = Math.PI / 4;
        this.headAche = 0;
        this.moveAmount = Math.floor((Math.random() * (2) + (5)));
        this.position.copy(new THREE.Vector3(Math.floor((Math.random() * (width) + (-75))), 1, Math.floor((Math.random() * (width) + (-75)))));
        this.MakeSpawnPos();
        this.bounceTick = Math.floor(Math.random() * Math.floor(59));

        /** Add to the scene */
        scene.add(this);
        /** Push to the collidableMesh list */
        collidableMeshList.push(this);

    }
    /** 
     * @function Update 
     * Update the enemy
     * @param {number} deltatime - the deltatime
     * */
    Update(deltatime) {
        //Set bounceTick
        this.bounceTick = ((this.bounceTick + 1) % 60);
        if (this.bounceTick == 30)
            this.bounceTick++;

        if (!this.enabled)
            return;

        if (this.timer <= this.cooldown) {
            this.timer += deltatime;
        }

        //Get the direction of the player
        var directiontoPlayer = new THREE.Vector3(
            this.position.x - player.position.x,
            0,
            this.position.z - player.position.z);
        //Set the direction (x,z) of the player
        directiontoPlayer.x = -directiontoPlayer.x;
        directiontoPlayer.z = -directiontoPlayer.z;
        
        //Set the bounce effect of the enemy objecr
        var bounce = -(Math.abs(3 / (Math.sqrt(Math.abs((this.bounceTick - 30) / 10)))));

        //Check if the enemy object collides with the player
        var objectinWay = this.CheckCollision(this.position, directiontoPlayer);

        if (objectinWay != null) {
            if (objectinWay.object instanceof Player) {
                //If the player object is farther away than 5. 
                //Move the enemy object towards the player
                if(objectinWay.distance > 5){
                    this.lookAt(player.position);
                    this.position.x += directiontoPlayer.x * this.moveSpeed * deltatime;
                    this.position.y = 1.5 + bounce / 10;
                    this.position.z += directiontoPlayer.z * this.moveSpeed * deltatime;
                }
                //If the player object is nearby and the attack is not on cooldown, attack the player.
                if (objectinWay.distance < 5.5 && this.timer >= this.cooldown) {
                    objectinWay.object.health.DeltaHealth(this.damage);
                    this.timer = 0;
                }
                return;
            }
        }
        //Checks if the enemy object collides with anything else than the player
        var newPos = this.position.clone();
        newPos.x -= Math.sin(this.moveAngle) * this.moveSpeed * deltatime;
        newPos.z -= Math.cos(this.moveAngle) * this.moveSpeed * deltatime;
        newPos.y = 1.5 + bounce / 10;

        //Set new position
        var direction = new THREE.Vector3(
            newPos.x - this.position.x,
            newPos.y - this.position.y,
            newPos.z - this.position.z);

        //Checks if the enemy object collides with antoher object
        var collidedObject = this.CheckCollision(this.position, direction);
        
        //If the enemy object doesn't collide, set the position of the enemy object.
        if (collidedObject == null || collidedObject.distance > 3) {
            this.lookAt(newPos);
            this.position.copy(newPos);
        }
        //if the object collides with another object move to another angle
        else {
            this.moveAngle = Math.random() * (Math.PI * 2);
        }

    }
    /**
     * @function MakeSpawnPos
     * Create spawn position of the enemy
     */
    MakeSpawnPos() {
        //Create a random position on the field
        var randomPos = new THREE.Vector3(Math.floor((Math.random() * (width) + (-75))), 1, Math.floor((Math.random() * (width) + (-75))));
        
        //Checks if the enemy object is collided with a wall
        var results = [];
        results.push(this.CheckCollision(randomPos, this.directionUp));
        results.push(this.CheckCollision(randomPos, this.directionDown));
        results.push(this.CheckCollision(randomPos, this.directionLeft));
        results.push(this.CheckCollision(randomPos, this.directionRight));

        results.forEach(e => {
            if (e != null) {
                if (e.distance < 1 && e.object.name == "wall") {
                    //if the enemy object is collided with a wall, create a new spawn position.
                    this.MakeSpawnPos();
                    return;
                }
            }
        });

        this.position.copy(randomPos);
    }
    /** 
     * @function OnDead 
     * When the enemy dies remove enemy object from the scene and give the player exp
     * */
    OnDead() {
        //Remove the enemy from the scene and from the collidable mesh list
        scene.remove(this);
        this.geometry.dispose();
        this.enabled = false;
        for (var i = collidableMeshList.length - 1; i >= 0; --i) {
            if (collidableMeshList[i].uuid == this.uuid) {
                collidableMeshList.splice(i, 1);
            }
        }
        //collidableMeshList.remove(this);
        //Give the player experience
        player.experience.DeltaExp(this.health.maxHealth);
    }
    /**
     * @function OnHit
     * The enemy gets hit
     */
    OnHit() {
        //Plays a a 'enemy hit'  sound
        document.getElementById("enemyhitfx").play();
    }
}