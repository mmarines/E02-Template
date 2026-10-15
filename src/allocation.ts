export {};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;

const totalCrew = 6;
const supplyPerProducer = 3;
const sharedNeed = 6;
let producers = 2;

type ProvisioningShift = {
  assignedPeople: number;
  supplyOutput: number;
  sharedNeed: number;
  balance: number;
};

function prepareProvisioningShift(assignedPeople: number): ProvisioningShift {
  const supplyOutput = assignedPeople * supplyPerProducer;
  return {
    assignedPeople,
    supplyOutput,
    sharedNeed,
    balance: supplyOutput - sharedNeed,
  };
}

function drawCrewAssignmentSlots(assignedPeople: number) {
  for (let slotIndex = 0; slotIndex < totalCrew; slotIndex++) {
    const isAssignedToSupply = slotIndex < assignedPeople;
    ctx.fillStyle = isAssignedToSupply ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + slotIndex * 45, 16, 36, 36);
    ctx.fillStyle = isAssignedToSupply ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(slotIndex + 1), 31 + slotIndex * 45, 40);
  }
}

function drawProvisioningBar(
  label: string,
  amount: number,
  color: string,
  labelY: number,
  barY: number,
) {
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`${label}: ${amount}`, 18, labelY);
  ctx.fillStyle = color;
  ctx.fillRect(18, barY, amount * 14, 20);
}

function renderAllocationDisplay(shift: ProvisioningShift) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCrewAssignmentSlots(shift.assignedPeople);
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(
    `Crew on supply duty: ${shift.assignedPeople} / ${totalCrew}`,
    18,
    76,
  );
  drawProvisioningBar(
    "Supply output",
    shift.supplyOutput,
    "#27766b",
    102,
    110,
  );
  drawProvisioningBar("Shared need", shift.sharedNeed, "#a44d23", 154, 162);
}

function renderAllocationStats(shift: ProvisioningShift) {
  readout.textContent =
    `Assigned: ${shift.assignedPeople}/${totalCrew} · Supply output: ${shift.supplyOutput} · Shared need: ${shift.sharedNeed} · Balance: ${
      shift.balance > 0 ? "+" : ""
    }${shift.balance}`;
}

function updateDisplay() {
  const shift = prepareProvisioningShift(producers);
  renderAllocationDisplay(shift);
  renderAllocationStats(shift);
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  producers = Math.max(0, producers - 1);
  updateDisplay();
};
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  producers = Math.min(totalCrew, producers + 1);
  updateDisplay();
};
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    producers = 2;
    updateDisplay();
  };
updateDisplay();
