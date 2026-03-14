# 🍔 QuickBite Support Bot

A conversational FAQ chatbot for QuickBite, powered by OpenAI GPT-4o. The bot answers customer queries strictly from a provided FAQ dataset and refuses to respond to anything outside that scope.

---

## Prerequisites

- Node.js v18 or higher
- An OpenAI API key

---

## Setup

**1. Clone / copy the project files**

```
quickbite-bot/
├── index.js
├── faq.json
├── .env.example
├── package.json
└── README.md
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment**

```bash
cp .env.example .env
```

Open `.env` and add your OpenAI API key:

```
OPENAI_API_KEY=sk-...your-key-here...
```

**4. Run the bot**

```bash
node index.js
```

---

## Usage

Once running, type any question at the `You:` prompt:

```
You: My order is delayed, what do I do?
Bot: I'm sorry to hear that! Orders can sometimes take longer due to high demand
     or traffic. You can track your order live in the app. If the delay exceeds
     20 minutes beyond the estimated time, please contact our support team.

You: Who is Elon Musk?
Bot: I'm here to help with QuickBite-related questions only. Is there anything
     about your order or our service I can assist with?

You: exit
Bot: Thanks for reaching out! Have a great day. 👋
```

---

## Project Structure

| File | Purpose |
|---|---|
| `index.js` | Main chatbot entry point — loads FAQ, builds system prompt, runs CLI loop |
| `faq.json` | 30-entry FAQ dataset used as the bot's sole knowledge source |
| `.env.example` | Template for required environment variables |
| `README.md` | Setup and usage instructions |

---

## Dependencies

```json
{
  "openai": "^4.x",
  "dotenv": "^16.x"
}
```

Install with: `npm install openai dotenv`

Add to `package.json`:
```json
{ "type": "module" }
```

---

## Guardrailing Approach

See `WRITEUP.md` for a full explanation of the guardrailing strategy.
