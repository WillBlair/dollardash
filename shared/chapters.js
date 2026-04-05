import { STOCKS } from "./constants.js";

export const CHAPTERS = [
  {
    id: 1,
    title: "First Paycheck",
    subtitle: "What is a stock?",
    storyDialog: [
      { speaker: "dollar-guy", text: "Hey! Congrats on the first paycheck! Most people just let their money sit there doing nothing." },
      { speaker: "dollar-guy", text: "But you're smarter than that. Let me show you how to make your money work for you." },
      { speaker: "dollar-guy", text: "See that company? When you buy a stock, you own a tiny piece of it. If the company does well, your piece becomes worth more." },
    ],
    learnDialog: [
      { speaker: "dollar-guy", text: "Let's try it. I'll walk you through buying your very first stock." },
      { speaker: "dollar-guy", text: "Tap the BUY button to grab a share. Then watch the price move. When you're ready, sell it!" },
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
      availableStocks: [0],
      durationSeconds: 60,
      objective: {
        id: "first-profit",
        text: "Buy at least 1 share and sell it for a profit",
        check: (stats) => stats.totalTrades >= 2 && stats.returnPct > 0,
      },
      hintLevel: "heavy",
      hints: [
        { trigger: "price-up-5", text: "Price is going up! Might be a good time to sell.", position: "trade-controls" },
        { trigger: "no-trades-10s", text: "Don't be shy — tap a stock and hit BUY!", position: "stock-card" },
        { trigger: "holding-profit", text: "You're in the green! Try selling to lock in your profit.", position: "trade-controls" },
      ],
      scriptedEvents: [],
    },
    reflectDialog: [
      { speaker: "dollar-guy", text: "You just made your first trade! A stock is a piece of a company." },
      { speaker: "dollar-guy", text: "When the company does well, your stock goes up. That's how people grow their money." },
      { speaker: "dollar-guy", text: "But here's the thing — prices don't just move randomly. Let me show you what drives them..." },
    ],
    badge: { id: "ch1_complete", label: "First Trade", icon: "🏁", desc: "Completed Chapter 1" },
  },
  {
    id: 2,
    title: "Reading the Room",
    subtitle: "How news moves markets",
    storyDialog: [
      { speaker: "dollar-guy", text: "So your coworker just made a bunch of money. Know how? They read the news before everyone else." },
      { speaker: "dollar-guy", text: "Here's the secret: markets react to information. Good news pushes prices UP. Bad news drags them DOWN." },
      { speaker: "dollar-guy", text: "If you can read the headlines and act fast, you've got an edge over everyone else." },
    ],
    learnDialog: [
      { speaker: "dollar-guy", text: "Let me test you. I'll show you some headlines — tell me if they're good or bad for the stock." },
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
      availableStocks: [0, 2],
      durationSeconds: 90,
      objective: {
        id: "news-trade",
        text: "Make a profitable trade after a news headline drops",
        check: (stats) => stats.newsBasedTrades >= 1 && stats.returnPct > -5,
      },
      hintLevel: "moderate",
      hints: [
        { trigger: "news-fired", text: "Breaking news! Read the headline — is it bullish or bearish?", position: "news-ticker" },
        { trigger: "news-bullish-no-action", text: "That was good news for {stock}. Could be a buying opportunity!", position: "stock-card" },
        { trigger: "news-bearish-holding", text: "Bad news just hit. If you're holding {stock}, think about selling.", position: "trade-controls" },
      ],
      scriptedEvents: [
        { atSecond: 15, stockIdx: 0, headline: "Banana Inc. announces record-breaking quarter", sentiment: "bullish", driftMod: 0.035, durationSec: 10 },
        { atSecond: 45, stockIdx: 2, headline: "EU proposes strict AI regulation — MOON under pressure", sentiment: "bearish", driftMod: -0.03, durationSec: 10 },
      ],
    },
    reflectDialog: [
      { speaker: "dollar-guy", text: "See? Information is power. The news feed isn't just noise — it's your cheat code." },
      { speaker: "dollar-guy", text: "Smart traders read the headlines and act before the crowd catches on." },
      { speaker: "dollar-guy", text: "But there's one more thing you need to learn before you're ready for the real deal..." },
    ],
    badge: { id: "ch2_complete", label: "News Reader", icon: "📰", desc: "Completed Chapter 2" },
  },
  {
    id: 3,
    title: "Don't Bet It All",
    subtitle: "The power of diversification",
    storyDialog: [
      { speaker: "dollar-guy", text: "Let me tell you about my buddy Steve. Steve put ALL his money into one stock." },
      { speaker: "dollar-guy", text: "The stock crashed 60% in one day. Steve lost almost everything." },
      { speaker: "dollar-guy", text: "Don't be like Steve. The smart move? Spread your money across different stocks." },
      { speaker: "dollar-guy", text: "That way, if one crashes, the others can save you. It's called DIVERSIFICATION." },
    ],
    learnDialog: [
      { speaker: "dollar-guy", text: "Let me show you what I mean. Try splitting your money across these stocks and see what happens when a crash hits." },
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
      durationSeconds: 120,
      objective: {
        id: "diversified",
        text: "End the round holding shares in at least 3 different stocks",
        check: (stats) => stats.uniqueStocks >= 3,
      },
      hintLevel: "light",
      hints: [
        { trigger: "single-stock-30s", text: "You're only in one stock. Remember what happened to Steve!", position: "stock-card" },
        { trigger: "crash-event", text: "Market crash! If you diversified, you'll be fine.", position: "center" },
      ],
      scriptedEvents: [
        { atSecond: 60, stockIdx: -1, headline: "BREAKING: Major bank collapses — markets in panic", sentiment: "bearish", driftMod: -0.05, durationSec: 12 },
      ],
    },
    reflectDialog: [
      { speaker: "dollar-guy", text: "Diversification isn't the most exciting strategy, but it keeps you alive." },
      { speaker: "dollar-guy", text: "You've learned the basics: what stocks are, how news moves them, and why you don't put all your eggs in one basket." },
      { speaker: "dollar-guy", text: "I think you're ready. Time to go up against real traders. Good luck out there!" },
    ],
    badge: { id: "ch3_complete", label: "Diversified", icon: "🎯", desc: "Completed Chapter 3" },
  },
];
