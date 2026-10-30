// Platzhalter-Daten (später durch echte API-Daten ersetzen)
const labels = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

function createChart(canvasId, data, farbe) {
    const ctx = document.getElementById(canvasId);
    new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                data: data,
                borderColor: farbe,
                backgroundColor: farbe + "33",
                tension: 0.3,
                fill: true,
                pointRadius: 3
            }]
        },
        options: {
            plugins: { legend: { display: false } },
            scales: {
                x: { ticks: { color: "#b3b3c6" }, grid: { color: "#2a2a40" } },
                y: { ticks: { color: "#b3b3c6" }, grid: { color: "#2a2a40" } }
            }
        }
    });
}

createChart("btcChart", [60000, 61500, 60800, 63000, 62500, 64000, 63800], "#f7931a");
createChart("ethChart", [3200, 3150, 3300, 3280, 3400, 3350, 3420], "#627eea");
createChart("solChart", [140, 145, 138, 150, 155, 152, 158], "#14f195");