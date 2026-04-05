import { STOCKS } from "./constants.js";

/**
 * Story spine: Dollar Guy, linear paycheck-to-portfolio path (NEXT only; interactive mini-games between beats).
 */

export const CHAPTERS = [
  {
    id: 1,
    title: "First Paycheck",
    subtitle: "Stock = slice of a company",
    /** Demo path: one dialog NEXT → practice trade → one-line recap. */
    dialogTypingSpeed: 12,
    storyBackdrop: "/story/ch1-office-bg.jpg",
    storyDialog: [
      {
        speaker: "dollar-guy",
        text: "I’m Dollar Guy. A stock is a tiny ownership slice of a company. Next: tap BUY once, wait a moment, SELL when the price is up—fake cash, real flow, ~30 seconds.",
        scene: { icon: "🧾", headline: "DEMO", detail: "Chapter 1 · speed run", accent: "#76FF03" },
      },
    ],
    learnDialog: [],
    situationDialog: [],
    miniGame: {
      type: "first-buy",
      config: {
        stockIdx: 0,
        title: "PRACTICE TRADE",
        /** Slightly faster uptrend + calmer noise so the demo almost always hits green quickly. */
        priceDrift: 0.007,
        shockScale: 0.65,
        instructions: "BUY 1 share, wait a moment, SELL when you’re above your buy price.",
        successText: "You completed the loop—buy, hold a tick, sell. That’s what “owning a share” feels like, shortened.",
        failText: "Tap BUY, wait until the price is above your buy, then SELL—or try again; practice costs nothing.",
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
      {
        speaker: "dollar-guy",
        text: "You felt buy → sell. Chapter two is only: bullish or bearish headlines—same Dollar Guy path.",
      },
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
        text: "Still here with you—you already know buy and sell. Headlines and events change how people feel about a company, and that shows up in the price.",
        scene: { icon: "📰", headline: "READING THE ROOM", detail: "News → mood → price", accent: "#FF9100" },
      },
      {
        speaker: "dollar-guy",
        text: "When earnings crush expectations, buyers often show up first—that pressure is what people mean by bullish. Bearish is the opposite: bad news, weaker story, more sellers leaning on the price.",
        scene: { icon: "📈", headline: "BULL VS BEAR", detail: "Words you’ll hear nonstop", accent: "#00E5FF" },
      },
      {
        speaker: "dollar-guy",
        text: "Ask every headline: does this help or hurt the business? Next, three quick taps—bullish or bearish for each story—same path, no branches.",
        scene: { icon: "🎯", headline: "NEXT UP", detail: "Interactive drill", accent: "#FFD600" },
      },
    ],
    learnDialog: [
      {
        speaker: "dollar-guy",
        text: "Bullish: the story gets better for the business. Bearish: it gets worse. Same words pros use—you’re not guessing vibes, you’re labeling cause and effect.",
        scene: { icon: "🎯", headline: "YOUR TURN", detail: "Three headlines · pick a side", accent: "#FFD600" },
      },
    ],
    situationDialog: [],
    miniGame: {
      type: "headline-quiz",
      config: {
        headlines: [
          { text: "Banana Inc. smashes earnings — revenue up 40%", answer: "bullish", stock: "BNNA", explanation: "Strong results → market likes the story → often 📈" },
          { text: "SEC investigation into RektCoin for securities fraud", answer: "bearish", stock: "REKT", explanation: "Legal risk → hurt confidence → often 📉" },
          { text: "MoonShot AI lands $2B government defense contract", answer: "bullish", stock: "MOON", explanation: "Big revenue growth → brighter outlook → often 📈" },
        ],
        successText: "Clean reads—that’s how you build headline reflexes.",
        partialText: "Good start. Remember: helps the business = bullish; hurts it = bearish. You’ll get faster with reps.",
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
      {
        speaker: "dollar-guy",
        text: "Now you’ve got two tools: how a trade works, and how news tilts the tape. Last piece with me—why betting everything on one stock can sting, and what spreading out buys you when a day goes wrong.",
      },
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
        text: "Same story, deeper layer: if most of your money rides one ticker, one bad headline can carve a huge hole in your account.",
        scene: { icon: "⚠️", headline: "CONCENTRATION RISK", detail: "Why “all in one” stings", accent: "#FF3D71" },
      },
      {
        speaker: "dollar-guy",
        text: "Conviction in one name can win big or lose big—no cushion. Spreading across companies is diversification: when one drops, others can soften the fall. Cash is safe from swings, but inflation nibbles buying power; most people mix cash and investing.",
        scene: { icon: "🧺", headline: "DIVERSIFY", detail: "Many eggs, many baskets", accent: "#76FF03" },
      },
      {
        speaker: "dollar-guy",
        text: "Next: split pretend $100 across four stocks with the sliders, simulate a crash, and feel balanced vs all-in-one for yourself.",
        scene: { icon: "🧪", headline: "NEXT UP", detail: "Allocation lab", accent: "#00E5FF" },
      },
    ],
    learnDialog: [
      {
        speaker: "dollar-guy",
        text: "Give more than one company weight. If you lean hard on one ticker, notice how your total jumps when that line breaks—then try a smoother split and run the same crash.",
        scene: { icon: "🧪", headline: "YOUR TURN", detail: "Allocation · then simulate", accent: "#00E5FF" },
      },
    ],
    situationDialog: [],
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
        instructions: "Split $100 across the stocks, then simulate a crash and compare the outcome.",
        diversifiedMessage: "Because you spread the money, one stock’s crash didn’t erase the whole hundred.",
        concentratedMessage: "When everything sat in one name, that single drop took most of the portfolio with it.",
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
        { trigger: "single-stock-15s", text: "Try opening a second and third position—one line shouldn’t carry the whole round.", position: "stock-card" },
        { trigger: "crash-event", text: "Rough patch—if you’re spread out, you’ll usually feel less of a single-stock punch.", position: "center" },
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
        speaker: "dollar-guy",
        text: "That’s the spine we built from your paycheck: what a share is, how news tilts mood and price, and why spreading money dulls a one-company disaster. Everything else you study plugs into those three ideas.",
      },
      {
        speaker: "dollar-guy",
        text: "You’ve got the foundation. Rehearse in solo free play or multiplayer when you want heat—the next chapters add compounding, budgeting, and core vocab on the same path.",
      },
    ],
    badge: { id: "ch3_complete", label: "Diversified", icon: "🎯", desc: "Completed Chapter 3" },
  },
  {
    id: 4,
    title: "Snowball Effect",
    subtitle: "How compounding works",
    storyBackdrop: "/story/ch1-office-bg.jpg",
    storyDialog: [
      {
        speaker: "dollar-guy",
        text: "New lesson—not a stock tip. Compounding: if your balance grows, the next year’s growth applies to a bigger number. Small %, many years, big curve. Try the sliders next.",
        scene: { icon: "📈", headline: "CHAPTER 4", detail: "Time × return", accent: "#76FF03" },
      },
    ],
    learnDialog: [
      {
        speaker: "dollar-guy",
        text: "Move amount, years, and yearly return. The ending number is a math illustration—real life is messier, but the idea is the same: start early, stay consistent.",
        scene: { icon: "🧮", headline: "YOUR TURN", detail: "Compound toy", accent: "#00E5FF" },
      },
    ],
    situationDialog: [],
    miniGame: {
      type: "compound-growth",
      config: {
        title: "COMPOUND GROWTH LAB",
        initialPrincipal: 1500,
        initialYears: 25,
        initialApr: 7,
      },
    },
    gameplay: {
      skipGameplay: true,
      availableStocks: [0],
      durationSeconds: 60,
      objective: { id: "compound", text: "Explore the compound growth mini-game", check: () => true },
      hintLevel: "heavy",
      hints: [],
      scriptedEvents: [],
    },
    reflectDialog: [
      {
        speaker: "dollar-guy",
        text: "You saw the curve. Same dollars behave differently with time and return—that’s why ‘start now’ shows up in every finance 101.",
      },
    ],
    badge: { id: "ch4_complete", label: "Compounder", icon: "📊", desc: "Completed Chapter 4" },
  },
  {
    id: 5,
    title: "Split the Check",
    subtitle: "Pay yourself first",
    storyBackdrop: "/story/ch1-office-bg.jpg",
    storyDialog: [
      {
        speaker: "dollar-guy",
        text: "Markets are one slice of money skills. Here’s another: how you split a paycheck—needs, growth, fun. No guilt trip; just see the hundred percent add up.",
        scene: { icon: "💸", headline: "CHAPTER 5", detail: "Budget buckets · % only", accent: "#FFD600" },
      },
    ],
    learnDialog: [
      {
        speaker: "dollar-guy",
        text: "Slide until the total reads 100%. Many people secure needs first, automate savings, then spend what’s left—your percentages can be yours.",
        scene: { icon: "🪣", headline: "YOUR TURN", detail: "Must sum to 100%", accent: "#00E5FF" },
      },
    ],
    situationDialog: [],
    miniGame: {
      type: "budget-buckets",
      config: {
        title: "PAYCHECK SPLITS",
        budget: 100,
        buckets: [
          { id: "needs", label: "Needs (rent, food, bills)", emoji: "🏠", color: "#00E5FF" },
          { id: "grow", label: "Save & invest (future you)", emoji: "📈", color: "#76FF03" },
          { id: "flex", label: "Fun & flexible", emoji: "🎮", color: "#FFD600" },
        ],
        footnote: "Irregular life happens—this is practice for the habit, not a stricter budget app.",
      },
    },
    gameplay: {
      skipGameplay: true,
      availableStocks: [0],
      durationSeconds: 60,
      objective: { id: "budget", text: "Balance buckets to 100%", check: () => true },
      hintLevel: "heavy",
      hints: [],
      scriptedEvents: [],
    },
    reflectDialog: [
      {
        speaker: "dollar-guy",
        text: "When savings isn’t an afterthought, investing gets fuel. You’ll feel that in solo practice later when you’re not starting from zero every month.",
      },
    ],
    badge: { id: "ch5_complete", label: "Balanced", icon: "⚖️", desc: "Completed Chapter 5" },
  },
  {
    id: 6,
    title: "Speak Like a Market",
    subtitle: "Core vocabulary",
    storyBackdrop: "/story/ch1-office-bg.jpg",
    storyDialog: [
      {
        speaker: "dollar-guy",
        text: "Last mini-game for this arc: match plain-English meanings to words you’ll hear forever—bull, bear, dividend, ETF. Speed matters less than recognition.",
        scene: { icon: "📖", headline: "CHAPTER 6", detail: "Tap term → meaning", accent: "#FF9100" },
      },
    ],
    learnDialog: [
      {
        speaker: "dollar-guy",
        text: "Left column: words. Right: definitions (shuffled). Pair them all, or tap skip if you already know the deck.",
        scene: { icon: "🔗", headline: "YOUR TURN", detail: "Four pairs", accent: "#FFD600" },
      },
    ],
    situationDialog: [],
    miniGame: {
      type: "term-match",
      config: {
        title: "TERM MATCH",
        instructions: "Select a term, then its definition. Wrong pairs reset—keep going.",
        pairs: [
          { id: "bull", term: "Bull market", definition: "Broad uptrend—prices generally rising and mood optimistic." },
          { id: "bear", term: "Bear market", definition: "Broad downtrend—prices falling and caution rules." },
          { id: "div", term: "Dividend", definition: "Cash a company pays shareholders, usually per share, on a schedule." },
          { id: "etf", term: "ETF", definition: "Basket of assets you buy like one stock—often tracks an index." },
        ],
      },
    },
    gameplay: {
      skipGameplay: true,
      availableStocks: [0],
      durationSeconds: 60,
      objective: { id: "terms", text: "Match all vocabulary pairs", check: () => true },
      hintLevel: "heavy",
      hints: [],
      scriptedEvents: [],
    },
    reflectDialog: [
      {
        speaker: "dollar-guy",
        text: "Six stops on one path: trade, news, diversify, compound, budget, vocab. Replay any chapter or take it to free play and multiplayer—you’ve got the tour.",
      },
    ],
    badge: { id: "ch6_complete", label: "Fluent", icon: "💬", desc: "Completed Chapter 6" },
  },
];
