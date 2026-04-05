import { STOCKS } from "./constants.js";

/**
 * Story spine: your first paycheck → three lessons with Dollar Guy only.
 * Each chapter opens by recalling what you just learned, then teaches the next layer.
 */

export const CHAPTERS = [
  {
    id: 1,
    title: "First Paycheck",
    subtitle: "What is a stock?",
    storyBackdrop: "/story/ch1-office-bg.jpg",
    storyDialog: [
      {
        speaker: "dollar-guy",
        text: "Your first paycheck just hit. You’re wondering how people grow money in the market—I’m Dollar Guy, and I’ll take you through three short lessons, right here with you.",
        scene: { icon: "🧾", headline: "WHERE WE START", detail: "Lesson 1 of 3 · What you’re buying", accent: "#76FF03" },
      },
      {
        type: "choice",
        scene: { icon: "🤔", headline: "THINK IT THROUGH", detail: "There’s no wrong tap—only what you learn next", accent: "#00E5FF" },
        prompt: "You haven’t put money in the market yet. What’s the smartest first move?",
        promptSpeaker: "dollar-guy",
        options: [
          {
            emoji: "📱",
            label: "Buy whatever’s loudest online",
            lines: [
              {
                speaker: "dollar-guy",
                text: "I get the pull—but start with what you own. A stock is a share of a real business; you’re buying a piece of its future results, not a sticker.",
              },
            ],
          },
          {
            emoji: "🛋️",
            label: "Leave it all in checking for now",
            lines: [
              {
                speaker: "dollar-guy",
                text: "Smart for cash you might need tomorrow. When you invest, it helps to know the basics first—that’s what we’re doing together.",
              },
            ],
          },
          {
            emoji: "🎓",
            label: "Learn what a stock is before I buy",
            lines: [
              {
                speaker: "dollar-guy",
                text: "That’s the one. When the company does well, your share can become worth more; when it struggles, it can drop. Simple idea—big implications.",
              },
            ],
          },
        ],
        tail: [
          {
            speaker: "dollar-guy",
            text: "Next screen: your first practice round. Fake dollars, same buy-and-sell moves you’d use for real—so your hands learn before your wallet is in play.",
          },
        ],
      },
    ],
    learnDialog: [
      {
        speaker: "dollar-guy",
        text: "You’ll see one ticker. Tap BUY for one share, watch the price wiggle, then SELL when you’re above what you paid. We’re learning the flow—timing the perfect trade comes later.",
        scene: { icon: "📚", headline: "YOUR TURN", detail: "Sandbox · practice only", accent: "#00E5FF" },
      },
    ],
    situationDialog: [],
    miniGame: {
      type: "first-buy",
      config: {
        stockIdx: 0,
        instructions: "Buy one share, then sell when the price is higher than what you paid.",
        successText: "Nice—you bought and sold. That’s the loop every stock trade runs through.",
        failText: "Try again: buy one share, wait for a higher price, then sell.",
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
        text: "So you’ve felt a trade: you owned a slice, then you closed it. Next, we connect that moving price to the news—how to tell if a headline helps or hurts the story around a stock.",
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
        text: "Still here with you—you already know buy and sell. Now add the layer traders watch all day: headlines and events change how people feel about a company, and that shows up in the price.",
        scene: { icon: "📰", headline: "BUILDING ON LESSON 1", detail: "Lesson 2 of 3 · News and mood", accent: "#FF9100" },
      },
      {
        type: "choice",
        scene: { icon: "📈", headline: "THINK IT THROUGH", detail: "What usually happens when surprise news is good?", accent: "#00E5FF" },
        prompt: "A company reports earnings much stronger than Wall Street expected. In general, what do buyers tend to do with the stock in the short run?",
        promptSpeaker: "dollar-guy",
        options: [
          {
            emoji: "📉",
            label: "They usually dump it on good news",
            lines: [
              {
                speaker: "dollar-guy",
                text: "Sometimes people take profits, which can pull price back—but a big positive surprise usually attracts buyers first. We call that pressure bullish.",
              },
            ],
          },
          {
            emoji: "📈",
            label: "More buyers show up—price often rises",
            lines: [
              {
                speaker: "dollar-guy",
                text: "Right. Bullish means the mood tilts toward “pay up”; bearish means the mood tilts toward “sell first, ask later.” You’ll hear those two words everywhere.",
              },
            ],
          },
          {
            emoji: "🤷",
            label: "Headlines don’t move stocks",
            lines: [
              {
                speaker: "dollar-guy",
                text: "They absolutely can—markets are people reacting to information. Your job is to ask: does this news make the business look stronger or weaker?",
              },
            ],
          },
        ],
        tail: [
          {
            speaker: "dollar-guy",
            text: "Coming up: three short headlines. For each one, you’ll tag it bullish or bearish for that company—quick reps before you ever do it under pressure.",
          },
        ],
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
        text: "Third lesson—same paycheck story, deeper layer. You can trade and you can read the room. Now we guard the downside: if most of your money rides one ticker, one ugly headline can carve a huge hole in your account.",
        scene: { icon: "⚠️", headline: "BUILDING ON LESSONS 1–2", detail: "Lesson 3 of 3 · Not one basket", accent: "#FF3D71" },
      },
      {
        type: "choice",
        scene: { icon: "🧺", headline: "THINK IT THROUGH", detail: "Long horizon · pretend $100", accent: "#76FF03" },
        prompt: "Say you have $100 you won’t need for years. What’s the soundest habit to start with?",
        promptSpeaker: "dollar-guy",
        options: [
          {
            emoji: "🎯",
            label: "Put all $100 in my one best idea",
            lines: [
              {
                speaker: "dollar-guy",
                text: "Conviction feels good—but you’re concentrated. If that company stumbles, there’s no cushion. That’s the risk we’re about to feel in the lab.",
              },
            ],
          },
          {
            emoji: "🥚",
            label: "Split it across several companies",
            lines: [
              {
                speaker: "dollar-guy",
                text: "That’s diversification: when one name drops, the others can soften the blow. It doesn’t erase risk—it spreads it so one surprise doesn’t own you.",
              },
            ],
          },
          {
            emoji: "💵",
            label: "Keep 100% in cash forever",
            lines: [
              {
                speaker: "dollar-guy",
                text: "Cash sleeps easy, but inflation can eat its value over time. Most people end up mixing safe cash with invested money—we’ll focus on the invested part here.",
              },
            ],
          },
        ],
        tail: [
          {
            speaker: "dollar-guy",
            text: "Next: drag sliders to split pretend $100 across four stocks, then run the crash. Watch a balanced book versus everything parked in one name.",
          },
        ],
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
        text: "You’ve got the foundation. Rehearse in solo free play or multiplayer when you want real pressure—and when new chapters arrive, they’ll continue this same story with you.",
      },
    ],
    badge: { id: "ch3_complete", label: "Diversified", icon: "🎯", desc: "Completed Chapter 3" },
  },
];
