#!/usr/bin/env node

// Minimum NodeJS v16.6
// Usage: ./count-file-words.js [-i] <filename>
// Options:
//   -i Enable case insensitive mode

const fs = require('fs/promises');

async function main() {
  const inputfile = process.argv.at(-1);
  const caseInsensitive = process.argv.includes('-i');

  if (!inputfile) {
    throw new Error('Missing input file, usage: `count-file-words.js <FILE>`');
  }

  let content = await fs.readFile(inputfile, 'utf-8');

  if (caseInsensitive) {
    content = content.toLowerCase();
  }

  const words = content.match(/\w+/g);

  const wordCount = words.reduce((acc, word) => {
    acc[word] ??= 0;
    acc[word]++;

    return acc;
  }, {});

  const uniqueWords = Object.keys(wordCount);

  uniqueWords
    .map((word) => [word, wordCount[word]])
    .sort((a, b) => {
      if (a[1] === b[1]) {
        return a[0] > b[0] ? 1 : -1;
      }

      return a[1] < b[1] ? 1 : -1;
    })
    .forEach((word) => {
      console.log(`${word[0]}: ${word[1]}`);
    });
}

main().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exit(1);
});
