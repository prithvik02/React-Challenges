import { readFileSync, existsSync, readdirSync } from "fs";
import { join } from "path";

function getProjectFiles(projectDir) {
  const files = [];

  function scanDirectory(directory) {
    if (!existsSync(directory)) {
      return;
    }

    const entries = readdirSync(directory, {
      withFileTypes: true
    });

    for (const entry of entries) {
      const fullPath = join(directory, entry.name);

      if (
        entry.name === "node_modules" ||
        entry.name === ".next" ||
        entry.name === ".git"
      ) {
        continue;
      }

      if (entry.isDirectory()) {
        scanDirectory(fullPath);
      } else if (
        /\.(tsx|ts|jsx|js)$/.test(entry.name)
      ) {
        files.push(fullPath);
      }
    }
  }

  scanDirectory(projectDir);

  return files;
}

function checkFile(filePath, projectDir) {
  const content = readFileSync(filePath, "utf-8");

  const relativePath = filePath
    .replace(projectDir, "")
    .replace(/\\/g, "/")
    .replace(/^\/+/, "");

  return {
    file: relativePath,
    content,

    serverComponent:
      !content.includes('"use client"') &&
      !content.includes("'use client'"),

    clientComponent:
      content.includes('"use client"') ||
      content.includes("'use client'"),

    useState:
      content.includes("useState"),

    useClient:
      content.includes('"use client"') ||
      content.includes("'use client'"),

    link:
      content.includes("next/link") ||
      content.includes("<Link"),

    appDirectory:
      relativePath.startsWith("app/"),

    fileBasedRouting:
      relativePath.includes("/page.") ||
      relativePath.includes("/layout."),

    functionalComponent:
      /export default function\s+\w+/.test(content) ||
      /function\s+\w+\s*\(/.test(content),

    reactHooks:
      /use[A-Z]\w*\s*\(/.test(content)
  };
}

export function checkArchitecture(
  projectDir,
  requirements = {}
) {
  const files = getProjectFiles(projectDir);

  const results = {
    score: 0,
    found: [],
    missing: [],
    details: []
  };

  if (files.length === 0) {
    return {
      score: 0,
      found: [],
      missing: ["No source files found"],
      details: []
    };
  }

  const checkedFiles = files.map((file) =>
    checkFile(file, projectDir)
  );

  /*
   * Check architecture across the entire project.
   *
   * A pattern such as useState only needs to exist
   * in the appropriate Client Component. It should
   * not be required in every file.
   */
  const projectPatterns = {
    useClient: checkedFiles.some(
      (file) => file.useClient
    ),

    clientComponent: checkedFiles.some(
      (file) => file.clientComponent
    ),

    useState: checkedFiles.some(
      (file) => file.useState
    ),

    serverComponent: checkedFiles.some(
      (file) => file.serverComponent
    ),

    functionalComponent: checkedFiles.some(
      (file) => file.functionalComponent
    ),

    appDirectory: checkedFiles.some(
      (file) => file.appDirectory
    ),

    fileBasedRouting: checkedFiles.some(
      (file) => file.fileBasedRouting
    ),

    Link: checkedFiles.some(
      (file) => file.link
    ),

    reactHooks: checkedFiles.some(
      (file) => file.reactHooks
    )
  };

  const expectedPatterns = [];

  if (
    requirements.useClient ||
    requirements.clientComponent
  ) {
    expectedPatterns.push("useClient");
  }

  if (requirements.useState) {
    expectedPatterns.push("useState");
  }

  if (requirements.serverComponent) {
    expectedPatterns.push("serverComponent");
  }

  if (requirements.functionalComponent) {
    expectedPatterns.push("functionalComponent");
  }

  if (requirements.appDirectory) {
    expectedPatterns.push("appDirectory");
  }

  if (requirements.fileBasedRouting) {
    expectedPatterns.push("fileBasedRouting");
  }

  if (
    requirements.Link ||
    requirements.link
  ) {
    expectedPatterns.push("Link");
  }

  if (requirements.reactHooks) {
    expectedPatterns.push("reactHooks");
  }

  /*
   * If the challenge doesn't explicitly define
   * architecture requirements, detect the important
   * Next.js patterns automatically.
   */
  if (expectedPatterns.length === 0) {
    expectedPatterns.push(
      "appDirectory",
      "fileBasedRouting"
    );

    if (projectPatterns.useClient) {
      expectedPatterns.push("useClient");
    }

    if (projectPatterns.useState) {
      expectedPatterns.push("useState");
    }

    if (projectPatterns.Link) {
      expectedPatterns.push("Link");
    }
  }

  for (const pattern of expectedPatterns) {
    if (projectPatterns[pattern]) {
      results.found.push(pattern);
    } else {
      results.missing.push(pattern);
    }
  }

  if (expectedPatterns.length > 0) {
    results.score = Math.round(
      (results.found.length /
        expectedPatterns.length) *
        100
    );
  } else {
    results.score = 100;
  }

  /*
   * File-level details
   */
  for (const file of checkedFiles) {
    const found = [];

    if (file.useClient) {
      found.push("useClient");
    }

    if (file.useState) {
      found.push("useState");
    }

    if (file.serverComponent) {
      found.push("serverComponent");
    }

    if (file.link) {
      found.push("Link");
    }

    if (file.appDirectory) {
      found.push("appDirectory");
    }

    if (file.fileBasedRouting) {
      found.push("fileBasedRouting");
    }

    if (file.functionalComponent) {
      found.push("functionalComponent");
    }

    if (file.reactHooks) {
      found.push("reactHooks");
    }

    results.details.push({
      file: file.file,
      found
    });
  }

  return results;
}