import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";

export async function checkArchitecture(challengeMetadata, projectDir) {
  const patternsRequired = challengeMetadata.patternsRequired || [];
  const filesToCheck = challengeMetadata.filesToCheck || [];

  if (patternsRequired.length === 0) {
    return {
      score: 100,
      passed: true,
      details: []
    };
  }

  const results = {
    score: 0,
    passed: false,
    patternsFound: [],
    patternsMissing: [],
    details: []
  };

  const patternFiles = {};

  for (const pattern of patternsRequired) {
    patternFiles[pattern] = [];
  }

  for (const file of filesToCheck) {
    const filePath = join(projectDir, file);

    if (!existsSync(filePath)) {
      results.details.push({
        file,
        error: "File does not exist",
        patternsFound: [],
        patternsMissing: patternsRequired
      });
      continue;
    }

    try {
      const content = readFileSync(filePath, "utf-8");

      const foundPatterns = checkFileForPatterns(
        content,
        patternsRequired,
        file
      );

      for (const pattern of foundPatterns) {
        if (patternFiles[pattern]) {
          patternFiles[pattern].push(file);
        }
      }

      results.details.push({
        file,
        patternsFound: foundPatterns,
        patternsMissing: patternsRequired.filter(
          pattern => !foundPatterns.includes(pattern)
        )
      });
    } catch (error) {
      results.details.push({
        file,
        error: error.message,
        patternsFound: [],
        patternsMissing: patternsRequired
      });
    }
  }

  for (const pattern of patternsRequired) {
    if (patternFiles[pattern] && patternFiles[pattern].length > 0) {
      results.patternsFound.push(pattern);
    } else {
      results.patternsMissing.push(pattern);
    }
  }

  results.score =
    patternsRequired.length > 0
      ? Math.round(
          (results.patternsFound.length / patternsRequired.length) *
            100 *
            10
        ) / 10
      : 100;

  results.passed = results.score >= 80;

  return results;
}

function checkFileForPatterns(content, patternsRequired, fileName) {
  const foundPatterns = new Set();
  const normalizedFileName = fileName.replace(/\\/g, "/");

  try {
    const ast = parse(content, {
      sourceType: "module",
      plugins: [
        "typescript",
        "jsx",
        "decorators-legacy",
        "classProperties"
      ]
    });

    traverse.default(ast, {
      Program(path) {
        const hasUseClient = path.node.directives?.some(
          directive => directive.value.value === "use client"
        );

        if (
          !hasUseClient &&
          normalizedFileName.includes("page.tsx")
        ) {
          foundPatterns.add("serverComponent");
        }

        if (normalizedFileName.includes("app/")) {
          foundPatterns.add("appDirectory");
        }

        if (normalizedFileName.includes("page.tsx")) {
          foundPatterns.add("fileBasedRouting");
        }
      },

      Directive(path) {
        if (path.node.value.value === "use client") {
          foundPatterns.add("useClient");
          foundPatterns.add("clientComponent");
        }
      },

      ImportDeclaration(path) {
        const source = path.node.source.value;

        if (source === "next/link") {
          foundPatterns.add("Link");
        }

        if (source === "next/navigation") {
          foundPatterns.add("navigation");
        }

        if (source === "next/image") {
          foundPatterns.add("nextImage");
        }

        if (
          source === "next/font/google" ||
          source === "next/font/local"
        ) {
          foundPatterns.add("nextFont");
        }

        if (source === "@reduxjs/toolkit") {
          foundPatterns.add("configureStore");
        }

        if (source === "react-redux") {
          for (const specifier of path.node.specifiers) {
            const name =
              specifier.imported?.name ||
              specifier.local?.name;

            if (name === "Provider") {
              foundPatterns.add("Provider");
            }

            if (name === "useSelector") {
              foundPatterns.add("useSelector");
            }

            if (name === "useDispatch") {
              foundPatterns.add("useDispatch");
            }
          }
        }
      },

      FunctionDeclaration(path) {
        if (path.node.async) {
          foundPatterns.add("asyncComponent");

          if (
            path.node.id?.name?.toLowerCase().includes("action") ||
            content.includes("use server")
          ) {
            foundPatterns.add("serverAction");
          }
        }
      },

      ArrowFunctionExpression(path) {
        if (path.node.async) {
          foundPatterns.add("asyncComponent");
        }
      },

      ExportNamedDeclaration(path) {
        if (!path.node.declaration) {
          return;
        }

        const declaration = path.node.declaration;

        if (
          declaration.id &&
          declaration.id.name === "metadata"
        ) {
          foundPatterns.add("metadata");
        }

        if (
          declaration.id &&
          declaration.id.name === "generateMetadata"
        ) {
          foundPatterns.add("generateMetadata");
        }
      },

      ExportDefaultDeclaration(path) {
        const declaration = path.node.declaration;

        if (
          declaration &&
          declaration.type === "FunctionDeclaration" &&
          declaration.async
        ) {
          foundPatterns.add("asyncComponent");
        }
      },

      CallExpression(path) {
        if (
          path.node.callee?.name === "NextResponse"
        ) {
          foundPatterns.add("apiRoute");
        }

        if (
          path.node.callee?.object?.name === "Response" &&
          path.node.callee?.property?.name === "json"
        ) {
          foundPatterns.add("apiRoute");
        }

        if (
          path.node.callee?.name === "configureStore"
        ) {
          foundPatterns.add("configureStore");
        }

        if (
          path.node.callee?.name === "useSelector"
        ) {
          foundPatterns.add("useSelector");
        }

        if (
          path.node.callee?.name === "useDispatch"
        ) {
          foundPatterns.add("useDispatch");
        }
      },

      JSXElement(path) {
        const name =
          path.node.openingElement?.name?.name;

        if (name === "form") {
          foundPatterns.add("formHandling");
        }

        if (name === "Provider") {
          foundPatterns.add("Provider");
        }
      },

      VariableDeclaration(path) {
        for (const declaration of path.node.declarations) {
          if (
            declaration.id?.name === "dynamic"
          ) {
            foundPatterns.add("dynamicExport");
          }

          if (
            declaration.id?.name === "revalidate"
          ) {
            foundPatterns.add("revalidate");
          }
        }
      }
    });
  } catch (error) {
    if (content.includes("use client")) {
      foundPatterns.add("useClient");
      foundPatterns.add("clientComponent");
    }

    if (
      normalizedFileName.includes("page.tsx") &&
      !content.includes("use client")
    ) {
      foundPatterns.add("serverComponent");
    }

    if (normalizedFileName.includes("app/")) {
      foundPatterns.add("appDirectory");
    }

    if (normalizedFileName.includes("page.tsx")) {
      foundPatterns.add("fileBasedRouting");
    }

    if (content.includes('from "next/link"')) {
      foundPatterns.add("Link");
    }
  }

  return patternsRequired.filter(pattern =>
    foundPatterns.has(pattern)
  );
}