import { QuizQuestion } from '../types/water';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: '1 adet pamuklu kot pantolonun (jean) üretimi için ortalama kaç litre gizli su harcanır?',
    options: ['500 Litre', '2.000 Litre', '7.800 Litre', '50.000 Litre'],
    correctIndex: 2,
    explanation: 'Pamuk tarımındaki sulama, sentetik indigo boyama ve kumaş taşlama yıkamaları nedeniyle tek bir kot pantolon ortalama 7.800 litre su tüketir.',
    fact: 'Bu miktar, tek bir kişinin yaklaşık 10 yıllık içme suyu ihtiyacına eşittir!'
  },
  {
    id: 2,
    question: 'Sabah içtiğiniz 1 fincan (125 ml) filtre kahvenin arkasında ne kadar sanal su gizlidir?',
    options: ['1 Fincan (125 ml)', '15 Litre', '140 Litre', '1.000 Litre'],
    correctIndex: 2,
    explanation: 'Kahve kirazı ağaçta yetişirken, ıslak işleme tesislerinde meyve etinden ayrılırken ve kavrulurken 1 fincan kahve için ortalama 140 litre su tüketilir.',
    fact: 'Aynı miktarda siyah çay ise yaklaşık 30 litre su gerektirir (kahveden yaklaşık 4.5 kat daha tasarruflu).'
  },
  {
    id: 3,
    question: 'Aşağıdaki gıdalardan hangisinin 1 kilogramındaki gizli su ayak izi en yüksektir?',
    options: ['Dana Eti (Kırmızı Et)', 'Tavuk Eti', 'Pirinç', 'Elma'],
    correctIndex: 0,
    explanation: '1 kg dana eti üretimi için hayvanın 3 yıl boyunca tükettiği saman, soya ve mısır yemlerinin sulanması nedeniyle tam 15.415 litre su gerekir.',
    fact: 'Tavuk eti (4.325 L) ve pirinç (2.497 L) dana etine göre çok daha düşük su ayak izine sahiptir.'
  },
  {
    id: 4,
    question: 'Sanal su ayak izinde "Gri Su" ne anlama gelir?',
    options: [
      'Gökten yağan doğal yağmur suyu',
      'Yeraltı ve barajlardan boruyla çekilen tatlı su',
      'Üretim atıklarını ve kimyasal kirliliği seyreltmek için gereken su hacmi',
      'Deniz suyunun buharlaşması'
    ],
    correctIndex: 2,
    explanation: 'Gri su ayak izi; endüstriyel boyama, gübreleme veya fabrika atıklarının su kalitesi standartlarına ulaşabilmesi için seyreltilmesinde kullanılan tatlı su miktarını ifade eder.',
    fact: 'Tekstilde kot taşlama ve boyama banyoları devasa gri su ayak izi yaratır.'
  },
  {
    id: 5,
    question: 'Cebinizdeki akıllı telefonun üretilmesinde neden yaklaşık 12.760 litre su harcanır?',
    options: [
      'Telefonun suya dayanıklılık testleri için',
      'Mikroçiplerin kimyasal arındırılmasında Ultra Saf Su (UPW) ve madencilik kullanıldığı için',
      'Telefon kılıfının yıkanması için',
      'Sadece nakliye gemilerinde buharlaşan su için'
    ],
    correctIndex: 1,
    explanation: 'Silikon yarı iletken çiplerin nanometrik üretiminde tozlardan arınmak için milyarlarca litre Ultra Saf Su (UPW) kullanılır ve lityum madenciliği yüksek su gerektirir.',
    fact: 'Telefonunuzu değiştirmek yerine bataryasını yenileyip 1 yıl daha kullanmak doğrudan 12.760 litre suyu kurtarır.'
  },
  {
    id: 6,
    question: 'Aşağıdaki giyim alışkanlıklarından hangisi su tasarrufunda en büyük etkiyi sağlar?',
    options: [
      'Kıyafetleri her gün 90 derecede yıkamak',
      'Bir kıyafeti eskiyene kadar giymek ve ikinci el tercih etmek',
      'Sürekli yeni hızlı moda (fast fashion) ürünleri almak',
      'Sadece beyaz renkli pamuklu elbiseler almak'
    ],
    correctIndex: 1,
    explanation: 'Tekstildeki en büyük su tüketimi ham lif üretimi ve ilk boyama aşamasındadır. İkinci el almak ya da kıyafetin ömrünü 9 ay uzatmak su ayak izinizi %80 e varan oranda düşürür.',
    fact: 'Dünyada üretilen tekstil ürünlerinin %70i ya yakılmakta ya da çöpe gitmektedir.'
  }
];

export interface WaterTip {
  id: string;
  title: string;
  category: string;
  litersSaved: string;
  description: string;
  actionText: string;
}

export const WATER_TIPS: WaterTip[] = [
  {
    id: 'tip-1',
    title: 'Haftada 1 Gün Etsiz Beslenin (Meatless Day)',
    category: 'Gıda',
    litersSaved: 'Haftada ~2.500 Litre',
    description: 'Haftada yalnızca bir gün kırmızı et yerine mercimek, nohut veya sebze yemeği tüketmek tek bir kişinin yılda 130.000 litre sanal su kurtarmasını sağlar.',
    actionText: 'Bugün akşam menüsünü bitkisel seçin'
  },
  {
    id: 'tip-2',
    title: 'Kot Pantolonu Havalandırın, Az Yıkayın',
    category: 'Tekstil',
    litersSaved: 'Yılda ~10.800 Litre (Yeni kot alımını erteleme)',
    description: 'Kot pantolonlar her giyimden sonra yıkanmak üzere tasarlanmamıştır. Havalandırmak ve leke temizliği yapmak lifleri korur, yeni kot alma ihtiyacını yıllarca erteler.',
    actionText: 'Kıyafetlerin ömrünü uzatın'
  },
  {
    id: 'tip-3',
    title: 'Kahve Molasının Birini Çayla Değiştirin',
    category: 'İçecek',
    litersSaved: 'Günde 110 Litre',
    description: 'Günde 3 fincan kahve yerine 1 fincanını Türk çayı veya bitki çayı ile değiştirdiğinizde her gün 110 litre su doğada kalır.',
    actionText: 'Çay molası verin'
  },
  {
    id: 'tip-4',
    title: 'Ekmek İsrafını Sıfıra İndirin',
    category: 'Gıda',
    litersSaved: 'Dilim başına 40 Litre',
    description: 'Türkiye\'de her gün milyonlarca ekmek çöpe gitmektedir. 1 dilim ekmek 40 litre buğday suyu demektir. Bayatlayan ekmekleri fırınlayıp kruton yapabilirsiniz.',
    actionText: 'Bayat ekmekleri değerlendirin'
  },
  {
    id: 'tip-5',
    title: 'Telefonunuzu En Az 3 Yıl Kullanın',
    category: 'Teknoloji',
    litersSaved: 'Cihaz başına 12.760 Litre',
    description: 'Her yıl yeni model telefon almak yerine mevcut cihazınızın bataryasını veya camını yenilemek 12.760 litre su ve onlarca kimyasal arıtma sürecini engeller.',
    actionText: 'Elektronik ömrünü uzatın'
  },
  {
    id: 'tip-6',
    title: 'Pirinç Yerine Anadolu Bulguru',
    category: 'Gıda',
    litersSaved: 'Kg başına ~1.500 Litre',
    description: 'Pirinç su basılmış çeltik tarlalarında yetiştirilirken bulgur kuru tarıma uygun buğdaydan elde edilir. Pirinç yerine bulgur pilavı su krizine karşı harika bir seçimdir.',
    actionText: 'Bulgur pilavı tercih edin'
  }
];

export interface ComparePreset {
  id: string;
  title: string;
  itemAId: string;
  itemBId: string;
  itemAName: string;
  itemBName: string;
  itemALiters: number;
  itemBLiters: number;
  differenceLiters: number;
  savingsPercentage: number;
  highlight: string;
}

export const COMPARE_PRESETS: ComparePreset[] = [
  {
    id: 'beef-vs-chicken',
    title: 'Dana Eti (1 Porsiyon) vs Tavuk (1 Porsiyon)',
    itemAId: 'beef-steak',
    itemBId: 'chicken-portion',
    itemAName: '1 Porsiyon Dana Eti (150g)',
    itemBName: '1 Porsiyon Tavuk Eti (150g)',
    itemALiters: 2310,
    itemBLiters: 650,
    differenceLiters: 1660,
    savingsPercentage: 72,
    highlight: 'Öğle/akşam yemeğinde dana eti yerine tavuk seçildiğinde tek bir tabakta 1.660 litre (21 duşluk) su kurtarılır!'
  },
  {
    id: 'jeans-vs-tshirt',
    title: 'Kot Pantolon vs Pamuklu Tişört',
    itemAId: 'jeans',
    itemBId: 'cotton-tshirt',
    itemAName: 'Kot Pantolon (1 adet)',
    itemBName: 'Pamuklu Tişört (1 adet)',
    itemALiters: 7800,
    itemBLiters: 2200,
    differenceLiters: 5600,
    savingsPercentage: 72,
    highlight: '1 kot pantolon, yaklaşık 3.5 adet pamuklu tişörtün toplam su ayak izine eşittir.'
  },
  {
    id: 'coffee-vs-tea',
    title: '1 Fincan Kahve vs 1 Bardak Çay',
    itemAId: 'coffee-cup',
    itemBId: 'tea-cup',
    itemAName: 'Filtre Kahve (125 ml)',
    itemBName: 'Geleneksel Çay (150 ml)',
    itemALiters: 140,
    itemBLiters: 30,
    differenceLiters: 110,
    savingsPercentage: 78,
    highlight: 'Çay, kahveye göre neredeyse 5 kat daha az su harcar. Fincan başına 110 litre su kurtarılır.'
  },
  {
    id: 'milk-vs-oat',
    title: 'İnek Sütü vs Yulaf Sütü',
    itemAId: 'cow-milk',
    itemBId: 'oat-milk',
    itemAName: '1 Bardak İnek Sütü (200ml)',
    itemBName: '1 Bardak Yulaf Sütü (200ml)',
    itemALiters: 204,
    itemBLiters: 38,
    differenceLiters: 166,
    savingsPercentage: 81,
    highlight: 'Bitkisel yulaf sütü, inek sütüne oranla su ayak izinde %81 oranında tasarruf sunar.'
  },
  {
    id: 'paper-vs-bottle',
    title: '1 Yaprak A4 Kağıt vs Plastik Şişe',
    itemAId: 'a4-paper-sheet',
    itemBId: 'plastic-bottle',
    itemAName: 'A4 Kağıt (1 yaprak)',
    itemBName: 'PET Su Şişesi (1 adet boş)',
    itemALiters: 10,
    itemBLiters: 2.5,
    differenceLiters: 7.5,
    savingsPercentage: 75,
    highlight: 'Yalnızca tek bir sayfa A4 kağıt üretimi için 10 litre, boş bir plastik şişe için 2.5 litre su harcanır.'
  }
];

