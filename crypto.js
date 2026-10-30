const backToTopBtn = document.getElementById("backtotop");

backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

const cryptoBtn = document.getElementById("cryptoBtn");
const kaufSection = document.querySelector(".kauf-section");

cryptoBtn.addEventListener("click", () => {
    kaufSection.innerHTML = `
        <div class="widget-header">
            <span class="coin-icon">₿</span>
            <span class="coin-price">62'976.00</span>
        </div>

        <label class="betrag-label">BETRAG (BTC)</label>
        <input type="number" class="betrag-input" value="0.001">

        <div class="widget-buttons">
            <button class="kaufen-btn">KAUFEN</button>
            <button class="verkaufen-btn">VERKAUFEN</button>
        </div>

        <div class="konto-block">
            <h4>KONTO STAND</h4>
            <div class="konto-row">
                <span>Cash</span>
                <span>83.08 CHF</span>
            </div>
            <div class="konto-row">
                <span>Portfolio</span>
                <span>76.67 CHF</span>
            </div>
            <div class="konto-row total">
                <span>Gesamt</span>
                <span>159.75 CHF</span>
            </div>
        </div>

        <div class="konto-block">
            <h4>DEIN BTC</h4>
            <div class="konto-row">
                <span>Menge</span>
                <span>0.001200</span>
            </div>
            <div class="konto-row">
                <span>Wert</span>
                <span>75.57 CHF</span>
            </div>
            <div class="konto-row">
                <span>P&L</span>
                <span class="negative">-0.23 CHF</span>
            </div>
        </div>
    `;
});