import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const prompts = {
  ua: (name, a) => `Ти — глибокий психолог, що проводить проєктивний тест "Куб у пустелі" для ${name}. Інтерпретуй кожен елемент і дай цілісне психологічне відображення поточного внутрішнього стану.

Символіка: Пустеля = сприйняття свого життєвого простору. Куб = образ себе. Драбина = стосунки з близькими. Кінь = партнер або свобода. Квіти = радість, творчість. Шторм = стрес і труднощі.

Відповіді ${name}:
- Пустеля: ${a.desert}
- Куб: ${a.cube}
- Драбина: ${a.ladder}
- Кінь: ${a.horse}
- Квіти: ${a.flowers}
- Шторм: ${a.storm}

Пиши українською. Звертайся до ${name}. Тон — тихий, поважний, без жаргону. Не діагностуй — відображай. Суцільний живий текст, без списків і підзаголовків, 3–5 абзаців. Починай з найбільш відчутного спостереження.`,

  en: (name, a) => `You are a thoughtful psychologist conducting the "Cube in the Desert" projective test for ${name}. Interpret each element and give a holistic psychological reflection of their current inner state.

Symbolism: Desert = perception of life space. Cube = self-image. Ladder = close relationships. Horse = partner or freedom. Flowers = joy, creativity. Storm = stress and difficulties.

${name}'s answers:
- Desert: ${a.desert}
- Cube: ${a.cube}
- Ladder: ${a.ladder}
- Horse: ${a.horse}
- Flowers: ${a.flowers}
- Storm: ${a.storm}

Write in English. Address ${name} by name. Tone — quiet, respectful, no jargon. Don't diagnose — reflect. Flowing prose, no lists or headers, 3–5 paragraphs. Start with the most striking observation.`,
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, lang, answers } = req.body;
  if (!name || !lang || !answers) return res.status(400).json({ error: 'Missing fields' });

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompts[lang](name, answers));
    const interpretation = result.response.text();
    return res.status(200).json({ interpretation });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
