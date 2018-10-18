THREE.Stars = function (scene, amount) {
    // create the particle variables
    var particleCount = amount,
        particles = new THREE.Geometry(),
        pMaterial = new THREE.ParticleBasicMaterial({
            color: 0xFFFFFF,
            size: Math.random() * 1,
            transparent: true,
            opacity: .3,
        });

    // now create the individual particles
    for (var p = 0; p < particleCount; p++) {

        var pX = Math.random() * (width / 2 * -3 - width / 2 * 3) + width / 2 * 3,
            pY = 40 + Math.random() * 30,
            pZ = Math.random() * (width / 2 * -3 - width / 2 * 3) + width / 2 * 3,
            particle = new THREE.Vector3(pX, pY, pZ);
        // create a velocity vector
        particle.velocity = new THREE.Vector3(
            Math.random() * (-.00001 - .00001) + .00001,				// x
            Math.random() * -.00001,	// y
            Math.random() * (-.00001 - .00001) + .00001);				// z

        // add it to the geometry
        particles.vertices.push(particle);
    }

    // create the particle system
    var particleSystem = new THREE.ParticleSystem(
        particles,
        pMaterial);

    particleSystem.sortParticles = true;

    // add it to the scene
    scene.add(particleSystem);
    // scene.add(particleSystem2);

    this.Update = function () {
        var pCount = particleCount;
        while (pCount--) {

            // get the particle
            var particle =
                particles.vertices[pCount];

            // check if we need to reset
            if (particle.y < 10) {
                particle.y = 40;
                particle.velocity.y = 0;
            }

            // update the velocity with
            // a splat of randomniz
            particle.velocity.y -= Math.random() * .00001;

            // and the position
            particle.add(
                particle.velocity);
        }

        // flag to the particle system
        // that we've changed its vertices.
        particleSystem.
            geometry.
            __dirtyVertices = true;
    }
}