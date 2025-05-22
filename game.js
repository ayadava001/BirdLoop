
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let frames = 0;
const DEGREE = Math.PI/180;

// Load sprite
const sprite = new Image();
sprite.src = "https://i.imgur.com/N2fMZpO.png"; // Bird sprite

// Control
canvas.addEventListener("click", () => {
  bird.flap();
});

// Game state
const state = {
  current: 0,
  getReady: 0,
  game: 1,
  over: 2
};

// Bird
const bird = {
  x: 50,
  y: 150,
  w: 34,
  h: 26,
  radius: 12,
  frame: 0,

  gravity: 0.25,
  jump: 4.6,
  speed: 0,
  rotation: 0,

  draw() {
    ctx.fillStyle = "#FF0";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    ctx.fill();
  },

  flap() {
    this.speed = -this.jump;
  },

  update() {
    this.speed += this.gravity;
    this.y += this.speed;

    if (this.y + this.radius >= canvas.height) {
      this.y = canvas.height - this.radius;
      if (state.current === state.game) {
        state.current = state.over;
      }
    }
  },

  reset() {
    this.speed = 0;
    this.y = 150;
  }
};

// Pipes
const pipes = {
  position: [],
  top: { y: 0 },
  bottom: {},

  w: 50,
  h: 300,
  gap: 120,
  maxYPos: -150,
  dx: 2,

  draw() {
    for (let i = 0; i < this.position.length; i++) {
      let p = this.position[i];
      ctx.fillStyle = "#0f0";
      ctx.fillRect(p.x, p.y, this.w, this.h);
      ctx.fillRect(p.x, p.y + this.h + this.gap, this.w, this.h);
    }
  },

  update() {
    if (frames % 100 === 0) {
      this.position.push({
        x: canvas.width,
        y: this.maxYPos * (Math.random() + 1)
      });
    }

    for (let i = 0; i < this.position.length; i++) {
      let p = this.position[i];
      p.x -= this.dx;

      // Collision
      if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w &&
        (bird.y - bird.radius < p.y + this.h || bird.y + bird.radius > p.y + this.h + this.gap)) {
        state.current = state.over;
      }

      if (p.x + this.w <= 0) {
        this.position.shift();
        score.value += 1;
        score.best = Math.max(score.value, score.best);
      }
    }
  },

  reset() {
    this.position = [];
  }
};

// Score
const score = {
  best: 0,
  value: 0,

  draw() {
    ctx.fillStyle = "#FFF";
    ctx.strokeStyle = "#000";
    ctx.font = "24px Arial";
    ctx.fillText("Score: " + this.value, 10, 25);
  },

  reset() {
    this.value = 0;
  }
};

function draw() {
  ctx.fillStyle = "#70c5ce";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  pipes.draw();
  bird.draw();
  score.draw();
}

function update() {
  bird.update();
  pipes.update();
}

function loop() {
  update();
  draw();
  frames++;

  if (state.current !== state.over) {
    requestAnimationFrame(loop);
  } else {
    alert("Game Over! Your Score: " + score.value);
    bird.reset();
    pipes.reset();
    score.reset();
    state.current = state.getReady;
    loop();
  }
}

loop();
