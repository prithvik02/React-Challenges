#!/usr/bin/env node

/**
 * AI Review Layer for RTK Query Course
 *
 * Uses Groq API to provide qualitative code review.
 *
 * IMPORTANT:
 * - Only affects the AI review layer.
 * - Does NOT modify challenge/project files.
 * - Keeps requests small enough for Groq TPM limits.
 */

import {
  readFileSync,
  existsSync,
  readdirSync,
  statSync
} from 'fs';

import {
  join,
  dirname,
  extname
} from 'path';

import {
  fileURLToPath
} from 'url';

// ---------------------------------------------------------
// PATHS / ENV
// ---------------------------------------------------------

const __filename =
  fileURLToPath(import.meta.url);

const __dirname =
  dirname(__filename);

const repoRoot =
  join(
    __dirname,
    '..',
    '..',
    '..'
  );

const envPath =
  join(
    repoRoot,
    '.env'
  );

// Load .env manually
if (existsSync(envPath)) {
  const envContent =
    readFileSync(
      envPath,
      'utf-8'
    );

  for (
    const line of envContent.split('\n')
  ) {
    const match =
      line.match(
        /^\s*GROQ_API_KEY\s*=\s*(.+?)\s*$/
      );

    if (match) {
      process.env.GROQ_API_KEY =
        match[1]
          .trim()
          .replace(
            /^["']|["']$/g,
            ''
          );

      break;
    }
  }
}

const GROQ_API_KEY =
  process.env.GROQ_API_KEY || '';

const GROQ_API_URL =
  'https://api.groq.com/openai/v1/chat/completions';

const MODEL =
  'openai/gpt-oss-20b';

const CODE_EXTENSIONS = [
  '.ts',
  '.tsx',
  '.js',
  '.jsx'
];

// ---------------------------------------------------------
// MAIN REVIEW FUNCTION
// ---------------------------------------------------------

export async function reviewCodeWithAI(
  challengeId,
  challengeMetadata,
  projectDir
) {
  const results = {
    challengeId,
    timestamp:
      new Date().toISOString(),

    score: 0,

    feedback: [],

    strengths: [],

    improvements: [],

    readability: 0,

    maintainability: 0,

    overall: ''
  };

  try {
    // -----------------------------------------------------
    // CHALLENGE README
    // -----------------------------------------------------

    const challengeDir =
      join(
        projectDir,
        'challenges',
        challengeId
      );

    const readmePath =
      join(
        challengeDir,
        'README.md'
      );

    let challengeInstructions = '';

    let challengeRequirements = '';

    if (existsSync(readmePath)) {
      const readmeContent =
        readFileSync(
          readmePath,
          'utf-8'
        );

      const requirementsMatch =
        readmeContent.match(
          /## Technical Requirements(?: \(What Will Be Reviewed\))?/
        );

      if (
        requirementsMatch &&
        requirementsMatch.index != null
      ) {
        const splitIndex =
          requirementsMatch.index;

        challengeInstructions =
          readmeContent.substring(
            0,
            splitIndex
          );

        challengeRequirements =
          readmeContent.substring(
            splitIndex
          );
      } else {
        challengeInstructions =
          readmeContent;
      }
    }

    // -----------------------------------------------------
    // COLLECT CODE
    // -----------------------------------------------------

    const codeFiles = [];

    const missingFiles = [];

    for (
      const filePath of
        challengeMetadata.filesToCheck || []
    ) {
      const fullPath =
        join(
          projectDir,
          filePath
        );

      if (existsSync(fullPath)) {
        const content =
          readFileSync(
            fullPath,
            'utf-8'
          );

        if (
          CODE_EXTENSIONS.includes(
            extname(fullPath)
          ) &&
          content.trim().length > 0
        ) {
          codeFiles.push({
            file: filePath,

            content:
              content.substring(
                0,
                2500
              )
          });
        }
      } else {
        missingFiles.push(
          filePath
        );
      }
    }

    // -----------------------------------------------------
    // ADDITIONAL FILES
    // -----------------------------------------------------

    const additionalFiles =
      discoverAdditionalFiles(
        challengeMetadata,
        projectDir
      );

    for (
      const file of additionalFiles
    ) {
      if (
        !codeFiles.some(
          existing =>
            existing.file ===
            file.file
        )
      ) {
        codeFiles.push(file);
      }
    }

    // -----------------------------------------------------
    // HARD REQUEST LIMIT
    // -----------------------------------------------------

    // This only limits what is SENT to Groq.
    // It does NOT modify project files.

    const MAX_REVIEW_FILES = 4;

    const MAX_TOTAL_CODE_CHARS =
      7000;

    const limitedCodeFiles = [];

    let totalCodeChars = 0;

    for (
      const file of codeFiles
    ) {
      if (
        limitedCodeFiles.length >=
        MAX_REVIEW_FILES
      ) {
        break;
      }

      const remaining =
        MAX_TOTAL_CODE_CHARS -
        totalCodeChars;

      if (remaining <= 0) {
        break;
      }

      const content =
        file.content.substring(
          0,
          Math.min(
            2500,
            remaining
          )
        );

      limitedCodeFiles.push({
        ...file,
        content
      });

      totalCodeChars +=
        content.length;
    }

    codeFiles.length = 0;

    codeFiles.push(
      ...limitedCodeFiles
    );

    // -----------------------------------------------------
    // NO CODE
    // -----------------------------------------------------

    if (
      codeFiles.length === 0
    ) {
      return {
        ...results,

        error:
          'No code files found to review. User must create the required files first.',

        score: 0
      };
    }

    // -----------------------------------------------------
    // API KEY
    // -----------------------------------------------------

    if (!GROQ_API_KEY) {
      return {
        ...results,

        error:
          'GROQ_API_KEY environment variable not set. AI review skipped.',

        score: 0
      };
    }

    // -----------------------------------------------------
    // BUILD PROMPT
    // -----------------------------------------------------

    const prompt =
      buildReviewPrompt(
        challengeId,
        challengeMetadata,
        challengeInstructions,
        challengeRequirements,
        codeFiles,
        missingFiles
      );

    // -----------------------------------------------------
    // CALL GROQ
    // -----------------------------------------------------

    let aiResponse;

    try {
      aiResponse =
        await callGroqAPI(
          prompt
        );
    } catch (error) {
      // If request is too large, retry with a
      // deliberately tiny prompt.

      if (
        String(error.message)
          .includes('(413)')
      ) {
        console.log(
          '   ⚠️ AI request too large. Retrying with compact prompt...'
        );

        const compactPrompt =
          buildCompactReviewPrompt(
            challengeId,
            challengeMetadata,
            codeFiles
          );

        aiResponse =
          await callGroqAPI(
            compactPrompt
          );
      } else {
        throw error;
      }
    }

    // -----------------------------------------------------
    // PARSE RESPONSE
    // -----------------------------------------------------

    const parsedResponse =
      parseAIResponse(
        aiResponse
      );

    // -----------------------------------------------------
    // SCORE
    // -----------------------------------------------------

    const score =
      calculateAIScore(
        parsedResponse
      );

    return {
      ...results,

      ...parsedResponse,

      score
    };

  } catch (error) {
    return {
      ...results,

      error:
        error instanceof Error
          ? error.message
          : String(error),

      score: 0
    };
  }
}

// ---------------------------------------------------------
// ADDITIONAL FILE DISCOVERY
// ---------------------------------------------------------

function discoverAdditionalFiles(
  challengeMetadata,
  projectDir
) {
  const additionalFiles = [];

  const checkedDirs =
    new Set();

  for (
    const filePath of
      challengeMetadata.filesToCheck || []
  ) {
    const dir =
      dirname(filePath);

    if (
      checkedDirs.has(dir)
    ) {
      continue;
    }

    checkedDirs.add(dir);

    const fullDir =
      join(
        projectDir,
        dir
      );

    if (!existsSync(fullDir)) {
      continue;
    }

    try {
      const files =
        readdirSync(
          fullDir
        );

      for (
        const file of files
      ) {
        const fullPath =
          join(
            fullDir,
            file
          );

        if (
          !statSync(
            fullPath
          ).isFile()
        ) {
          continue;
        }

        if (
          !CODE_EXTENSIONS.includes(
            extname(file)
          )
        ) {
          continue;
        }

        const relativePath =
          join(
            dir,
            file
          ).replace(
            /\\/g,
            '/'
          );

        if (
          challengeMetadata.filesToCheck.includes(
            relativePath
          )
        ) {
          continue;
        }

        try {
          const content =
            readFileSync(
              fullPath,
              'utf-8'
            );

          if (
            content.trim().length > 0
          ) {
            additionalFiles.push({
              file: relativePath,

              content:
                content.substring(
                  0,
                  2000
                )
            });
          }
        } catch {
          // Ignore unreadable files
        }
      }
    } catch {
      // Ignore unreadable directories
    }
  }

  return additionalFiles;
}

// ---------------------------------------------------------
// NORMAL REVIEW PROMPT
// ---------------------------------------------------------

function buildReviewPrompt(
  challengeId,
  challengeMetadata,
  instructions,
  requirements,
  codeFiles,
  missingFiles
) {
  const challengeName =
    challengeMetadata.challengeName ||
    challengeId;

  const skills =
    challengeMetadata.skills || [];

  const patternsRequired =
    challengeMetadata.patternsRequired || [];

  const codeContext =
    codeFiles
      .map(
        file =>
          `File: ${file.file}\n${file.content}`
      )
      .join(
        '\n\n---\n\n'
      );

  const missingFilesNote =
    missingFiles.length > 0
      ? `Missing files: ${missingFiles.join(', ')}`
      : '';

  const requirementsSummary =
    requirements
      ? requirements.substring(
          0,
          900
        )
      : '';

  const instructionsSummary =
    instructions
      ? instructions.substring(
          0,
          1200
        )
      : '';

  return `
You are an expert React, Redux Toolkit and RTK Query reviewer.

Review challenge:
${challengeName} (${challengeId})

Skills:
${skills.join(', ')}

Required patterns:
${patternsRequired.join(', ')}

Instructions:
${instructionsSummary}

Requirements:
${requirementsSummary}

USER CODE:
${codeContext}

${missingFilesNote}

Return ONLY valid JSON.

{
  "readability": 85,
  "maintainability": 85,
  "requirementCompliance": 90,
  "strengths": ["specific strength"],
  "improvements": ["specific improvement"],
  "overall": "Short assessment"
}

Be concise.
`;
}

// ---------------------------------------------------------
// COMPACT FALLBACK PROMPT
// ---------------------------------------------------------

function buildCompactReviewPrompt(
  challengeId,
  challengeMetadata,
  codeFiles
) {
  const code =
    codeFiles
      .slice(0, 2)
      .map(
        file =>
          `${file.file}:\n${file.content.substring(
            0,
            1500
          )}`
      )
      .join('\n\n');

  return `
Review this RTK Query challenge.

Challenge:
${challengeId}

Required patterns:
${(
  challengeMetadata.patternsRequired ||
  []
).join(', ')}

Code:
${code}

Return ONLY JSON:
{
  "readability": 80,
  "maintainability": 80,
  "requirementCompliance": 90,
  "strengths": ["good implementation"],
  "improvements": ["minor improvement"],
  "overall": "Short review"
}

Be concise.
`;
}

// ---------------------------------------------------------
// GROQ API
// ---------------------------------------------------------

async function callGroqAPI(
  prompt
) {
  const response =
    await fetch(
      GROQ_API_URL,
      {
        method: 'POST',

        headers: {
          Authorization:
            `Bearer ${GROQ_API_KEY}`,

          'Content-Type':
            'application/json'
        },

        body:
          JSON.stringify({
            model: MODEL,

            messages: [
              {
                role: 'system',

                content:
                  'You are an expert code reviewer. Return only valid JSON.'
              },

              {
                role: 'user',

                content: prompt
              }
            ],

            temperature: 0.2,

            max_tokens: 600
          })
      }
    );

  const data =
    await response
      .json()
      .catch(
        () => ({})
      );

  if (!response.ok) {
    const message =
      data?.error?.message ||
      data?.error ||
      response.statusText;

    throw new Error(
      `Groq API error (${response.status}): ${message}`
    );
  }

  const content =
    data?.choices?.[0]?.message?.content;

  if (
    typeof content !==
    'string'
  ) {
    throw new Error(
      'Groq API returned no usable content.'
    );
  }

  return content;
}

// ---------------------------------------------------------
// PARSE AI RESPONSE
// ---------------------------------------------------------

function parseAIResponse(
  response
) {
  if (
    !response ||
    typeof response !== 'string'
  ) {
    return {
      readability: 0,
      maintainability: 0,
      requirementCompliance: 0,
      strengths: [],
      improvements: [],
      overall: ''
    };
  }

  let cleaned =
    response.trim();

  // Remove markdown fences
  cleaned =
    cleaned
      .replace(
        /^```json\s*/i,
        ''
      )
      .replace(
        /^```\s*/i,
        ''
      )
      .replace(
        /\s*```$/i,
        ''
      )
      .trim();

  // -------------------------------------------------------
  // Try direct JSON first
  // -------------------------------------------------------

  try {
    const parsed =
      JSON.parse(
        cleaned
      );

    return normalizeAIResponse(
      parsed
    );
  } catch {
    // Continue below
  }

  // -------------------------------------------------------
  // Extract JSON object
  // -------------------------------------------------------

  const start =
    cleaned.indexOf('{');

  const end =
    cleaned.lastIndexOf('}');

  if (
    start !== -1 &&
    end !== -1 &&
    end > start
  ) {
    const jsonText =
      cleaned.substring(
        start,
        end + 1
      );

    try {
      const parsed =
        JSON.parse(
          jsonText
        );

      return normalizeAIResponse(
        parsed
      );
    } catch {
      // Continue with regex fallback
    }
  }

  // -------------------------------------------------------
  // Regex fallback
  // -------------------------------------------------------

  const readability =
    extractNumber(
      cleaned,
      'readability'
    );

  const maintainability =
    extractNumber(
      cleaned,
      'maintainability'
    );

  const requirementCompliance =
    extractNumber(
      cleaned,
      'requirementCompliance'
    );

  return {
    readability,

    maintainability,

    requirementCompliance,

    strengths:
      extractList(
        cleaned,
        /strengths?/i
      ),

    improvements:
      extractList(
        cleaned,
        /improvements?/i
      ),

    overall:
      cleaned.substring(
        0,
        500
      )
  };
}

// ---------------------------------------------------------
// NORMALIZE AI RESPONSE
// ---------------------------------------------------------

function normalizeAIResponse(
  parsed
) {
  return {
    readability:
      clampScore(
        parsed?.readability
      ),

    maintainability:
      clampScore(
        parsed?.maintainability
      ),

    requirementCompliance:
      clampScore(
        parsed?.requirementCompliance
      ),

    strengths:
      Array.isArray(
        parsed?.strengths
      )
        ? parsed.strengths
            .filter(
              item =>
                typeof item ===
                'string'
            )
            .slice(0, 5)
        : [],

    improvements:
      Array.isArray(
        parsed?.improvements
      )
        ? parsed.improvements
            .filter(
              item =>
                typeof item ===
                'string'
            )
            .slice(0, 5)
        : [],

    overall:
      typeof parsed?.overall ===
      'string'
        ? parsed.overall
        : ''
  };
}

// ---------------------------------------------------------
// NUMBER EXTRACTION
// ---------------------------------------------------------

function extractNumber(
  text,
  key
) {
  const regex =
    new RegExp(
      `"?'?${key}"?'?\\s*[:=]\\s*"?([0-9]+(?:\\.[0-9]+)?)`,
      'i'
    );

  const match =
    text.match(
      regex
    );

  return match
    ? clampScore(
        Number(match[1])
      )
    : 0;
}

// ---------------------------------------------------------
// SCORE CLAMP
// ---------------------------------------------------------

function clampScore(
  value
) {
  const number =
    Number(value);

  if (
    !Number.isFinite(
      number
    )
  ) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(
      100,
      number
    )
  );
}

// ---------------------------------------------------------
// EXTRACT LIST
// ---------------------------------------------------------

function extractList(
  text,
  keyword
) {
  const lines =
    text.split('\n');

  const list = [];

  let inList = false;

  for (
    const line of lines
  ) {
    if (
      keyword.test(line)
    ) {
      inList = true;
      continue;
    }

    if (
      inList &&
      (
        line.trim().startsWith('-') ||
        /^\d+\./.test(
          line.trim()
        )
      )
    ) {
      const item =
        line
          .trim()
          .replace(
            /^[-•\d."]+\s*/,
            ''
          )
          .replace(
            /^["']|["']$/g,
            ''
          );

      if (item) {
        list.push(item);
      }

      if (
        list.length >= 5
      ) {
        break;
      }
    }

    if (
      inList &&
      line.trim() === '' &&
      list.length > 0
    ) {
      break;
    }
  }

  return list;
}

// ---------------------------------------------------------
// AI SCORE
// ---------------------------------------------------------

function calculateAIScore(
  parsedResponse
) {
  const readability =
    clampScore(
      parsedResponse.readability
    );

  const maintainability =
    clampScore(
      parsedResponse.maintainability
    );

  const requirementCompliance =
    clampScore(
      parsedResponse.requirementCompliance
    );

  const score =
    Math.round(
      requirementCompliance *
        0.4 +
      readability *
        0.3 +
      maintainability *
        0.3
    );

  return Math.max(
    0,
    Math.min(
      100,
      score
    )
  );
}