class Player extends MoveAbleObject {
    constructor(scene, camera) {
        var Geometry = new THREE.BoxGeometry(2, 2, 2);
        var Material = new THREE.MeshPhongMaterial({ color: 0x008000, transparent: false, opacity: 0.8 });
        var object = new THREE.Mesh(Geometry, Material);
        var collision = new THREE.Mesh(Geometry, Material);
        object.castShadow = true;
        object.name = 'player';
        object.position = new THREE.Vector3(width / 2 - 1, 1, width / 2 - 3);

        super(object);
        this.camera = camera;
        this.moveSpeed = .25;
        this.turnSpeed = Math.PI * 0.02;
        this.health = new Health(5);        
        this.keyboard = {};

        this.collisionobj = collision;
        scene.add(object);
        scene.add(collision);
    }

    Update() {        
        var hasclicked = false;
        var newPosition = this.camera.position.clone();

        if (this.keyboard[87]) {// W key
            hasclicked = true;
            newPosition.x -= Math.sin(this.camera.rotation.y) * this.moveSpeed;
            newPosition.z -= Math.cos(this.camera.rotation.y) * this.moveSpeed;
        }
        if (this.keyboard[83]) {// S key
            hasclicked = true;            
            newPosition.x += Math.sin(this.camera.rotation.y) * this.moveSpeed;
            newPosition.z += Math.cos(this.camera.rotation.y) * this.moveSpeed;
        }
        if (this.keyboard[65]) {// A key
            hasclicked = true;
            newPosition.x -= Math.sin(this.camera.rotation.y + Math.PI / 2) * this.moveSpeed;
            newPosition.z -= Math.cos(this.camera.rotation.y + Math.PI / 2) * this.moveSpeed;
        }

        if (this.keyboard[68]) {// D key
            hasclicked = true;
            newPosition.x -= Math.sin(this.camera.rotation.y - Math.PI / 2) * this.moveSpeed;
            newPosition.z -= Math.cos(this.camera.rotation.y - Math.PI / 2) * this.moveSpeed;
        }

        if (this.keyboard[37]) { // left arrow key
            this.camera.rotation.y += this.turnSpeed;
        }

        if (this.keyboard[39]) { // right arrow key
            this.camera.rotation.y -= this.turnSpeed;
        }

        if(hasclicked){            
            if (!this.DetectCollision(newPosition)) {
                this.camera.position = newPosition;
                this.position.x = newPosition.x;
                this.position.z = newPosition.z;
            }
        }
    }   
}