// automate.js (Playwright script to automate the game)
const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    // Navigate to the game
    await page.goto('http://localhost:3000');
    
    // Listen for the winning message
    page.on('console', async (msg) => {
        if (msg.text().includes('guessed the number')) {
            console.log('Winning message:', msg.text());
            await browser.close();
        }
    });
    
    // Simulate auto guessing: Loop through number guesses quickly
    for (let guess = 1; guess <= 100; guess++) {
        await page.fill('#guessInput', String(guess));
        await page.click('#guessButton');
        await page.waitForTimeout(100);  // Short delay between guesses
    }
})();