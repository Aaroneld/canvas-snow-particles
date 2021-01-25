const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

let MousePos = [Infinity, Infinity];
const DISPLACEMENT_FORCE_MAX = 2;
canvas.addEventListener("mousemove", (e) => {
    // console.log(MousePos);
    MousePos = [e.clientX, e.clientY];
});

bRect = canvas.getBoundingClientRect();
canvas.width = bRect.width;
canvas.height = bRect.height;

console.log(ctx);
console.log(canvas.width);
ctx.fillStyle = "#ffffff";
ctx.fillRect(0, 0, 100, 300);

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

function createParticle() {
    return {
        x: ~~(Math.random() * canvas.width),
        y: -~~(Math.random() * canvas.height),
        windValue: returnRandomWindValue(),
        displacementVectorX: 0,
        displacementVectorY: 0,
        celeration: "NONE",
    };
}

function checkIfInMouseRange(particle = {}) {
    if (
        Math.abs(particle.x - MousePos[0]) <= 10 &&
        Math.abs(particle.y - MousePos[1]) <= 10
    ) {
        particle.displacementVectorX = particle.x - MousePos[0] <= 0 ? -1 : 1;
        particle.displacementVectorY = particle.y - MousePos[1] <= 0 ? -1 : 1;
        particle.celeration = "INCREASING";
    }
}

function rectifyCeleration(value, particle) {
    if (value > 0.5 || value < -0.5) {
        if (particle.celeration === "INCREASING") {
            const changedValue =
                value < 0
                    ? -(Math.abs(value) + (0.2 / 10) * DISPLACEMENT_FORCE_MAX)
                    : Math.abs(value) + (0.2 / 10) * DISPLACEMENT_FORCE_MAX;

            if (Math.abs(changedValue) > DISPLACEMENT_FORCE_MAX)
                particle.celeration = "DECREASING";

            return changedValue;
        }

        const changedValue =
            value < 0
                ? -(Math.abs(value) - (0.5 / 200) * DISPLACEMENT_FORCE_MAX)
                : Math.abs(value) - (0.5 / 200) * DISPLACEMENT_FORCE_MAX;

        if (Math.abs(changedValue) < 1) particle.celeration = "NONE";

        return changedValue;
    }
    return 0;
}

let particles = [];

for (i = 0; i < 3000; i++) {
    particles.push(createParticle());
}

// function WindMap(particles) {
//     let windMap = [];

//     return function simulateWind(y, i) {
//         if (y < 0) {
//             windMap[i] = returnRandomWindValue();
//         }

//         const RAND = Math.random();

//         if (RAND > 0.9999) {
//             windMap[i] = returnRandomWindValue();
//         }

//         return windMap[i];
//     };
// }

function animation() {
    ctx.clearRect(0, 0, 5000, 5000);

    ctx.fillStyle = "white";

    const LENGTH = particles.length;

    for (i = LENGTH - 1; i > -1; i--) {
        ctx.beginPath();

        ctx.arc(
            particles[i].x,
            particles[i].y,
            i % 2 === 0 ? 1 : 2,
            0,
            Math.PI * 2
        );

        ctx.fill();

        checkIfInMouseRange(particles[i]);

        particles[i].y > canvas.height
            ? (particles[i] = createParticle())
            : (particles[i] = {
                  x:
                      particles[i].x +
                      particles[i].windValue +
                      particles[i].displacementVectorX,
                  y: particles[i].y + 0.5 + particles[i].displacementVectorY,
                  windValue: particles[i].windValue,
                  displacementVectorX: rectifyCeleration(
                      particles[i].displacementVectorX,
                      particles[i]
                  ),
                  displacementVectorY: rectifyCeleration(
                      particles[i].displacementVectorY,
                      particles[i]
                  ),
                  celeration: particles[i].celeration,
              });
    }

    // particles = particles.map((particle, index) => {
    //     ctx.beginPath();

    //     ctx.arc(
    //         particle.x,
    //         particle.y,
    //         index % 2 === 0 ? 1 : 2,
    //         0,
    //         Math.PI * 2
    //     );
    //     ctx.fill();

    //     return particle.y > canvas.height
    //         ? createParticle()
    //         : {
    //               x: (particle.x += simulateWind(particle.y, index)),
    //               y: particle.y + 0.5,
    //           };
    // });

    requestAnimationFrame(animation);
}

animation();
