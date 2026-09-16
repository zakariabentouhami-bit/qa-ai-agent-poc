import { test, expect } from '@playwright/test';

const BASE_URL = 'https://the-internet.herokuapp.com/login';

test.describe('STORY-002 - Connexion securisee (the-internet)', () => {
  test('Scenario 1 - Connexion reussie redirige vers secure', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('#username').fill('tomsmith');
    await page.locator('#password').fill('SuperSecretPassword!');
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/\/secure$/);
    await expect(page.locator('#flash')).toContainText('You logged into a secure area!');
  });

  test('Scenario 2 - Connexion invalide affiche un message d\'erreur', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('#username').fill('tomsmith');
    await page.locator('#password').fill('wrongpassword');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('#flash')).toContainText('Your password is invalid!');
    await expect(page).toHaveURL(/\/login$/);
  });
});
