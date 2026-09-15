import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com';

test.describe('STORY-001 - Connexion et ajout au panier', () => {
  test('Scenario 1 - Connexion reussie redirige vers inventory', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('Scenario 2 - Connexion invalide affiche un message d\'erreur', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('wrong_password');
    await page.locator('#login-button').click();
    await expect(page.locator('[data-test="error"]')).toContainText(
      'Epic sadface: Username and password do not match any user in this service'
    );
  });

  test('Scenario 3 - Ajout au panier met a jour le badge', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });
});
