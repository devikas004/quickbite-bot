# Guardrailing Approach — QuickBite Support Bot

## Overview

The bot's guardrails are enforced entirely through the **system prompt**, which is injected with every API call. This approach keeps the logic transparent, editable, and model-agnostic.

## How It Works

**FAQ-Only Answering**
The full FAQ (30 Q&A pairs) is embedded directly in the system prompt as a labeled knowledge block. GPT-4o is instructed to treat this as its sole source of truth. If a user's question cannot be matched to any FAQ entry, the bot responds with a fixed fallback: *"I don't have information on that. Please contact support@quickbite.com."* — avoiding hallucination by design.

**Out-of-Scope Queries**
The system prompt explicitly defines "in-scope" as anything related to QuickBite or food delivery. For any other topic — general knowledge, celebrities, coding, etc. — the bot politely declines and redirects the user. This redirect is framed warmly to avoid feeling like a hard block.

**Abusive Inputs**
The model is instructed to ignore the content of offensive messages and instead ask the user to rephrase calmly. This prevents the bot from either engaging with harmful content or shutting down abruptly.

**No Hallucination**
A low temperature (`0.3`) reduces creative deviation. Combined with the explicit instruction to never invent timelines, amounts, or policies, this keeps answers grounded in the verbatim FAQ text.

**Sensitive Data**
The system prompt instructs the bot to never solicit or acknowledge passwords, card numbers, CVVs, or OTPs — protecting users from accidentally sharing sensitive information through a chat interface.

**Multi-Turn Coherence**
The full conversation history is passed with every API call, allowing the bot to handle follow-up questions naturally while still being constrained to FAQ content.
