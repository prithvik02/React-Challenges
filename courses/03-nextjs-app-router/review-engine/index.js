#!/usr/bin/env node

import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const repoRoot = join(__dirname, "..", "..", "..");
const envPath = join(repoRoot, ".env");

function loadGroqApiKey() {
  if (!existsSync(envPath)) {
    return "";
  }

  const envContent = readFileSync(envPath, "utf8").replace(/^\uFEFF/, "");

  const lines = envContent.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const match = trimmed.match(/^GROQ_API_KEY\s*=\s*(.*)$/);

    if (match) {
      return match[1]
        .trim()
        .replace(/^["']|["']$/g, "");
    }
  }

  return "";
}

const GROQ_API_KEY = loadGroqApiKey();

const GROQ_API_URL =
  "https://api.groq.com/openai/v1/chat/completions";

const MODEL = "llama-3.1-8b-instant";

export async function reviewCodeWithAI(
  challengeId,
  filesToReview,
  projectDir
) {
  const results = {
    challengeId,
    timestamp: new Date().toISOString(),
    score: 0,
    feedback: [],
    strengths: [],
    improvements: [],
    readability: 0,
    maintainability: 0,
    overall: ""
  };

  try {
    const challengeDir = join(
      projectDir,
      "challenges",
      challengeId
    );

    const readmePath = join(
      challengeDir,
      "README.md"
    );

    let challengeContext = "";

    if (existsSync(readmePath)) {
      challengeContext = readFileSync(
        readmePath,
        "utf8"
      );
    }

    const codeSnippets = [];

    for (const file of filesToReview) {
      const filePath = join(projectDir, file);

      if (existsSync(filePath)) {
        const content = readFileSync(
          filePath,
          "utf8"
        );

        codeSnippets.push({
          file,
          content: content.substring(0, 5000)
        });
      }
    }

    if (codeSnippets.length === 0) {
      return {
        ...results,
        error: "No files found to review"
      };
    }

    if (!GROQ_API_KEY) {
      return {
        ...results,
        error:
          "GROQ_API_KEY was not found in the repository .env file.",
        score: 0
      };
    }

    const prompt = buildReviewPrompt(
      challengeId,
      codeSnippets,
      challengeContext
    );

    const aiResponse = await callGroqAPI(prompt);

    const parsedResponse =
      parseAIResponse(aiResponse);

    return {
      ...results,
      ...parsedResponse,
      score: calculateAIScore(parsedResponse)
    };
  } catch (error) {
    return {
      ...results,
      error: error.message
    };
  }
}

function buildReviewPrompt(
  challengeId,
  codeSnippets,
  challengeContext = ""
) {
  const codeContext = codeSnippets
    .map(
      snippet =>
        `File: ${snippet.file}\n\`\`\`typescript\n${snippet.content}\n\`\`\``
    )
    .join("\n\n");

  const contextSection = challengeContext
    ? `\n\n## Challenge Instructions and Requirements:\n${challengeContext.substring(
        0,
        3000
      )}\n`
    : "";

  return `You are an expert Next.js App Router and React code reviewer. Review the following code for challenge "${challengeId}".
${contextSection}
${codeContext}

Provide a structured review focusing on:
1. Code readability (0-100 score)
2. Maintainability (0-100 score)
3. Strengths (list 2-3 key strengths)
4. Areas for improvement (list 2-3 specific improvements)
5. Overall assessment (brief paragraph)

Format your response as JSON:
{
  "readability": <number>,
  "maintainability": <number>,
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "overall": "<brief assessment>"
}`;
}

async function callGroqAPI(prompt) {
  const response = await fetch(
    GROQ_API_URL,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are an expert Next.js App Router, React, and TypeScript code reviewer. Provide constructive, specific feedback."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      })
    }
  );

  const data = await response
    .json()
    .catch(() => ({}));

  if (!response.ok) {
    const msg =
      data?.error?.message ||
      data?.error ||
      response.statusText;

    throw new Error(
      `Groq API error (${response.status}): ${msg}`
    );
  }

  const content =
    data?.choices?.[0]?.message?.content;

  if (
    content == null ||
    typeof content !== "string"
  ) {
    throw new Error(
      "Groq API returned no content."
    );
  }

  return content;
}

function parseAIResponse(response) {
  try {
    const jsonMatch =
      response.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (_) {}

  const readabilityMatch =
    response.match(
      /readability[:\s]+(\d+)/i
    );

  const maintainabilityMatch =
    response.match(
      /maintainability[:\s]+(\d+)/i
    );

  return {
    readability: readabilityMatch
      ? parseInt(readabilityMatch[1])
      : 50,

    maintainability: maintainabilityMatch
      ? parseInt(maintainabilityMatch[1])
      : 50,

    strengths: extractList(
      response,
      /strengths?/i
    ),

    improvements: extractList(
      response,
      /improvements?/i
    ),

    overall: response.substring(0, 500)
  };
}

function extractList(text, keyword) {
  const lines = text.split("\n");
  const list = [];
  let inList = false;

  for (const line of lines) {
    if (keyword.test(line)) {
      inList = true;
      continue;
    }

    if (
      inList &&
      (
        line.trim().startsWith("-") ||
        /^\d+\./.test(line.trim())
      )
    ) {
      list.push(
        line
          .trim()
          .replace(/^[-•\d.]+\s*/, "")
      );

      if (list.length >= 3) {
        break;
      }
    }

    if (
      inList &&
      line.trim() === ""
    ) {
      break;
    }
  }

  return list.length > 0
    ? list
    : ["Code structure is reasonable"];
}

function calculateAIScore(parsedResponse) {
  const readability =
    parsedResponse.readability || 50;

  const maintainability =
    parsedResponse.maintainability || 50;

  return Math.round(
    (readability + maintainability) / 2
  );
}