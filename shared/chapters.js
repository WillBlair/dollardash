import { STOCKS } from "./constants.js";

/** One continuous arc: first paycheck → Dollar Guy teaches stocks, news, then diversification. */

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
        text: "Your first real paycheck hits your account. You want your money to grow—but you are not sure what a stock actually is.",
        scene: { icon: "🧾", headline: "FIRST PAYCHECK", detail: "Friday • direct deposit", accent: "#76FF03" },
      },
      {
        speaker: "dollar-guy",
        text: "I am Dollar Guy. Think of me as your guide from here on out—we will go step by step.",
        scene: { icon: "💵", headline: "YOUR GUIDE", detail: "Same story, three lessons", accent: "#FFD600" },
      },
      {
        type: "choice",
        scene: { icon: "🤔", headline: "BEFORE YOU INVEST", detail: "Lesson 1 of 3", accent: "#00E5FF" },
        prompt: "What should you do first?",
        promptSpeaker: "dollar-guy",
        options: [
          {
            emoji: "📱",
            label: "Buy whatever is trending online",
            lines: [
              { speaker: "dollar-guy", text: "Trends come and go. First you need to know what you are buying: a share is a small ownership stake in a company." },
            ],
          },
          {
            emoji: "🛋️",
            label: "Leave it all in checking and decide later",
            lines: [
              { speaker: "dollar-guy", text: "That is safe for cash you need soon. For long-term growth many people invest—but only after they understand the basics." },
            ],
          },
          {
            emoji: "🎓",
            label: "Learn what a stock is before spending",
            lines: [
              { speaker: "dollar-guy", text: "That is the right instinct. A stock is a share of a business. If the business does well, your shares may rise; if it struggles, they may fall." },
            ],
          },
        ],
        tail: [
          {
            speaker: "dollar-guy",
            text: "Next, try one practice buy and one sell in the sandbox below. Watch how the price moves—it is the same idea real markets use, without real money at risk.",
          },
        ],
      },
    ],
    learnDialog: [
      {
        speaker: "dollar-guy",
        text: "Practice round: tap BUY once, watch the price, then SELL when you are ready. The goal is to see how a trade works, not to be perfect.",
        scene: { icon: "📚", headline: "PRACTICE TRADE", detail: "Sandbox—no real money", accent: "#00E5FF" },
      },
    ],
    situationDialog: [
      {
        speaker: "dollar-guy",
        text: "Use the buttons on the stock card. Buy one share, then sell it when the price is higher than what you paid.",
        scene: { icon: "📱", headline: "YOUR TURN", detail: "One buy, one sell", accent: "#76FF03" },
      },
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
      { speaker: "dollar-guy", text: "You bought and sold a share. That is what investing in a single stock looks like in miniature." },
      { speaker: "dollar-guy", text: "Next, in the same journey with me: how news and sentiment push those prices up and down." },
    ],
    badge: { id: "ch1_complete", label: "First Trade", icon: "🏁", desc: "Completed Chapter 1" },
  },
  {
    id: 2,
    title: "Reading the Room",
    subtitle: "How news moves markets",
    storyBackdrop: "/story/ch1-office-bg.jpg",
    storyDialog: [
      {
        speaker: "dollar-guy",
        text: "You have seen a share price move. Now we connect it to the real world: headlines and events change how investors feel about a company.",
        scene: { icon: "📰", headline: "LESSON 2", detail: "News and prices", accent: "#FF9100" },
      },
      {
        type: "choice",
        scene: { icon: "📈", headline: "GOOD VS BAD NEWS", detail: "Bullish vs bearish", accent: "#00E5FF" },
        prompt: "Earnings come in much stronger than expected. What usually happens to the stock short term?",
        promptSpeaker: "dollar-guy",
        options: [
          {
            emoji: "📉",
            label: "Investors usually sell on good news",
            lines: [
              { speaker: "dollar-guy", text: "Sometimes people take profits, but better-than-expected results usually support the price—we call that bullish." },
            ],
          },
          {
            emoji: "📈",
            label: "The news is positive for the company—often bullish",
            lines: [
              { speaker: "dollar-guy", text: "Right. Bullish means upward pressure or optimism; bearish means the opposite." },
            ],
          },
          {
            emoji: "🤷",
            label: "Headlines never matter",
            lines: [
              { speaker: "dollar-guy", text: "They do. Markets react to information. The skill is reading whether news helps or hurts the business." },
            ],
          },
        ],
        tail: [
          {
            speaker: "dollar-guy",
            text: "In the quiz below, choose whether each headline is bullish or bearish for that company.",
          },
        ],
      },
    ],
    learnDialog: [
      {
        speaker: "dollar-guy",
        text: "Bullish: good for the stock’s story. Bearish: bad for the stock’s story. Apply that to every headline.",
        scene: { icon: "🎯", headline: "VOCABULARY", detail: "Bullish 📈 • Bearish 📉", accent: "#FFD600" },
      },
    ],
    situationDialog: [
      {
        speaker: "dollar-guy",
        text: "Read each headline once, then choose. There is no timer—accuracy matters more than speed.",
        scene: { icon: "📳", headline: "HEADLINE QUIZ", detail: "Three examples", accent: "#76FF03" },
      },
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
      { speaker: "dollar-guy", text: "You linked headlines to direction. Traders use the same bullish and bearish language all day." },
      { speaker: "dollar-guy", text: "Last stop with me: why holding only one stock is risky—and how spreading money across names helps." },
    ],
    badge: { id: "ch2_complete", label: "News Reader", icon: "📰", desc: "Completed Chapter 2" },
  },
  {
    id: 3,
    title: "Don't Bet It All",
    subtitle: "The power of diversification",
    storyBackdrop: "/story/ch1-office-bg.jpg",
    storyDialog: [
      {
        speaker: "dollar-guy",
        text: "You know what a stock is and how news moves prices. The last core idea for this course: if all your money is in one company, one bad shock can hurt your whole portfolio.",
        scene: { icon: "⚠️", headline: "LESSON 3", detail: "Concentration risk", accent: "#FF3D71" },
      },
      {
        type: "choice",
        scene: { icon: "🧺", headline: "DIVERSIFICATION", detail: "Many eggs, many baskets", accent: "#76FF03" },
        prompt: "You have $100 to invest for the long run. What is the soundest approach?",
        promptSpeaker: "dollar-guy",
        options: [
          {
            emoji: "🎯",
            label: "Put 100% in one stock you believe in",
            lines: [
              { speaker: "dollar-guy", text: "You might win big—or lose big. High conviction does not remove company-specific risk." },
            ],
          },
          {
            emoji: "🥚",
            label: "Split across several companies or sectors",
            lines: [
              { speaker: "dollar-guy", text: "That is diversification: when one holding drops, others may hold steadier. It does not guarantee profit, but it spreads risk." },
            ],
          },
          {
            emoji: "💵",
            label: "Keep everything in cash forever",
            lines: [
              { speaker: "dollar-guy", text: "Cash is safe from market swings, but inflation can erode buying power over time—many people blend cash and investments." },
            ],
          },
        ],
        tail: [
          {
            speaker: "dollar-guy",
            text: "Use the sliders to split $100 across four tickers, then run the crash simulation. Notice how a balanced mix behaves versus everything in one name.",
          },
        ],
      },
    ],
    learnDialog: [
      {
        speaker: "dollar-guy",
        text: "Adjust weights so no single line is your whole portfolio. Then trigger the crash and compare the outcome.",
        scene: { icon: "🧪", headline: "ALLOCATION LAB", detail: "$100 practice capital", accent: "#00E5FF" },
      },
    ],
    situationDialog: [
      {
        speaker: "dollar-guy",
        text: "Four stocks, one portfolio. After you set weights, simulate a sharp drop in one of them and read the result.",
        scene: { icon: "🖥️", headline: "PORTFOLIO VIEW", detail: "Practice only", accent: "#FFD600" },
      },
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
        { trigger: "single-stock-15s", text: "You are only in one stock—consider spreading across more names.", position: "stock-card" },
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
        scene: { icon: "🏁", headline: "YOU COMPLETED THE ARC", detail: "Stocks → news → diversification", accent: "#76FF03" },
        prompt: "Which idea will you remember first?",
        promptSpeaker: "dollar-guy",
        options: [
          {
            emoji: "🧩",
            label: "A stock is ownership; prices move with the business and the news",
            lines: [{ speaker: "dollar-guy", text: "Solid foundation. Build from there." }],
          },
          {
            emoji: "🎯",
            label: "Spread risk so one bad day in one stock does not sink everything",
            lines: [{ speaker: "dollar-guy", text: "That is diversification in one sentence." }],
          },
          {
            emoji: "📰",
            label: "Classify news as bullish or bearish before acting on impulse",
            lines: [{ speaker: "dollar-guy", text: "Good habit: headline first, buttons second." }],
          },
        ],
        tail: [
          { speaker: "dollar-guy", text: "Same story from your first paycheck to here: three lessons. Take them into solo practice or multiplayer when you are ready." },
        ],
      },
    ],
    badge: { id: "ch3_complete", label: "Diversified", icon: "🎯", desc: "Completed Chapter 3" },
  },
];
