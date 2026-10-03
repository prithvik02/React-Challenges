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
      patternsFound: [],
      patternsMissing: [],
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

    const content = readFileSync(filePath, "utf8");
    const foundPatterns = checkFileForPatterns(
      content,
      patternsRequired,
      file
    );

    results.details.push({
      file,
      patternsFound: foundPatterns,
      patternsMissing: patternsRequired.filter(
        pattern => !foundPatterns.includes(pattern)
      )
    });

    for (const pattern of foundPatterns) {
      if (!results.patternsFound.includes(pattern)) {
        results.patternsFound.push(pattern);
      }
    }
  }

  results.patternsMissing = patternsRequired.filter(
    pattern => !results.patternsFound.includes(pattern)
  );

  results.score =
    patternsRequired.length === 0
      ? 100
      : Math.round(
          (results.patternsFound.length /
            patternsRequired.length) *
            100
        );

  results.passed = results.score >= 80;

  return results;
}

function checkFileForPatterns(
  content,
  patternsRequired,
  fileName
) {
  const foundPatterns = new Set();

  const normalizedFileName = fileName
    .replace(/\\/g, "/")
    .toLowerCase();

  function add(pattern) {
    if (patternsRequired.includes(pattern)) {
      foundPatterns.add(pattern);
    }
  }

  if (
    normalizedFileName.includes("page.tsx") ||
    normalizedFileName.includes("page.jsx") ||
    normalizedFileName.includes("page.js")
  ) {
    if (!content.includes('"use client"') &&
        !content.includes("'use client'")) {
      add("serverComponent");
    }

    add("fileBasedRouting");
  }

  if (normalizedFileName.includes("app/")) {
    add("appDirectory");
  }

  if (
    content.includes('"use client"') ||
    content.includes("'use client'")
  ) {
    add("useClient");
    add("clientComponent");
  }

  if (
    content.includes('from "next/link"') ||
    content.includes("from 'next/link'")
  ) {
    add("Link");
  }

  if (
    content.includes('from "next/navigation"') ||
    content.includes("from 'next/navigation'")
  ) {
    add("navigation");
  }

  if (
    content.includes('from "next/image"') ||
    content.includes("from 'next/image'")
  ) {
    add("nextImage");
  }

  if (
    content.includes('from "next/font/google"') ||
    content.includes("from 'next/font/google'") ||
    content.includes('from "next/font/local"') ||
    content.includes("from 'next/font/local'")
  ) {
    add("nextFont");
  }

  if (
    content.includes("useState") &&
    (
      content.includes('from "react"') ||
      content.includes("from 'react'") ||
      content.includes("React.useState")
    )
  ) {
    add("useState");
  }

  if (
    content.includes("useEffect") &&
    (
      content.includes('from "react"') ||
      content.includes("from 'react'")
    )
  ) {
    add("useEffect");
  }

  if (
    content.includes("useReducer") &&
    (
      content.includes('from "react"') ||
      content.includes("from 'react'")
    )
  ) {
    add("useReducer");
  }

  if (
    content.includes("useContext") &&
    (
      content.includes('from "react"') ||
      content.includes("from 'react'")
    )
  ) {
    add("useContext");
  }

  if (
    content.includes("useMemo") &&
    (
      content.includes('from "react"') ||
      content.includes("from 'react'")
    )
  ) {
    add("useMemo");
  }

  if (
    content.includes("useCallback") &&
    (
      content.includes('from "react"') ||
      content.includes("from 'react'")
    )
  ) {
    add("useCallback");
  }

  if (
    content.includes("configureStore") &&
    content.includes("@reduxjs/toolkit")
  ) {
    add("configureStore");
  }

  if (
    content.includes("Provider") &&
    content.includes("react-redux")
  ) {
    add("Provider");
  }

  if (
    content.includes("useSelector") &&
    content.includes("react-redux")
  ) {
    add("useSelector");
  }

  if (
    content.includes("useDispatch") &&
    content.includes("react-redux")
  ) {
    add("useDispatch");
  }

  if (
    content.includes("async function") ||
    content.includes("async (")
  ) {
    add("asyncComponent");
  }

  if (content.includes("use server")) {
    add("serverAction");
  }

  if (
    content.includes("export const metadata") ||
    content.includes("export let metadata")
  ) {
    add("metadata");
  }

  if (content.includes("generateMetadata")) {
    add("generateMetadata");
  }

  if (content.includes("export const dynamic")) {
    add("dynamicExport");
  }

  if (content.includes("export const revalidate")) {
    add("revalidate");
  }

  if (
    content.includes("<form") ||
    content.includes("<Form")
  ) {
    add("formHandling");
  }

  return Array.from(foundPatterns);
}