// Všechna uhrazená čísla vstupenek (677 kusů)
const ALL_TICKETS = [1,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,32,33,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,104,105,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,140,141,143,144,146,147,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,176,177,178,180,182,183,184,185,186,188,189,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255,256,257,258,259,260,261,262,263,264,265,266,267,268,269,270,271,272,273,274,275,276,277,278,279,280,281,282,283,284,285,286,287,288,289,290,291,292,293,294,295,296,297,298,299,300,301,302,303,304,305,306,307,308,309,310,311,312,313,314,315,317,318,319,320,321,322,323,324,325,326,327,328,329,330,331,332,333,334,335,336,337,338,339,340,341,342,343,344,345,346,347,348,349,350,351,352,353,354,355,356,357,358,359,360,361,362,363,364,365,366,367,368,369,370,371,372,373,374,375,376,377,378,379,383,384,385,386,387,388,389,390,392,393,395,396,397,398,399,400,401,402,403,404,405,406,407,408,411,412,413,414,415,416,417,418,419,420,421,422,423,424,425,426,427,428,429,430,431,432,433,434,437,438,440,441,443,444,445,446,447,448,449,450,451,452,453,454,455,456,457,458,459,460,461,462,463,464,465,466,467,468,469,470,471,472,473,474,475,476,477,479,480,481,482,483,484,485,486,488,489,491,492,494,495,497,498,499,500,501,502,503,504,505,506,507,508,509,510,511,512,513,514,515,516,517,518,519,520,521,522,523,524,525,526,527,528,531,532,533,534,536,537,538,539,540,541,542,545,546,547,549,550,551,552,554,575,578,603,604,605,606,607,608,609,610,611,613,614,616,617,619,620,621,622,623,624,625,626,627,628,629,630,639,641,642,645,646,647,648,649,650,651,652,653,654,655,656,657,658,663,664,665,666,671,672,679,681,682,687,688,695,696,697,698,703,704,705,706,711,712,713,714,719,720,721,722,729,730,731,734,737,738,831,832,833,834,835,836,837,838,839,841,842,843,844,845,846,847,848,849,850,851,852,853,854,855,856,857,858,859,860,861,862,863,864,867,868,869,870,871,872,875,876,877,878,879,880,883,884,885,886,887,888,891,892,893,894,896,899,900,901,902,903,904,905,906,907,908,909,910,911,912,913,914,915,916,917,918,919,920,921,922,923,926,927,928,929,930];

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

  // Vylosovat výherce předem (ale zobrazit ho až po animaci)
  const winner = drawWinner();

  // Animace: zobrazit 12 náhodných čísel se zpomalujícím tempem
  const steps = 12;
  for (let i = 0; i < steps; i++) {
    const delay = 30 + i * 25; // Postupně delší pauzy (30ms → 305ms)
    await new Promise(r => setTimeout(r, delay));
    display.textContent = getRandomFromAll();
  }

  // Krátká pauza před odhalením výherce
  await new Promise(r => setTimeout(r, 150));

  // Zobrazit výherce se zlatým efektem
  display.textContent = winner;
  display.className = 'number-display winner reveal';

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
