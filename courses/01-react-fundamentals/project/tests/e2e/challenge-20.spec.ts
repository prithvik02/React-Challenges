import { test, expect } from '@playwright/test'

test.describe('Challenge 20: Error Boundaries - E2E', () => {
  test('should display task list or main content', async ({ page }) => {
    await page.goto('/challenge/20-error-boundaries')

    const taskList = page.locator('#task-list')
    const main = page.locator('main')

    if (await taskList.count()) {
      await expect(taskList.first()).toBeVisible()
    } else {
      await expect(main.first()).toBeVisible()
    }
  })
})