export {};

const canvas = document.querySelector<HTMLCanvasElement>("#rover-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>("#rover-readout")!;

let x = 2;
let y = 2;
let directionIndex = 0;

const gridMin = 0;
const gridMax = 4;

type Direction = {
  name: "North" | "East" | "South" | "West";
  X: number;
  Y: number;
};

const directions: Direction[] = [
  { name: "North", X: 0, Y: -1 },
  { name: "East", X: 1, Y: 0 },
  { name: "South", X: 0, Y: 1 },
  { name: "West", X: -1, Y: 0 },
];

function clampToGrid(value: number) {
  return Math.min(gridMax, Math.max(gridMin, value));
}

type Command =
  | { type: "forward" }
  | { type: "right" };

function runCommand(command: Command) {
  if (command.type === "forward") {
    const currentDirection = directions[directionIndex];
    x = clampToGrid(x + currentDirection.X);
    y = clampToGrid(y + currentDirection.Y);
  }

  if (command.type === "right") {
    directionIndex = (directionIndex + 1) % directions.length;
  }

  drawRover();
}

function drawRover() {
  const currentDirection = directions[directionIndex];

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#718881";
  for (let row = 0; row < 5; row++) {
    for (let column = 0; column < 5; column++) {
      ctx.strokeRect(10 + column * 56, 10 + row * 56, 56, 56);
    }
  }

  ctx.save();
  ctx.translate(38 + x * 56, 38 + y * 56);
  ctx.rotate(directionIndex * Math.PI / 2);
  ctx.fillStyle = "#27766b";
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(17, 16);
  ctx.lineTo(-17, 16);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  readout.textContent =
    `Position: (${x}, ${y}) · Facing: ${currentDirection.name}`;
}

document.querySelector<HTMLButtonElement>("#rover-forward")!.onclick = () => {
  runCommand({ type: "forward" });
};
document.querySelector<HTMLButtonElement>("#rover-right")!.onclick = () => {
  runCommand({ type: "right" });
};
document.querySelector<HTMLButtonElement>("#rover-reset")!.onclick = () => {
  x = 2;
  y = 2;
  directionIndex = 0;
  drawRover();
};
drawRover();
