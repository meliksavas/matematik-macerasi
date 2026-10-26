// Matematik Macerası — soru bankası
// Her soru: konu, soru metni (HTML), isteğe bağlı görsel/tablo, şıklar,
// doğru şıkkın sırası (0'dan başlar) ve adım adım çözüm.

const frac = (top, bottom) => `<span class="frac"><span>${top}</span><span>${bottom}</span></span>`;

const table = (headers, rows) => `
  <table class="data-table">
    <thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
    <tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody>
  </table>`;

const GARDEN_SVG = `
  <svg class="figure-svg" viewBox="0 0 340 215" role="img" aria-label="Kenarları 84 m ve 60 m olan dikdörtgen bahçe">
    <rect x="55" y="38" width="210" height="150" rx="6" fill="#dcfce7" stroke="#16a34a" stroke-width="3"/>
    <text x="160" y="22" text-anchor="middle" font-size="16">84 m</text>
    <text x="282" y="118" font-size="16">60 m</text>
    <path d="M55 60 H115" stroke="#15803d" stroke-width="2" stroke-dasharray="4 4"/>
    <text x="85" y="80" text-anchor="middle" font-size="15" fill="#15803d">? m</text>
    <g font-size="22" text-anchor="middle" dominant-baseline="central">
      <text x="55" y="38">🌳</text><text x="115" y="38">🌳</text><text x="265" y="38">🌳</text>
      <text x="55" y="188">🌳</text><text x="265" y="188">🌳</text>
    </g>
  </svg>`;

const CARDBOARD_SVG = `
  <svg class="figure-svg" viewBox="0 0 340 200" role="img" aria-label="Kenarları 90 cm ve 54 cm olan dikdörtgen karton">
    <rect x="25" y="30" width="250" height="150" rx="4" fill="#fef3c7" stroke="#d97706" stroke-width="3"/>
    <rect x="25" y="30" width="42" height="42" fill="#fde68a" stroke="#b45309" stroke-width="2" stroke-dasharray="5 4"/>
    <text x="46" y="57" text-anchor="middle" font-size="18" fill="#92400e">?</text>
    <text x="150" y="20" text-anchor="middle" font-size="16">90 cm</text>
    <text x="284" y="110" font-size="16">54 cm</text>
  </svg>`;

const QUESTIONS = [
  // ---------- Çarpanlar ve Katlar ----------
  {
    topic: "Çarpanlar ve Katlar",
    text: "Beden eğitimi öğretmeni 36 öğrenciyi, her sırada eşit sayıda öğrenci olacak şekilde sıralara dizecektir. Her sırada <b>en az 2, en fazla 12</b> öğrenci olacaktır.<br><br>Öğretmen öğrencileri kaç farklı şekilde dizebilir?",
    options: ["4", "5", "6", "9"],
    answer: 2,
    steps: [
      "Her sıradaki öğrenci sayısı 36'yı tam bölmelidir; yani 36'nın bir çarpanı olmalıdır.",
      "36'nın çarpanları: 1, 2, 3, 4, 6, 9, 12, 18, 36",
      "Bunlardan 2 ile 12 arasında olanlar: 2, 3, 4, 6, 9, 12",
      "Öğretmen öğrencileri <b>6</b> farklı şekilde dizebilir."
    ]
  },
  {
    topic: "Çarpanlar ve Katlar",
    text: "Bir hazine sandığının şifresi, <b>2024</b> sayısının <b>birbirinden farklı asal çarpanlarının toplamıdır</b>.<br><br>Sandığın şifresi kaçtır?",
    options: ["34", "36", "40", "47"],
    answer: 1,
    steps: [
      "2024'ü asal çarpanlarına ayıralım: 2024 ÷ 2 = 1012 → 1012 ÷ 2 = 506 → 506 ÷ 2 = 253",
      "253 ÷ 11 = 23 ve 23 bir asal sayıdır.",
      "2024 = 2<sup>3</sup> · 11 · 23 olduğundan farklı asal çarpanlar: 2, 11 ve 23",
      "2'yi üç kez değil, bir kez toplarız: 2 + 11 + 23 = <b>36</b>"
    ]
  },
  {
    topic: "Çarpanlar ve Katlar",
    text: "Elif'in aldığı şeker sayısı <b>iki basamaklı</b> bir sayıdır. Elif şekerleri 3'erli paketlere de 5'erli paketlere de koyduğunda hiç şeker artmıyor. Şeker sayısının rakamları toplamı <b>12</b>'dir.<br><br>Elif kaç şeker almıştır?",
    options: ["45", "60", "75", "90"],
    answer: 2,
    steps: [
      "Hem 3'erli hem 5'erli paketlerde şeker artmıyorsa sayı hem 3'ün hem 5'in katıdır; yani 15'in katıdır.",
      "İki basamaklı 15'in katları: 15, 30, 45, 60, 75, 90",
      "Rakamları toplamı: 15 → 6, 30 → 3, 45 → 9, 60 → 6, 75 → 12, 90 → 9",
      "Rakamları toplamı 12 olan sayı <b>75</b>'tir."
    ]
  },
  {
    topic: "Çarpanlar ve Katlar",
    text: "Mimar Zeynep, alanı <b>48 m²</b> olan dikdörtgen şeklinde bir oda tasarlayacaktır. Odanın kenar uzunlukları metre cinsinden <b>doğal sayı</b> olacaktır.<br><br>Zeynep kaç farklı oda tasarlayabilir? <i>(3 × 16 ile 16 × 3 aynı oda sayılır.)</i>",
    options: ["4", "5", "6", "10"],
    answer: 1,
    steps: [
      "Dikdörtgenin alanı = kısa kenar × uzun kenar = 48",
      "Çarpımı 48 olan doğal sayı ikilileri: 1 × 48, 2 × 24, 3 × 16, 4 × 12, 6 × 8",
      "Kenarların yerini değiştirmek yeni bir oda oluşturmaz.",
      "Zeynep <b>5</b> farklı oda tasarlayabilir."
    ]
  },
  {
    topic: "Çarpanlar ve Katlar",
    text: "Ece'nin 21 mavi boncuğu ve <b>x</b> tane kırmızı boncuğu vardır. Ece boncukları, her grupta eşit sayıda mavi ve eşit sayıda kırmızı boncuk olacak şekilde, hiç boncuk artmadan gruplara ayırmak istiyor. Ancak bunu <b>yalnızca 1 grup</b> oluşturarak yapabiliyor.<br><br>Buna göre x aşağıdakilerden hangisi olabilir?",
    options: ["14", "27", "32", "35"],
    answer: 2,
    steps: [
      "Grup sayısı hem 21'i hem x'i tam bölmelidir; yani 21 ile x'in ortak böleni olmalıdır.",
      "Yalnızca 1 grup yapılabiliyorsa 21 ile x'in tek ortak böleni 1'dir. Yani 21 ile x <b>aralarında asaldır</b>.",
      "21 = 3 · 7. Şıkları kontrol edelim: 14 = 2 · 7 (7 ortak), 27 = 3<sup>3</sup> (3 ortak), 35 = 5 · 7 (7 ortak)",
      "32 = 2<sup>5</sup> ile 21'in ortak asal çarpanı yoktur. Cevap <b>32</b>."
    ]
  },

  // ---------- EBOB ve EKOK ----------
  {
    topic: "EBOB ve EKOK",
    text: "Kenar uzunlukları <b>84 m</b> ve <b>60 m</b> olan dikdörtgen şeklindeki bir bahçenin çevresine eşit aralıklarla ağaç dikilecektir. Bahçenin her köşesine de birer ağaç gelecektir.<br><br>Bu iş için <b>en az</b> kaç ağaç gerekir?",
    figure: GARDEN_SVG,
    options: ["20", "24", "26", "28"],
    answer: 1,
    steps: [
      "Ağaç sayısının en az olması için ağaçlar arası mesafe en büyük olmalıdır. Bu mesafe hem 84'ü hem 60'ı bölmelidir → EBOB(84, 60)",
      "84 = 2<sup>2</sup> · 3 · 7 ve 60 = 2<sup>2</sup> · 3 · 5 → EBOB = 2<sup>2</sup> · 3 = 12 m",
      "Bahçenin çevresi: 2 · (84 + 60) = 288 m",
      "Kapalı bir çevrede ağaç sayısı = çevre ÷ aralık = 288 ÷ 12 = <b>24</b>"
    ]
  },
  {
    topic: "EBOB ve EKOK",
    text: "Bir manav <b>90 kg</b> elma, <b>120 kg</b> armut ve <b>150 kg</b> portakalı hiç meyve artmayacak ve meyveler birbirine karışmayacak şekilde kasalara dolduracaktır. Tüm kasalarda eşit kilogram meyve olacaktır.<br><br>Manav <b>en az</b> kaç kasa kullanır?",
    options: ["10", "12", "15", "30"],
    answer: 1,
    steps: [
      "Kasa sayısının en az olması için bir kasaya konan meyve miktarı en büyük olmalıdır → EBOB(90, 120, 150)",
      "90 = 2 · 3<sup>2</sup> · 5, 120 = 2<sup>3</sup> · 3 · 5, 150 = 2 · 3 · 5<sup>2</sup> → EBOB = 2 · 3 · 5 = 30 kg",
      "Elma: 90 ÷ 30 = 3 kasa, armut: 120 ÷ 30 = 4 kasa, portakal: 150 ÷ 30 = 5 kasa",
      "Toplam: 3 + 4 + 5 = <b>12</b> kasa (30, bir kasadaki meyve miktarıdır, kasa sayısı değil!)"
    ]
  },
  {
    topic: "EBOB ve EKOK",
    text: "Boyutları <b>90 cm</b> ve <b>54 cm</b> olan dikdörtgen şeklindeki bir karton, hiç parça artmayacak şekilde birbirine eş ve <b>mümkün olan en büyük</b> karelere kesilecektir.<br><br>Kaç kare elde edilir?",
    figure: CARDBOARD_SVG,
    options: ["9", "12", "15", "18"],
    answer: 2,
    steps: [
      "Karenin kenarı hem 90'ı hem 54'ü tam bölmeli ve en büyük olmalıdır → EBOB(90, 54)",
      "90 = 2 · 3<sup>2</sup> · 5 ve 54 = 2 · 3<sup>3</sup> → EBOB = 2 · 3<sup>2</sup> = 18 cm",
      "Uzun kenara 90 ÷ 18 = 5 kare, kısa kenara 54 ÷ 18 = 3 kare sığar.",
      "Toplam kare sayısı: 5 · 3 = <b>15</b>"
    ]
  },
  {
    topic: "EBOB ve EKOK",
    text: "Bir öğretmen <b>40 kalem</b> ve <b>58 silgiyi</b> sınıfındaki öğrencilere eşit sayıda dağıtıyor. Dağıtımın sonunda <b>4 kalem</b> ve <b>4 silgi</b> artıyor.<br><br>Bu sınıfta <b>en fazla</b> kaç öğrenci vardır?",
    options: ["2", "9", "12", "18"],
    answer: 3,
    steps: [
      "Artanları çıkaralım: 40 − 4 = 36 kalem ve 58 − 4 = 54 silgi tam olarak dağıtılmıştır.",
      "Öğrenci sayısı hem 36'yı hem 54'ü tam bölmelidir. En fazla öğrenci için EBOB(36, 54) bulunur.",
      "36 = 2<sup>2</sup> · 3<sup>2</sup> ve 54 = 2 · 3<sup>3</sup> → EBOB = 2 · 3<sup>2</sup> = 18",
      "Kontrol: 18 öğrenciye 2'şer kalem (4 artar) ve 3'er silgi (4 artar) verilir. Cevap <b>18</b>."
    ]
  },
  {
    topic: "EBOB ve EKOK",
    text: "Bir otogardaki üç firmanın otobüsleri tabloda verilen aralıklarla sefere çıkmaktadır. Üç firmanın otobüsleri saat <b>08.00</b>'de birlikte yola çıktı.<br><br>Üç firmanın otobüsleri <b>ilk kez tekrar</b> hangi saatte birlikte yola çıkar?",
    figure: table(["Firma", "Sefer aralığı"], [
      ["🚌 Yıldız Turizm", "20 dakikada bir"],
      ["🚌 Mavi Yol", "30 dakikada bir"],
      ["🚌 Kartal Seyahat", "45 dakikada bir"]
    ]),
    options: ["10.00", "10.30", "11.00", "12.00"],
    answer: 2,
    steps: [
      "Otobüslerin tekrar birlikte kalkması için geçen süre 20, 30 ve 45'in ortak katı olmalıdır. İlk kez → EKOK(20, 30, 45)",
      "20 = 2<sup>2</sup> · 5, 30 = 2 · 3 · 5, 45 = 3<sup>2</sup> · 5 → EKOK = 2<sup>2</sup> · 3<sup>2</sup> · 5 = 180 dakika",
      "180 dakika = 3 saat",
      "08.00 + 3 saat = <b>11.00</b>"
    ]
  },
  {
    topic: "EBOB ve EKOK",
    text: "Bir sınıftaki öğrenciler 3'erli, 4'erli ya da 6'şarlı gruplara ayrıldığında her seferinde <b>2 öğrenci</b> açıkta kalıyor. Sınıfın mevcudu 30'dan fazla, 40'tan azdır.<br><br>Sınıfta kaç öğrenci vardır?",
    options: ["32", "34", "36", "38"],
    answer: 3,
    steps: [
      "Açıkta kalan 2 öğrenciyi çıkarırsak kalan sayı 3'e, 4'e ve 6'ya tam bölünür.",
      "EKOK(3, 4, 6) = 12 olduğundan öğrenci sayısı 12'nin bir katının 2 fazlasıdır: 12k + 2",
      "12k + 2 değerleri: 14, 26, 38, 50, ...",
      "30 ile 40 arasındaki tek değer <b>38</b>'dir. (36 olamaz; 36 öğrenci tam bölünür, açıkta kimse kalmaz.)"
    ]
  },
  {
    topic: "EBOB ve EKOK",
    text: "Bir kafenin vitrinindeki üç ışık, tabloda verilen aralıklarla yanmaktadır. Üç ışık aynı anda yandı.<br><br>Bu andan sonraki <b>10 dakika</b> içinde üç ışık kaç kez daha aynı anda yanar?",
    figure: table(["Işık", "Yanma aralığı"], [
      ["🔴 Kırmızı", "6 saniyede bir"],
      ["🔵 Mavi", "8 saniyede bir"],
      ["🟢 Yeşil", "10 saniyede bir"]
    ]),
    options: ["4", "5", "6", "10"],
    answer: 1,
    steps: [
      "Üç ışığın tekrar birlikte yanması için geçen süre EKOK(6, 8, 10) kadardır.",
      "6 = 2 · 3, 8 = 2<sup>3</sup>, 10 = 2 · 5 → EKOK = 2<sup>3</sup> · 3 · 5 = 120 saniye = 2 dakika",
      "Işıklar 2 dakikada bir birlikte yanar: 2., 4., 6., 8. ve 10. dakikalarda",
      "10 dakika içinde <b>5</b> kez daha birlikte yanarlar."
    ]
  },
  {
    topic: "EBOB ve EKOK",
    text: "Bir kasanın şifresi iki sayıdan oluşmaktadır. Bu iki sayının EBOB'u <b>6</b>, EKOK'u <b>72</b>'dir.<br><br>Sayılardan biri <b>18</b> olduğuna göre diğer sayı kaçtır?",
    options: ["12", "24", "36", "48"],
    answer: 1,
    steps: [
      "İki sayının çarpımı, EBOB'ları ile EKOK'larının çarpımına eşittir: a · b = EBOB · EKOK",
      "18 · b = 6 · 72 = 432",
      "b = 432 ÷ 18 = 24",
      "Kontrol: 18 = 2 · 3<sup>2</sup>, 24 = 2<sup>3</sup> · 3 → EBOB = 2 · 3 = 6 ✓, EKOK = 2<sup>3</sup> · 3<sup>2</sup> = 72 ✓. Cevap <b>24</b>."
    ]
  },

  // ---------- Üslü Sayılar ----------
  {
    topic: "Üslü Sayılar",
    text: "Işığın boşluktaki hızı yaklaşık olarak saniyede <b>300 000 km</b>'dir.<br><br>Işığın <b>1 dakikada</b> aldığı yolun bilimsel gösterimi aşağıdakilerden hangisidir?",
    options: ["1,8 × 10<sup>6</sup> km", "1,8 × 10<sup>7</sup> km", "1,8 × 10<sup>8</sup> km", "3,6 × 10<sup>7</sup> km"],
    answer: 1,
    steps: [
      "1 dakika = 60 saniyedir. Alınan yol = hız × zaman = 300 000 × 60",
      "300 000 = 3 × 10<sup>5</sup> ve 60 = 6 × 10<sup>1</sup> → 3 × 6 × 10<sup>5</sup> × 10<sup>1</sup> = 18 × 10<sup>6</sup>",
      "Bilimsel gösterimde katsayı 1 ile 10 arasında olmalıdır (1 ≤ a < 10). 18 = 1,8 × 10<sup>1</sup>",
      "18 × 10<sup>6</sup> = 1,8 × 10<sup>1</sup> × 10<sup>6</sup> = <b>1,8 × 10<sup>7</sup> km</b>"
    ]
  },
  {
    topic: "Üslü Sayılar",
    text: "Bir laboratuvarda incelenen bakterilerin sayısı <b>her 20 dakikada bir 2 katına</b> çıkmaktadır. Başlangıçta kapta <b>2<sup>10</sup></b> bakteri vardır.<br><br><b>2 saat</b> sonra kaptaki bakteri sayısı kaç olur?",
    options: ["2<sup>12</sup>", "2<sup>16</sup>", "2<sup>60</sup>", "4<sup>16</sup>"],
    answer: 1,
    steps: [
      "2 saat = 120 dakika. 120 ÷ 20 = 6 kez 2 katına çıkma olur.",
      "Her seferinde sayı 2 ile çarpılır: 2<sup>10</sup> · 2 · 2 · 2 · 2 · 2 · 2 = 2<sup>10</sup> · 2<sup>6</sup>",
      "Tabanları aynı üslü ifadeler çarpılırken üsler toplanır: 2<sup>10 + 6</sup>",
      "2 saat sonra <b>2<sup>16</sup></b> bakteri olur."
    ]
  },
  {
    topic: "Üslü Sayılar",
    text: "Mert'in fotoğraf makinesindeki hafıza kartının kapasitesi <b>2<sup>30</sup> bayt</b>tır. Makinenin çektiği her fotoğraf <b>2<sup>22</sup> bayt</b> yer kaplamaktadır.<br><br>Bu karta en fazla kaç fotoğraf kaydedilebilir?",
    options: ["128", "256", "512", "1024"],
    answer: 1,
    steps: [
      "Fotoğraf sayısı = kart kapasitesi ÷ bir fotoğrafın boyutu = 2<sup>30</sup> ÷ 2<sup>22</sup>",
      "Tabanları aynı üslü ifadeler bölünürken üsler çıkarılır: 2<sup>30 − 22</sup> = 2<sup>8</sup>",
      "2<sup>8</sup> = 2 · 2 · 2 · 2 · 2 · 2 · 2 · 2 = 256",
      "Karta en fazla <b>256</b> fotoğraf kaydedilebilir."
    ]
  },
  {
    topic: "Üslü Sayılar",
    text: "Mikroskopla incelenen bir hücrenin çapı <b>0,00004 metre</b>dir. Fen bilimleri öğretmeni bu uzunluğun bilimsel gösterimle yazılmasını istiyor.<br><br>Doğru yazım hangisidir?",
    options: ["4 × 10<sup>−4</sup> m", "4 × 10<sup>−5</sup> m", "4 × 10<sup>−6</sup> m", "40 × 10<sup>−5</sup> m"],
    answer: 1,
    steps: [
      "Bilimsel gösterim a × 10<sup>n</sup> biçimindedir ve 1 ≤ a < 10 olmalıdır. Burada a = 4 olur.",
      "0,00004 sayısında virgülü 4'ün sağına getirmek için virgülü <b>5 basamak</b> sağa kaydırırız.",
      "Virgül sağa kaydırıldığı için üs negatiftir: 0,00004 = 4 × 10<sup>−5</sup>",
      "Kontrol: 4 × 10<sup>−5</sup> = 4 ÷ 100 000 = 0,00004 ✓ Cevap <b>4 × 10<sup>−5</sup> m</b>."
    ]
  },
  {
    topic: "Üslü Sayılar",
    text: "Bir şehirde <b>3 × 10<sup>5</sup></b> hane bulunmaktadır. Her hane günde ortalama <b>2 × 10<sup>2</sup> litre</b> su kullanmaktadır.<br><br>Bu şehirde bir günde toplam kaç litre su kullanılır?",
    options: ["6 × 10<sup>3</sup>", "5 × 10<sup>7</sup>", "6 × 10<sup>7</sup>", "6 × 10<sup>10</sup>"],
    answer: 2,
    steps: [
      "Toplam su = hane sayısı × hane başına su = (3 × 10<sup>5</sup>) × (2 × 10<sup>2</sup>)",
      "Katsayıları kendi arasında çarparız: 3 × 2 = 6",
      "10'un kuvvetlerini çarparken üsleri toplarız: 10<sup>5</sup> × 10<sup>2</sup> = 10<sup>7</sup>",
      "Toplam: <b>6 × 10<sup>7</sup></b> litre, yani 60 milyon litre su."
    ]
  },
  {
    topic: "Üslü Sayılar",
    text: "Bir bilgi yarışmasında üç arkadaşın topladığı puanlar tabloda üslü ifade olarak verilmiştir.<br><br>Buna göre aşağıdakilerden hangisi doğrudur?",
    figure: table(["Yarışmacı", "Puan"], [
      ["👧 Ayşe", "8<sup>4</sup>"],
      ["👦 Burak", "4<sup>6</sup>"],
      ["🧒 Can", "16<sup>3</sup>"]
    ]),
    options: ["Ayşe'nin puanı en yüksektir.", "Burak'ın puanı en yüksektir.", "Can'ın puanı en düşüktür.", "Üçünün puanı birbirine eşittir."],
    answer: 3,
    steps: [
      "Karşılaştırmak için tabanları 2'nin kuvveti olarak yazalım: 8 = 2<sup>3</sup>, 4 = 2<sup>2</sup>, 16 = 2<sup>4</sup>",
      "Üssün üssü alınırken üsler çarpılır. Ayşe: 8<sup>4</sup> = (2<sup>3</sup>)<sup>4</sup> = 2<sup>12</sup>",
      "Burak: 4<sup>6</sup> = (2<sup>2</sup>)<sup>6</sup> = 2<sup>12</sup> ve Can: 16<sup>3</sup> = (2<sup>4</sup>)<sup>3</sup> = 2<sup>12</sup>",
      "Üçünün puanı da 2<sup>12</sup> = 4096'dır. Yani puanlar <b>birbirine eşittir</b>."
    ]
  },
  {
    topic: "Üslü Sayılar",
    text: "Bir bilgisayar oyununda karakter her seviyeyi geçtiğinde boyu <b>yarıya</b> iniyor. Oyuna başladığında boyu <b>1 metre</b> olan karakter art arda <b>5 seviye</b> geçiyor.<br><br>Karakterin son boyu kaç metredir?",
    options: ["2<sup>5</sup>", "−2<sup>5</sup>", "2<sup>−5</sup>", "5<sup>−2</sup>"],
    answer: 2,
    steps: [
      `Her seviyede boy ${frac(1, 2)} ile çarpılır. 5 seviye sonra: 1 · ${frac(1, 2)} · ${frac(1, 2)} · ${frac(1, 2)} · ${frac(1, 2)} · ${frac(1, 2)} = <span class="nw">(${frac(1, 2)})<sup>5</sup></span>`,
      `<span class="nw">(${frac(1, 2)})<sup>5</sup></span> = ${frac(1, "2<sup>5</sup>")} = ${frac(1, 32)} metre`,
      `Negatif üs kuralı: ${frac(1, "a<sup>n</sup>")} = a<sup>−n</sup>`,
      `Buna göre ${frac(1, "2<sup>5</sup>")} = <b>2<sup>−5</sup></b> metre. (−2<sup>5</sup> = −32 olur; bir uzunluk negatif olamaz!)`
    ]
  }
];
