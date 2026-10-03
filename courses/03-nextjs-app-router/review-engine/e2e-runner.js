import { spawnSync, execSync } from "child_process";
import { existsSync } from "fs";
import { join } from "path";

const E2E_TIMEOUT_MS = 240000;

export async function runE2ETests(challengeId, projectDir) {
  const challengeNum = challengeId.split("-")[0];
  const testFileName = `challenge-${challengeNum}.spec.ts`;

  const testFileAbs = join(
    projectDir,
    "tests",
    "e2e",
    testFileName
  );

  const testFileRel = `tests/e2e/${testFileName}`;

  if (!existsSync(testFileAbs)) {
    return {
      score: 0,
      passed: false,
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      error: `E2E test file not found: ${testFileAbs}`,
      details: [],
    };
  }

  try {
    const env = { ...process.env };

    let output = "";

    if (process.platform === "win32") {
      output = execSync(
        `npx playwright test "${testFileRel}" --reporter=json`,
        {
          cwd: projectDir,
          encoding: "utf8",
          timeout: E2E_TIMEOUT_MS,
          env,
          stdio: ["ignore", "pipe", "pipe"],
        }
      );
    } else {
      const result = spawnSync(
        "npx",
        [
          "playwright",
          "test",
          testFileRel,
          "--reporter=json",
        ],
        {
          cwd: projectDir,
          encoding: "utf8",
          timeout: E2E_TIMEOUT_MS,
          env,
          shell: false,
        }
      );

      output = `${result.stdout || ""}${result.stderr || ""}`;

      if (result.error) {
        throw result.error;
      }

      if (result.status !== 0) {
        const error = new Error(
          result.signal
            ? String(result.signal)
            : `Playwright exited with code ${result.status}`
        );

        error.stdout = result.stdout;
        error.stderr = result.stderr;

        throw error;
      }
    }

    const testResults = parsePlaywrightJson(output);

    return createResult(testResults);
  } catch (error) {
    const errorOutput = `${error.stdout || ""}${error.stderr || ""}`;

    const parsedResults = tryParsePlaywrightJson(errorOutput);

    if (parsedResults) {
      return createResult(parsedResults, error.message);
    }

    const fullMessage = [
      error.message,
      errorOutput.trim(),
    ]
      .filter(Boolean)
      .join("\n");

    const needsBrowsers =
      /Executable doesn't exist|browserType\.launch|playwright install/i.test(
        fullMessage
      );

    return {
      score: 0,
      passed: false,
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      error: fullMessage,
      details: [],
      note: needsBrowsers
        ? "Playwright browsers not installed. Run: npx playwright install"
        : "E2E test command failed.",
    };
  }
}

function parsePlaywrightJson(output) {
  const parsed = tryParsePlaywrightJson(output);

  if (!parsed) {
    throw new Error(
      "Could not parse Playwright JSON output."
    );
  }

  return parsed;
}

function tryParsePlaywrightJson(output) {
  if (!output) {
    return null;
  }

  const text = String(output).trim();

  try {
    return JSON.parse(text);
  } catch {
    // Playwright JSON may have extra output before the JSON.
  }

  const start = text.indexOf("{");

  if (start === -1) {
    return null;
  }

  const jsonText = text.slice(start);

  try {
    return JSON.parse(jsonText);
  } catch {
    return null;
  }
}

function createResult(testResults, errorMessage = null) {
  const stats = testResults.stats || {};

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  if (
    typeof stats.expected === "number" ||
    typeof stats.unexpected === "number" ||
    typeof stats.skipped === "number" ||
    typeof stats.flaky === "number"
  ) {
    passedTests = stats.expected || 0;
    failedTests = stats.unexpected || 0;

    totalTests =
      passedTests +
      failedTests +
      (stats.skipped || 0) +
      (stats.flaky || 0);
  }

  if (totalTests === 0 && testResults.suites) {
    const counts = countSpecs(testResults.suites);

    totalTests = counts.total;
    passedTests = counts.passed;
    failedTests = counts.failed;
  }

  const score =
    totalTests > 0
      ? (passedTests / totalTests) * 100
      : 0;

  return {
    score: Math.round(score * 10) / 10,
    passed:
      totalTests > 0 &&
      failedTests === 0 &&
      passedTests === totalTests,
    totalTests,
    passedTests,
    failedTests,
    details: testResults.suites || [],
    screenshots: testResults.screenshots || [],
    ...(errorMessage ? { error: errorMessage } : {}),
  };
}

function countSpecs(suites) {
  let total = 0;
  let passed = 0;
  let failed = 0;

  for (const suite of suites || []) {
    for (const spec of suite.specs || []) {
      total++;

      const hasPassedResult = (spec.tests || []).some((test) =>
        (test.results || []).some(
          (result) => result.status === "passed"
        )
      );

      if (hasPassedResult) {
        passed++;
      } else {
        failed++;
      }
    }

    const nested = countSpecs(suite.suites || []);

    total += nested.total;
    passed += nested.passed;
    failed += nested.failed;
  }

  return {
    total,
    passed,
    failed,
  };
}