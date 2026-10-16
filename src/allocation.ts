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

type ProvisioningRow = {
  label: "Production" | "Consumption";
  amount: number;
  color: string;
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

function getProvisioningRows(shift: ProvisioningShift): ProvisioningRow[] {
  return [
    {
      label: "Production",
      amount: shift.supplyOutput,
      color: "#27766b",
    },
    {
      label: "Consumption",
      amount: shift.sharedNeed,
      color: "#a44d23",
    },
  ];
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

function drawProvisioningRows(rows: ProvisioningRow[]) {
  rows.forEach((row, rowIndex) => {
    const rowLabelY = 102 + rowIndex * 52;
    const rowBarY = 110 + rowIndex * 52;
    ctx.fillStyle = "#233e43";
    ctx.font = "14px system-ui";
    ctx.fillText(`${row.label}: ${row.amount}`, 18, rowLabelY);
    ctx.fillStyle = row.color;
    ctx.fillRect(18, rowBarY, row.amount * 14, 20);
  });
}

function renderAllocationDisplay(shift: ProvisioningShift) {
  const rows = getProvisioningRows(shift);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCrewAssignmentSlots(shift.assignedPeople);
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(
    `Crew on supply duty: ${shift.assignedPeople} / ${totalCrew}`,
    18,
    76,
  );
  drawProvisioningRows(rows);
}

function renderAllocationStats(shift: ProvisioningShift) {
  readout.textContent =
    `Assigned: ${shift.assignedPeople}/${totalCrew} · Production: ${shift.supplyOutput} · Consumption: ${shift.sharedNeed} · Balance: ${
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
