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

    GetDamage(){
        this.canHit = false;
        return this.damage;
    }
}