import { WaterItem } from '../types/water';

export const WATER_DATABASE: WaterItem[] = [
  // =================== GIDA & BESLENME (TEKLİ TANE & TEK PORSİYON) ===================
  {
    id: 'beef-steak',
    name: 'Dana Eti / Biftek',
    category: 'food',
    unit: '1 porsiyon (150g)',
    defaultQty: 1,
    stepQty: 1,
    maxQty: 10,
    totalLiters: 2310,
    greenWater: 2160,
    blueWater: 85,
    greyWater: 65,
    iconName: 'Beef',
    emoji: '🥩',
    tag: 'Tek Porsiyon',
    shortWhy: '150 gramlık tek bir porsiyon dana eti için hayvanın yediği arpa, mısır ve saman tarlalarında 2.310 L su tüketilir.',
    description: 'Büyükbaş hayvancılıkta suyun %95 i hayvanın 3 yıllık ömrü boyunca yediği yem tahıllarının sulanmasına harcanır. Tabağınızdaki tek bir porsiyon biftek yaklaşık 29 kez duş almaya bedeldir.',
    breakdownStages: [
      { stage: 'Besi Yemi Tarımı (Mısır, Soya, Yonca)', percent: 94, note: 'Tüketilen suyun asıl kaynağı yem tarımıdır' },
      { stage: 'Hayvanın Doğrudan İçtiği Su', percent: 3, note: 'Günlük içme suyu ihtiyacı' },
      { stage: 'Kesim ve Soğuk Hava Deposu', percent: 3, note: 'Tesis sterilizasyonu ve karkas soğutma' }
    ],
    ecoSwap: {
      name: 'Tavuk Eti (150g) veya Mercimek Yemeği',
      liters: 650,
      tip: 'Dana eti yerine tavuk tercih etmek tek öğünde 1.660 litre, mercimek yemeği seçmek 2.000 litre su kurtarır!'
    }
  },
  {
    id: 'beef-meatball',
    name: 'Izgara Köfte',
    category: 'food',
    unit: '1 adet tek köfte (~40g)',
    defaultQty: 3,
    stepQty: 1,
    maxQty: 20,
    totalLiters: 615,
    greenWater: 575,
    blueWater: 23,
    greyWater: 17,
    iconName: 'Utensils',
    emoji: '🧆',
    tag: 'Tek Adet',
    shortWhy: 'Çatalınızın ucundaki tek 1 adet ızgara köfte, yaklaşık 32 damacana dolusu (615 L) gizli su içerir.',
    description: 'Küçük gibi görünen 40 gramlık tek bir köfte, dana kıymasının yoğun yem suyu nedeniyle 615 litre sanal su taşır. Bir porsiyonda 4 köfte yendiğinde bu rakam 2.460 litreyi bulur.',
    breakdownStages: [
      { stage: 'Büyükbaş Yem Bitkileri', percent: 93, note: 'Mısır ve arpa silajı sulaması' },
      { stage: 'Kıyma Çekimi ve Ekmek İçi', percent: 4, note: 'Ekmek kırıntısı ve baharat üretimi' },
      { stage: 'Soğuk Depo ve Pişirme', percent: 3, note: 'İşletme ve temizlik' }
    ],
    ecoSwap: {
      name: 'Mercimek Köftesi (1 adet)',
      liters: 45,
      tip: 'Mercimek köftesi porsiyon başına %90 daha az su harcar ve çok zengin lif kaynağıdır.'
    }
  },
  {
    id: 'chicken-portion',
    name: 'Tavuk Fileto / But',
    category: 'food',
    unit: '1 porsiyon (150g)',
    defaultQty: 1,
    stepQty: 1,
    maxQty: 10,
    totalLiters: 650,
    greenWater: 530,
    blueWater: 50,
    greyWater: 70,
    iconName: 'Utensils',
    emoji: '🍗',
    tag: 'Tek Porsiyon',
    shortWhy: 'Tavuklar yemi ete çok verimli dönüştürdüğü için 1 porsiyon tavuk, dana etine göre 3.5 kat daha az (650 L) su harcar.',
    description: 'Tavuk eti su açısından kırmızı ete kıyasla oldukça tasarrufludur. Tek bir porsiyon tavuk but veya göğüs eti yaklaşık 8 duşluk su tüketir.',
    breakdownStages: [
      { stage: 'Tavuk Yemi Tahılları', percent: 85, note: 'Mısır ve soya tarımı' },
      { stage: 'Kümes İşletmesi ve İklimlendirme', percent: 8, note: 'Havalandırma ve soğutma petekleri' },
      { stage: 'İşleme ve Paketleme', percent: 7, note: 'Kesimhane yıkamaları' }
    ]
  },
  {
    id: 'beef-burger',
    name: 'Dana Hamburger',
    category: 'food',
    unit: '1 adet tek burger',
    defaultQty: 1,
    stepQty: 1,
    maxQty: 10,
    totalLiters: 2100,
    greenWater: 1880,
    blueWater: 130,
    greyWater: 90,
    iconName: 'Utensils',
    emoji: '🍔',
    tag: 'Tek Burger',
    shortWhy: 'Tek bir burger köftesi, susamlı ekmeği ve peyniriyle birlikte toplam 2.100 L sanal su taşır.',
    description: '120 gramlık köftesi 1.850 litre, hamburger ekmeği 120 litre, dilim peyniri ve sosları ise yaklaşık 130 litre su tüketir.',
    breakdownStages: [
      { stage: 'Dana Köftesi (120g)', percent: 88, note: 'Besi yemi ayak izi' },
      { stage: 'Susamlı Burger Ekmeği', percent: 6, note: 'Buğday unu ve mayalama' },
      { stage: 'Cheddar Peyniri ve Soslar', percent: 6, note: 'Süt ürünü ve domates sosu' }
    ],
    ecoSwap: {
      name: 'Sebzeli / Mercimek Burger',
      liters: 220,
      tip: 'Bitkisel burger köftesi %89 daha az su tüketir.'
    }
  },
  {
    id: 'cheese-slice',
    name: 'Kaşar / Sert Peynir',
    category: 'food',
    unit: '1 dilim (~30g)',
    defaultQty: 2,
    stepQty: 1,
    maxQty: 15,
    totalLiters: 152,
    greenWater: 132,
    blueWater: 11,
    greyWater: 9,
    iconName: 'Utensils',
    emoji: '🧀',
    tag: 'Tek Dilim',
    shortWhy: 'Kahvaltıda ekmeğe koyduğunuz tek bir dilim (30g) kaşar peyniri için 152 L su harcanır.',
    description: '1 dilim sert peynir elde etmek için yaklaşık 300 ml çiğ inek sütü yoğunlaştırılır. İneğin tükettiği yem suyunun tamamı süte ve peynire yansır.',
    breakdownStages: [
      { stage: 'Çiğ Süt Üretimi (Yem Suyu)', percent: 93, note: 'İneklerin beslenme ayak izi' },
      { stage: 'Mayalama ve Teleme Süzme', percent: 4, note: 'Peynir altı suyu ayrıştırma' },
      { stage: 'Olgunlaştırma Deposu', percent: 3, note: 'Nem ve sıcaklık kontrolü' }
    ]
  },
  {
    id: 'bread-slice',
    name: 'Ekmek',
    category: 'food',
    unit: '1 dilim (~30g)',
    defaultQty: 2,
    stepQty: 1,
    maxQty: 20,
    totalLiters: 40,
    greenWater: 28,
    blueWater: 8,
    greyWater: 4,
    iconName: 'Wheat',
    emoji: '🍞',
    tag: 'Tek Dilim',
    shortWhy: '1 dilim ekmek yaklaşık 40 litre, yani 2 koca damacana dolusu su demektir.',
    description: 'Buğday başağının tarlada büyümesi, un fabrikasında öğütülmesi ve hamurun fırınlanması tek bir dilimde 40 litre su harcatır. Ekmek israfı en büyük gizli su kaybıdır.',
    breakdownStages: [
      { stage: 'Buğday Tarımı', percent: 82, note: 'Toprak sulama ve yağış' },
      { stage: 'Değirmen ve Un Öğütme', percent: 10, note: 'Kabuk soyma' },
      { stage: 'Yoğurma ve Fırınlama', percent: 8, note: 'Hamur suyu ve buhar' }
    ]
  },
  {
    id: 'rice-portion',
    name: 'Pirinç Pilavı',
    category: 'food',
    unit: '1 porsiyon (~60g pirinç)',
    defaultQty: 1,
    stepQty: 1,
    maxQty: 10,
    totalLiters: 150,
    greenWater: 101,
    blueWater: 39,
    greyWater: 10,
    iconName: 'Wheat',
    emoji: '🍚',
    tag: 'Tek Porsiyon',
    shortWhy: 'Tek bir porsiyon pilav, çeltik tarlalarının su altında tutulması nedeniyle 150 litre su çeker.',
    description: 'Pirinç bataklık benzeri su basılı tavalarda yetiştirildiği için yüksek mavi su (sulama) gerektirir. 1 porsiyon pilav yaklaşık 2 kez hızlı duş almaya denktir.',
    breakdownStages: [
      { stage: 'Çeltik Tavası Göllendirme', percent: 87, note: 'Sürekli su altında buharlaşma' },
      { stage: 'Kurutma ve Kabuk Soyma', percent: 8, note: 'Fabrikada kepek ayrımı' },
      { stage: 'Cilalama ve Pişirme', percent: 5, note: 'Pilav tenceresi' }
    ],
    ecoSwap: {
      name: 'Bulgur Pilavı (1 porsiyon)',
      liters: 55,
      tip: 'Anadolu buğdayından yapılan bulgur, pirince göre %63 daha az su harcar.'
    }
  },
  {
    id: 'eggs',
    name: 'Yumurta',
    category: 'food',
    unit: '1 adet tek yumurta (60g)',
    defaultQty: 2,
    stepQty: 1,
    maxQty: 20,
    totalLiters: 196,
    greenWater: 155,
    blueWater: 20,
    greyWater: 21,
    iconName: 'Egg',
    emoji: '🥚',
    tag: 'Tek Adet',
    shortWhy: 'Tavada kırdığınız tek 1 yumurta, tavuğun karma yem tüketimi sebebiyle 196 litre sanal su taşır.',
    description: 'Yumurtacı tavuğun yediği mısır ve soya küspesi, tek bir yumurtanın arkasında 2.5 duşluk su rezervi oluşturur.',
    breakdownStages: [
      { stage: 'Tavuk Karma Yemi', percent: 88, note: 'Tahıl sulaması' },
      { stage: 'Kümes Temizlik ve İçme', percent: 12, note: 'Çiftlik suyu' }
    ]
  },
  {
    id: 'chocolate-bar',
    name: 'Çikolata',
    category: 'food',
    unit: '1 küçük bar / 3 kare (~30g)',
    defaultQty: 1,
    stepQty: 1,
    maxQty: 10,
    totalLiters: 516,
    greenWater: 474,
    blueWater: 24,
    greyWater: 18,
    iconName: 'Sparkles',
    emoji: '🍫',
    tag: 'Tek Bar (30g)',
    shortWhy: 'Yalnızca 3 karecik (30g) çikolata, kakao ağacının tropik su iştahı nedeniyle 516 litre su harcar!',
    description: 'Kakao dünyadaki en su yoğun bitkilerden biridir. Çekirdeklerin fermantasyonu ve kurutulması yüksek yeşil su döngüsü içerir.',
    breakdownStages: [
      { stage: 'Kakao Ağacı Yağmurları', percent: 91, note: 'Tropikal kakao bahçeleri' },
      { stage: 'Fermantasyon ve Sıkım', percent: 5, note: 'Kakao yağı ayrıştırma' },
      { stage: 'Süt Tozu ve Şeker İlavesi', percent: 4, note: 'Diğer bileşenler' }
    ]
  },
  {
    id: 'apple',
    name: 'Elma',
    category: 'food',
    unit: '1 adet tek elma (150g)',
    defaultQty: 1,
    stepQty: 1,
    maxQty: 15,
    totalLiters: 125,
    greenWater: 85,
    blueWater: 25,
    greyWater: 15,
    iconName: 'Apple',
    emoji: '🍎',
    tag: 'Tek Meyve',
    shortWhy: 'Bir adet sulu elma, ağaçta olgunlaşana kadar ortalama 125 litre tatlı su çeker.',
    description: 'Meyve ağaçları kökleriyle topraktaki yağmuru emer. Modern damla sulamalı bahçelerde su tüketimi oldukça verimlidir.',
    breakdownStages: [
      { stage: 'Meyve Bahçesi Sulaması', percent: 90, note: 'İlkbahar/yaz sulaması' },
      { stage: 'Hasat, Yıkama ve Mum Kaplama', percent: 10, note: 'Paketleme ve soğuk depo' }
    ]
  },
  {
    id: 'banana',
    name: 'Muz',
    category: 'food',
    unit: '1 adet tek muz (120g)',
    defaultQty: 1,
    stepQty: 1,
    maxQty: 15,
    totalLiters: 95,
    greenWater: 75,
    blueWater: 12,
    greyWater: 8,
    iconName: 'Apple',
    emoji: '🍌',
    tag: 'Tek Meyve',
    shortWhy: '1 adet muz ortalama 95 litre yağmur ve sulama suyu ile yetişir.',
    description: 'Tropik muz ağaçları bol yağış alan iklimlerde doğal yeşil su ile beslenir. Su ayak izi oldukça makuldür.',
    breakdownStages: [
      { stage: 'Tropik Yağışlar', percent: 85, note: 'Doğal yeşil su alımı' },
      { stage: 'Konteyner ve Sarartma', percent: 15, note: 'Yıkama ve nakliye' }
    ]
  },
  {
    id: 'tomato',
    name: 'Domates',
    category: 'food',
    unit: '1 adet tek domates (100g)',
    defaultQty: 2,
    stepQty: 1,
    maxQty: 20,
    totalLiters: 22,
    greenWater: 12,
    blueWater: 7,
    greyWater: 3,
    iconName: 'Utensils',
    emoji: '🍅',
    tag: 'Çok Tasarruflu',
    shortWhy: 'Salataya doğradığınız 1 adet domates yalnızca 22 litre su harcar, çok tasarrufludur.',
    description: 'Domates damla sulama yöntemiyle kök bölgesine verilen su ile yetiştirilir. Sebzeler genel olarak en düşük sanal suya sahiptir.',
    breakdownStages: [
      { stage: 'Hedefli Damla Sulama', percent: 80, note: 'Kök sulaması' },
      { stage: 'Toplama ve Yıkama', percent: 20, note: 'Ayıklama' }
    ]
  },
  {
    id: 'potato',
    name: 'Patates',
    category: 'food',
    unit: '1 adet orta boy (150g)',
    defaultQty: 2,
    stepQty: 1,
    maxQty: 20,
    totalLiters: 43,
    greenWater: 28,
    blueWater: 10,
    greyWater: 5,
    iconName: 'Utensils',
    emoji: '🥔',
    tag: 'Çok Tasarruflu',
    shortWhy: '1 adet patates 43 litre su ister; pirince kıyasla kalori başına 5 kat daha su dostudur.',
    description: 'Yumrular yer altında büyüdüğü için buharlaşma kaybı düşüktür. Dünyadaki en su tasarruflu temel karbonhidratlardan biridir.',
    breakdownStages: [
      { stage: 'Tarla Sulama', percent: 85, note: 'Yağmurlama sulama' },
      { stage: 'Toprak Arındırma', percent: 15, note: 'Yıkama' }
    ]
  },

  // =================== İÇECEKLER (TEK FİNCAN & BARDAK) ===================
  {
    id: 'coffee-cup',
    name: 'Filtre / Türk Kahvesi',
    category: 'drinks',
    unit: '1 fincan (125 ml)',
    defaultQty: 1,
    stepQty: 1,
    maxQty: 10,
    totalLiters: 140,
    greenWater: 125,
    blueWater: 8,
    greyWater: 7,
    iconName: 'Coffee',
    emoji: '☕',
    tag: 'Tek Fincan',
    shortWhy: 'Fincandaki 125 ml kahve için tarladan fincana tam 140 litre (yaklaşık 1.5 duş) su harcanır!',
    description: 'Kahve kirazı ağaçta yetişirken çok su çeker. Hasat sonrası meyve etinin çekirdekten basınçlı suyla ayrılması ve kavrulması 1 fincanda 140 litre su tüketir.',
    breakdownStages: [
      { stage: 'Kahve Kirazı Sulama', percent: 93, note: 'Ağacın tarladaki su çekimi' },
      { stage: 'Islak Yıkama ve Ayrıştırma', percent: 5, note: 'Meyve etinden ayırma banyosu' },
      { stage: 'Kavurma ve Demleme', percent: 2, note: 'Fincana dökülen sıcak su' }
    ],
    ecoSwap: {
      name: 'Geleneksel Çay (1 bardak)',
      liters: 30,
      tip: 'Kahve yerine çay içmek fincan başına 110 litre su tasarrufu sağlar.'
    }
  },
  {
    id: 'tea-cup',
    name: 'Siyah Çay',
    category: 'drinks',
    unit: '1 ince belli bardak (150 ml)',
    defaultQty: 2,
    stepQty: 1,
    maxQty: 15,
    totalLiters: 30,
    greenWater: 24,
    blueWater: 3,
    greyWater: 3,
    iconName: 'Coffee',
    emoji: '🍵',
    tag: 'Su Dostu',
    shortWhy: '1 bardak çay yalnızca 30 litre su gerektirir, kahveye göre neredeyse 5 kat daha tasarrufludur.',
    description: 'Çay fidanları Rize ve Karadeniz yamaçlarında bol doğal yağmur ile yapay sulama olmadan yetişir.',
    breakdownStages: [
      { stage: 'Doğal Karadeniz Yağmurları', percent: 85, note: 'Doğal yeşil su alımı' },
      { stage: 'Soldurma ve Fırınlama', percent: 10, note: 'Fabrikada nem atma' },
      { stage: 'Demleme Suyu', percent: 5, note: 'Demlikteki kaynar su' }
    ]
  },
  {
    id: 'cow-milk',
    name: 'İnek Sütü',
    category: 'drinks',
    unit: '1 su bardağı (200 ml)',
    defaultQty: 1,
    stepQty: 1,
    maxQty: 10,
    totalLiters: 204,
    greenWater: 176,
    blueWater: 16,
    greyWater: 12,
    iconName: 'Milk',
    emoji: '🥛',
    tag: 'Tek Bardak',
    shortWhy: '1 su bardağı (200 ml) süt için ineğin yem tüketimi nedeniyle 204 L su harcanır.',
    description: 'Süt ineği günde onlarca kilo mısır silajı ve karma yem yer. Bu yemlerin su ayak izi bardağınızdaki süte yansır.',
    breakdownStages: [
      { stage: 'Sağmal İnek Yemi', percent: 92, note: 'Silaj ve yonca tarımı' },
      { stage: 'İçme Suyu ve Ahır Temizliği', percent: 5, note: 'Çiftlik sanitasyonu' },
      { stage: 'Pastörizasyon ve Şişeleme', percent: 3, note: 'UHT soğutma kuleleri' }
    ],
    ecoSwap: {
      name: 'Yulaf Sütü (1 bardak)',
      liters: 38,
      tip: 'Yulaf sütü, inek sütüne göre %81 daha az su harcar.'
    }
  },
  {
    id: 'oat-milk',
    name: 'Yulaf Sütü (Bitkisel)',
    category: 'drinks',
    unit: '1 su bardağı (200 ml)',
    defaultQty: 1,
    stepQty: 1,
    maxQty: 10,
    totalLiters: 38,
    greenWater: 30,
    blueWater: 5,
    greyWater: 3,
    iconName: 'Milk',
    emoji: '🌾',
    tag: 'Su Dostu',
    shortWhy: '1 bardak yulaf sütü yalnızca 38 litre su ile üretilir, inek sütünden 5 kat tasarrufludur.',
    description: 'Yulaf kurak arazide yağmur suyu ile rahatça yetişen kanaatkar bir serin iklim tahılıdır.',
    breakdownStages: [
      { stage: 'Yulaf Tarımı', percent: 76, note: 'Doğal tarla yağışları' },
      { stage: 'Enzimatik Sıvılaştırma', percent: 17, note: 'Lif süzme ve kaynatma' },
      { stage: 'Homojenizasyon', percent: 7, note: 'Ambalajlama' }
    ]
  },
  {
    id: 'soda-can',
    name: 'Kutu Gazlı İçecek (Kola)',
    category: 'drinks',
    unit: '1 kutu (330 ml)',
    defaultQty: 1,
    stepQty: 1,
    maxQty: 10,
    totalLiters: 175,
    greenWater: 120,
    blueWater: 35,
    greyWater: 20,
    iconName: 'Coffee',
    emoji: '🥤',
    tag: 'Tek Kutu',
    shortWhy: 'Kutunun içindeki sıvının ve şeker pancarı tarımının su ayak izi 175 litreyi bulur.',
    description: 'İçecekteki tatlandırıcı (şeker pancarı / mısır şurubu) ve alüminyum kutunun madenciliği su tüketimini artırır.',
    breakdownStages: [
      { stage: 'Şeker Bitkisi Tarımı', percent: 78, note: 'Pancar sulaması' },
      { stage: 'Alüminyum Kutu Üretimi', percent: 14, note: 'Metal işleme ve haddeleme' },
      { stage: 'Dolum ve Arıtma', percent: 8, note: 'Fabrika temiz suyu' }
    ]
  },
  {
    id: 'beer',
    name: 'Şişe Bira',
    category: 'drinks',
    unit: '1 şişe (330 ml)',
    defaultQty: 1,
    stepQty: 1,
    maxQty: 8,
    totalLiters: 98,
    greenWater: 72,
    blueWater: 16,
    greyWater: 10,
    iconName: 'Beer',
    emoji: '🍺',
    tag: 'Tek Şişe',
    shortWhy: '1 şişe (330 ml) bira için maltlık arpa tarımı ve mayalama tesisi 98 litre su tüketir.',
    description: 'Arpanın çimlendirilip malt yapılması ve bira kazanlarının kaynatma döngüleri su harcar.',
    breakdownStages: [
      { stage: 'Arpa ve Şerbetçiotu Tarımı', percent: 84, note: 'Maltlık arpa tarlaları' },
      { stage: 'Maltlama ve Kaynatma', percent: 16, note: 'Fabrika proses suyu' }
    ]
  },

  // =================== GİYİM & TEKSTİL (TEKLİ PARÇA) ===================
  {
    id: 'cotton-tshirt',
    name: 'Pamuklu Tişört',
    category: 'clothing',
    unit: '1 adet tek tişört (~180g)',
    defaultQty: 1,
    stepQty: 1,
    maxQty: 10,
    totalLiters: 2200,
    greenWater: 1200,
    blueWater: 700,
    greyWater: 300,
    iconName: 'Shirt',
    emoji: '👕',
    tag: 'Tek Tişört',
    shortWhy: 'Tek bir pamuklu tişörtün pamuk tarlasında sulanması, boyanması ve dikilmesi için 2.200 litre su harcanır.',
    description: 'Pamuk çok su isteyen bir bitkidir. 180 gramlık tek bir tişörtün liflerinden kumaş oluşana kadar 2.200 litre su tüketilir (yaklaşık 27 duş).',
    breakdownStages: [
      { stage: 'Pamuk Sulaması (Tarlada)', percent: 70, note: 'Pamuk kozası tarımı' },
      { stage: 'Kumaş Ağartma ve Boyama', percent: 18, note: 'Reaktif kimyasal boya banyoları' },
      { stage: 'Dikiş ve Buhar Ütüleme', percent: 12, note: 'Konfeksiyon ve terbiye' }
    ],
    ecoSwap: {
      name: 'Organik / Geri Dönüştürülmüş Lifli Tişört',
      liters: 850,
      tip: 'Geri dönüştürülmüş pamuk veya Tencel tişörtler %60 daha az su tüketir.'
    }
  },
  {
    id: 'jeans',
    name: 'Kot Pantolon (Jean)',
    category: 'clothing',
    unit: '1 adet tek kot pantolon',
    defaultQty: 1,
    stepQty: 1,
    maxQty: 5,
    totalLiters: 7800,
    greenWater: 4100,
    blueWater: 2400,
    greyWater: 1300,
    iconName: 'Shirt',
    emoji: '👖',
    tag: 'Tek Pantolon',
    shortWhy: '1 adet kot pantolon, pamuk tarımından sentetik indigo boyama ve taşlama yıkamalarına kadar 7.800 L su tüketir.',
    description: 'Kot pantolon tekstilin en su yoğun ürünüdür. Yıpratılmış taşlanmış görünüm vermek için devasa endüstriyel kazanlarda defalarca kimyasallarla yıkanır.',
    breakdownStages: [
      { stage: 'Pamuk Tarımı ve Sulama', percent: 65, note: 'Yoğun tarla sulaması' },
      { stage: 'İndigo Boyama Banyoları', percent: 18, note: 'Renk sabitleme kimyasalları' },
      { stage: 'Taşlama ve Ağartma Yıkamaları', percent: 17, note: 'Yıpratılmış efekt için su tüketimi' }
    ],
    ecoSwap: {
      name: 'İkinci El Jean / Havalandırarak Giyme',
      liters: 0,
      tip: 'Kotu her giyimde yıkamak yerine havalandırmak ve 1 yıl daha giymek 7.800 L suyu kurtarır.'
    }
  },
  {
    id: 'sneakers',
    name: 'Spor Ayakkabı (Sneaker)',
    category: 'clothing',
    unit: '1 çift tek ayakkabı',
    defaultQty: 1,
    stepQty: 1,
    maxQty: 5,
    totalLiters: 3800,
    greenWater: 1600,
    blueWater: 1400,
    greyWater: 800,
    iconName: 'Footprints',
    emoji: '👟',
    tag: 'Tek Çift',
    shortWhy: '1 çift spor ayakkabının kauçuk tabanı, file kumaşı ve yapıştırıcıları için 3.800 L su harcanır.',
    description: 'Çok katmanlı EVA köpükler, sentetik polimerler ve boyalı file kumaşların kimyasal sentezi ve montajı su tüketir.',
    breakdownStages: [
      { stage: 'Polimer Taban ve Köpük', percent: 50, note: 'Kimyasal sentez' },
      { stage: 'Saya Kumaşı Dokuma ve Boya', percent: 30, note: 'Tekstil üst yüzey' },
      { stage: 'Sıcak Pres ve Montaj', percent: 20, note: 'Yapıştırıcı kürleme' }
    ]
  },
  {
    id: 'cotton-socks',
    name: 'Pamuklu Çorap',
    category: 'clothing',
    unit: '1 çift tek çorap',
    defaultQty: 2,
    stepQty: 1,
    maxQty: 20,
    totalLiters: 350,
    greenWater: 190,
    blueWater: 110,
    greyWater: 50,
    iconName: 'Footprints',
    emoji: '🧦',
    tag: 'Tek Çift',
    shortWhy: 'Küçük bir çift çorap, pamuk ipliğinin tarladan örülmesine kadar 350 L (4.5 duş) su taşır.',
    description: 'İnce pamuk ipliğinin sulaması, dikişsiz çorap örme makineleri ve buharlı ütüleme süreçleri su harcar.',
    breakdownStages: [
      { stage: 'Pamuk İpliği', percent: 72, note: 'Lif tarımı' },
      { stage: 'Örme ve Yıkama', percent: 18, note: 'İmalat' },
      { stage: 'Buharlı Ütüleme', percent: 10, note: 'Paketleme' }
    ]
  },

  // =================== EŞYA & GÜNLÜK NESNELER (TEKLİ TANE) ===================
  {
    id: 'a4-paper-sheet',
    name: 'A4 Kağıt',
    category: 'goods',
    unit: '1 tek yaprak kağıt!',
    defaultQty: 5,
    stepQty: 1,
    maxQty: 50,
    totalLiters: 10,
    greenWater: 7,
    blueWater: 2,
    greyWater: 1,
    iconName: 'FileText',
    emoji: '📄',
    tag: 'Tek 1 Yaprak',
    shortWhy: 'Yazıcıdan aldığınız TEK 1 YAPRAK A4 kağıt için ağaç hamurundan preslemeye tam 10 L su harcanır.',
    description: 'Ağaç kütüklerinin kimyasal selüloz haline getirilmesi, klor ile beyazlatılması ve dev silindirlerde kurutulması yaprak başına 10 litre temiz su sirkülasyonu gerektirir.',
    breakdownStages: [
      { stage: 'Endüstriyel Ağaç Tarımı', percent: 75, note: 'Çam ve kavak yetiştiriciliği' },
      { stage: 'Selüloz Pişirme ve Ağartma', percent: 15, note: 'Kimyasal hamur kazanları' },
      { stage: 'Silindir Presleme ve Kurutma', percent: 10, note: 'Buhar basımı' }
    ],
    ecoSwap: {
      name: 'Dijital Belge / Not Ekranı',
      liters: 0,
      tip: 'Gereksiz çıktı almamak doğrudan ağaçları ve temiz suyu korur.'
    }
  },
  {
    id: 'plastic-bottle',
    name: 'PET Su Şişesi (0.5L)',
    category: 'goods',
    unit: '1 adet tek boş şişe',
    defaultQty: 1,
    stepQty: 1,
    maxQty: 15,
    totalLiters: 2.5,
    greenWater: 0,
    blueWater: 1.8,
    greyWater: 0.7,
    iconName: 'Wine',
    emoji: '🧴',
    tag: 'Tek Boş Şişe',
    shortWhy: 'Yarım litrelik tek bir boş plastik şişeyi üretmek için, içine doldurulan sudan 5 kat fazlası (2.5 L) harcanır.',
    description: 'Petrokimyasal polimer granül üretimi, yüksek sıcaklıkta preform şişirme ve kalıp soğutma süreçleri tatlı su tüketir.',
    breakdownStages: [
      { stage: 'PET Polimerizasyon', percent: 65, note: 'Petrol rafinerisi' },
      { stage: 'Kalıp Şişirme ve Soğutma Suyu', percent: 35, note: 'Plastik enjeksiyon' }
    ],
    ecoSwap: {
      name: 'Çelik Termos Matara',
      liters: 0,
      tip: 'Kendi mataranızı kullanmak yılda yüzlerce plastik şişenin gizli suyunu doğada bırakır.'
    }
  },
  {
    id: 'paper-coffee-cup',
    name: 'Karton Kahve Bardağı',
    category: 'goods',
    unit: '1 adet kapaklı karton bardak',
    defaultQty: 1,
    stepQty: 1,
    maxQty: 10,
    totalLiters: 5,
    greenWater: 3,
    blueWater: 1.5,
    greyWater: 0.5,
    iconName: 'Coffee',
    emoji: '🥤',
    tag: 'Tek Bardak',
    shortWhy: 'Kafeden aldığınız tek kullanımlık karton bardağın üretimi için 5 litre su harcanır.',
    description: 'Kartonun içindeki sızdırmaz polietilen plastik kaplama ve selüloz hamuru üretimi su tüketir.',
    breakdownStages: [
      { stage: 'Ağaç Hamuru ve Kağıt', percent: 70, note: 'Selüloz üretimi' },
      { stage: 'Polietilen İç Kaplama', percent: 30, note: 'Plastik bariyer ve plastik kapak' }
    ]
  },
  {
    id: 'smartphone',
    name: 'Akıllı Telefon',
    category: 'goods',
    unit: '1 adet yeni cihaz',
    defaultQty: 1,
    stepQty: 1,
    maxQty: 3,
    totalLiters: 12760,
    greenWater: 800,
    blueWater: 7200,
    greyWater: 4760,
    iconName: 'Smartphone',
    emoji: '📱',
    tag: 'Tek Cihaz',
    shortWhy: 'Tek bir akıllı telefonun nano mikroçiplerinin Ultra Saf Su ile yıkanması ve madencilik tam 12.760 L su ister.',
    description: 'Silikon yarı iletken çiplerin üretiminde nano devreleri mikroskobik tozlardan arındırmak için milyarlarca litre Ultra Saf Su (UPW) kullanılır. Lityum ve kobalt madenciliği de yüksek su harcar.',
    breakdownStages: [
      { stage: 'Yarı İletken Çip Yıkama (UPW)', percent: 55, note: 'Ultra Saf Su banyoları' },
      { stage: 'Lityum & Nadir Toprak Madenciliği', percent: 25, note: 'Pil maden havuzları' },
      { stage: 'OLED Ekran ve Alüminyum Gövde', percent: 20, note: 'Cam ve metal işleme soğutma suyu' }
    ],
    ecoSwap: {
      name: 'Mevcut Telefonu 1 Yıl Daha Kullanma',
      liters: 0,
      tip: 'Telefonu değiştirmek yerine bataryasını yenileyip kullanmak 12.760 litre suyu doğrudan kurtarır!'
    }
  }
];

export const CATEGORY_INFO: Record<string, { label: string; icon: string; desc: string }> = {
  all: { label: 'Tümü', icon: 'Grid', desc: 'Tüm tekil porsiyon ve tane verileri' },
  food: { label: 'Gıda & Et (Porsiyon)', icon: 'Utensils', desc: 'Tek porsiyon et, köfte, dilim peynir ve meyveler' },
  drinks: { label: 'İçecekler (Fincan/Bardak)', icon: 'Coffee', desc: 'Tek fincan kahve, bardak çay ve süt' },
  clothing: { label: 'Giyim (Tek Parça)', icon: 'Shirt', desc: 'Tek tişört, kot pantolon ve ayakkabı' },
  goods: { label: 'Eşyalar (Tek Adet)', icon: 'Smartphone', desc: '1 yaprak kağıt, pet şişe ve telefon' },
};
