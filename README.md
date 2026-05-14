# 🏜 Куб у пустелі / Cube in the Desert

Проєктивний психологічний тест з AI-інтерпретацією.

---

## Деплой за 15 хвилин

### Крок 1 — GitHub

1. Зайди на [github.com](https://github.com) → увійди або зареєструйся
2. Натисни **New repository** (кнопка `+` вгорі справа)
3. Назви репозиторій: `cube-in-desert`
4. Залиш **Public**, натисни **Create repository**
5. Завантаж всі файли цього проєкту:
   - Натисни **uploading an existing file**
   - Перетягни всю папку `cube-in-desert` або завантаж файли по одному
   - Натисни **Commit changes**

---

### Крок 2 — API ключі

**Anthropic (Claude):**
1. Зайди на [console.anthropic.com](https://console.anthropic.com)
2. Settings → API Keys → **Create Key**
3. Скопіюй ключ (починається з `sk-ant-`)

**Resend (імейли):**
1. Зайди на [resend.com](https://resend.com) → безкоштовна реєстрація
2. API Keys → **Create API Key**
3. Скопіюй ключ (починається з `re_`)

---

### Крок 3 — Vercel

1. Зайди на [vercel.com](https://vercel.com) → **Continue with GitHub**
2. Натисни **Add New → Project**
3. Знайди репозиторій `cube-in-desert` → **Import**
4. Перед деплоєм натисни **Environment Variables** і додай три змінні:

   | Name | Value |
   |------|-------|
   | `ANTHROPIC_API_KEY` | `sk-ant-...` |
   | `RESEND_API_KEY` | `re_...` |
   | `OWNER_EMAIL` | `твій@email.com` |

5. Натисни **Deploy**
6. Через хвилину отримаєш посилання типу `cube-in-desert-xxx.vercel.app` 🎉

---

## Локальний запуск (для тестування)

```bash
npm install
cp .env.example .env
# заповни .env своїми ключами
npm run dev
```

Відкрий [http://localhost:5173](http://localhost:5173)

---

## Структура проєкту

```
cube-in-desert/
├── api/
│   └── interpret.js     ← серверна функція (Claude + email)
├── src/
│   ├── App.jsx           ← весь UI (UA + EN)
│   └── main.jsx
├── public/
│   └── favicon.svg
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
└── .env.example
```
