export {};

const canvas = document.querySelector<HTMLCanvasElement>("#rover-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>("#rover-readout")!;
const pendingList = document.querySelector<HTMLOListElement>("#rover-pending")!;
const queueStatus = document.querySelector<HTMLParagraphElement>(
  "#rover-queue-status",
)!;

let x = 2;
let y = 2;
let directionIndex = 0;
let pendingCommands: Command[] = [];

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
  | { type: "Forward" }
  | { type: "Right" };

function runCommand(command: Command) {
  if (command.type === "Forward") {
    const currentDirection = directions[directionIndex];
    x = clampToGrid(x + currentDirection.X);
    y = clampToGrid(y + currentDirection.Y);
  }

  if (command.type === "Right") {
    directionIndex = (directionIndex + 1) % directions.length;
  }

  drawRover();
}

function renderQueue() {
  pendingList.replaceChildren();
  pendingCommands.forEach((command) => {
    const item = document.createElement("li");
    item.textContent = command.type;
    pendingList.append(item);
  });

  const hasPendingCommands = pendingCommands.length > 0;
  queueStatus.textContent = hasPendingCommands
    ? `Queued: ${pendingCommands.length} command${
      pendingCommands.length === 1 ? "" : "s"
    }`
    : "Empty";
}

function queueCommand(command: Command) {
  pendingCommands.push(command);
  renderQueue();
}

function runQueuedCommands() {
  while (pendingCommands.length > 0) {
    const command = pendingCommands.shift()!;
    runCommand(command);
  }
  renderQueue();
}

function clearQueuedCommands() {
  pendingCommands = [];
  renderQueue();
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
  queueCommand({ type: "Forward" });
};
document.querySelector<HTMLButtonElement>("#rover-right")!.onclick = () => {
  queueCommand({ type: "Right" });
};
document.querySelector<HTMLButtonElement>("#rover-run")!.onclick = () => {
  runQueuedCommands();
};
document.querySelector<HTMLButtonElement>("#rover-clear")!.onclick = () => {
  clearQueuedCommands();
};
document.querySelector<HTMLButtonElement>("#rover-reset")!.onclick = () => {
  x = 2;
  y = 2;
  directionIndex = 0;
  clearQueuedCommands();
  drawRover();
};
renderQueue();
drawRover();
