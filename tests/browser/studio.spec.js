import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("negative: choosing no size explains the problem and keeps the bag empty", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Add to demo bag", exact: true })
    .click();
  await expect(page.locator("#size-error")).toBeVisible();
  await expect(page.locator("#size-error")).not.toBeEmpty();
  await expect(page.locator("#bag-count")).toHaveText("0");
});

test("positive: a shopper can choose sizes, add items, and empty the demo bag", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator('input[name="size"][value="M"]').check();
  await page
    .getByRole("button", { name: "Add to demo bag", exact: true })
    .click();
  await expect(page.locator("#bag-count")).toHaveText("1");
  await expect(page.locator("#bag-status")).toContainText("M");
  await page.locator('input[name="size"][value="L"]').check();
  await page
    .getByRole("button", { name: "Add to demo bag", exact: true })
    .click();
  await expect(page.locator("#bag-count")).toHaveText("2");
  await page
    .getByRole("button", { name: "Empty demo bag", exact: true })
    .click();
  await expect(page.locator("#bag-count")).toHaveText("0");
  await page.reload();
  await expect(page.locator("#bag-count")).toHaveText("0");
});

test("keyboard: the skip link reaches main and the size controls work without a mouse", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: /skip/i });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  // Focus a native radio, then use its real keyboard behavior and the next control.
  await page.locator('input[name="size"][value="S"]').focus();
  await page.keyboard.press("Space");
  await page.keyboard.press("ArrowRight");
  await expect(page.locator('input[name="size"][value="M"]')).toBeChecked();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Add to demo bag", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#bag-count")).toHaveText("1");
});

test("the on-body stock image is clearly separate from the demo tee", async ({
  page,
}) => {
  await page.goto("/");
  const wearerImage = page.locator(".wearer-image");
  await expect(wearerImage).toBeVisible();
  await expect(wearerImage).toHaveAttribute(
    "alt",
    /Stock photo.*not the demo product/,
  );
  expect(
    await wearerImage.evaluate((image) => image.naturalWidth > 0),
  ).toBeTruthy();
  await expect(page.locator(".product-illustration img")).toHaveAttribute(
    "alt",
    "Illustration of the plain white demo T-shirt",
  );
  await expect(page.locator(".image-caption")).toContainText(
    "not the demo product or an endorsement",
  );
  await expect(
    page.getByRole("link", { name: "Photo: Estefania Milazzo / Pexels" }),
  ).toHaveAttribute(
    "href",
    "https://www.pexels.com/photo/standing-man-in-jeans-and-white-t-shirt-17858295/",
  );

  await page.goto("/styleguide.html");
  const photoSpecimen = page.locator(".photo-direction img");
  await expect(photoSpecimen).toBeVisible();
  await expect(photoSpecimen).toHaveAttribute(
    "src",
    "assets/stock-tee-worn-pexels-17858295.jpg",
  );
  expect(
    await photoSpecimen.evaluate((image) => image.naturalWidth > 0),
  ).toBeTruthy();
  await expect(page.locator(".photo-direction")).toContainText(
    "not the demo product, a fit reference, or an endorsement",
  );
});

test("the two hero directions keep the same headline, support, shirt, and action", async ({
  page,
}) => {
  await page.goto("/explorations.html");
  const studies = page.locator(".hero-study");
  await expect(studies).toHaveCount(2);
  await expect(
    page.getByRole("heading", { name: "EVERYWO/MAN'S ATM" }),
  ).toHaveCount(2);
  const offers = await studies.evaluateAll((cards) =>
    cards.map((card) => ({
      headline: card.querySelector("[data-study-headline]").dataset
        .studyHeadline,
      support: card
        .querySelector("[data-study-support]")
        .textContent.replace(/\s+/g, " ")
        .trim(),
      action: card.querySelector("[data-study-action]").textContent.trim(),
      href: card.querySelector("[data-study-action]").getAttribute("href"),
      image: card.querySelector("img").getAttribute("src"),
      alt: card.querySelector("img").getAttribute("alt"),
    })),
  );
  expect(offers[0]).toEqual(offers[1]);
  expect(offers[0].headline).toBe("EVERYWO/MAN'S ATM");
  expect(offers[0].support).toBe(
    "Everyday streetwear with a step-up point of view, without the hard sell.",
  );
  expect(offers[0].href).toBe("index.html#product-form");
});

test("the live guide shares storefront tokens and presents the draft identity", async ({
  page,
}) => {
  await page.goto("/");
  const storefront = await page.evaluate(() => {
    const styles = getComputedStyle(document.documentElement);
    return {
      accent: styles.getPropertyValue("--color-accent").trim(),
      paper: styles.getPropertyValue("--color-paper").trim(),
      headline: document.querySelector("#product-title").textContent.trim(),
      promise: document
        .querySelector(".product-intro")
        .textContent.replace(/\s+/g, " ")
        .trim(),
      wordmark: document.querySelector(".brand-link img").getAttribute("src"),
    };
  });
  expect(storefront).toEqual({
    accent: "#1d4ed8",
    paper: "#f7f6f1",
    headline: "EVERYWO/MAN'S ATM",
    promise:
      "Everyday streetwear with a step-up point of view, without the hard sell.",
    wordmark: "assets/wordmark.svg",
  });

  await page.goto("/styleguide.html");
  await expect(page.locator(".decision-grid > div")).toHaveCount(4);
  await expect(
    page.getByRole("heading", { name: "Secondary hypothesis" }),
  ).toBeVisible();
  await expect(page.locator(".decision-grid")).toContainText(
    "A visitor comparing plain tees",
  );
  await expect(page.locator(".type-body")).toHaveText(storefront.promise);
  await expect(page.locator("#voice .voice-example")).toHaveText(
    "Outgoing · striking · meaningful",
  );
  await expect(page.locator('[data-color-token="--color-accent"]')).toHaveText(
    storefront.accent,
  );
  await expect(page.locator('[data-color-token="--color-paper"]')).toHaveText(
    storefront.paper,
  );
  await expect(page.locator(".logo-small")).toHaveAttribute(
    "src",
    "assets/wordmark.svg",
  );
  const monochrome = page.locator(".logo-mono");
  await expect(monochrome).toHaveAttribute("src", "assets/wordmark-mono.svg");
  await expect(monochrome).toBeVisible();
  expect(
    await monochrome.evaluate((image) => image.naturalWidth > 0),
  ).toBeTruthy();
  await expect(page.locator(".persuasion-card")).toHaveCount(2);
  await expect(page.locator(".persuasion-card")).toContainText([
    "Reciprocity / learner-selected",
    "Unity / learner-selected",
  ]);
});

test("the hero headline and product stay separate at narrow widths", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/explorations.html");
  const overlaps = await page.locator(".hero-study").evaluateAll((cards) =>
    cards.map((card) => {
      const headline = card
        .querySelector("[data-study-headline]")
        .getBoundingClientRect();
      const product = card
        .querySelector(".hero-product")
        .getBoundingClientRect();
      return (
        headline.left < product.right &&
        headline.right > product.left &&
        headline.top < product.bottom &&
        headline.bottom > product.top
      );
    }),
  );
  expect(overlaps).toEqual([false, false]);
});

for (const route of [
  "/",
  "/styleguide.html",
  "/studio.html",
  "/explorations.html",
]) {
  test(`page integrity and automated accessibility: ${route}`, async ({
    page,
  }) => {
    const failures = [];
    page.on("pageerror", (error) => failures.push(error.message));
    page.on("response", (response) => {
      if (
        response.url().startsWith("http://127.0.0.1:5174") &&
        response.status() >= 400
      ) {
        failures.push(`${response.status()} ${response.url()}`);
      }
    });
    await page.goto(route);
    await expect(page.getByRole("main")).toBeVisible();
    const brokenImages = await page
      .locator("img")
      .evaluateAll((images) =>
        images
          .filter((image) => !image.complete || image.naturalWidth === 0)
          .map((image) => image.src),
      );
    expect(brokenImages).toEqual([]);
    const links = await page
      .locator("a[href]")
      .evaluateAll((anchors) =>
        anchors.map((anchor) => anchor.getAttribute("href")),
      );
    for (const href of links) {
      if (href.startsWith("#")) {
        expect(
          await page.locator(`[id="${href.slice(1)}"]`).count(),
          href,
        ).toBeGreaterThan(0);
      } else if (!/^(https?:|mailto:)/.test(href)) {
        const response = await page.request.get(new URL(href, page.url()).href);
        expect(response.ok(), href).toBeTruthy();
      }
    }
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
    expect(failures).toEqual([]);
  });

  test(`narrow screen: readable page without horizontal overflow ${route}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(route);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBeTruthy();
    await expect(page.getByRole("main")).toBeVisible();
  });
}
