THREE.Stars = function (scene, amount) {
    var particleCount = amount,
        particles = new THREE.Geometry(),
        pMaterial = new THREE.ParticleBasicMaterial({
            color: 0xFFFFFF,
            size: Math.random() * 1,
            transparent: true,
            opacity: .3,
        });

    for (var p = 0; p < particleCount; p++) {
        var pX = Math.random() * (width / 2 * -3 - width / 2 * 3) + width / 2 * 3,
            pY = 40 + Math.random() * 30,
            pZ = Math.random() * (width / 2 * -3 - width / 2 * 3) + width / 2 * 3,
            particle = new THREE.Vector3(pX, pY, pZ);

        particle.velocity = new THREE.Vector3(
            Math.random() * (-.00001 - .00001) + .00001,
            Math.random() * -.00001,
            Math.random() * (-.00001 - .00001) + .00001);		

        particles.vertices.push(particle);
    }

    var particleSystem = new THREE.ParticleSystem(
        particles,
        pMaterial);

    particleSystem.sortParticles = true;

    scene.add(particleSystem);

    this.Update = function () {
        var pCount = particleCount;
        while (pCount--) {
            var particle =
                particles.vertices[pCount];

            if (particle.y < 10) {
                particle.y = 40;
                particle.velocity.y = 0;
            }

            particle.velocity.y -= Math.random() * .00001;
            particle.add(particle.velocity);
        }

        particleSystem.
            geometry.
            __dirtyVertices = true;
    }
}