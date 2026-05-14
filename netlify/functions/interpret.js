import { GoogleGenerativeAI } from '@google/generative-ai';
import { Resend } from 'resend';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);
const OWNER_EMAIL = process.env.OWNER_EMAIL;

const prompts = {
  ua: (name, a) => `Ти — мудрий і теплий друг, який добре розуміється на психології. Ти проводиш проєктивну техніку "Куб у пустелі" для ${name} і хочеш допомогти їй/йому краще зрозуміти свій поточний емоційний стан і що з ним робити.

Символіка (дотримуйся чітко):
- Пустеля = загальний емоційний фон і відчуття свого життя зараз
- Куб = образ себе: розмір = самооцінка, матеріал і колір = характер захисту, прозорість = відкритість, положення = стабільність
- Драбина = друзі та близькі: її стан і розташування = якість цих стосунків зараз
- Кінь = романтичний партнер або бажаний партнер або просто важлива людина в житті: його стан, поведінка і відстань = стан цих стосунків або бажань
- Квіти = мрії, плани, надії: кількість, стан і розташування = наскільки вони живі і доступні зараз
- Шторм = поточні труднощі і стрес: відстань і сила = наскільки гостро відчувається тиск

Відповіді ${name}:
- Пустеля: ${a.desert}
- Куб: ${a.cube}
- Драбина: ${a.ladder}
- Кінь: ${a.horse}
- Квіти: ${a.flowers}
- Шторм: ${a.storm}

Напиши відповідь українською, звертаючись до ${name} на "ти". Говори тепло, м'яко і з повагою — як близька людина, а не як психолог на прийомі. Не аналізуй особистість — відображай поточний стан і настрій. Визнай те що важко, але обов'язково знайди і назви те що сильне і світле в картині. Суцільний живий текст без списків, 3–4 абзаци.`,

  en: (name, a) => `You are a warm and wise friend who understands people well. You're doing the "Cube in the Desert" projective exercise with ${name} and want to help them understand their current emotional state and what they should do with that

Symbolism (follow strictly):
- Desert = overall emotional tone and how life feels right now
- Cube = self-image: size = self-esteem, material and color = nature of self-protection, transparency = openness, position = stability
- Ladder = friends and close ones: its condition and position = quality of these relationships now
- Horse = romantic partner or desired partner: condition, behavior and distance = state of that relationship or longing
- Flowers = dreams, plans, hopes: quantity, condition and position = how alive and reachable they feel now
- Storm = current difficulties and stress: distance and strength = how acute the pressure feels

${name}'s answers:
- Desert: ${a.desert}
- Cube: ${a.cube}
- Ladder: ${a.ladder}
- Horse: ${a.horse}
- Flowers: ${a.flowers}
- Storm: ${a.storm}

Write in English, addressing ${name} warmly as a friend. Be gentle and kind — not like a therapist, but like someone who truly cares. Acknowledge what's hard, but always find and name what's strong and beautiful in the picture. Flowing prose, no lists, 3–4 paragraphs.`,
};

const stepTitles = {
  ua: { desert:'Пустеля', cube:'Куб', ladder:'Драбина', horse:'Кінь', flowers:'Квіти', storm:'Шторм' },
  en:  { desert:'Desert',  cube:'Cube', ladder:'Ladder', horse:'Horse', flowers:'Flowers', storm:'Storm' },
};

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let body;
  try { body = JSON.parse(event.body); }
  catch { return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) }; }

  const { name, lang, answers } = body;
  if (!name || !lang || !answers) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing fields' }) };
  }

  try {
    // 1. Gemini інтерпретація
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });
    const result = await model.generateContent(prompts[lang](name, answers));
    const interpretation = result.response.text();

    // 2. Відправка імейлу
    if (OWNER_EMAIL && process.env.RESEND_API_KEY) {
      const titles = stepTitles[lang];
      const answersHtml = Object.entries(answers)
        .map(([key, val]) => `<p><strong>${titles[key]}:</strong><br/>${val}</p>`)
        .join('');

      await resend.emails.send({
        from: 'Cube in Desert <onboarding@resend.dev>',
        to: OWNER_EMAIL,
        subject: `Новий результат — ${name}`,
        html: `
          <h2>🏜 Куб у пустелі — новий результат</h2>
          <p><strong>Ім'я:</strong> ${name}</p>
          <p><strong>Мова:</strong> ${lang === 'ua' ? 'Українська' : 'English'}</p>
          <hr/>
          <h3>Відповіді:</h3>
          ${answersHtml}
          <hr/>
          <h3>Інтерпретація:</h3>
          <p>${interpretation.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>')}</p>
        `,
      });
    }

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
