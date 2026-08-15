/* ==========================================================================
   CALLAN COACH — BIBLIOTECA DE IMAGENS LOCAIS (SVG)
   Ilustrações simples e educativas, 100% locais (sem URLs externas,
   sem imagens com direitos autorais de terceiros). Usadas apenas quando
   ajudam a entender a pergunta (posição, objetos) — nunca decorativas.
   ========================================================================== */

const IMAGE_LIBRARY = {
  position: {
    on: {
      alt: "Uma caneta em cima de um livro",
      svg: `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="70" width="120" height="14" rx="2" fill="var(--accent-2)"/>
        <rect x="55" y="52" width="70" height="16" rx="3" fill="#fff" stroke="var(--navy)" stroke-width="2"/>
        <line x1="90" y1="58" x2="118" y2="30" stroke="var(--navy)" stroke-width="4" stroke-linecap="round"/>
      </svg>`,
    },
    under: {
      alt: "Uma caneta embaixo de um livro",
      svg: `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg">
        <rect x="55" y="35" width="70" height="16" rx="3" fill="#fff" stroke="var(--navy)" stroke-width="2"/>
        <line x1="30" y1="80" x2="60" y2="80" stroke="var(--navy)" stroke-width="4" stroke-linecap="round"/>
      </svg>`,
    },
    in: {
      alt: "Um objeto dentro de uma caixa",
      svg: `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg">
        <rect x="30" y="40" width="100" height="60" rx="4" fill="#fff" stroke="var(--navy)" stroke-width="3"/>
        <circle cx="80" cy="70" r="14" fill="var(--accent-2)"/>
      </svg>`,
    },
    behind: {
      alt: "Uma pessoa atrás de uma casa",
      svg: `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg">
        <polygon points="50,60 90,30 130,60 130,100 50,100" fill="#fff" stroke="var(--navy)" stroke-width="3"/>
        <circle cx="100" cy="55" r="8" fill="var(--accent)"/>
        <rect x="94" y="63" width="12" height="20" fill="var(--accent)"/>
      </svg>`,
    },
    "in front of": {
      alt: "Uma pessoa na frente de uma casa",
      svg: `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg">
        <polygon points="40,60 80,30 120,60 120,100 40,100" fill="#fff" stroke="var(--navy)" stroke-width="3"/>
        <circle cx="80" cy="90" r="9" fill="var(--accent)"/>
        <rect x="72" y="99" width="16" height="20" fill="var(--accent)"/>
      </svg>`,
    },
    "next to": {
      alt: "Duas cadeiras lado a lado",
      svg: `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg">
        <rect x="30" y="50" width="30" height="40" rx="3" fill="#fff" stroke="var(--navy)" stroke-width="3"/>
        <rect x="70" y="50" width="30" height="40" rx="3" fill="#fff" stroke="var(--accent-2)" stroke-width="3"/>
      </svg>`,
    },
    between: {
      alt: "Um objeto entre dois outros",
      svg: `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="50" width="24" height="40" fill="var(--navy)"/>
        <rect x="116" y="50" width="24" height="40" fill="var(--navy)"/>
        <circle cx="80" cy="70" r="14" fill="var(--accent-2)"/>
      </svg>`,
    },
    above: {
      alt: "Uma bola acima de uma caixa",
      svg: `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg">
        <rect x="55" y="70" width="50" height="35" fill="#fff" stroke="var(--navy)" stroke-width="3"/>
        <circle cx="80" cy="40" r="16" fill="var(--accent-2)"/>
      </svg>`,
    },
    below: {
      alt: "Uma bola abaixo de uma mesa",
      svg: `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg">
        <rect x="30" y="35" width="100" height="10" fill="var(--navy)"/>
        <circle cx="80" cy="80" r="14" fill="var(--accent-2)"/>
      </svg>`,
    },
  },
  object: {
    table: {
      alt: "Uma mesa",
      svg: `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="45" width="120" height="12" fill="var(--navy)"/>
        <rect x="28" y="57" width="8" height="35" fill="var(--navy)"/>
        <rect x="124" y="57" width="8" height="35" fill="var(--navy)"/>
      </svg>`,
    },
    picture: {
      alt: "Um quadro na parede",
      svg: `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg">
        <rect x="45" y="20" width="70" height="55" fill="#fff" stroke="var(--navy)" stroke-width="4"/>
        <circle cx="65" cy="55" r="8" fill="var(--accent-2)"/>
        <polygon points="50,70 75,45 110,70" fill="var(--blue)"/>
      </svg>`,
    },
    light: {
      alt: "Uma luz no teto",
      svg: `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg">
        <line x1="80" y1="10" x2="80" y2="35" stroke="var(--navy)" stroke-width="3"/>
        <circle cx="80" cy="50" r="18" fill="#ffe27a" stroke="var(--navy)" stroke-width="2"/>
      </svg>`,
    },
    book: {
      alt: "Um livro",
      svg: `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg">
        <rect x="45" y="35" width="70" height="50" rx="3" fill="#fff" stroke="var(--navy)" stroke-width="3"/>
        <line x1="80" y1="35" x2="80" y2="85" stroke="var(--navy)" stroke-width="2"/>
      </svg>`,
    },
    door: {
      alt: "Uma porta",
      svg: `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg">
        <rect x="55" y="20" width="50" height="80" rx="2" fill="#fff" stroke="var(--navy)" stroke-width="3"/>
        <circle cx="95" cy="62" r="3" fill="var(--accent)"/>
      </svg>`,
    },
  },
};

function getQuestionImage(question) {
  if (!question.imageType || !question.imageKey) return null;
  return IMAGE_LIBRARY[question.imageType]?.[question.imageKey] || null;
}
