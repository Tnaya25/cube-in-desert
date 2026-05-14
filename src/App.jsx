import { useState, useEffect, useRef } from "react";

const T = {
  ua: {
    introTitle: "Куб у пустелі",
    introSub: "проєктивна техніка",
    introText: "Це уявна подорож через шість образів, кожен з яких відображає щось реальне у твоєму внутрішньому світі. Немає правильних чи неправильних відповідей — є лише твоя унікальна картина. Після того як ти опишеш усе що бачиш, ти отримаєш особисту інтерпретацію свого стану.",
    introNote: "Зазвичай займає 5–10 хвилин. Краще в тиші.",
    startBtn: "Почати",
    nameTitle: "Як до тебе звертатись?",
    namePlaceholder: "Твоє ім'я або псевдонім",
    nameBtn: "Далі →",
    backLang: "Мова",
    step: "Крок", of: "з",
    nextBtn: "Далі →", finishBtn: "Завершити",
    ctrlEnter: "Ctrl+Enter — далі",
    loadingText: "Читаю твою картину...",
    resultTitle: "Твій простір",
    restartBtn: "Пройти ще раз",
    errorText: "Щось пішло не так. Спробуй ще раз.",
    steps: [
      { id:"desert", element:"🏜", title:"Пустеля",
        prompt:"Заплющ очі на мить. Уяви безкрайню пустелю. Відчуй пісок, тишу, простір.",
        question:"Як виглядає твоя пустеля? Яка вона — велика чи мала, світла чи похмура, тепла чи холодна? Що ти відчуваєш, стоячи в ній?",
        hint:"Атмосфера, колір неба, пісок, відчуття простору..." },
      { id:"cube", element:"🟫", title:"Куб",
        prompt:"У цій пустелі з'являється куб.",
        question:"Де він стоїть? Який за розміром? З чого зроблений — метал, дерево, скло, камінь? Якого кольору? Порожній чи суцільний? Прозорий чи ні?",
        hint:"Матеріал, розмір, розташування — всі деталі важливі..." },
      { id:"ladder", element:"🪜", title:"Драбина",
        prompt:"Поруч із кубом з'являється драбина.",
        question:"Де вона? Спирається на куб, лежить поруч чи стоїть окремо? З чого зроблена? Довга чи коротка?",
        hint:"Де вона знаходиться відносно куба?" },
      { id:"horse", element:"🐴", title:"Кінь",
        prompt:"У цю пустелю приходить кінь.",
        question:"Де він? Якого кольору та розміру? Осідланий чи вільний? Що він робить — стоїть, іде, дивиться на тебе?",
        hint:"Опиши поведінку і характер коня..." },
      { id:"flowers", element:"🌸", title:"Квіти",
        prompt:"Десь у цій пустелі є квіти.",
        question:"Де вони ростуть? Скільки їх? Яскраві чи блякнуть? Де відносно куба та коня?",
        hint:"Один кущ чи безліч? Близько чи далеко?" },
      { id:"storm", element:"⛈", title:"Шторм",
        prompt:"Десь у цьому просторі є шторм.",
        question:"Де він? Далеко чи близько? Наближається чи іде? Сильний чи тихий? Як впливає на куб, коня, квіти?",
        hint:"Шторм у пустелі чи на горизонті?" },
    ],
  },
  en: {
    introTitle: "The Cube in the Desert",
    introSub: "a projective technique",
    introText: "This is an imaginary journey through six symbols, each reflecting something real in your inner world. There are no right or wrong answers — only your unique picture. After you describe what you see, you'll receive a personal interpretation of your current state.",
    introNote: "Usually takes 5–10 minutes. Best done in silence.",
    startBtn: "Begin",
    nameTitle: "What should I call you?",
    namePlaceholder: "Your name or nickname",
    nameBtn: "Continue →",
    backLang: "Language",
    step: "Step", of: "of",
    nextBtn: "Next →", finishBtn: "Finish",
    ctrlEnter: "Ctrl+Enter to continue",
    loadingText: "Reading your picture...",
    resultTitle: "Your Space",
    restartBtn: "Take the test again",
    errorText: "Something went wrong. Please try again.",
    steps: [
      { id:"desert", element:"🏜", title:"The Desert",
        prompt:"Close your eyes for a moment. Imagine a vast desert. Feel the sand, the silence, the space.",
        question:"What does your desert look like? Large or small, bright or gloomy, warm or cold? What do you feel standing in it?",
        hint:"Atmosphere, sky color, sand, the sense of space..." },
      { id:"cube", element:"🟫", title:"The Cube",
        prompt:"A cube appears in this desert.",
        question:"Where does it stand? How large is it? What is it made of — metal, wood, glass, stone? What color? Hollow or solid? Transparent or opaque?",
        hint:"Material, size, position — all details matter..." },
      { id:"ladder", element:"🪜", title:"The Ladder",
        prompt:"A ladder appears near the cube.",
        question:"Where is it? Leaning against the cube, lying nearby, or standing apart? What is it made of? Long or short?",
        hint:"Where is it relative to the cube?" },
      { id:"horse", element:"🐴", title:"The Horse",
        prompt:"A horse comes into this desert.",
        question:"Where is it? What color and size? Saddled or free? What is it doing — standing, walking, looking at you?",
        hint:"Describe the horse's behavior and character..." },
      { id:"flowers", element:"🌸", title:"The Flowers",
        prompt:"Somewhere in this desert there are flowers.",
        question:"Where do they grow? How many? Vivid or faded? Where are they relative to the cube and horse?",
        hint:"One cluster or many? Close or far away?" },
      { id:"storm", element:"⛈", title:"The Storm",
        prompt:"Somewhere in this space there is a storm.",
        question:"Where is it? Near or far? Approaching or moving away? Strong or quiet? How does it affect the cube, horse, flowers?",
        hint:"Storm in the desert or on the horizon?" },
    ],
  },
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Jost:wght@300;400&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes drift  { from{transform:translateY(0) translateX(0)} to{transform:translateY(-26px) translateX(12px)} }
  @keyframes pulse  { 0%,100%{opacity:.45} 50%{opacity:.95} }
  @keyframes spin   { to{transform:rotate(360deg)} }
  .fade { animation: fadeUp .55s ease both; }
  textarea, input[type=text] {
    display: block; width: 100%;
    background: rgba(255,248,230,.07);
    border: 1px solid rgba(255,200,100,.22);
    border-radius: 12px; color: #f0ddb8;
    font-family: 'Jost', sans-serif; font-weight: 300;
    font-size: 15px; line-height: 1.75; padding: 14px 18px;
    resize: none; outline: none; transition: border-color .3s, background .3s;
  }
  textarea:focus, input[type=text]:focus {
    border-color: rgba(255,175,55,.55); background: rgba(255,248,230,.11);
  }
  textarea::placeholder, input[type=text]::placeholder { color: rgba(240,221,184,.28); }
  button { cursor: pointer; font-family: 'Jost', sans-serif; transition: opacity .2s; }
  button:disabled { opacity: .3; cursor: default; }
`;

export default function App() {
  const [lang, setLang]       = useState(null);
  const [phase, setPhase]     = useState("lang");
  const [userName, setName]   = useState("");
  const [stepIdx, setStep]    = useState(0);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState("");
  const [result, setResult]   = useState("");
  const [error, setError]     = useState("");
  const inputRef = useRef(null);

  const [dots] = useState(() =>
    Array.from({length:20}, (_, i) => ({
      id: i, x: Math.random()*100, y: Math.random()*100,
      s: Math.random()*2.5+1, d: Math.random()*9+7, dl: Math.random()*6,
    }))
  );

  const t = T[lang] || T.ua;
  const steps = t.steps;
  const s = steps[stepIdx];

  useEffect(() => {
    if (["test","name"].includes(phase) && inputRef.current) inputRef.current.focus();
  }, [phase, stepIdx]);

  const go = (p) => setPhase(p);

  const handleNext = () => {
    const upd = { ...answers, [s.id]: current };
    setAnswers(upd);
    setCurrent("");
    if (stepIdx < steps.length - 1) { setStep(stepIdx + 1); }
    else { go("loading"); fetchResult(upd); }
  };

  const fetchResult = async (all) => {
    setError("");
    try {
      const res = await fetch("/api/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: userName, lang, answers: all }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Server error");
      setResult(data.interpretation);
      go("result");
    } catch (err) {
      setError(err.message);
      go("result");
    }
  };

  const restart = () => {
    setPhase("intro"); setStep(0); setAnswers({});
    setCurrent(""); setResult(""); setError(""); setName("");
  };

  const progress = (stepIdx / steps.length) * 100;

  const wrap = { minHeight:"100vh", background:"linear-gradient(148deg,#100800 0%,#1c0e03 40%,#271306 70%,#130900 100%)", fontFamily:"'Jost',sans-serif", fontWeight:300, color:"#f0ddb8", position:"relative", overflow:"hidden" };
  const center = { position:"relative", zIndex:1, maxWidth:"600px", margin:"0 auto", padding:"clamp(32px,8vh,64px) 24px", minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"center" };
  const card = { background:"rgba(255,245,215,.055)", backdropFilter:"blur(14px)", border:"1px solid rgba(255,205,115,.13)", borderRadius:"22px", padding:"28px 30px" };
  const btnPrimary = { padding:"13px 30px", background:"linear-gradient(135deg,#ad6010,#d49030)", border:"none", borderRadius:"11px", color:"#140800", fontSize:"14px", fontWeight:400, letterSpacing:".06em" };
  const btnGhost = { padding:"12px 22px", background:"transparent", border:"1px solid rgba(255,195,95,.2)", borderRadius:"11px", color:"rgba(240,221,184,.5)", fontSize:"13px", letterSpacing:".05em" };

  return (
    <div style={wrap}>
      <style>{css}</style>
      {dots.map(p => (
        <div key={p.id} style={{ position:"fixed", left:`${p.x}%`, top:`${p.y}%`, width:`${p.s}px`, height:`${p.s}px`, borderRadius:"50%", background:"rgba(255,195,100,.28)", animation:`drift ${p.d}s ${p.dl}s ease-in-out infinite alternate`, pointerEvents:"none", zIndex:0 }}/>
      ))}
      <div style={center}>

        {phase === "lang" && (
          <div className="fade" style={{textAlign:"center"}}>
            <div style={{fontSize:"54px",marginBottom:"20px",animation:"pulse 3s infinite"}}>🏜</div>
            <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"30px",fontWeight:300,color:"#e0c068",letterSpacing:".06em",marginBottom:"6px"}}>Cube in the Desert</h1>
            <p style={{opacity:.35,fontSize:"12px",letterSpacing:".18em",textTransform:"uppercase",marginBottom:"44px"}}>Куб у пустелі</p>
            <div style={{display:"flex",gap:"14px",justifyContent:"center",flexWrap:"wrap"}}>
              {[["ua","🇺🇦 Українська"],["en","🇬🇧 English"]].map(([l,label]) => (
                <button key={l} onClick={() => { setLang(l); go("intro"); }} style={{...btnPrimary,fontSize:"15px",padding:"15px 28px"}}>{label}</button>
              ))}
            </div>
          </div>
        )}

        {phase === "intro" && (
          <div className="fade">
            <div style={{textAlign:"center",marginBottom:"36px"}}>
              <div style={{fontSize:"46px",marginBottom:"14px",animation:"pulse 3s infinite"}}>🏜</div>
              <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"28px",fontWeight:300,color:"#e0c068",letterSpacing:".06em",marginBottom:"6px"}}>{t.introTitle}</h1>
              <p style={{opacity:.35,fontSize:"11px",letterSpacing:".18em",textTransform:"uppercase"}}>{t.introSub}</p>
            </div>
            <div style={{...card,marginBottom:"26px"}}>
              <p style={{lineHeight:1.85,opacity:.82,marginBottom:"14px",fontSize:"15px"}}>{t.introText}</p>
              <p style={{fontSize:"13px",opacity:.4,fontStyle:"italic"}}>{t.introNote}</p>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <button onClick={() => go("lang")} style={btnGhost}>← {t.backLang}</button>
              <button onClick={() => go("name")} style={btnPrimary}>{t.startBtn}</button>
            </div>
          </div>
        )}

        {phase === "name" && (
          <div className="fade">
            <div style={{textAlign:"center",marginBottom:"32px"}}>
              <div style={{fontSize:"32px",marginBottom:"12px"}}>✦</div>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"24px",fontWeight:300,color:"#e0c068",letterSpacing:".05em"}}>{t.nameTitle}</h2>
            </div>
            <input ref={inputRef} type="text" placeholder={t.namePlaceholder} value={userName}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => { if (e.key==="Enter" && userName.trim()) go("test"); }}
              style={{marginBottom:"18px"}} />
            <div style={{display:"flex",justifyContent:"flex-end"}}>
              <button onClick={() => go("test")} disabled={!userName.trim()} style={btnPrimary}>{t.nameBtn}</button>
            </div>
          </div>
        )}

        {phase === "test" && (
          <div className="fade" key={stepIdx}>
            <div style={{marginBottom:"32px"}}>
              <div style={{display:"flex",justifyContent:"space-between",opacity:.38,fontSize:"11px",letterSpacing:".1em",marginBottom:"8px"}}>
                <span>{t.step} {stepIdx+1} {t.of} {steps.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div style={{height:"1px",background:"rgba(255,195,95,.1)"}}>
                <div style={{height:"100%",width:`${progress}%`,background:"linear-gradient(90deg,#ad6010,#d49030)",transition:"width .5s ease"}}/>
              </div>
            </div>
            <div style={{textAlign:"center",marginBottom:"26px"}}>
              <div style={{fontSize:"38px",marginBottom:"10px"}}>{s.element}</div>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"26px",fontWeight:300,color:"#e0c068",letterSpacing:".06em"}}>{s.title}</h2>
            </div>
            <div style={{...card,padding:"16px 22px",marginBottom:"18px",borderColor:"rgba(255,200,100,.09)"}}>
              <p style={{opacity:.6,fontStyle:"italic",fontSize:"14px",lineHeight:1.7}}>{s.prompt}</p>
            </div>
            <p style={{lineHeight:1.82,marginBottom:"14px",fontSize:"15px"}}>{s.question}</p>
            <textarea ref={inputRef} rows={5} placeholder={s.hint} value={current}
              onChange={e => setCurrent(e.target.value)}
              onKeyDown={e => { if (e.key==="Enter" && (e.metaKey||e.ctrlKey) && current.trim().length>3) handleNext(); }} />
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"14px"}}>
              <span style={{fontSize:"11px",opacity:.28,letterSpacing:".05em"}}>{t.ctrlEnter}</span>
              <button onClick={handleNext} disabled={current.trim().length < 3} style={btnPrimary}>
                {stepIdx < steps.length-1 ? t.nextBtn : t.finishBtn}
              </button>
            </div>
          </div>
        )}

        {phase === "loading" && (
          <div className="fade" style={{textAlign:"center"}}>
            <div style={{width:"44px",height:"44px",border:"1px solid rgba(255,175,55,.3)",borderTop:"1px solid #d49030",borderRadius:"50%",margin:"0 auto 22px",animation:"spin 1.4s linear infinite"}}/>
            <p style={{opacity:.45,letterSpacing:".1em",fontSize:"14px"}}>{t.loadingText}</p>
          </div>
        )}

        {phase === "result" && (
          <div className="fade">
            <div style={{textAlign:"center",marginBottom:"32px"}}>
              <div style={{fontSize:"38px",marginBottom:"12px"}}>🏜</div>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"24px",fontWeight:300,color:"#e0c068",letterSpacing:".08em"}}>{t.resultTitle}</h2>
              {userName && <p style={{opacity:.35,fontSize:"13px",marginTop:"5px"}}>{userName}</p>}
            </div>
            <div style={{...card,marginBottom:"22px",lineHeight:1.9,fontSize:"15px"}}>
              {error ? (
                <p style={{opacity:.6,color:"#e08070"}}>{t.errorText}<br/><span style={{fontSize:"12px",opacity:.6}}>{error}</span></p>
              ) : result ? (
                result.split("\n\n").map((para, i) => (
                  <p key={i} style={{marginBottom:"16px",opacity:.88}}>{para}</p>
                ))
              ) : <p style={{opacity:.3,fontStyle:"italic"}}>—</p>}
            </div>
            <button onClick={restart} style={{...btnGhost,width:"100%",padding:"13px",textAlign:"center"}}>{t.restartBtn}</button>
          </div>
        )}

      </div>
    </div>
  );
}
