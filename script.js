// Kopie pole pro losování — odebíráme vylosovaná čísla
const remaining = [...ALL_TICKETS];

// Pole již vylosovaných čísel
const drawn = [];

// Příznak, zda právě probíhá animace losování
let isRolling = false;

// Reference na HTML elementy
const display = document.getElementById('display');
const historyEl = document.getElementById('history');

/**
 * Vrátí náhodné číslo z celého pole vstupenek
 * (používá se pro animaci — zobrazují se i již vylosovaná čísla)
 */
function getRandomFromAll() {
  return ALL_TICKETS[Math.floor(Math.random() * ALL_TICKETS.length)];
}

/**
 * Vylosuje výherce — náhodně vybere číslo z pole zbývajících,
 * odebere ho a přidá do seznamu vylosovaných
 */
function drawWinner() {
  const idx = Math.floor(Math.random() * remaining.length);
  const winner = remaining[idx];
  remaining.splice(idx, 1);
  drawn.push(winner);
  return winner;
}

/**
 * Přidá vylosované číslo do historie vlevo na obrazovce
 * Zobrazuje maximálně posledních 15 čísel
 */
function addToHistory(number) {
  const item = document.createElement('div');
  item.className = 'history-item';
  item.textContent = number;
  historyEl.appendChild(item);

  // Ponechat jen posledních 15 položek
  while (historyEl.children.length > 15) {
    historyEl.removeChild(historyEl.firstChild);
  }
}

/**
 * Hlavní funkce losování
 * Spustí animaci s náhodnými čísly, která se postupně zpomaluje,
 * a poté odhalí vylosovaného výherce
 */
async function roll() {
  // Pokud už losování běží, nic nedělat
  if (isRolling) return;

  // Pokud už nejsou žádná čísla k vylosování
  if (remaining.length === 0) {
    display.textContent = '—';
    display.className = 'number-display';
    return;
  }

  isRolling = true;
  display.className = 'number-display rolling';

  // Při prvním losování animovat pozadí z bottom na top
  if (drawn.length === 0) {
    document.body.classList.add('bg-top');
  }

  // Vylosovat výherce předem (ale zobrazit ho až po animaci)
  const winner = drawWinner();

  // Animace: zobrazit 24 náhodných čísel se zpomalujícím tempem
  // Opacity postupně roste z 0 na 0.5 během animace
  const steps = 24;
  for (let i = 0; i < steps; i++) {
    const delay = 15 + i * 12; // Postupně delší pauzy (15ms → 291ms)
    const opacity = (i / steps) * 0.8; // Opacity roste z 0 do ~0.5
    await new Promise(r => setTimeout(r, delay));
    display.textContent = getRandomFromAll();
    display.style.opacity = opacity;
  }

  // Krátká pauza před odhalením výherce
  await new Promise(r => setTimeout(r, 150));

  // Zobrazit výherce s plnou viditelností a zlatým efektem
  display.style.opacity = 1;
  display.textContent = winner;
  display.className = 'number-display winner';

  // Přidat do historie
  addToHistory(winner);

  // Po 1.5 sekundě povolit další losování
  setTimeout(() => {
    isRolling = false;
  }, 1500);
}

// Naslouchat na stisk mezerníku
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault(); // Zamezit scrollování stránky
    roll();
  }
});
