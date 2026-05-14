import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const prompts = {
  ua: (name, a) => `Ти — мудрий і теплий друг, який добре розуміється на психології. Ти проводиш проєктивну техніку "Куб у пустелі" для ${name} і хочеш допомогти їй/йому краще зрозуміти свій поточний емоційний стан.

Символіка: Пустеля = відчуття свого життєвого простору зараз. Куб = образ себе. Драбина = близькі стосунки. Кінь = партнер або відчуття свободи. Квіти = те що приносить радість і ніжність. Шторм = поточні труднощі або тривога.

Відповіді ${name}:
- Пустеля: ${a.desert}
- Куб: ${a.cube}
- Драбина: ${a.ladder}
- Кінь: ${a.horse}
- Квіти: ${a.flowers}
- Шторм: ${a.storm}

Напиши відповідь українською, звертаючись до ${name} на "ти". Говори тепло, м'яко і з повагою — як близька людина, а не як психолог на прийомі. Не аналізуй особистість — відображай поточний стан і настрій. Не роби висновків про характер людини. Визнай те що важко, але обов'язково знайди і назви те що сильне і світле в картині. Суцільний живий текст без списків, 3–4 абзаци.`,

  en: (name, a) => `You are a warm and wise friend who understands people well. You're doing the "Cube in the Desert" projective exercise with ${name} and want to help them understand their current emotional state.

Symbolism: Desert = how life feels right now. Cube = sense of self. Ladder = close relationships. Horse = partner or sense of freedom. Flowers = what brings joy and tenderness. Storm = current difficulties or anxiety.

${name}'s answers:
- Desert: ${a.desert}
- Cube: ${a.cube}
- Ladder: ${a.ladder}
- Horse: ${a.horse}
- Flowers: ${a.flowers}
- Storm: ${a.storm}

Write in English, addressing ${name} warmly as a friend. Be gentle and kind — not like a therapist, but like someone who truly cares. Don't analyze their personality — reflect their current mood and state. Acknowledge what's hard, but always find and name what's strong and beautiful in the picture. Flowing prose, no lists, 3–4 paragraphs.`,
};
export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { name, lang, answers } = body;
  if (!name || !lang || !answers) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing fields' }) };
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });
    const result = await model.generateContent(prompts[lang](name, answers));
    const interpretation = result.response.text();
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ interpretation }),
    };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
