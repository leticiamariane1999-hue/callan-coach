/* ==========================================================================
   CALLAN COACH — REAL COURSE DATA
   ==========================================================================
   Fonte: materiais Callan Method enviados pelo usuário (PDFs).
   - Stage 2 (Lessons 10–24): extraído com alta confiança do texto do PDF
     "Vocabulary Books — Stage 2: Lessons 10–24" (2012 edition).
   - Stage 1 (Lessons 1–2) e Stage 3 (1 lição de amostra): o PDF do
     "Student's Book" tem o conteúdo principal das lições como imagem/vetor
     (sem camada de texto confiável), então essas lições foram transcritas
     manualmente a partir da inspeção visual das páginas — 100% reais,
     porém é apenas uma AMOSTRA, não o livro completo.
   - Tudo o que não está aqui aparece marcado precisa_import: true e pode
     ser completado pela tela "Importar Conteúdo".
   NADA aqui foi inventado. Onde o número exato da lição não pôde ser
   confirmado, o campo needsVerification está true.
   ========================================================================== */

const REAL_COURSE_DATA = {
  1: {
    title: "Stage 1",
    lessons: {
      1: {
        stage: 1, lesson: 1, topic: "Objetos, cores, posição (on/under)",
        vocabulary: ["pen","pencil","book","table","chair","black","white","green","brown","Mr","Mrs"],
        grammar: [],
        questions: [
          q(1,1,"Is the pen in the book?","No, the pen isn't in the book; it's under the book"),
          q(1,1,"Is the pen under the book?","No, the pen isn't under the book; it's on the book"),
          q(1,1,"Is this Anna Brown?","No, it isn't Anna Brown; it's Mr Brown"),
          q(1,1,"Is this Mr Brown?","No, it isn't Mr Brown; it's Mrs Brown"),
          q(1,1,"Is this Mrs Brown?","No, it isn't Mrs Brown; it's Jack Brown"),
          q(1,1,"Is this Jack Brown?","No, it isn't Jack Brown; it's Anna Brown"),
          q(1,1,"Which pencil's black?","This pencil's black"),
          q(1,1,"Which pencil's white?","This pencil's white"),
          q(1,1,"Which book's open?","This book's open"),
          q(1,1,"Which book's closed?","This book's closed"),
        ],
      },
      2: {
        stage: 1, lesson: 2, topic: "Verbo to be (I am / he is / she is)",
        vocabulary: ["I am","you are","he is","she is","it is","Mr","Mrs"],
        grammar: ["I am / I'm — you are / you're — he is / he's — she is / she's — it is / it's",
                   "Negativo: I am not / I'm not — you are not / you aren't — he is not / he isn't"],
        questions: [
          q(1,2,"Is he Mr Brown?","Yes, he's Mr Brown"),
          q(1,2,"Is she Mrs Brown?","Yes, she's Mrs Brown"),
          q(1,2,"Is he Mr Smith?","No, he isn't Mr Smith; he's Mr Brown"),
          q(1,2,"Is she Mr Brown?","No, she isn't Mr Brown; she's Mrs Brown"),
        ],
      },
    },
  },

  2: {
    title: "Stage 2",
    lessons: {
      10: {
        stage: 2, lesson: 10, topic: "Present continuous vs. Present simple",
        vocabulary: ["home","speak","that","remain","Japanese","Chinese","do","does","don't","doesn't"],
        grammar: [
          "Present continuous (now): I am / you are / he-she-it is / we-you-they are + -ing",
          "Present simple (generally): I/you/we/they + verb — he/she/it + verb-s",
        ],
        questions: [
          q(2,10,"Are you speaking English?","Yes, I'm speaking English"),
          q(2,10,"Is he sitting on a chair?","Yes, he's sitting on a chair"),
          q(2,10,"Is she speaking French?","No, she isn't speaking French; she's speaking English"),
          q(2,10,"Are we going home?","No, we aren't going home; we're remaining in the room"),
          q(2,10,"Are they standing behind the house?","No, they aren't standing behind the house; they're standing in front of the house"),
          q(2,10,"What's the difference between the present continuous and the present simple?","The difference between the present continuous and the present simple is that we use the present continuous for an action we are doing now, whereas we use the present simple for an action we do generally"),
          q(2,10,"Does he go home after the lesson?","Yes, he goes home after the lesson"),
          q(2,10,"Is she speaking?","No, she isn't speaking"),
          q(2,10,"Does she speak?","Yes, she speaks"),
        ],
        dictation: "You aren't Mrs Brown; you're Mr Green. I'm Mrs Brown. Six, seven, eight, nine, ten. The women are standing under the light in front of the picture. Where's the house? It's behind her. What am I doing? You're taking the bag from me, closing it, and putting it on the floor. Which door is open? That door is. Eleven, twelve, thirteen, fourteen, fifteen.",
      },
      11: {
        stage: 2, lesson: 11, topic: "can / like / dislike / right-left / half",
        vocabulary: ["about","page","can","like","dislike","cinema","television","right","left","moving","still","completely","wearing","with","half","tell"],
        grammar: [],
        questions: [
          q(2,11,"Can you touch that book?","Yes, I can touch that (or this) book"),
          q(2,11,"Can you read and write?","Yes, I can read and write"),
          q(2,11,"Do you dislike the cinema?","No, I don't dislike the cinema; I like the cinema"),
          q(2,11,"Do you dislike television?","No, I don't dislike television; I like television"),
          q(2,11,"Do you generally sit completely still in the lesson?","No, I don't generally sit completely still in the lesson; I move"),
          q(2,11,"Do we speak with our mouths?","Yes, we speak with our mouths"),
          q(2,11,"How much is half of a hundred?","Fifty is half of a hundred"),
          q(2,11,"How much is half of thirteen?","Six and a half is half of thirteen"),
        ],
      },
      12: {
        stage: 2, lesson: 12, topic: "prefer / both / mean / have not",
        vocabulary: ["Russian","Greek","prefer","tea","coffee","both","mean","hello","goodbye","thank you","language","European","Asian","Germany","haven't"],
        grammar: ["Negativo de have: I have not / I haven't"],
        questions: [
          q(2,12,"Are both my hands on the table?","Yes, both your hands are on the table"),
          q(2,12,"Which is it right to say: \"both us\" or \"both of us\"?","It's right to say \"both of us\""),
          q(2,12,"Is Chinese a European language?","No, Chinese isn't a European language; it's an Asian language"),
          q(2,12,"Is Germany an Asian country?","No, Germany isn't an Asian country; it's a European country"),
          q(2,12,"What's the negative of \"I have\"?","The negative of \"I have\" is \"I have not\""),
          q(2,12,"What's the contraction of \"I have not\"?","The contraction of \"I have not\" is \"I haven't\""),
        ],
      },
      13: {
        stage: 2, lesson: 13, topic: "anybody/somebody/nobody, cannot, quarter, teach/learn",
        vocabulary: ["anybody","somebody","nobody","walk","stand up","sit down","cannot","can't","quarter","teach","learn","Spanish"],
        grammar: ["anybody = pergunta/negativa (não-específico) — somebody = afirmativa — who = específico"],
        questions: [
          q(2,13,"What's the difference between \"anybody\" and \"somebody\"?","The difference between \"anybody\" and \"somebody\" is that we use \"anybody\" in questions and negative sentences, whereas we use \"somebody\" in positive sentences"),
          q(2,13,"Is there anybody sitting on the floor?","No, there isn't anybody sitting on the floor"),
          q(2,13,"Who's in the corridor?","Nobody's in the corridor"),
          q(2,13,"Do you like walking?","Yes, I like walking"),
          q(2,13,"What's the negative of \"can\"?","The negative of \"can\" is \"cannot\""),
          q(2,13,"What's the contraction of \"cannot\"?","The contraction of \"cannot\" is \"can't\""),
          q(2,13,"Can you touch the ceiling?","No, I can't touch the ceiling"),
          q(2,13,"What's a quarter of ten?","Two-and-a-half is a quarter of ten"),
          q(2,13,"Do you like learning a language?","Yes, I like learning a language"),
        ],
      },
      14: {
        stage: 2, lesson: 14, topic: "easy/difficult, married/single, family, kind",
        vocabulary: ["easy","difficult","grammar","married","single","Miss","husband","wife","mother","father","child","children","call","kind"],
        grammar: [],
        questions: [
          q(2,14,"Is English grammar difficult?","No, English grammar isn't difficult; it's easy"),
          q(2,14,"What's the plural of \"child\"?","The plural of \"child\" is \"children\""),
          q(2,14,"What do we call the thing we wear on our heads?","We call the thing we wear on our heads a hat"),
          q(2,14,"What kind of room is this?","It's a classroom"),
        ],
      },
      15: {
        stage: 2, lesson: 15, topic: "Preposições, pontos cardeais, oposto, verbo/substantivo",
        vocabulary: ["preposition","north","south","east","west","cardinal point","opposite","without","verb","noun","translation","during","about"],
        grammar: ["Numa pergunta com 'what/which/where', a preposição vai no final da frase."],
        questions: [
          q(2,15,"Give me some examples of prepositions, please.","Some examples of prepositions are \"on\", \"under\", \"in\" and \"from\""),
          q(2,15,"Tell me the names of the four cardinal points, please.","The names of the four cardinal points are north, south, east and west"),
          q(2,15,"Is Greece west of Italy?","No, Greece isn't west of Italy; it's east of Italy"),
          q(2,15,"What's the opposite of \"high\"?","The opposite of \"high\" is \"low\""),
          q(2,15,"Can we speak without opening our mouths?","No, we can't speak without opening our mouths"),
          q(2,15,"What's the difference between a verb and a noun?","The difference between a verb and a noun is that a verb is a word we use for an action, whereas a noun is the name of a thing"),
        ],
      },
      16: {
        stage: 2, lesson: 16, topic: "some...some, anything/something/nothing, dupla negativa",
        vocabulary: ["anything","something","nothing","front","back","top","bottom","side","smell","address","street"],
        grammar: ["Em inglês só se usa UMA palavra negativa por frase."],
        questions: [
          q(2,16,"Are all the cars in Europe Fords?","No, not all the cars in Europe are Fords; some are Fords and some are Fiats, Renaults, Volkswagens, Volvos etc."),
          q(2,16,"What does this sentence mean: \"I'm not eating nothing\"?","\"I'm not eating nothing\" means \"I'm eating something\""),
          q(2,16,"What do we smell with?","We smell with our noses"),
        ],
      },
      17: {
        stage: 2, lesson: 17, topic: "many/few, into/in, why/because, adjetivos",
        vocabulary: ["many","few","match","matchbox","friend","friendly","into","in","see","such as","why","because","similar","too","second","minute","hour"],
        grammar: ["Em inglês, o adjetivo vem antes do substantivo."],
        questions: [
          q(2,17,"Have you got any friends?","Yes, I've got some friends"),
          q(2,17,"What's the difference between \"into\" and \"in\"?","The difference between \"into\" and \"in\" is that we use \"into\" for a thing that moves from one place to another, and \"in\" for a thing that remains in one place"),
          q(2,17,"How many seconds make a minute?","Sixty seconds make a minute"),
          q(2,17,"In English, do we put an adjective before or after a noun?","In English, we put an adjective before a noun"),
        ],
      },
      18: {
        stage: 2, lesson: 18, topic: "Família, comparativos (more...than), instead of",
        vocabulary: ["food","son","daughter","brother","sister","parents","relatives","uncle","aunt","cousin","break","out of","think","good at","bad at","instead of"],
        grammar: [],
        questions: [
          q(2,18,"Do you like food?","Yes, I like food"),
          q(2,18,"What does the word \"uncle\" mean?","The word \"uncle\" means your mother's brother, or your father's brother"),
          q(2,18,"What does the word \"cousin\" mean?","The word \"cousin\" means your uncle's child, or your aunt's child"),
          q(2,18,"Are all students good at learning languages?","No, not all students are good at learning languages; some are good at learning languages and some are bad at learning languages"),
        ],
      },
      19: {
        stage: 2, lesson: 19, topic: "Comida, no=not any, hear/drive, dinheiro, watch",
        vocabulary: ["bread","butter","rice","carry","no","hear","drive","money","pence","pound","fewer than","watch"],
        grammar: ["'no' pode substituir 'not any': \"I have no books\" = \"I don't have any books\""],
        questions: [
          q(2,19,"What do we put on our bread?","We put butter on our bread"),
          q(2,19,"What can we say instead of \"not any books\"?","We can say \"no books\" instead of \"not any books\""),
          q(2,19,"Can you drive a car?","Yes, I can drive a car"),
          q(2,19,"How many pence make a pound?","A hundred pence make a pound"),
          q(2,19,"What's the difference between a watch and a clock?","The difference between a watch and a clock is that we wear a watch on our wrist, whereas we hang a clock on the wall or put it on a table"),
        ],
      },
      20: {
        stage: 2, lesson: 20, topic: "Tempo (hora, dia, semana), possessive adjectives/pronouns",
        vocabulary: ["time","past","to","by","o'clock","day","week","month","year","also","meat","sugar","count","mine","yours","his","hers","ours","theirs","whose"],
        grammar: ["Possessive adjectives: my, your, his, her, its, our, your, their",
                  "Possessive pronouns: mine, yours, his, hers, -, ours, yours, theirs"],
        questions: [
          q(2,20,"How many hours make a day?","24 hours make a day"),
          q(2,20,"How many days make a week?","7 days make a week"),
          q(2,20,"How many weeks make a month?","4 weeks make a month"),
          q(2,20,"How many months make a year?","12 months make a year"),
          q(2,20,"What are the possessive adjectives?","The possessive adjectives are \"my\", \"your\", \"his\", \"her\", \"its\", \"our\", \"your\" and \"their\""),
          q(2,20,"What's the difference between a possessive adjective and a possessive pronoun?","The difference between a possessive adjective and a possessive pronoun is that we put a possessive adjective in front of a noun, whereas we use a possessive pronoun instead of a noun"),
        ],
      },
      21: {
        stage: 2, lesson: 21, topic: "the most, eat/drink, metais, made of, dias da semana",
        vocabulary: ["the most","beautiful","handsome","ugly","eat","drink","water","wine","milk","metal","gold","silver","steel","iron","made of","key","plastic","cost","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday","weekend"],
        grammar: [],
        questions: [
          q(2,21,"Do you eat all food?","No, I don't eat all food; some I eat and some I don't eat"),
          q(2,21,"What do we eat with?","We eat with our mouths"),
          q(2,21,"What colour's water?","Water has no colour"),
          q(2,21,"Tell me the names of four metals, please.","The names of four metals are gold, silver, steel and iron"),
          q(2,21,"What's a key generally made of?","A key's generally made of steel"),
          q(2,21,"Tell me the names of the days of the week, please.","The names of the days of the week are Monday, Tuesday, Wednesday, Thursday, Friday, Saturday and Sunday"),
          q(2,21,"What do we call Saturday and Sunday?","We call Saturday and Sunday the weekend"),
        ],
      },
      22: {
        stage: 2, lesson: 22, topic: "want, do you have, begin/end/last, the fewest, whose",
        vocabulary: ["want","at the moment","do you have","begin","end","last","how long","cheap","expensive","the fewest","building","inside","outside","stomach","well","flower","plant","whose"],
        grammar: ["'do you have' e 'have you got' têm o mesmo significado."],
        questions: [
          q(2,22,"Is a Rolls Royce cheap?","No, a Rolls Royce isn't cheap; it's expensive"),
          q(2,22,"What's the plural of \"a\"?","The plural of \"a\" is \"some\""),
          q(2,22,"Can you hear well?","Yes, I can hear well"),
          q(2,22,"Whose book's this?","It's your book"),
        ],
      },
      23: {
        stage: 2, lesson: 23, topic: "Refeições, many/much, few/little, fewer/less than",
        vocabulary: ["meal","breakfast","lunch","dinner","plate","bowl","knife","fork","spoon","chopsticks","much","little","a lot of","salt","pepper","bank"],
        grammar: ["many/much: contável x incontável — few/little: contável x incontável",
                  "fewer than (contável) x less than (incontável)"],
        questions: [
          q(2,23,"Tell me the names of the three meals that people generally eat a day.","The names of the three meals that people generally eat a day are breakfast, lunch and dinner"),
          q(2,23,"What do we eat our food from?","We eat our food from a plate or a bowl"),
          q(2,23,"What do we eat our food with?","We eat our food with a knife, fork and spoon, or with chopsticks"),
          q(2,23,"What's the difference between \"many\" and \"much\"?","The difference between \"many\" and \"much\" is that we use \"many\" with things we can count, and \"much\" with things we can't count"),
          q(2,23,"What's the difference between \"few\" and \"little\"?","The difference between \"few\" and \"little\" is that we use \"few\" with things we can count and \"little\" with things we can't count"),
          q(2,23,"What's the difference between \"fewer than\" and \"less than\"?","The difference between \"fewer than\" and \"less than\" is that we use \"fewer than\" with things we can count, and \"less than\" with things we can't count"),
        ],
      },
      24: {
        stage: 2, lesson: 24, topic: "the fewest/the least, materiais, enough, telefone",
        vocabulary: ["the fewest","the least","opposite","next to","work","rest","glass","wood","paper","stone","enough","that one","repeat","badly","telephone","mobile","phone","call"],
        grammar: [],
        questions: [
          q(2,24,"What's the difference between \"the fewest\" and \"the least\"?","The difference between \"the fewest\" and \"the least\" is that we use \"the fewest\" with things we can count, whereas we use \"the least\" with things we cannot count"),
          q(2,24,"What's the window made of?","The window's made of glass"),
          q(2,24,"Are you tall enough to touch the ceiling?","No, I'm not tall enough to touch the ceiling; I'm too short"),
          q(2,24,"Do you see badly?","No, I don't see badly; I see well"),
        ],
        dictation: "The difference between \"any\" and \"some\" is that we generally use \"any\" in questions and negative sentences, whereas we use \"some\" in the positive. \"Any\" is non-specific. \"How many\" is specific. Are there any books on the table? Yes, there are some. How many books are there on the floor? There are none. The present continuous we use for an action we are doing now. For example, I am speaking English now. About how many pages are there in this book?",
      },
    },
  },

  3: {
    title: "Stage 3",
    lessons: {
      0: {
        stage: 3, lesson: 0, needsVerification: true,
        topic: "Amostra: comparativo/superlativo, above/below, meses, a.m./p.m.",
        vocabulary: ["comparative","superlative","above","below","January","February","March","April","May","June","July","August","September","October","November","December","last","next","a.m.","p.m.","midday","Latin"],
        grammar: ["Adjetivos de 1 sílaba: -er/-est (cheap → cheaper → the cheapest)",
                  "Adjetivos de 2+ sílabas: more/the most (expensive → more expensive → the most expensive)"],
        questions: [
          q(3,0,"What's the comparative of \"beautiful\"?","The comparative of \"beautiful\" is \"more beautiful than\""),
          q(3,0,"What's the superlative of \"small\"?","The superlative of \"small\" is \"the smallest\""),
          q(3,0,"What's the superlative of \"expensive\"?","The superlative of \"expensive\" is \"the most expensive\""),
          q(3,0,"Why do we say \"cheaper than\" but not \"expensiver than\"?","We say \"cheaper than\", but not \"expensiver than\", because the adjective \"cheap\" has only one syllable, whereas the adjective \"expensive\" has three syllables"),
          q(3,0,"Tell me the names of the months of the year, please.","The names of the months of the year are January, February, March, April, May, June, July, August, September, October, November, December"),
          q(3,0,"What do the letters a.m. mean after the time?","The letters a.m. mean \"ante meridiem\" after the time"),
          q(3,0,"What do the letters p.m. mean after the time?","The letters p.m. mean \"post meridiem\" after the time"),
          q(3,0,"What's the difference between a.m. and p.m.?","The difference between a.m. and p.m. is that we use a.m. for the time before midday (12 o'clock), and p.m. for the time after midday"),
        ],
      },
    },
  },
};

// Helper to build a question object with a stable id
function q(stage, lesson, question, answer) {
  const id = `s${stage}-l${lesson}-${hash(question)}`;
  return {
    id, stage, lesson, question, answer,
    type: "callan",
    difficulty: 1,
  };
}
function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) { h = (h * 31 + str.charCodeAt(i)) | 0; }
  return Math.abs(h).toString(36);
}

// Flat index of every real question, built once.
const ALL_QUESTIONS = [];
for (const stageKey of Object.keys(REAL_COURSE_DATA)) {
  const stage = REAL_COURSE_DATA[stageKey];
  for (const lessonKey of Object.keys(stage.lessons)) {
    const lesson = stage.lessons[lessonKey];
    for (const question of lesson.questions) ALL_QUESTIONS.push(question);
  }
}

// Which lessons exist per stage vs. which are known-but-not-imported yet.
// (Numbers below are only what we can *confirm* exist in the user's books;
// we never invent lesson counts we haven't verified.)
const KNOWN_LESSON_NUMBERS = {
  1: Array.from({ length: 2 }, (_, i) => i + 1),           // confirmed: 1–2 (rest needs import)
  2: Array.from({ length: 15 }, (_, i) => i + 10),         // confirmed: 10–24
  3: [0],                                                   // 1 amostra, número exato a confirmar
};
