// Guthaben aus LocalStorage laden (oder Startwert setzen)
let guthaben = parseFloat(localStorage.getItem("guthaben")) || 1200;

const guthabenAnzeige = document.getElementById("guthabenAnzeige");
const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spinBtn");
const ergebnisBox = document.getElementById("ergebnisBox");
const einsatzInput = document.getElementById("einsatz");
const zahlInput = document.getElementById("zahlInput");

function guthabenAktualisieren() {
    guthabenAnzeige.textContent = guthaben.toFixed(2) + " CHF";
    localStorage.setItem("guthaben", guthaben);
}
guthabenAktualisieren();

// Rote Zahlen im europäischen Roulette
const roteZahlen = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

function farbeVonZahl(zahl) {
    if (zahl === 0) return "gruen";
    return roteZahlen.includes(zahl) ? "rot" : "schwarz";
}

function kolonneVonZahl(zahl) {
    if (zahl === 0) return null;
    const rest = zahl % 3;
    if (rest === 1) return "1";
    if (rest === 2) return "2";
    return "3";
}

function wetteBeschreibung(wette) {
    switch (wette.typ) {
        case "farbe": return wette.wert === "rot" ? "Rot" : "Schwarz";
        case "paritaet": return wette.wert === "gerade" ? "Gerade" : "Ungerade";
        case "bereich": return wette.wert === "niedrig" ? "1–18" : "19–36";
        case "kolonne": return "Kolonne " + wette.wert;
        case "zahl": return "Zahl " + wette.wert;
    }
}

// Aktuelle Auswahl merken
let aktuelleWette = null; // { typ: "farbe", wert: "rot" }

const betButtons = document.querySelectorAll(".bet-btn:not(.zahl-btn)");
betButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        betButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        aktuelleWette = { typ: btn.dataset.typ, wert: btn.dataset.wert };
    });
});

document.querySelector(".zahl-btn").addEventListener("click", (e) => {
    const zahl = parseInt(zahlInput.value);
    if (isNaN(zahl) || zahl < 0 || zahl > 36) {
        ergebnisBox.innerHTML = `<p class="ergebnis-platzhalter">Bitte eine gültige Zahl (0-36) eingeben.</p>`;
        return;
    }
    betButtons.forEach(b => b.classList.remove("active"));
    e.target.classList.add("active");
    aktuelleWette = { typ: "zahl", wert: zahl };
});

// Spin-Logik
spinBtn.addEventListener("click", () => {
    const einsatz = parseFloat(einsatzInput.value);

    if (!aktuelleWette) {
        ergebnisBox.innerHTML = `<p class="ergebnis-platzhalter">Bitte zuerst eine Wette auswählen.</p>`;
        return;
    }
    if (isNaN(einsatz) || einsatz <= 0) {
        ergebnisBox.innerHTML = `<p class="ergebnis-platzhalter">Bitte einen gültigen Einsatz eingeben.</p>`;
        return;
    }
    if (einsatz > guthaben) {
        ergebnisBox.innerHTML = `<p class="ergebnis-platzhalter">Nicht genug Guthaben.</p>`;
        return;
    }

    // Guthaben sofort abziehen
    guthaben -= einsatz;
    guthabenAktualisieren();

    // Zufallszahl 0-36
    const ergebnis = Math.floor(Math.random() * 37);
    const farbe = farbeVonZahl(ergebnis);

    // Rad-Animation (mehrere Umdrehungen + Zufallswinkel)
    const aktuelleRotation = wheel.style.transform
        ? parseInt(wheel.style.transform.replace(/[^0-9]/g, ""))
        : 0;
    const neueRotation = aktuelleRotation + 1440 + Math.floor(Math.random() * 360);
    wheel.style.transform = `rotate(${neueRotation}deg)`;

    spinBtn.disabled = true;

    setTimeout(() => {
        wheel.textContent = ergebnis;
        auswertung(ergebnis, farbe, einsatz);
        spinBtn.disabled = false;
    }, 3000);
});

function auswertung(zahl, farbe, einsatz) {
    let gewonnen = false;
    let auszahlung = 0;

    switch (aktuelleWette.typ) {
        case "farbe":
            if (aktuelleWette.wert === farbe) {
                gewonnen = true;
                auszahlung = einsatz * 2;
            }
            break;

        case "paritaet":
            if (zahl !== 0) {
                const istGerade = zahl % 2 === 0;
                if ((aktuelleWette.wert === "gerade" && istGerade) ||
                    (aktuelleWette.wert === "ungerade" && !istGerade)) {
                    gewonnen = true;
                    auszahlung = einsatz * 2;
                }
            }
            break;

        case "bereich":
            if (aktuelleWette.wert === "niedrig" && zahl >= 1 && zahl <= 18) {
                gewonnen = true;
                auszahlung = einsatz * 2;
            } else if (aktuelleWette.wert === "hoch" && zahl >= 19 && zahl <= 36) {
                gewonnen = true;
                auszahlung = einsatz * 2;
            }
            break;

        case "kolonne":
            if (kolonneVonZahl(zahl) === aktuelleWette.wert) {
                gewonnen = true;
                auszahlung = einsatz * 3;
            }
            break;

        case "zahl":
            if (zahl === aktuelleWette.wert) {
                gewonnen = true;
                auszahlung = einsatz * 36;
            }
            break;
    }

    const wetteText = wetteBeschreibung(aktuelleWette);

    if (gewonnen) {
        const gewinn = auszahlung - einsatz;
        guthaben += auszahlung;
        ergebnisBox.innerHTML = `
            <p class="ergebnis-zahl">Gezogen: ${zahl} (${farbe.toUpperCase()})</p>
            <p class="ergebnis-wette">Deine Wette: ${wetteText} · Einsatz: ${einsatz.toFixed(2)} CHF</p>
            <p class="ergebnis-betrag gewonnen">+${gewinn.toFixed(2)} CHF</p>
        `;
    } else {
        ergebnisBox.innerHTML = `
            <p class="ergebnis-zahl">Gezogen: ${zahl} (${farbe.toUpperCase()})</p>
            <p class="ergebnis-wette">Deine Wette: ${wetteText} · Einsatz: ${einsatz.toFixed(2)} CHF</p>
            <p class="ergebnis-betrag verloren">-${einsatz.toFixed(2)} CHF</p>
        `;
    }

    guthabenAktualisieren();
}