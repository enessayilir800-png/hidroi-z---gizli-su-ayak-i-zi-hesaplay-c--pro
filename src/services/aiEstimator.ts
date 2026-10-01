import { WaterEstimateResult } from '../types/water';

export interface ImageInput {
  data: string;     // base64 data
  mimeType: string;
}

export async function estimateVirtualWater(
  query?: string,
  image?: ImageInput,
  hint?: string
): Promise<WaterEstimateResult> {
  try {
    const res = await fetch('/api/estimate-footprint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query, image, hint })
    });

    if (!res.ok) {
      throw new Error(`Sunucu yanıt vermedi (${res.status})`);
    }

    const data: WaterEstimateResult = await res.json();
    return data;
  } catch (err: any) {
    console.warn('API call failed, running local estimator fallback:', err);
    return getLocalEstimate(query || hint || 'Yemek / Ürün');
  }
}

// Whole word matching helper
function matchesWord(text: string, keyword: string): boolean {
  const regex = new RegExp('(^|\\s|[.,;])' + keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '($|\\s|[.,;])', 'i');
  return regex.test(text);
}

function getLocalEstimate(query: string): WaterEstimateResult {
  const q = query.toLowerCase().trim();
  let itemName = query || 'Tespit Edilen Ürün';
  let totalLiters = 220;
  let greenWater = 150;
  let blueWater = 45;
  let greyWater = 25;
  let explanation = `"${query}" için tekil 1 adet / 1 porsiyon ölçeğinde hammadde ve üretim aşamaları incelenerek sanal su hesaplanmıştır.`;
  let supplyChainKeyFactors = [
    'Tarımsal hammadde / lif / yem yetiştiriciliği',
    'İmalat, boyama veya pişirme süreci',
    'Paketleme ve lojistik'
  ];
  let recommendedEcoSwap = 'Daha az işlenmiş ve yerel muadilleri tercih etmek su tüketimini düşürür.';

  if (matchesWord(q, 'burger') || matchesWord(q, 'hamburger')) {
    itemName = 'Dana Hamburger (1 Adet)';
    totalLiters = 2100;
    greenWater = 1880;
    blueWater = 130;
    greyWater = 90;
    explanation = '1 adet dana burgerin köftesi (120g) 1.850 L su çeker. Ekmek, peynir ve soslarla birlikte tek burger 2.100 litredir.';
    supplyChainKeyFactors = ['Besi yemi tarımı (mısır/arpa)', 'Burger ekmeği buğdayı', 'Cheddar peyniri ve soslar'];
    recommendedEcoSwap = 'Sebzeli veya mercimek burger (%88 daha az su) tercih edilebilir.';
  } else if (matchesWord(q, 'biftek') || matchesWord(q, 'antrikot') || matchesWord(q, 'dana eti') || matchesWord(q, 'bonfile')) {
    itemName = 'Dana Eti / Biftek (1 Porsiyon ~150g)';
    totalLiters = 2310;
    greenWater = 2160;
    blueWater = 85;
    greyWater = 65;
    explanation = 'Kırmızı et içeren tek porsiyonda harcanan suyun %94 ü büyükbaş hayvanın yem tahıllarının sulanmasından kaynaklanır.';
    supplyChainKeyFactors = ['Besi yemi tarımı', 'Büyükbaş yetiştiriciliği', 'Kesim ve soğuk zincir'];
    recommendedEcoSwap = 'Haftada bir porsiyonu tavuk (650 L) veya mercimekle değiştirmek 1.660 L su kurtarır.';
  } else if (matchesWord(q, 'köfte')) {
    itemName = 'Izgara Köfte (1 Adet ~40g)';
    totalLiters = 615;
    greenWater = 575;
    blueWater = 23;
    greyWater = 17;
    explanation = 'Çatalınızdaki tek 1 adet ızgara köfte, dana kıymasının yoğun yem suyu nedeniyle yaklaşık 615 L sanal su içerir.';
    supplyChainKeyFactors = ['Besi yemi tahılları', 'Kıyma çekimi ve ekmek içi', 'Pişirme'];
    recommendedEcoSwap = 'Mercimek köftesi (adet başı 45 L) tercih edilebilir.';
  } else if (matchesWord(q, 'tavuk') || matchesWord(q, 'piliç') || matchesWord(q, 'chicken')) {
    itemName = 'Tavuk Fileto / But (1 Porsiyon ~150g)';
    totalLiters = 650;
    greenWater = 530;
    blueWater = 50;
    greyWater = 70;
    explanation = 'Tavuklar yemi ete çevirmede çok daha verimlidir. Tek porsiyon tavuk eti ~650 L sanal su içerir.';
    supplyChainKeyFactors = ['Tavuk karma yemi', 'Kümes iklimlendirmesi', 'İşleme tesisi'];
    recommendedEcoSwap = 'Bitkisel proteinlerle öğünleri zenginleştirmek su ayak izini daha da düşürür.';
  } else if (matchesWord(q, 'peynir') || matchesWord(q, 'kaşar')) {
    itemName = 'Kaşar Peyniri (1 Dilim ~30g)';
    totalLiters = 152;
    greenWater = 132;
    blueWater = 11;
    greyWater = 9;
    explanation = 'Tek bir dilim peynir (~30g) üretmek için yaklaşık 300 ml çiğ inek sütü yoğunlaştırılır.';
    supplyChainKeyFactors = ['Sağmal inek karma yemi', 'Süt yoğunlaştırma', 'Mayalama'];
    recommendedEcoSwap = 'Peynir tüketimini dengede tutmak veya bitkisel alternatifler denemek su tasarrufu sağlar.';
  } else if (matchesWord(q, 'kahve') || matchesWord(q, 'latte') || matchesWord(q, 'espresso') || matchesWord(q, 'cappuccino')) {
    itemName = 'Kahve (1 Fincan 125ml)';
    totalLiters = 140;
    greenWater = 125;
    blueWater = 8;
    greyWater = 7;
    explanation = 'Tek bir fincan kahve için tarladaki kahve kirazının sulanması ve yıkanması tam 140 litre su harcar.';
    supplyChainKeyFactors = ['Kahve kirazı sulaması', 'Meyve etinden ayırma yıkaması', 'Kavurma'];
    recommendedEcoSwap = 'Kahve yerine Türk çayı (30 L) tercih ederek fincan başına 110 litre su kurtarabilirsiniz.';
  } else if (matchesWord(q, 'çay') || matchesWord(q, 'türk çayı')) {
    itemName = 'Siyah Çay (1 Bardak 150ml)';
    totalLiters = 30;
    greenWater = 24;
    blueWater = 3;
    greyWater = 3;
    explanation = 'Çay yaprakları bol yağışlı Karadeniz yamaçlarında yapay sulamasız yetiştiğinden çok düşük sanal suya sahiptir.';
    supplyChainKeyFactors = ['Doğal Karadeniz yağışları', 'Soldurma ve fırınlama', 'Demleme'];
    recommendedEcoSwap = 'Çay en su dostu içeceklerin başında gelir.';
  } else if (matchesWord(q, 'keten') || matchesWord(q, 'keten gömlek') || matchesWord(q, 'keten pantolon')) {
    itemName = 'Keten Gömlek (1 Adet)';
    totalLiters = 1200;
    greenWater = 900;
    blueWater = 200;
    greyWater = 100;
    explanation = 'Keten bitkisi pamuğa göre çok daha az su tüketir ve yağmur suyuyla büyür.';
    supplyChainKeyFactors = ['Keten tarımı', 'Havuzlama ve lif ayırma', 'Dokuma ve dikiş'];
    recommendedEcoSwap = 'Keten, pamuğa kıyasla mükemmel bir su tasarrufu tercihidir.';
  } else if (matchesWord(q, 'tişört') || matchesWord(q, 'tshirt')) {
    itemName = 'Pamuklu Tişört (1 Adet)';
    totalLiters = 2200;
    greenWater = 1200;
    blueWater = 700;
    greyWater = 300;
    explanation = 'Tek bir pamuklu tişörtün pamuk tarlasında sulanması, boyanması ve dikilmesi için 2.200 litre su harcanır.';
    supplyChainKeyFactors = ['Pamuk tarımı sulaması', 'Kumaş boyama ve terbiye', 'Konfeksiyon'];
    recommendedEcoSwap = 'Var olan kıyafetleri özenle korumak ve ikinci el tercih etmek yeni üretim suyunu sıfırlar.';
  } else if (matchesWord(q, 'kot') || matchesWord(q, 'jean')) {
    itemName = 'Kot Pantolon (1 Adet)';
    totalLiters = 7800;
    greenWater = 4100;
    blueWater = 2400;
    greyWater = 1300;
    explanation = '1 adet kot pantolon, pamuk tarımından sentetik indigo boyama ve taşlama yıkamalarına kadar 7.800 L su tüketir.';
    supplyChainKeyFactors = ['Pamuk sulaması', 'İndigo kimyasal boyama', 'Taşlama yıkamaları'];
    recommendedEcoSwap = 'Kotu sık yıkamak yerine havalandırmak kumaş ömrünü uzatır ve suyu korur.';
  } else if (matchesWord(q, 'ayakkabı') || matchesWord(q, 'sneaker')) {
    itemName = 'Spor Ayakkabı (1 Çift)';
    totalLiters = 3800;
    greenWater = 1600;
    blueWater = 1400;
    greyWater = 800;
    explanation = 'Sentetik polimer taban, kumaş saya ve kalıplama prosesleri 1 çift ayakkabıda 3.800 L su harcar.';
    supplyChainKeyFactors = ['Polimer taban sentezi', 'Saya kumaşı boyama', 'Sıcak pres ve montaj'];
    recommendedEcoSwap = 'Tamir edip taban yaptırmak sıfır ek su harcatır.';
  } else if (matchesWord(q, 'yumurta')) {
    itemName = 'Yumurta (1 Adet)';
    totalLiters = 196;
    greenWater = 156;
    blueWater = 22;
    greyWater = 18;
    explanation = '1 adet yumurta, tavuğun tükettiği karma yem tahıllarının sulanması sebebiyle 196 L sanal su içerir.';
    supplyChainKeyFactors = ['Yem tahılları', 'Kümes temizliği', 'Lojistik'];
    recommendedEcoSwap = 'Dengeli protein kaynağıdır.';
  } else if (matchesWord(q, 'süt')) {
    itemName = 'İnek Sütü (1 Bardak 200ml)';
    totalLiters = 204;
    greenWater = 174;
    blueWater = 16;
    greyWater = 14;
    explanation = '1 bardak inek sütü için sağmal ineğin tükettiği yemler nedeniyle 204 L su harcanır.';
    supplyChainKeyFactors = ['Yem tarımı', 'Sağımhane temizliği', 'Pastörizasyon'];
    recommendedEcoSwap = 'Yulaf sütü (38 L) tercih ederek %81 su tasarrufu yapabilirsiniz.';
  }

  return {
    itemName,
    totalLiters,
    greenWater,
    blueWater,
    greyWater,
    confidence: 'Yüksek',
    explanation,
    supplyChainKeyFactors,
    recommendedEcoSwap,
    showerEquivalent: Math.max(1, Math.round(totalLiters / 80))
  };
}
