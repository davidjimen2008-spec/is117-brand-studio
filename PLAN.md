# Plan — ABOVE THE MEAN T-shirt
**IS117-005 Review 2 · November 14, 2026 · Due November 16, 11:30 a.m. ET**

**Status:** Planning documentation prepared; classmate review pending; SQLite implementation and run/save/reopen verification not yet established. This is a plan, not a claim that checkout is deployed.

## Audience, problem, goal
Primary audience (hypothesis from [RESEARCH.md](RESEARCH.md)): an everyday streetwear wearer who wants an elevated ordinary white tee without an over-the-top look. Secondary check: a plain-tee comparer who needs clear sizes and an honest explanation of the demo. Neither persona is validated through interviews. The goal is to let a visitor evaluate one white tee, choose a size, and complete a **simulated** checkout without suggesting a real purchase.

## Two concise page approaches
| Approach | Benefits | Risks | Decision |
|---|---|---|---|
| A — Basics-first product page: clear tee image, sizes, bag and checkout | Simple comparison, quick action, lower cognitive load | Can look generic | **Choose as the structural flow** |
| B — Identity-first editorial landing page: large slogan, expressive typography and imagery | Memorable and consistent with streetwear | Can bury size/checkout details and feel 'too extra' | Borrow the expressive headline/wordmark, not the navigation complexity |

**Decision:** Keep the existing postmodernist-inspired ABOVE THE MEAN styling, blue and neutral palette, bold type, serif accent and original A-arrow wordmark. Preserve the straightforward single-product shopping path. This follows the existing SPEC and Research decision, not a new user-study result.

**Brand promise:** “Everyday streetwear with a step-up point of view, without the hard sell.” Brand character: Everyman. Voice: outgoing, striking, meaningful. Slogan: “EVERYWO/MAN'S ATM”.

## User stories, essential features, and observable acceptance checks
| ID | User story | Essential feature | Observable check / acceptance criterion |
|---|---|---|---|
| US1 | As an everyday streetwear visitor, I want to understand the product and brand quickly so I can decide whether it fits my style. | One white tee, visible brand promise, honest product information | Open the page at desktop and narrow/mobile width; tee, promise and primary action remain visible and readable without overlapping text. |
| US2 | As a shopper, I want to select a size so I can see what would go in my demo bag. | Labeled size selector and add-to-demo-bag action | Select a size, add item; bag displays exactly that size and quantity; missing size produces a clear message instead of silently adding. |
| US3 | As a cautious visitor, I want to understand the simulation before proceeding so I do not mistake it for a real order. | Persistent “demo only; no payment or shipment” disclosure | Disclosure is visible before checkout and on confirmation; no payment credentials are requested or charged. |
| US4 | As a demo shopper, I want to submit a simulated checkout so I can receive an understandable confirmation. | Checkout form, server-side validation, confirmation ID | Valid demo input creates one record and returns a confirmation ID; invalid/empty required fields show errors without saving a record. Do not collect real card data. |
| US5 | As a returning demo visitor, I want the simulated order to survive reopening so I can verify it was saved. | Working server-side SQLite database and order retrieval | Run server, save demo order, stop/restart server, reopen confirmation via ID: matching size, quantity and demo status load from SQLite, not browser storage. |

## Feature boundaries and implementation plan
**Existing baseline:** The repository README documents a branded storefront, size selector and temporary demo bag. It explicitly states no checkout, payments, accounts or persistence. Existing automated tests mentioned in prior records are not evidence that SQLite works.

**Next implementation slice:** Keep existing frontend and brand tokens. Add a small server-side SQLite layer (use the course-supported starter as a reference, adapting its routes and schema to this project). Proposed schema: `demo_orders(id TEXT PRIMARY KEY, size TEXT NOT NULL, quantity INTEGER NOT NULL CHECK(quantity > 0), status TEXT NOT NULL DEFAULT 'SIMULATED', created_at TEXT NOT NULL)`. Add a POST endpoint for creating demo orders and GET endpoint for retrieving by confirmation ID. Validate size against the actual displayed options; use parameterized queries. Use a durable local database file outside ephemeral browser storage; do not commit customer data or database secrets. Add a demo-only confirmation screen, no card fields, no payment provider, no shipping promise.

**SQLite acceptance test (pending execution):** (1) start app and backend, (2) select size and quantity, (3) submit simulated checkout, (4) record confirmation ID, (5) restart the backend and reopen the confirmation, (6) verify same row in SQLite and browser, (7) test invalid size and missing fields, (8) document actual commands/results/screenshots. A GitHub Pages static deployment by itself cannot run the SQLite server; a runnable local/server environment must be documented separately. No persistence test is marked passed yet.

## Honest persuasion
1. **Reciprocity:** offer “Three ways to wear the white tee with clothes you already own” freely, without signup or misleading product claims. Check that the tips are visible without submitting personal information.
2. **Unity:** use “Everyday style has room for every point of view.” Check the wording invites belonging without falsely claiming existing members, testimonials or sales.

Avoid fake scarcity, fabricated reviews, unverified material/fit claims and fake social proof.

## Review, decisions and evidence
- **Plan issue:** [#7](https://github.com/davidjimen2008-spec/is117-brand-studio/issues/7).
- **Review request for classmate:** “Please explain US5 in your own words, tell me how you would check run → save → reopen, and ask one useful question about the flow or demo disclosure. Please comment on issue #7.”
- **Feedback received:** Pending — no classmate question or retry recorded.
- **Decision on feedback:** Pending — choose implement/investigate/defer/decline only after actual feedback.
- **Change link and verification:** Link documentation commit/PR when created; code and SQLite verification are pending.
- **Reviewer retry/resolution:** Pending; keep issue open until reviewed and checked.
- **AI disclosure:** AI assisted in drafting and structuring this plan from existing project research. The student must verify statements, run the implementation and checks, and explain decisions. Do not report proposed checks as observed outcomes.

## Next steps
1. Review this plan and request a classmate comment on issue #7.
2. Implement SQLite-backed simulated checkout and capture real run/save/reopen results.
3. Record feedback, decision, linked change, verification, and reviewer retry; do not close unfinished work.
4. Update Canvas with the record, repository, deployed link if verified, issue and short change note.

**References:** [RESEARCH.md](RESEARCH.md) · [SPEC.md](SPEC.md) · [LEARNING.md](LEARNING.md) · [course SQLite starter](https://kaw393939.github.io/is117-demo-days/examples/submissions/run-examples.html).
