import gsap from "gsap";

const DISPLACEMENT_FORCE_MAX = 2;
let MousePos = [Infinity, Infinity];

function main() {
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    const stage = document.querySelector("#stage");
    const iris = document.querySelector("#iris-pupil").children[1];

    eyeEntrance();

    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;

    stage.addEventListener("mousemove", (e) => {
        MousePos = [e.clientX, e.clientY];
        const bRect = iris.getBoundingClientRect();
        const center = [bRect.x + bRect.width / 2, bRect.y + bRect.height / 2];
        const maxDistance = calculateDistance(
            bRect.x + bRect.width / 2,
            0,
            bRect.y + bRect.height / 2,
            0
        );
        const relPos = getRelativePosition(
            MousePos[0],
            center[0],
            MousePos[1],
            center[1]
        );

        const slope = calculateSlope(relPos[0], 0, relPos[1], 0);
        const quadrant = determineQuadrant(relPos[0], relPos[1]);
        const distancePercent = percentageOfMaxDistance(
            calculateDistance(relPos[0], 0, relPos[1], 0),
            maxDistance
        );
        const intersection = getIntersection(slope, quadrant);
        mouseMoveAnimations(
            intersection,
            Math.abs(slope) > 2 ? 2 * (Math.abs(slope) / slope) : slope
        );
    });

    setStage();
    setSize(canvas);
    const buffer = createCanvasBuffer(canvas);
    let particles = initializeParticles(canvas);

    resize(canvas, stage);

    window.addEventListener("resize", () => {
        resize(canvas, stage);
    });

    animation(ctx, canvas, particles, buffer);
}

function calculateDistance(x1, x2, y1, y2) {
    return Math.sqrt(Math.abs(x1 - x2 + (y1 - y2)));
}

function calculateTranslationAmount(
    proportionalComponent,
    proportionFactor,
    slopeMagnitude
) {
    let shim = 0;

    // if (debug) {
    //     // console.log(
    //     //     proportionalComponent,
    //     //     proportionFactor,
    //     //     distanceFactor,
    //     //     SIGNEDNESS,
    //     //     distanceComponent
    //     // );
    //     // console.log(proportionalComponent * proportionFactor);
    //     // console.log(intersection);
    // }

    if (slopeMagnitude && slopeMagnitude > 1) {
        console.log(slopeMagnitude);
        shim =
            40 *
            (slopeMagnitude * 0.3) *
            (Math.abs(proportionalComponent) / proportionalComponent);
    }

    return proportionalComponent * proportionFactor + shim;
}

function mouseMoveAnimations(intersection, slope) {
    gsap.to("#iris-shadow", {
        x: calculateTranslationAmount(intersection[0], 150),
        y: calculateTranslationAmount(intersection[1], 150, Math.abs(slope)),

        ease: "slow(0.7, 0.7, false)",
    });
    gsap.to("#reflection-1", {
        x: calculateTranslationAmount(intersection[0], 20),
        y: calculateTranslationAmount(intersection[1], 20),
        ease: "slow(0.7, 0.7, false)",
    });
    gsap.to("#reflection-2", {
        x: calculateTranslationAmount(intersection[0], 20),
        y: calculateTranslationAmount(intersection[1], 20),
        ease: "slow(0.7, 0.7, false)",
    });
    gsap.to("#eye-shadow", {
        x: calculateTranslationAmount(intersection[0], 25),
        y: calculateTranslationAmount(intersection[1], 25),
    });
}

function percentageOfMaxDistance(distance, maxDistance) {
    return distance / maxDistance;
}

function calculateSlope(x1, x2, y1, y2) {
    return x1 - x2 !== 0 ? (y1 - y2) / (x1 - x2) : "vert";
}

function determineQuadrant(x, y) {
    if (x > 0 && y > 0) return 1;
    if (x < 0 && y > 0) return 2;
    if (x < 0 && y < 0) return 3;
    if (x > 0 && y < 0) return 4;
}

function getRelativePosition(x1, x2, y1, y2) {
    return [x1 - x2, y1 - y2];
}

function getIntersection(slope, quadrant) {
    slope = Math.abs(slope) > 2 ? 2 * (Math.abs(slope) / slope) : slope;
    const x = 1 / (1 + slope ** 2);
    const y = x * slope;
    console.log(quadrant, slope);
    if (slope > 0) {
        return quadrant === 1
            ? [Math.abs(x), Math.abs(y)]
            : [-Math.abs(x), -Math.abs(y)];
    } else {
        return quadrant === 2
            ? [-Math.abs(x), Math.abs(y)]
            : [Math.abs(x), -Math.abs(y)];
    }
}

const eyeEntrance = () => {
    gsap.set("#eye-open", { y: "-50%" });
    gsap.to("#eye-open", {
        delay: 8,
        y: 0,
        duration: 5,
        ease: "back.out(.1)",
    });

    function toggleValue() {
        let value = -20;

        return () => {
            value *= -1;
            return value;
        };
    }

    gsap.to("#eye-open", {
        delay: 13,
        duration: 4,
        y: 5,
        repeat: -1,
        ease: "back.inOut(6)",
        yoyoEase: "slow(0.7, 0.7, false)",
        yoyo: true,
        repeatRefresh: true,
    });
};

const createCanvasBuffer = (canvas) => {
    canvas.canvasBuffer = document.createElement("canvas");
    canvas.canvasBuffer.height = canvas.height;
    canvas.canvasBuffer.width = canvas.width;
    return canvas.canvasBuffer.getContext("2d");
};

const setStage = () => {
    gsap.set(".tree, .tree-2", {
        transformOrigin: "50% 100%",
        rotate: -90,
        scaleX: 0.05,
        scale: 0.3,
        y: 20,
    });

    gsap.set(".tree-2", { scaleX: 0.6, y: 200 });

    window.onload = () => {
        gsap.to(".tree", {
            delay: 3,
            rotate: -3,
            scaleX: 1,
            scaleY: 0.9,
            y: 0,
            duration: 3,
        });
        gsap.to(".tree", { delay: 4, scaleY: 1, duration: 4 });

        gsap.to(".tree-2", {
            delay: 5,
            rotate: 3,
            scaleX: 0.7,
            scaleY: 0.9,
            y: 0,
            duration: 3,
        });
        gsap.to(".tree-2", { delay: 7, scaleY: 0.9, duration: 4 });
    };
};

const resize = (canvas, stage) => {
    canvas.width = canvas.canvasBuffer.width = window.innerWidth;
    canvas.height = canvas.canvasBuffer.height = window.innerWidth * 0.5625;
    stage.style.height = `${window.innerWidth * 0.5625}px`;
    stage.style.width = `${window.innerWidth}px`;
};

const setSize = (canvas) => {
    const bRect = canvas.getBoundingClientRect();
    canvas.width = bRect.width;
    canvas.height = bRect.height;
};

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

function createParticle(canvas) {
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
                ? -(Math.abs(value) - (0.5 / 400) * DISPLACEMENT_FORCE_MAX)
                : Math.abs(value) - (0.5 / 200) * DISPLACEMENT_FORCE_MAX;

        if (Math.abs(changedValue) < 1) particle.celeration = "NONE";

        return changedValue;
    }
    return 0;
}

const initializeParticles = (canvas) => {
    let particles = [];

    for (let i = 0; i < 5000; i++) {
        particles.push(createParticle(canvas));
    }

    return particles;
};

function animation(ctx, canvas, particles, buffer) {
    buffer.clearRect(0, 0, canvas.width, canvas.height);

    buffer.beginPath();
    buffer.fillStyle = "#ffffff";
    buffer.ellipse(
        canvas.width / 2,
        canvas.height,
        canvas.width / 1.5,
        canvas.width / 12,
        0,
        0,
        Math.PI * 2
    );
    buffer.stroke();
    buffer.fill();

    buffer.fillStyle = "#80ffdd";

    const LENGTH = particles.length;

    for (let i = LENGTH - 1; i > -1; i--) {
        buffer.beginPath();

        if (
            particles[i].x > 0 ||
            particles[i].x < canvas.width ||
            particles[i].y > 0 ||
            particles[i].y < canvas.height
        ) {
            buffer.arc(
                particles[i].x,
                particles[i].y,
                i % 2 === 0 ? 1 : 2,
                0,
                Math.PI * 2
            );
        }

        buffer.stroke();
        buffer.fill();

        checkIfInMouseRange(particles[i]);

        particles[i].y > canvas.height
            ? (particles[i] = createParticle(canvas))
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(canvas.canvasBuffer, 0, 0);

    setTimeout(() => {
        requestAnimationFrame(() => {
            animation(ctx, canvas, particles, buffer);
        });
    }, 1000 / 60);
}

main();
