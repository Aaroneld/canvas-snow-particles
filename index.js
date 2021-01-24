const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

bRect = canvas.getBoundingClientRect();
canvas.width = bRect.width;
canvas.height = bRect.height;

console.log(ctx);
console.log(canvas.width);
ctx.fillStyle = "#ffffff";
ctx.fillRect(0, 0, 100, 300);

function createParticle() {
    return {
        x: ~~(Math.random() * canvas.width),
        y: -~~(Math.random() * canvas.height),
    };
}

function returnRandomWindValue() {
    const RAND = Math.random();

    switch (RAND) {
        case RAND < 0.75:
            return 0;
        case RAND > 0.75 && RAND < 0.9:
            return Math.random() > 0.5 ? Math.random() : -Math.random();
        default:
            return Math.random() > 0.5
                ? Math.random() * 1.5
                : -Math.random() * 1.5;
    }
}

let particles = [];

for (i = 0; i < 3000; i++) {
    particles.push(createParticle());
}

function WindMap(particles) {
    let windMap = [];

    return function simulateWind(y, i) {
        if (y < 0) {
            windMap[i] = returnRandomWindValue();
        }

        const RAND = Math.random();

        if (RAND > 0.9999) {
            windMap[i] = returnRandomWindValue();
        }

        return windMap[i];
    };
}
ctx.lineWidth = 0.2;

const simulateWind = WindMap(particles);

function animation() {
    ctx.clearRect(0, 0, 5000, 5000);

    ctx.fillStyle = "white";

    particles = particles.map((particle, index) => {
        ctx.beginPath();

        ctx.arc(
            particle.x,
            particle.y,
            index % 2 === 0 ? 1 : 2,
            0,
            Math.PI * 2
        );
        ctx.fill();

        return particle.y > canvas.height
            ? createParticle()
            : {
                  x: (particle.x += simulateWind(particle.y, index)),
                  y: particle.y + 0.5,
              };
    });

    requestAnimationFrame(animation);
}

animation();
