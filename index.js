// index.js — QuickBite Support Chatbot
// Run: node index.js

import Groq from "groq-sdk";
import * as readline from "readline";
import { readFileSync } from "fs";
import dotenv from "dotenv";

dotenv.config();

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ── Load FAQ ──────────────────────────────────────────────────────────────────
const faq = JSON.parse(readFileSync("./faq.json", "utf-8"));

const faqBlock = faq
  .map((entry) => `Q${entry.id}: ${entry.question}\nA${entry.id}: ${entry.answer}`)
  .join("\n\n");

// ── System Prompt ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `
You are a friendly and empathetic customer support agent for QuickBite, a food delivery platform.
Your ONLY knowledge source is the FAQ provided below. You must follow every rule listed.

━━━━━━━━━━━━━━━━━━━━━━━ FAQ KNOWLEDGE BASE ━━━━━━━━━━━━━━━━━━━━━━━━
${faqBlock}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

GUARDRAILS — follow ALL of these, always:

1. FAQ-ONLY ANSWERING
   Answer exclusively using information from the FAQ above.
   If the user's question has no matching FAQ entry, respond exactly:
   "I don't have information on that. Please contact support@quickbite.com."

2. NO OFF-TOPIC RESPONSES
   If the user asks anything unrelated to QuickBite or food delivery
   (e.g., general knowledge, news, coding, celebrities), politely decline
   and redirect: "I'm here to help with QuickBite-related questions only.
   Is there anything about your order or our service I can assist with?"

3. NO HALLUCINATION
   Never invent refund amounts, timelines, policies, or details not stated
   in the FAQ. If a specific detail is not in the FAQ, do not guess.

4. EMPATHETIC TONE
   Always acknowledge the user's frustration or concern before answering.
   Use warm, supportive language. Never be dismissive or robotic.

5. SENSITIVE / ABUSIVE INPUTS
   If the user sends abusive, offensive, or inappropriate language,
   do not engage with the content. Calmly ask them to rephrase:
   "I'm here to help, but I'd appreciate if we could keep the conversation
   respectful. Could you rephrase your question?"

6. NO PERSONAL DATA
   Never ask for, acknowledge, or repeat passwords, full card numbers,
   CVVs, OTPs, or any sensitive personal data.

7. MULTI-TURN CONTEXT
   Use prior messages in this conversation to provide coherent follow-ups,
   but never introduce information beyond the FAQ.
`.trim();

// ── Chat History ──────────────────────────────────────────────────────────────
const history = [];

// ── Ask Claude (via OpenAI) ───────────────────────────────────────────────────
async function chat(userMessage) {
  history.push({ role: "user", content: userMessage });

  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history],
    temperature: 0.3, // low temp for consistent, grounded replies
  });

  const reply = response.choices[0].message.content;
  history.push({ role: "assistant", content: reply });
  return reply;
}

// ── CLI Loop ──────────────────────────────────────────────────────────────────
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("\n🍔  QuickBite Support Bot  🍔");
console.log("────────────────────────────");
console.log('Type your question below. Type "exit" to quit.\n');

function prompt() {
  rl.question("You: ", async (input) => {
    const userInput = input.trim();
    if (!userInput) return prompt();
    if (userInput.toLowerCase() === "exit") {
      console.log("\nBot: Thanks for reaching out! Have a great day. 👋\n");
      rl.close();
      return;
    }

    try {
      const reply = await chat(userInput);
      console.log(`\nBot: ${reply}\n`);
    } catch (err) {
      console.error("Error:", err.message);
    }

    prompt();
  });
}

prompt();
