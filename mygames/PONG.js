console.log("PONG.JS");
let myCanvas;
let bouncePhysics = { "bounceClassesCollidePipeline": [] };
let gameObjects = {
    "baseObjects": {
    },
    "renderPipeline": []
}

const baseObjects = gameObjects.baseObjects;
baseObjects.linearMovingObject = class linearMovingObject {
    constructor() {
        this.position = createVector(0, 0);
        this.velocity = createVector(0, 0);
    }
    render() {
        this.position.add(this.velocity);
    }
}
baseObjects.bouncingObjectSquareHitbox = class bouncingObjectSquareHitbox extends gameObjects.baseObjects.linearMovingObject {
    constructor() {
        super();
        this.size = createVector(0, 0);
        this.anchored = false;
        this.oncollide = () => {};
        bouncePhysics.bounceClassesCollidePipeline.push(this);
    }

    isOnEdge(width, height) {
        const finalVector = createVector(0, 0);
        const halfWidth = this.size.x / 2;
        const halfHeight = this.size.y / 2;

        if (this.position.x - halfWidth <= 0) {
            finalVector.x = 1;
            this.position.x = halfWidth; // Push it back inside
        }
        if (this.position.x + halfWidth >= width) {
            finalVector.x = -1;
            this.position.x = width - halfWidth; // Push it back inside
        }
        if (this.position.y - halfHeight <= 0) {
            finalVector.y = 1;
            this.position.y = halfHeight;
        }
        if (this.position.y + halfHeight >= height) {
            finalVector.y = -1;
            this.position.y = height - halfHeight;
        }

        if (this.position.x - halfWidth <= 0) finalVector.x = 1;
        if (this.position.x + halfWidth >= width) finalVector.x = -1;
        if (this.position.y - halfHeight <= 0) finalVector.y = 1;
        if (this.position.y + halfHeight >= height) finalVector.y = -1;

        return finalVector;
    }

    collidesWith(other) {
        const halfWidth1 = this.size.x / 2;
        const halfHeight1 = this.size.y / 2;
        const halfWidth2 = other.size.x / 2;
        const halfHeight2 = other.size.y / 2;

        return (
            this.position.x - halfWidth1 < other.position.x + halfWidth2 &&
            this.position.x + halfWidth1 > other.position.x - halfWidth2 &&
            this.position.y - halfHeight1 < other.position.y + halfHeight2 &&
            this.position.y + halfHeight1 > other.position.y - halfHeight2
        );
    }

    checkCollisions() {
        bouncePhysics.bounceClassesCollidePipeline.forEach((value, index) => {
            if (this.anchored) return;
            const other = value;
            if (!(other !== this && this.collidesWith(other))) return;
            
            const dx = this.position.x - other.position.x;
            const dy = this.position.y - other.position.y;
            
            const halfWidth1 = this.size.x / 2;
            const halfHeight1 = this.size.y / 2;
            const halfWidth2 = other.size.x / 2;
            const halfHeight2 = other.size.y / 2;
            
            const overlapX = (halfWidth1 + halfWidth2) - Math.abs(dx);
            const overlapY = (halfHeight1 + halfHeight2) - Math.abs(dy);
            
            const reflectVector = createVector(0, 0);
            const reflectHorizontally = overlapX < overlapY;
            reflectVector.x = reflectHorizontally ? (dx > 0 ? 1 : -1) : 0;
            reflectVector.y = !reflectHorizontally ? (dy > 0 ? 1 : -1) : 0;
            
            const xCorrection = reflectHorizontally ? (dx > 0 ? overlapX : -overlapX) : 0;
            const yCorrection = !reflectHorizontally ? (dy > 0 ? overlapY : -overlapY) : 0;
            this.position.x += xCorrection;
            this.position.y += yCorrection;
            
            this.velocity.reflect(reflectVector);
            this.oncollide(other);
        });
    }

    render() {
        if (!this.anchored) {
            super.render();
        }
        const edgeVector = this.isOnEdge(width, height);
        this.velocity.reflect(edgeVector);
        this.checkCollisions();
    }
},
baseObjects.pongBat = class pongBat extends gameObjects.baseObjects.bouncingObjectSquareHitbox {
    constructor() {
        super();
        this.position = createVector(450, 250);
        this.size = createVector(20, 100);
        this.colour = [255, 100, 100];
        this.velocity = createVector(0, 0);
        this.anchored = true;
    }
    render() {
        super.render();
        fill(...this.colour);
        rectMode(CENTER);
        rect(this.position.x, this.position.y, this.size.x, this.size.y);
    }
},
baseObjects.pongBall = class ball extends gameObjects.baseObjects.bouncingObjectSquareHitbox {
    constructor() {
        super();
        this.colour = [255, 100, 100];
        this.position = createVector(250, 250);
        this.velocity = createVector(3, 2);
        this.size = createVector(20, 20);
    }
    render() {
        super.render();
        fill(...this.colour);
        noStroke();
        ellipse(this.position.x, this.position.y, this.size.x, this.size.y);
    }
}
baseObjects.fallingBouncingObject = class fallingBouncingObject extends gameObjects.baseObjects.linearMovingObject {
    constructor() {
        super();
        this.size = createVector(0, 0);
        this.anchored = false;
        this.gravity = 0.5;
        this.bounceDamping = 0.8;
        this.groundFriction = 0.98;
        this.airResistance = 0.99;
        this.oncollide = () => {};
        bouncePhysics.bounceClassesCollidePipeline.push(this);
    }

    isOnEdge(width, height) {
        const finalVector = createVector(0, 0);
        const halfWidth = this.size.x / 2;
        const halfHeight = this.size.y / 2;

        if (this.position.x - halfWidth <= 0) {
            finalVector.x = 1;
            this.position.x = halfWidth;
        }
        if (this.position.x + halfWidth >= width) {
            finalVector.x = -1;
            this.position.x = width - halfWidth;
        }
        if (this.position.y - halfHeight <= 0) {
            finalVector.y = 1;
            this.position.y = halfHeight;
        }
        if (this.position.y + halfHeight >= height) {
            finalVector.y = -1;
            this.position.y = height - halfHeight;
        }

        return finalVector;
    }

    collidesWith(other) {
        const halfWidth1 = this.size.x / 2;
        const halfHeight1 = this.size.y / 2;
        const halfWidth2 = other.size.x / 2;
        const halfHeight2 = other.size.y / 2;

        return (
            this.position.x - halfWidth1 < other.position.x + halfWidth2 &&
            this.position.x + halfWidth1 > other.position.x - halfWidth2 &&
            this.position.y - halfHeight1 < other.position.y + halfHeight2 &&
            this.position.y + halfHeight1 > other.position.y - halfHeight2
        );
    }

    handleObjectCollision(other) {
        if (other === this) return;
        if (!this.collidesWith(other)) return;

        const dx = this.position.x - other.position.x;
        const dy = this.position.y - other.position.y;

        const halfWidth1 = this.size.x / 2;
        const halfHeight1 = this.size.y / 2;
        const halfWidth2 = other.size.x / 2;
        const halfHeight2 = other.size.y / 2;

        const overlapX = (halfWidth1 + halfWidth2) - Math.abs(dx);
        const overlapY = (halfHeight1 + halfHeight2) - Math.abs(dy);

        if (overlapX < overlapY) {
            if (!this.anchored) {
                this.position.x += (dx > 0 ? overlapX : -overlapX);
            }
            this.velocity.x *= -this.bounceDamping;
            this.oncollide(other);
            return;
        }

        if (!this.anchored) {
            this.position.y += (dy > 0 ? overlapY : -overlapY);
        }
        this.velocity.y *= -this.bounceDamping;
        this.oncollide(other);
    }

    checkCollisions() {
        bouncePhysics.bounceClassesCollidePipeline.forEach((value) => {
            this.handleObjectCollision(value);
        });
    }

    applyGravity() {
        this.velocity.y += this.gravity;
    }

    handleBounce(edgeVector) {
        if (edgeVector.x !== 0) {
            this.velocity.x *= -this.bounceDamping;
            this.velocity.y *= this.groundFriction;
        }
        if (edgeVector.y !== 0) {
            this.velocity.y *= -this.bounceDamping;
            this.velocity.x *= this.groundFriction;
        }
    }

    render() {
        if (!this.anchored) {
            this.applyGravity();
            this.velocity.mult(this.airResistance);
            super.render();
        }
        
        const edgeVector = this.isOnEdge(width, height);
        if (edgeVector.x !== 0 || edgeVector.y !== 0) {
            this.handleBounce(edgeVector);
        }
        
        this.checkCollisions();
    }
}

baseObjects.basketball = class basketball extends gameObjects.baseObjects.fallingBouncingObject {
    constructor() {
        super();
        this.colour = [255, 140, 0];
        this.position = createVector(250, 100);
        this.velocity = createVector(2, 0);
        this.size = createVector(30, 30);
        this.bounceDamping = 1;
        this.gravity = 0.6;
    }
    render() {
        super.render();
        fill(...this.colour);
        noStroke();
        ellipse(this.position.x, this.position.y, this.size.x, this.size.y);
    }
}
function createNew(objectName) {
    const baseObjects = gameObjects.baseObjects;
    const thisObject = new baseObjects[objectName]();
    gameObjects.renderPipeline.push(thisObject);
    return thisObject;
}let pongBat;
let botBat;
let pongBalls = [];
let shotgunPellets = [];
let playerScore = 0;
let playerAssistBats = [];
let botAssistBats = [];
let konamiActivated = false;
let gun = null;
let bounceMarks = [];
let lastVelocities = {};
let initFrameCounts = {};

function createAssistBat(xPos, yPos) {
    let assistBat = createNew("pongBat");
    assistBat.position.x = xPos;
    assistBat.position.y = yPos;
    assistBat.targetVelocity = createVector(0, 0);
    assistBat.anchored = true;
    return assistBat;
}
function createPongBalls(amount = 1, config = {}) {
    const balls = [];
    for (let i = 0; i < amount; i++) {
        let ball = createNew(config.class || "pongBall");
        ball.position = createVector(250, 100 + i * 80);
        ball.velocity = createVector(random(6, 14) * (random() > 0.5 ? 1 : -1), random(-8, 8));
        balls.push(ball);
    }
    return balls;
}
function setup() {
    myCanvas = createCanvas(500, 500);
    myCanvas.parent('gamePanel');

    pongBat = createNew("pongBat");
    pongBat.colour = [0, 0, 0];
    botBat = createNew("pongBat");
    botBat.colour = [0, 0, 0];
    botBat.position.x = 50;
    
    createPongBalls().forEach((value, index) => {pongBalls.push(value);})
    const i = 0;
    playerAssistBats.push(createAssistBat(380, 150 + i * 200));
    botAssistBats.push(createAssistBat(120, 150 + i * 200));
}

const key_sequence = [];
key_sequence.push(["keyCode", 38]);
key_sequence.push(["keyCode", 38]);
key_sequence.push(["keyCode", 40]);
key_sequence.push(["keyCode", 40]);
key_sequence.push(["keyCode", 37]);
key_sequence.push(["keyCode", 39]);
key_sequence.push(["keyCode", 37]);
key_sequence.push(["keyCode", 39]);
key_sequence.push(["key", "b"]);
key_sequence.push(["key", "a"]);
let keySequenceIndex = 0;

function keyPressed() {
    const curKey = key_sequence[keySequenceIndex];
    let matched = false;
    
    if (curKey[0] === "keyCode" && curKey[1] === keyCode) {
        matched = true;
    }
    if (curKey[0] === "key" && curKey[1] === key) {
        matched = true;
    }

    if (!matched) {
        keySequenceIndex = 0;
        return;
    }

    keySequenceIndex += 1;

    if (keySequenceIndex !== key_sequence.length) {
        return;
    }

    konamiActivated = true;
    gun = {
        position: createVector(360, height / 2),
        angle: 0,
        width: 50,
        height: 15
    };
    keySequenceIndex = 0;
    pongBat.size.y = height-100;
}

function mousePressed() {
    if (!konamiActivated || !gun) return;
    const pelletsCount = 6;
    let spreadAngle = PI / 90;
        
    createPongBalls(undefined, {class: "basketball"}).forEach((value, index) => {
        value.size = createVector(10, 6);
        value.position = createVector(gun.position.x, gun.position.y);
        value.colour = [255, 161, 93];
    })
    for (let i = 0; i < pelletsCount; i++) {
        let ball = createNew("basketball");
        ball.oncollide = function(other) {
            ball.velocity.x /= 2;
            ball.velocity.y /= 2;
        }
        ball.position = createVector(gun.position.x, gun.position.y);

        ball.size = createVector(ball.size.x * 0.2, ball.size.y * 0.2);
        
        const angleOffset = map(i, 0, pelletsCount - 1, -spreadAngle / 2, spreadAngle / 2);
        const shootAngle = gun.angle + angleOffset;
        const speed = 5100;
        
        ball.velocity = createVector(cos(shootAngle) * speed, sin(shootAngle) * speed);
        ball.hasBounced = false;
        ball.isPellet = true;
        pongBalls.push(ball);
        shotgunPellets.push(ball);
    }
}
function resetPongBalls() {
    for (let i = shotgunPellets.length - 1; i >= 0; i--) {
        let b = shotgunPellets[i];
        b.render = () => {};
        let ballIndex = pongBalls.indexOf(b);
        if (ballIndex > -1) {
            pongBalls.splice(ballIndex, 1);
        }
        shotgunPellets.splice(i, 1);
        let bounceIndex = bouncePhysics.bounceClassesCollidePipeline.indexOf(b);
        if (bounceIndex > -1) {
            bouncePhysics.bounceClassesCollidePipeline.splice(bounceIndex, 1);
        }
    }
    for (let b of pongBalls) {
        b.position = createVector(250, random(50, 450));
        b.velocity = createVector(random(6, 14) * (random() > 0.5 ? 1 : -1), random(-8, 8));
    }
}
function draw() {
    background(255, 255, 255);
    for (let obj of gameObjects.renderPipeline) {
        if (!obj) continue;
        obj.render();   
    }
    noStroke();
    pongBat.position.y = constrain(mouseY, pongBat.size.y / 2, height - pongBat.size.y / 2);

    let closestBall = null;
    let closestDist = Infinity;
    for (let ball of pongBalls) {
        // if (ball.velocity.x > 0) return;
        let dist = ball.position.x;
        if (dist > closestDist) continue;
        closestDist = dist;
        closestBall = ball;
    }
    
    if (closestBall) {
        botBat.position.y = constrain(closestBall.position.y, botBat.size.y / 2, height - botBat.size.y / 2);
    }
    
    for (let ball of pongBalls) {
        if (ball.position.x + ball.size.x / 2 >= width - 1) {
            playerScore--;
            resetPongBalls();
            break;
        }
        if (ball.position.x - ball.size.x / 2 <= 0) {
            playerScore++;
            resetPongBalls();
            break;
        }
    }

    for (let assistBat of playerAssistBats) {
        if (frameCount % 15 === 0) {
            assistBat.targetVelocity = createVector(0, random(-16, 16));
        }
        assistBat.velocity.y = lerp(assistBat.velocity.y, assistBat.targetVelocity.y, 0.15);
        assistBat.position.y = constrain(assistBat.position.y + assistBat.velocity.y, assistBat.size.y / 2, height - assistBat.size.y / 2);
    }

    for (let assistBat of botAssistBats) {
        if (frameCount % 15 === 0) {
            assistBat.targetVelocity = createVector(0, random(-16, 16));
        }
        assistBat.velocity.y = lerp(assistBat.velocity.y, assistBat.targetVelocity.y, 0.15);
        assistBat.position.y = constrain(assistBat.position.y + assistBat.velocity.y, assistBat.size.y / 2, height - assistBat.size.y / 2);
    }
    
    if (konamiActivated && gun) {
        gun.angle = atan2(mouseY - gun.position.y, mouseX - gun.position.x);
        
        push();
        translate(gun.position.x, gun.position.y);
        rotate(gun.angle);
        fill(0);
        rectMode(CENTER);
        rect(0, 0, gun.width, gun.height);
        pop();
    }
    
    fill(0);
    textSize(32);
    textAlign(RIGHT, TOP);
    text(playerScore, width - 20, 20);
}