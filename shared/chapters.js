import { STOCKS } from "./constants.js";

export const CHAPTERS = [
  {
    id: 1,
    title: "First Paycheck",
    subtitle: "What is a stock?",
    /** Shown behind story / learn / situation / minigame / reflect for this chapter only. */
    storyBackdrop: "/story/ch1-office-bg.jpg",
    storyDialog: [
      {
        speaker: "narrator",
        text: 'Your paycheck clears. Somewhere a spreadsheet smiles. Somewhere else, your brain whisper-sings: "what if we got silly with it."',
        scene: { icon: "🧾", headline: "INITIAL DEPOSIT", detail: "Friday • direct deposit • caffeine optional", accent: "#76FF03" },
      },
      {
        type: "choice",
        scene: { icon: "🤔", headline: "FIRST MOVE", detail: "No wrong answers — only expensive learning", accent: "#FFD600" },
        prompt: "Your group chat won't stop posting rockets next to BNNA. Your adult self suggests hydration. What do you actually do?",
        promptSpeaker: "narrator",
        options: [
          {
            emoji: "🛋️",
            label: "Close every app and doom-scroll the couch — money can be tomorrow's problem",
            lines: [
              { speaker: "dollar-guy", text: "Valid. Extremely leg-shaped strategy. Also how couches get expensive long-term." },
            ],
          },
          {
            emoji: "🦍",
            label: "YOLO into the loudest ticker because conviction looks like typing in ALL CAPS",
            lines: [
              { speaker: "dollar-guy", text: "Passionate. Chaotic. We will absolutely channel this energy… after you learn what a share even IS." },
            ],
          },
          {
            emoji: "🎓",
            label: "Panic-Google 'is stock just gambling' with the shame tab still open",
            lines: [
              { speaker: "dollar-guy", text: "Beautiful. Self-awareness plus Wi-Fi — you're already ahead of 2019 me." },
            ],
          },
        ],
        tail: [
          {
            speaker: "dollar-guy",
            text: "Here's the cheat code: a stock isn't a lottery ticket. It's a microscopic slice of a company. Company wins → your slice can grow. Company trips → your slice limps.",
          },
          {
            speaker: "dollar-guy",
            text: "You don't need vibes alone. You need one clean buy, one clean sell, and the ego damage of watching a price wiggle. Training montage time.",
          },
        ],
      },
    ],
    learnDialog: [
      {
        speaker: "dollar-guy",
        text: "Sandbox mode: one ticker, fake stakes, real emotions. I'm legally obligated to say past performance isn't vibes.",
        scene: { icon: "📚", headline: "TUTORIAL SAFE ZONE", detail: "No landlords were harmed", accent: "#00E5FF" },
      },
      { speaker: "dollar-guy", text: "Tap BUY once so the universe knows you're serious. Watch the number dance. Then sell when your soul says 'profit' — or panic, both teach." },
    ],
    situationDialog: [
      {
        speaker: "narrator",
        text: "The banking app is beige wallpaper. The broker app looks like a rhythm game boss fight. BNNA is RIGHT THERE — the meme your cousin won't shut up about.",
        scene: { icon: "📱", headline: "11:47 PM", detail: "Blue light • dopamine • one bright BUY button", accent: "#FF3D71" },
      },
      { speaker: "dollar-guy", text: "Narrator's getting dramatic. You: breathe, tap BUY, sell when you're up. We'll roast your timing later." },
    ],
    miniGame: {
      type: "first-buy",
      config: {
        stockIdx: 0,
        instructions: "Tap BUY to purchase your first share, then sell it for a profit!",
        successText: "Nice! You just made your first trade!",
        failText: "No worries — try again! Buy a share, then sell when the price goes up.",
      },
    },
    gameplay: {
      skipGameplay: true,
      availableStocks: [0],
      durationSeconds: 60,
      objective: {
        id: "first-profit",
        text: "Buy at least 1 share and sell it for a profit",
        check: (stats) => stats.totalTrades >= 2 && stats.returnPct > 0,
      },
      hintLevel: "heavy",
      hints: [],
      scriptedEvents: [],
    },
    reflectDialog: [
      { speaker: "dollar-guy", text: "Look at you — bought, sold, still have eyebrows. A stock is literally a slice of a company, not a casino coupon." },
      { speaker: "dollar-guy", text: "Companies get hyped, scared, sued, praised. That drama becomes your P&L. Next episode: the gossip column that moves billions." },
    ],
    badge: { id: "ch1_complete", label: "First Trade", icon: "🏁", desc: "Completed Chapter 1" },
  },
  {
    id: 2,
    title: "Reading the Room",
    subtitle: "How news moves markets",
    storyDialog: [
      {
        speaker: "narrator",
        text: "Coworker Dave made four figures 'from vibes' and won't explain the spreadsheet. Your pride says research. Your thumb wants revenge.",
        scene: { icon: "☕", headline: "BREAK ROOM INTEL", detail: "Monday • weak coffee • strong opinions", accent: "#FF9100" },
      },
      {
        type: "choice",
        scene: { icon: "📰", headline: "HEADLINE STRATEGY", detail: "Information is a weapon — or a slip 'n slide", accent: "#00E5FF" },
        prompt: "A scary headline pops up before the market opens. Your strategy?",
        promptSpeaker: "narrator",
        options: [
          {
            emoji: "🙈",
            label: "Ignore it — if you don't read it, the graph can't hurt you",
            lines: [
              { speaker: "dollar-guy", text: "Cute. Also how people wake up -30% and blame Mercury retrograde." },
            ],
          },
          {
            emoji: "🏃",
            label: "Trade first, read later — speed is a personality trait",
            lines: [
              { speaker: "dollar-guy", text: "Main-character energy. We're going to add 'sentiment' so your legs don't outrun your brain." },
            ],
          },
          {
            emoji: "🔍",
            label: "Screenshot it, highlight nouns, spiral politely",
            lines: [
              { speaker: "dollar-guy", text: "Healthy. Annoying. Correct. That's the reflex we're training." },
            ],
          },
        ],
        tail: [
          {
            speaker: "dollar-guy",
            text: "Markets are a gossip mill with math: good news lifts tickers, bad news drags them. Wall Street calls it bullish 📈 and bearish 📉 so traders sound like sports announcers.",
          },
          { speaker: "dollar-guy", text: "Quiz time — I'll flash real-ish chaos. You call the vibe before your lizard brain apes into a button." },
        ],
      },
    ],
    learnDialog: [
      {
        speaker: "dollar-guy",
        text: "Bullish = green flag energy. Bearish = red flag energy. Zero bears were consulted for branding.",
        scene: { icon: "🎯", headline: "BULL vs BEAR", detail: "Not financial advice — it's vocabulary with consequences", accent: "#FFD600" },
      },
      { speaker: "dollar-guy", text: "I'll sling headlines. You pick which way the stock story tilts. No shame — traders miss too; they just miss with spreadsheets." },
    ],
    situationDialog: [
      {
        speaker: "narrator",
        text: "Alerts stack like a slot machine: earnings beats, SEC drama, moonshot contracts. Everyone pretends they 'already knew.'",
        scene: { icon: "📳", headline: "NOTIFICATION HAIL", detail: "Push alerts • adrenaline • bad posture", accent: "#FF3D71" },
      },
      { speaker: "dollar-guy", text: "Lock in. Read like someone’s pension depends on it — because someday maybe yours does, no pressure." },
    ],
    miniGame: {
      type: "headline-quiz",
      config: {
        headlines: [
          { text: "Banana Inc. smashes earnings — revenue up 40%", answer: "bullish", stock: "BNNA", explanation: "Great earnings = company is doing well = stock goes UP" },
          { text: "SEC investigation into RektCoin for securities fraud", answer: "bearish", stock: "REKT", explanation: "Legal trouble = bad news = stock goes DOWN" },
          { text: "MoonShot AI lands $2B government defense contract", answer: "bullish", stock: "MOON", explanation: "Huge new deal = more money coming in = stock goes UP" },
        ],
        successText: "You're a natural! Now let's put that skill to work.",
        partialText: "Not bad! Remember: good news = 📈, bad news = 📉. Let's practice for real.",
      },
    },
    gameplay: {
      skipGameplay: true,
      availableStocks: [0, 2],
      durationSeconds: 90,
      objective: {
        id: "news-trade",
        text: "Identify whether headlines are good or bad news",
        check: () => true,
      },
      hintLevel: "moderate",
      hints: [],
      scriptedEvents: [],
    },
    reflectDialog: [
      { speaker: "dollar-guy", text: "Headlines aren't wallpaper — they're the script the crowd trades off." },
      { speaker: "dollar-guy", text: "You classified chaos under pressure. Next lesson: not everything mooning should get your whole wallet." },
    ],
    badge: { id: "ch2_complete", label: "News Reader", icon: "📰", desc: "Completed Chapter 2" },
  },
  {
    id: 3,
    title: "Don't Bet It All",
    subtitle: "The power of diversification",
    storyDialog: [
      {
        speaker: "dollar-guy",
        text: "Story time: my friend Steve went full laser-eyes on one ticker. One bad Tuesday turned his portfolio into a participation trophy.",
        scene: { icon: "⚠️", headline: "STEVE COUNTER: 1", detail: "Tragedy in three candles", accent: "#FF3D71" },
      },
      {
        type: "choice",
        scene: { icon: "🧺", headline: "EGGS & BASKETS", detail: "Metaphor budget: maxed", accent: "#76FF03" },
        prompt: "Hypothetical: bonus lands Monday. Steve 2.0 wants to 'max conviction' on one hype stock. You counter with…",
        promptSpeaker: "dollar-guy",
        options: [
          {
            emoji: "🎰",
            label: "Bet it all — if you're right once you can retire on screenshots",
            lines: [
              { speaker: "dollar-guy", text: "That's the spirit that built… very exciting group chats. We're still diversifying you for sport." },
            ],
          },
          {
            emoji: "🥚",
            label: "Split across names so one meltdown can't delete your entire personality",
            lines: [
              { speaker: "dollar-guy", text: "Look at you hedging like someone who reads disclaimers. Hot." },
            ],
          },
          {
            emoji: "🐌",
            label: "Hide in cash forever — feelings can't margin call you",
            lines: [
              { speaker: "dollar-guy", text: "Inflation has entered the chat. We'll compromise with pretend dollars first." },
            ],
          },
        ],
        tail: [
          {
            speaker: "dollar-guy",
            text: "Diversification = multiple lifeboats. Boring word, sexy outcome: one REKT day doesn't erase your whole net worth.",
          },
          {
            speaker: "dollar-guy",
            text: "You'll prove it with sliders — $100 play money, four temperamental tickers, then we simulate a crash so mean it needs a content warning.",
          },
        ],
      },
    ],
    learnDialog: [
      {
        speaker: "dollar-guy",
        text: "Allocation lab: drag slices until your inner accountant stops screaming. Then we summon chaos.",
        scene: { icon: "🧪", headline: "ALLOCATION LAB", detail: "Play money • real regret simulator", accent: "#00E5FF" },
      },
      { speaker: "dollar-guy", text: "Goal: split $100 across the four tickers however you want — then simulate a crash and watch diversification do its boring superhero thing." },
    ],
    situationDialog: [
      {
        speaker: "narrator",
        text: "Four tickers, one screen, zero emotional support animals. REKT wants drama, SAFE wants tea, MOON wants the future, BNNA wants potassium.",
        scene: { icon: "🖥️", headline: "THE BOARD", detail: "Portfolio view • pretend cash • impending violence", accent: "#FFD600" },
      },
      { speaker: "dollar-guy", text: "Simulate the crash when you're braced. Comedy for me, lesson for you — capitalism's two-for-one." },
    ],
    miniGame: {
      type: "portfolio-builder",
      config: {
        budget: 100,
        stocks: STOCKS.map((s) => ({
          symbol: s.symbol,
          name: s.name,
          color: s.color,
          risk: s.volatility > 0.04 ? "High Risk" : s.volatility > 0.02 ? "Medium" : "Low Risk",
        })),
        crashStockIdx: 1,
        crashPct: -55,
        instructions: "Drag the sliders to split $100 across stocks. Then watch what happens in a crash!",
        diversifiedMessage: "Smart! Because you spread your money around, the crash only hurt a little.",
        concentratedMessage: "Ouch! All your eggs were in one basket. Diversification would have saved you.",
      },
    },
    gameplay: {
      availableStocks: [0, 1, 2, 3],
      durationSeconds: 45,
      newsEngineOptions: { bullishPickProbability: 0.78 },
      objective: {
        id: "diversified",
        text: "End the round holding shares in at least 3 different stocks",
        check: (stats) => stats.uniqueStocks >= 3,
      },
      hintLevel: "moderate",
      hints: [
        { trigger: "single-stock-15s", text: "You're only in one stock. Remember what happened to Steve!", position: "stock-card" },
        { trigger: "crash-event", text: "Bumpy stretch! If you diversified, you'll be fine.", position: "center" },
      ],
      scriptedEvents: [
        {
          atSecond: 20,
          stockIdx: -1,
          headline: "MARKET BRIEF: Profit-taking after a strong run — volatility ticks up",
          sentiment: "bearish",
          driftMod: -0.028,
          durationSec: 8,
        },
      ],
    },
    reflectDialog: [
      {
        type: "choice",
        scene: { icon: "🏁", headline: "DEBRIEF", detail: "Pick your honest headline", accent: "#76FF03" },
        prompt: "After that round, what's the real lesson you're stealing into the rest of the game?",
        promptSpeaker: "dollar-guy",
        options: [
          {
            emoji: "🎯",
            label: "Spread risk so one villain can't delete my run",
            lines: [{ speaker: "dollar-guy", text: "Correct. Boring shield > exciting crater." }],
          },
          {
            emoji: "📰",
            label: "News + patience beat panic-tapping",
            lines: [{ speaker: "dollar-guy", text: "Chef's kiss. Sentiment is a skill tree." }],
          },
          {
            emoji: "🧃",
            label: "I mostly learned I'm addicted to green numbers",
            lines: [{ speaker: "dollar-guy", text: "Self-awareness points awarded. Hydrate, then go bully the multiplayer queue." }],
          },
        ],
        tail: [
          { speaker: "dollar-guy", text: "You've got: stocks 101, headline literacy, and diversification muscle memory. Go lose politely to strangers on the internet — or win, I'll act surprised." },
        ],
      },
    ],
    badge: { id: "ch3_complete", label: "Diversified", icon: "🎯", desc: "Completed Chapter 3" },
  },
];
