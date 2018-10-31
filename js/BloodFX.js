THREE.BloodFX = function (scene) {
    var time = 0;
    var speed = 1;
    var dirs = [];
    var particleCount = Math.floor((Math.random() * (15) + (30))),
        particles = new THREE.Geometry(),
        pMaterial = new THREE.PointsMaterial({
            color: 0xff0000,
            size: Math.random() * (1.5) + (2),
            
            map: textureLoader.load(
                "assets/particle.png"
            ),
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: .3,
        });

    for (var p = 0; p < particleCount; p++) {
        var pX = 0,
            pY = 0,
            pZ = 0
            particle = new THREE.Vector3(pX, pY, pZ);

        particle.velocity = new THREE.Vector3(
            (Math.random() * speed) - (speed / 2),
            (Math.random() * speed) - (speed / 2),
            (Math.random() * speed) - (speed / 2));
        dirs.push({ x: (Math.random() * speed) - (speed / 2), y: (Math.random() * speed) - (speed / 2), z: (Math.random() * speed) - (speed / 2) });
        particles.vertices.push(particle);
    }

    var particleSystem = new THREE.Points(
        particles,
        pMaterial);

    particleSystem.sortParticles = true;

    scene.add(particleSystem);

    this.Update = function (deltatime) {
        time += deltatime;
        if (time >= 2) {
            return;
        }
        var pCount = particleCount;
        while (pCount--) {
            var particle =
                particles.vertices[pCount];

            particle.velocity.x += dirs[pCount].x;
            particle.velocity.y += dirs[pCount].y;
            particle.velocity.z += dirs[pCount].z;

            particle.add(particle.velocity);
        }

        particleSystem.
            geometry.
            __dirtyVertices = true;
    }

    this.Hit = function (position) {
        time = 0;
        var pCount = particleCount;
        while (pCount--) {
            var particle =
                particles.vertices[pCount];

            particle.x = position.x;
            particle.y = position.y;
            particle.z = position.z -5;

            particle.velocity.x = dirs[pCount].x;
            particle.velocity.y = dirs[pCount].y;
            particle.velocity.z = dirs[pCount].z;
        }
    }
}