import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Support base64 image uploads up to 30MB
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Initialize Gemini client according to @google/genai guidelines
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (geminiApiKey && geminiApiKey.trim() !== '' && geminiApiKey !== 'MY_GEMINI_API_KEY') {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Clean markdown ticks and parse JSON safely
function cleanAndParseJson(text: string) {
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  }
  const startIdx = cleaned.indexOf('{');
  const endIdx = cleaned.lastIndexOf('}');
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    cleaned = cleaned.substring(startIdx, endIdx + 1);
  }
  return JSON.parse(cleaned);
}

// Scientific single-item catalog for offline / emergency fallback
const SINGLE_ITEM_CATALOG = [
  { keywords: ['burger', 'hamburger'], name: 'Dana Burger (1 Adet)', liters: 2100, green: 1880, blue: 130, grey: 90, exp: '1 adet dana burgerin köftesi (120g) için besi hayvanının tükettiği yemler ve tahıllar sebebiyle tek bir burger 2.100 litre su harcar.', eco: 'Sebzeli veya mercimek burger tercih edilebilir (%88 su tasarrufu).' },
  { keywords: ['biftek', 'antrikot', 'bonfile', 'kırmızı et', 'dana eti'], name: 'Dana Eti / Biftek (1 Porsiyon ~150g)', liters: 2310, green: 2160, blue: 85, grey: 65, exp: 'Tek 1 porsiyon dana etinde harcanan suyun %94 ü büyükbaş hayvanın 3 yıl boyunca tükettiği saman ve yem tahıllarının sulanmasından kaynaklanır.', eco: 'Haftada bir öğünü tavuk (650 L) veya baklagil ile değiştirmek 1.660 L su kurtarır.' },
  { keywords: ['köfte', 'meatball', 'akçaabat', 'inegöl'], name: 'Izgara Köfte (1 Adet ~40g)', liters: 615, green: 575, blue: 23, grey: 17, exp: 'Çatalınızdaki tek 1 adet ızgara köfte, dana kıymasının yoğun yem suyu nedeniyle yaklaşık 615 litre (yaklaşık 32 damacana) sanal su içerir.', eco: 'Mercimek köftesi veya sebzeli köfte tercih edilebilir.' },
  { keywords: ['tavuk', 'piliç', 'chicken', 'kanat', 'but', 'şnitzel', 'nugget'], name: 'Tavuk Fileto / But (1 Porsiyon ~150g)', liters: 650, green: 530, blue: 50, grey: 70, exp: 'Tavuklar yemi ete çevirmede büyükbaşa kıyasla 3.5 kat daha verimlidir. Tek porsiyon tavuk eti ortalama 650 litre su tüketir.', eco: 'Protein dengesini nohut veya mercimekle zenginleştirmek su ayak izini daha da düşürür.' },
  { keywords: ['peynir', 'kaşar', 'cheese', 'beyaz peynir', 'tulum', 'mozzarella'], name: 'Kaşar / Sert Peynir (1 Dilim ~30g)', liters: 152, green: 132, blue: 11, grey: 9, exp: 'Tek bir dilim peynir (~30g) üretmek için yaklaşık 300 ml inek sütü yoğunlaştırılır. İneğin yem suyu sütün içine hapsedilir.', eco: 'Porsiyon kontrolü yapmak veya bitkisel peynirler denemek su tasarrufu sağlar.' },
  { keywords: ['ekmek', 'somun', 'baget'], name: 'Ekmek (1 Dilim ~30g)', liters: 40, green: 28, blue: 8, grey: 4, exp: 'Kahvaltıdaki tek 1 dilim ekmek buğday tarlalarının sulanması ve un öğütme aşamalarıyla 40 litre (2 damacana) su demektir.', eco: 'Bayat ekmekleri değerlendirmek doğrudan temiz su tasarrufu sağlar.' },
  { keywords: ['simit', 'poğaça', 'açma', 'börek'], name: 'Susamlı Simit (1 Adet)', liters: 160, green: 112, blue: 32, grey: 16, exp: '1 adet simit, susam tarımının yoğun su ihtiyacı ve buğday unu sebebiyle yaklaşık 160 litre gizli su taşır.', eco: 'Tam tahıllı ve susamsız unlu mamuller daha az su tüketir.' },
  { keywords: ['pizza'], name: 'Pizza (1 Dilim ~120g)', liters: 850, green: 650, blue: 120, grey: 80, exp: 'Mozzarella peyniri, şarküteri eti ve mayalı hamur tek bir dilim pizzada 850 L su ayak izi oluşturur.', eco: 'Sebzeli veya mantarlı pizza seçmek su tüketimini yarıya indirir.' },
  { keywords: ['lahmacun'], name: 'Lahmacun (1 Adet)', liters: 550, green: 420, blue: 75, grey: 55, exp: 'Kıymalı harç ve ince hamurun fırınlanmasıyla tek bir lahmacun yaklaşık 550 litre sanal su içerir.', eco: 'Yanında bol yeşillik ve salata ile dengelemek idealdir.' },
  { keywords: ['kahve', 'coffee', 'latte', 'espresso', 'cappuccino', 'filtre kahve', 'türk kahvesi'], name: 'Filtre / Türk Kahvesi (1 Fincan 125ml)', liters: 140, green: 125, blue: 8, grey: 7, exp: 'Tek bir fincan kahve için tropik ağaçtaki kahve kirazının sulanması ve yıkanması tam 140 litre (yaklaşık 1.8 duş) su harcatır.', eco: 'Kahve yerine Türk çayı (30 L) seçmek fincan başına 110 litre su kurtarır.' },
  { keywords: ['siyah çay', 'türk çayı', 'demleme çay'], name: 'Siyah Çay (1 İnce Belli Bardak 150ml)', liters: 30, green: 24, blue: 3, grey: 3, exp: 'Çay yaprakları bol yağışlı Karadeniz yamaçlarında yapay sulamasız yetiştiğinden çok düşük (30 L) sanal suya sahiptir.', eco: 'Geleneksel çay en su dostu içeceklerin başında gelir.' },
  { keywords: ['inek sütü'], name: 'İnek Sütü (1 Su Bardağı 200ml)', liters: 204, green: 174, blue: 16, grey: 14, exp: '1 su bardağı inek sütü için sağmal ineğin tükettiği yemler ve çiftlik temizliği nedeniyle 204 L su harcanır.', eco: 'Yulaf sütü (38 L) tercih ederek %81 su tasarrufu yapabilirsiniz.' },
  { keywords: ['yulaf sütü', 'badem sütü', 'soya sütü'], name: 'Yulaf Sütü (1 Bardak 200ml)', liters: 38, green: 32, blue: 4, grey: 2, exp: 'Yulaf az su isteyen serin iklim tahılı olduğu için bir bardağı sadece 38 litre sanal su gerektirir.', eco: 'Harika bir seçim, su dostu bir içecektir.' },
  { keywords: ['kola', 'gazoz', 'fanta', 'gazlı içecek'], name: 'Gazlı İçecek (1 Kutu 330ml)', liters: 175, green: 120, blue: 35, grey: 20, exp: 'Şeker pancarı tarımı ve alüminyum kutunun boksit madenciliği tek bir kutuda 175 L su tüketir.', eco: 'Maden suyu veya taze ev yapımı limonata tercih edilebilir.' },
  { keywords: ['bira', 'beer'], name: 'Şişe Bira (1 Şişe 330ml)', liters: 98, green: 72, blue: 16, grey: 10, exp: 'Maltlık arpanın tarlada sulanması ve fermantasyon kazanları tek bir şişede 98 litre su tüketir.', eco: 'Ölçülü tüketim su ayak izinizi korur.' },
  { keywords: ['yumurta', 'haşlanmış yumurta'], name: 'Yumurta (1 Adet Orta Boy)', liters: 196, green: 156, blue: 22, grey: 18, exp: '1 adet yumurta, tavuğun yumurtlama sürecinde tükettiği yem tahıllarının sulanması sebebiyle yaklaşık 196 litre su taşır.', eco: 'Yüksek biyolojik protein değerine sahip dengeli bir kaynaktır.' },
  { keywords: ['elma', 'apple'], name: 'Elma (1 Adet Tek Meyve ~150g)', liters: 125, green: 85, blue: 25, grey: 15, exp: 'Elma ağaçları kökleriyle topraktaki yağış suyunu emer. 1 adet taze elma 125 litre sanal su ile sofranıza gelir.', eco: 'Mevsiminde yerel meyve tüketmek su izini düşürür.' },
  { keywords: ['muz', 'banana'], name: 'Muz (1 Adet Tek Muz ~120g)', liters: 95, green: 75, blue: 12, grey: 8, exp: 'Tropikal muz ağaçları bol yağmur suyuyla beslenir. 1 adet muz yaklaşık 95 litre su harcar.', eco: 'Yerli Anamur muzu seçmek taşıma suyunu azaltır.' },
  { keywords: ['domates', 'tomato'], name: 'Domates (1 Adet ~100g)', liters: 22, green: 12, blue: 7, grey: 3, exp: '1 adet taze domates yalnızca 22 litre su harcar; sebzeler en düşük su ayak izine sahip gıdalardır.', eco: 'Sebzeler en doğa dostu tercihlerdir.' },
  { keywords: ['patates', 'potato'], name: 'Patates (1 Adet Orta Boy ~150g)', liters: 43, green: 28, blue: 10, grey: 5, exp: 'Patates yer altında büyüdüğü için buharlaşma kaybı çok azdır. 1 adet patates yalnızca 43 L su ister.', eco: 'Pirinç yerine patates veya bulgur seçmek büyük tasarruf sağlar.' },
  { keywords: ['pirinç pilavı'], name: 'Pirinç Pilavı (1 Porsiyon ~150g)', liters: 375, green: 270, blue: 75, grey: 30, exp: 'Pirinç tarlaları sular altında çeltik olarak yetiştirildiğinden 1 porsiyon pilav 375 L su gerektirir.', eco: 'Bulgur pilavı (porsiyon başına ~110 L) tercih ederek 265 L tasarruf edebilirsiniz.' },
  { keywords: ['çikolata', 'chocolate'], name: 'Çikolata (3 Kare / Küçük Bar ~30g)', liters: 516, green: 474, blue: 24, grey: 18, exp: 'Kakao ağacı aşırı su çeker. Yalnızca 30 gramcık çikolata bile 516 litre (yaklaşık 6.5 duş) sanal su taşır!', eco: 'Kuru meyve veya az işlenmiş kuruyemişlerle tatlı ihtiyacını dengeleyebilirsiniz.' },
  { keywords: ['pamuklu tişört', 'tişört', 'tshirt', 't-shirt'], name: 'Pamuklu Tişört (1 Adet)', liters: 2200, green: 1200, blue: 700, grey: 300, exp: '1 adet pamuklu tişörtün pamuk tarlasında sulanması, kumaş boyaması ve dikilmesi için tam 2.200 litre su harcanır.', eco: 'Var olan tişörtü 1 yıl daha giymek veya ikinci el tercih etmek 2.200 L suyu kurtarır.' },
  { keywords: ['kot pantolon', 'jean', 'denim'], name: 'Kot Pantolon (1 Adet Tek Jean)', liters: 7800, green: 4100, blue: 2400, grey: 1300, exp: '1 adet kot pantolon, pamuk tarımından sentetik indigo boyama ve taşlama yıkamalarına kadar 7.800 litre su tüketir.', eco: 'Kotu her giyişte yıkamak yerine havalandırmak hem kumaşı korur hem binlerce litre su kurtarır.' },
  { keywords: ['keten gömlek', 'keten'], name: 'Keten Gömlek / Pantolon (1 Adet)', liters: 1200, green: 900, blue: 200, grey: 100, exp: 'Keten bitkisi pamuğa göre çok daha az su ister ve serin iklimlerde yetişir. 1 adet keten giysi ~1.200 L su gerektirir.', eco: 'Pamuğa kıyasla harika bir su tasarruflu giysi tercihidir.' },
  { keywords: ['sneaker', 'spor ayakkabı'], name: 'Spor Ayakkabı / Sneaker (1 Çift)', liters: 3800, green: 1600, blue: 1400, grey: 800, exp: 'Sentetik taban polimerleri, kumaş saya ve kalıplama prosesleri 1 çift spor ayakkabıda 3.800 L su harcar.', eco: 'Ayakkabıyı tamir ettirip taban yenilemek sıfır ek su harcatır.' },
  { keywords: ['çorap', 'sock'], name: 'Pamuklu Çorap (1 Çift)', liters: 350, green: 190, blue: 110, grey: 50, exp: '1 çift pamuklu çorap, iplik eğirmeden buharlı ütülemeye kadar 350 litre su taşır.', eco: 'Yüksek kaliteli lifler tercih etmek kumaş ömrünü artırır.' },
  { keywords: ['akıllı telefon', 'iphone', 'cep telefonu'], name: 'Akıllı Telefon (1 Adet)', liters: 12760, green: 800, blue: 7200, grey: 4760, exp: 'Mikroçiplerin nanometrik devrelerinin Ultra Saf Su ile yıkanması ve nadir metal madenciliği 1 telefonda 12.760 L su harcar.', eco: 'Telefonun pilini yenileyip 1 yıl daha kullanmak doğrudan 12.760 L su tasarrufu demektir.' },
  { keywords: ['a4 kağıt', 'kağıt yaprağı'], name: 'A4 Kağıt (Tek 1 Yaprak!)', liters: 10, green: 7, blue: 2, grey: 1, exp: 'Yazıcıdan çıkan TEK 1 YAPRAK kağıt ağaç hamurundan kurutmaya kadar 10 litre su gerektirir.', eco: 'Çift taraflı yazdırmak ve dijital not tutmak kağıt ve su israfını önler.' },
  { keywords: ['plastik şişe', 'pet şişe'], name: 'Plastik Su Şişesi (1 Adet Boş Şişe 0.5L)', liters: 2.5, green: 0, blue: 1.8, grey: 0.7, exp: 'Boş bir plastik su şişesini üretmek için içine konan sudan 5 kat daha fazlası (2.5 L) harcanır.', eco: 'Çelik matara kullanarak yılda yüzlerce litre su tasarrufu yapabilirsiniz.' }
];

// Word boundary matching to avoid accidental substring matches (e.g. keten containing et)
function findInCatalog(query: string) {
  const q = query.toLowerCase().trim();
  for (const item of SINGLE_ITEM_CATALOG) {
    for (const kw of item.keywords) {
      const regex = new RegExp('(^|\\s|[.,;])' + kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '($|\\s|[.,;])', 'i');
      if (regex.test(q)) {
        return {
          itemName: item.name,
          totalLiters: item.liters,
          greenWater: item.green,
          blueWater: item.blue,
          greyWater: item.grey,
          confidence: 'Yüksek' as const,
          explanation: item.exp,
          supplyChainKeyFactors: [
            'Hammadde yetiştiriciliği ve tarımsal sulama',
            'Üretim, işleme veya pişirme enerjisi',
            'Paketleme ve tedarik lojistiği'
          ],
          recommendedEcoSwap: item.eco,
          showerEquivalent: Math.max(1, Math.round(item.liters / 80))
        };
      }
    }
  }
  return null;
}

// Fallback estimation for when Gemini API is completely unavailable
function getSmartSingleItemFallback(query: string) {
  const direct = findInCatalog(query);
  if (direct) return direct;

  const q = query.toLowerCase().trim();
  let name = query || 'Tespit Edilen Ürün';
  let totalLiters = 220;
  let greenWater = 150;
  let blueWater = 45;
  let greyWater = 25;

  if (q.includes('kebap') || q.includes('döner') || q.includes('köfte') || q.includes('bonfile') || q.includes('antrikot')) {
    name = `${query} (1 Porsiyon)`;
    totalLiters = 1450;
    greenWater = 1200;
    blueWater = 150;
    greyWater = 100;
  } else if (q.includes('tavuk') || q.includes('balık') || q.includes('hindi')) {
    name = `${query} (1 Porsiyon)`;
    totalLiters = 580;
    greenWater = 450;
    blueWater = 60;
    greyWater = 70;
  } else if (q.includes('elbise') || q.includes('kıyafet') || q.includes('ceket') || q.includes('mont') || q.includes('kaban')) {
    name = `${query} (1 Adet)`;
    totalLiters = 3100;
    greenWater = 1800;
    blueWater = 850;
    greyWater = 450;
  } else if (q.includes('çorba') || q.includes('salata') || q.includes('sebze') || q.includes('meyve')) {
    name = `${query} (1 Porsiyon)`;
    totalLiters = 110;
    greenWater = 75;
    blueWater = 22;
    greyWater = 13;
  } else if (q.includes('içecek') || q.includes('kahve') || q.includes('çay') || q.includes('limonata')) {
    name = `${query} (1 Porsiyon/Bardak)`;
    totalLiters = 85;
    greenWater = 65;
    blueWater = 12;
    greyWater = 8;
  }

  return {
    itemName: name,
    totalLiters,
    greenWater,
    blueWater,
    greyWater,
    confidence: 'Tahmini' as const,
    explanation: `"${name}" için tekil 1 adet veya 1 porsiyon ölçeğinde hammadde tarımı ve üretim zincirleri hesaplanarak tahmini sanal su ayak izi belirlenmiştir.`,
    supplyChainKeyFactors: [
      'Tarımsal hammadde yetiştiriciliği ve sulama',
      'İşleme ve hazırlık enerjisi',
      'Paketleme ve nakliye'
    ],
    recommendedEcoSwap: 'Daha az işlenmiş ve yerel muadilleri tercih etmek su ayak izinizi düşürür.',
    showerEquivalent: Math.max(1, Math.round(totalLiters / 80))
  };
}

// Cascade list of Gemini models to handle transient 503 errors gracefully
const MODEL_CASCADE = [
  'gemini-3.5-flash',
  'gemini-3.8-flash',
  'gemini-flash-latest',
  'gemini-3.1-flash-lite'
];

app.post('/api/estimate-footprint', async (req, res) => {
  const { query, image, hint } = req.body;

  const hasQuery = typeof query === 'string' && query.trim().length > 0;
  const hasImage = image && typeof image.data === 'string' && image.data.length > 0;
  const hasHint = typeof hint === 'string' && hint.trim().length > 0;

  if (!hasQuery && !hasImage && !hasHint) {
    return res.status(400).json({
      error: 'Lütfen bir ürün adı girin veya fotoğraf çekin.'
    });
  }

  const queryText = hasQuery ? query.trim() : (hasHint ? hint.trim() : '');

  // If AI client not available, run smart catalog/single-item fallback
  if (!ai) {
    return res.json(getSmartSingleItemFallback(queryText));
  }

  const prompt = `Sen Water Footprint Network (Hoekstra & Mekonnen) metodolojisinde uzman bir çevre mühendisisin.
GÖREV:
${hasImage ? `1. Ekteki FOTOĞRAFTA yer alan gıda, içecek, giysi veya eşyayı dikkatle tespit et.${queryText ? ` (Kullanıcı ipucu: "${queryText}")` : ''}` : `1. Kullanıcının sorduğu "${queryText}" ürününü analiz et.`}
2. KRİTİK KURAL - TEKİL PORSİYON / ADET:
   Asla 1000 kg'lık fabrika rakamları verme!
   Kullanıcının tabağında yediği, bardağında içtiği veya üzerine giydiği **TEK 1 ADET / TEK 1 PORSİYON / TEK 1 DİLİM** için gerçekçi sanal su ayak izini (Litre) hesapla.
   Gerçekçi tekil porsiyon referansları:
   - 1 dilim ekmek: ~40 L
   - 1 dilim kaşar peyniri: ~152 L
   - 1 adet yumurta: ~196 L
   - 1 porsiyon dana biftek: ~2.310 L
   - 1 adet ızgara köfte: ~615 L
   - 1 adet dana burger: ~2.100 L
   - 1 porsiyon tavuk but/fileto: ~650 L
   - 1 kase mercimek çorbası: ~180 L
   - 1 fincan kahve: ~140 L
   - 1 bardak Türk çayı: ~30 L
   - 1 bardak süt: ~204 L
   - 1 adet elma: ~125 L
   - 1 adet muz: ~95 L
   - 1 adet pamuklu tişört: ~2.200 L
   - 1 adet keten gömlek: ~1.200 L
   - 1 adet kot pantolon: ~7.800 L
   - 1 çift spor ayakkabı: ~3.800 L
   - 1 adet akıllı telefon: ~12.760 L
   - 1 adet yaprak kağıt: ~10 L
3. Yeşil Su (Yağmur suyu), Mavi Su (Sulama ve şebeke suyu), Gri Su (Arıtma ve kirlilik seyreltme suyu) dağılımını hesapla (Yeşil + Mavi + Gri = Toplam).
4. Bu suyun neden harcandığını kullanıcının anlayacağı samimi, bilimsel Türkçe ile açıkla.
5. Tedarik zincirindeki 3 temel su harcayan aşamayı yaz.
6. Gerçekçi bir tasarruf / alternatif tavsiyesi (Eco-swap).

Yanıtı SADECE ve KESİNLİKLE aşağıdaki geçerli JSON formatında döndür:
{
  "itemName": string (Örn: "Dana Burger (1 Adet)" veya "Mercimek Çorbası (1 Kase)"),
  "totalLiters": number,
  "greenWater": number,
  "blueWater": number,
  "greyWater": number,
  "confidence": "Yüksek" | "Orta" | "Tahmini",
  "explanation": string,
  "supplyChainKeyFactors": string[],
  "recommendedEcoSwap": string,
  "showerEquivalent": number
}`;

  const contents: any[] = [];
  if (hasImage) {
    let rawBase64 = image.data;
    let mimeType = image.mimeType || 'image/jpeg';
    if (rawBase64.includes(';base64,')) {
      const parts = rawBase64.split(';base64,');
      const mimeMatch = parts[0].match(/data:(.*?)$/);
      if (mimeMatch) mimeType = mimeMatch[1];
      rawBase64 = parts[1];
    }
    // Clean up any stray whitespaces or newlines
    rawBase64 = rawBase64.replace(/\s+/g, '');

    contents.push({
      inlineData: {
        mimeType,
        data: rawBase64
      }
    });
  }
  contents.push(prompt);

  // Try models with cascading fallback to eliminate 503 high-demand errors
  let lastError: any = null;
  for (const modelName of MODEL_CASCADE) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const responseText = response.text || '';
      const parsed = cleanAndParseJson(responseText);

      if (parsed && typeof parsed.totalLiters === 'number' && parsed.totalLiters > 0) {
        parsed.showerEquivalent = Math.max(1, Math.round(parsed.totalLiters / 80));
        return res.json(parsed);
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`Model ${modelName} call failed, trying next model in cascade:`, err?.status, err?.message?.slice(0, 100));
      // Short delay before next model
      await new Promise(r => setTimeout(r, 200));
    }
  }

  console.error('All Gemini cascade models failed, using smart calibrated fallback:', lastError?.message);
  return res.json(getSmartSingleItemFallback(queryText));
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
