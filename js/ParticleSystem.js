// JavaScript source code
///<reference path = "three.js" />

var particlecount = 1800,
    particles = new THREE.Geometry(),
    pMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: 20,
        map: new THREE.TextureLoader().load("../tex/fire.png"),
        blending: THREE.AdditiveBlending,
        transparent: true
    });


for (var p = 0; p < particlecount; p++) {
    var pX = Math.random() * 500 - 250,
        pY = Math.random() * 500 - 250,
        pZ = Math.random() * 500 - 250,
        particle = new THREE.Vector3(pX, pY, pZ);
    particle.velocity = new THREE.Vector3(0, -Math.random(), 0);

    particles.vertices.push(particle);
}

var ParticleSystem = new THREE.Points(
    particles,
    pMaterial);

ParticleSystem.sortParticles = true;