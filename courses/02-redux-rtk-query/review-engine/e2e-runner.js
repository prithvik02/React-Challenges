import { spawnSync, execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

const E2E_TIMEOUT_MS = 240000;

export async function runE2ETests(challengeId, projectDir) {
  const challengeNum = challengeId.split('-')[0];
  const testFileName = `challenge-${challengeNum}.spec.ts`;
  const testFileAbs = join(
    projectDir,
    'tests',
    'e2e',
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
      details: []
    };
  }

  try {
    const env = { ...process.env };
    delete env.CI;

    let output = '';

    if (process.platform === 'win32') {
      try {
        output = execSync(
          `npx playwright test "${testFileRel}" --reporter=json`,
          {
            cwd: projectDir,
            encoding: 'utf-8',
            timeout: E2E_TIMEOUT_MS,
            env,
            stdio: ['ignore', 'pipe', 'pipe']
          }
        );
      } catch (error) {
        const stdout = error.stdout
          ? String(error.stdout)
          : '';

        const stderr = error.stderr
          ? String(error.stderr)
          : '';

        output = stdout + stderr;

        const parsed = parsePlaywrightOutput(output);

        if (parsed) {
          return createResult(parsed);
        }

        throw error;
      }
    } else {
      const result = spawnSync(
        'npx',
        [
          'playwright',
          'test',
          testFileRel,
          '--reporter=json'
        ],
        {
          cwd: projectDir,
          encoding: 'utf-8',
          timeout: E2E_TIMEOUT_MS,
          env,
          shell: false
        }
      );

      output =
        (result.stdout || '') +
        (result.stderr || '');

      if (result.error) {
        throw result.error;
      }

      if (result.status !== 0) {
        const error = new Error(
          result.signal
            ? String(result.signal)
            : `Exit ${result.status}`
        );

        error.stdout = result.stdout || '';
        error.stderr = result.stderr || '';

        throw error;
      }
    }

    const testResults =
      parsePlaywrightOutput(output);

    if (!testResults) {
      return {
        score: 0,
        passed: false,
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        error: 'Could not parse Playwright JSON output.',
        details: []
      };
    }

    return createResult(testResults);

  } catch (error) {
    const stdout = error.stdout
      ? String(error.stdout)
      : '';

    const stderr = error.stderr
      ? String(error.stderr)
      : '';

    const errorOutput =
      `${stdout}\n${stderr}`.trim();

    const parsed =
      parsePlaywrightOutput(errorOutput);

    if (parsed) {
      return createResult(parsed);
    }

    const fullMessage = [
      error.message,
      errorOutput
    ]
      .filter(Boolean)
      .join('\n');

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
        ? 'Playwright browsers not installed. Run from repo root: npm run setup (or in project: npx playwright install).'
        : 'E2E failed. The app is started automatically by Playwright (webServer in playwright.config).'
    };
  }
}

function parsePlaywrightOutput(output) {
  if (!output) {
    return null;
  }

  const text = String(output).trim();

  try {
    return JSON.parse(text);
  } catch (error) {
  }

  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');

  if (
    start !== -1 &&
    end !== -1 &&
    end > start
  ) {
    const jsonText =
      text.substring(start, end + 1);

    try {
      return JSON.parse(jsonText);
    } catch (error) {
    }
  }

  return null;
}

function createResult(testResults) {
  const stats =
    testResults.stats || {};

  const expected =
    Number(stats.expected || 0);

  const unexpected =
    Number(stats.unexpected || 0);

  const skipped =
    Number(stats.skipped || 0);

  const flaky =
    Number(stats.flaky || 0);

  const totalTests =
    expected +
    unexpected +
    skipped +
    flaky;

  const passedTests =
    expected;

  const failedTests =
    unexpected;

  const score =
    totalTests > 0
      ? (passedTests / totalTests) * 100
      : 0;

  return {
    score:
      Math.round(score * 10) / 10,

    passed:
      failedTests === 0 &&
      totalTests > 0,

    totalTests,
    passedTests,
    failedTests,
    skippedTests: skipped,
    flakyTests: flaky,

    details:
      testResults.suites || [],

    screenshots:
      testResults.screenshots || []
  };
}