import { existsSync, readFileSync, readdirSync } from "fs";
import { join } from "path";

function getSourceFiles(projectDir) {
  const files = [];

  function scan(directory) {
    if (!existsSync(directory)) {
      return;
    }

    const entries = readdirSync(directory, {
      withFileTypes: true
    });

    for (const entry of entries) {
      if (
        entry.name === "node_modules" ||
        entry.name === ".next" ||
        entry.name === ".git"
      ) {
        continue;
      }

      const fullPath = join(directory, entry.name);

      if (entry.isDirectory()) {
        scan(fullPath);
      } else if (
        /\.(js|jsx|ts|tsx)$/.test(entry.name)
      ) {
        files.push(fullPath);
      }
    }
  }

  scan(projectDir);

  return files;
}

function analyzeFile(filePath, projectDir) {
  const content = readFileSync(filePath, "utf8");

  const relativePath = filePath
    .replace(projectDir, "")
    .replace(/\\/g, "/")
    .replace(/^\/+/, "");

  const isClient =
    content.includes("'use client'") ||
    content.includes('"use client"');

  const isPage =
    /(^|\/)page\.(js|jsx|ts|tsx)$/.test(
      relativePath
    );

  const isLayout =
    /(^|\/)layout\.(js|jsx|ts|tsx)$/.test(
      relativePath
    );

  return {
    file: relativePath,
    content,

    isClient,

    isServer:
      !isClient &&
      relativePath.startsWith("app/"),

    isPage,

    isLayout,

    useState:
      /\buseState\b/.test(content),

    hasLink:
      content.includes("next/link") ||
      /<Link\b/.test(content),

    hasFetch:
      /\bfetch\s*\(/.test(content),

    isAsync:
      /export\s+default\s+async\s+function/.test(
        content
      ) ||
      /async\s+function/.test(content)
  };
}

export function checkArchitecture(
  challengeMetadata,
  projectDir
) {
  /*
   * IMPORTANT:
   * The review engine calls this function as:
   *
   * checkArchitecture(challengeMetadata, PROJECT_DIR)
   *
   * Therefore the arguments must stay in this order.
   */

  const challengeId =
    challengeMetadata?.id || "";

  const files = getSourceFiles(projectDir);

  const analyzedFiles = files.map((file) =>
    analyzeFile(file, projectDir)
  );

  const found = [];
  const missing = [];

  /*
   * Common Next.js App Router patterns.
   */
  const hasAppDirectory =
    analyzedFiles.some(
      (file) =>
        file.file === "app" ||
        file.file.startsWith("app/")
    );

  const hasFileBasedRouting =
    analyzedFiles.some(
      (file) =>
        file.isPage ||
        file.isLayout
    );

  const hasServerComponent =
    analyzedFiles.some(
      (file) => file.isServer
    );

  const hasClientComponent =
    analyzedFiles.some(
      (file) => file.isClient
    );

  const hasUseState =
    analyzedFiles.some(
      (file) => file.useState
    );

  const hasLink =
    analyzedFiles.some(
      (file) => file.hasLink
    );

  /*
   * Challenge 03 specific checks.
   */
  const postsPage = analyzedFiles.find(
    (file) =>
      file.file === "app/posts/page.tsx"
  );

  const hasPostsPage =
    Boolean(postsPage);

  const hasAsyncServerComponent =
    Boolean(
      postsPage &&
      postsPage.isAsync &&
      !postsPage.isClient
    );

  const hasServerDataFetching =
    Boolean(
      postsPage &&
      postsPage.hasFetch &&
      !postsPage.isClient
    );

  /*
   * Challenge 01
   */
  if (
    challengeId ===
    "01-app-router-pages-layout"
  ) {
    if (hasAppDirectory) {
      found.push("appDirectory");
    } else {
      missing.push("appDirectory");
    }

    if (hasFileBasedRouting) {
      found.push("fileBasedRouting");
    } else {
      missing.push("fileBasedRouting");
    }

    if (hasServerComponent) {
      found.push("serverComponent");
    } else {
      missing.push("serverComponent");
    }

    if (hasLink) {
      found.push("Link");
    } else {
      missing.push("Link");
    }
  }

  /*
   * Challenge 02
   */
  else if (
    challengeId ===
    "02-server-and-client-components"
  ) {
    if (hasAppDirectory) {
      found.push("appDirectory");
    } else {
      missing.push("appDirectory");
    }

    if (hasFileBasedRouting) {
      found.push("fileBasedRouting");
    } else {
      missing.push("fileBasedRouting");
    }

    if (hasServerComponent) {
      found.push("serverComponent");
    } else {
      missing.push("serverComponent");
    }

    if (hasClientComponent) {
      found.push("useClient");
    } else {
      missing.push("useClient");
    }

    if (hasUseState) {
      found.push("useState");
    } else {
      missing.push("useState");
    }
  }

  /*
   * Challenge 03
   */
  else if (
    challengeId ===
    "03-data-fetching-server"
  ) {
    if (hasAppDirectory) {
      found.push("appDirectory");
    } else {
      missing.push("appDirectory");
    }

    if (hasFileBasedRouting) {
      found.push("fileBasedRouting");
    } else {
      missing.push("fileBasedRouting");
    }

    if (hasServerComponent) {
      found.push("serverComponent");
    } else {
      missing.push("serverComponent");
    }

    if (hasPostsPage) {
      found.push("postsPage");
    } else {
      missing.push("postsPage");
    }

    if (hasAsyncServerComponent) {
      found.push("asyncServerComponent");
    } else {
      missing.push("asyncServerComponent");
    }

    if (hasServerDataFetching) {
      found.push("serverDataFetching");
    } else {
      missing.push("serverDataFetching");
    }
  }

  /*
   * Fallback for future challenges.
   */
  else {
    if (hasAppDirectory) {
      found.push("appDirectory");
    }

    if (hasFileBasedRouting) {
      found.push("fileBasedRouting");
    }

    if (hasServerComponent) {
      found.push("serverComponent");
    }

    if (hasClientComponent) {
      found.push("useClient");
    }

    if (hasUseState) {
      found.push("useState");
    }

    if (hasLink) {
      found.push("Link");
    }

    if (hasPostsPage) {
      found.push("postsPage");
    }

    if (hasAsyncServerComponent) {
      found.push(
        "asyncServerComponent"
      );
    }

    if (hasServerDataFetching) {
      found.push(
        "serverDataFetching"
      );
    }
  }

  const requiredCount =
    found.length + missing.length;

  const score =
    requiredCount === 0
      ? 100
      : Math.round(
          (found.length /
            requiredCount) *
            100
        );

  const details =
    analyzedFiles.map((file) => {
      const fileFound = [];

      if (file.isClient) {
        fileFound.push("useClient");
      }

      if (
        file.isServer
      ) {
        fileFound.push(
          "serverComponent"
        );
      }

      if (file.useState) {
        fileFound.push("useState");
      }

      if (file.hasLink) {
        fileFound.push("Link");
      }

      if (file.hasFetch) {
        fileFound.push("fetch");
      }

      if (file.isAsync) {
        fileFound.push("asyncComponent");
      }

      return {
        file: file.file,
        patternsFound: fileFound,
        patternsMissing: []
      };
    });

  return {
    score,

    patternsFound: found,

    patternsMissing: missing,

    found,

    missing,

    details
  };
}