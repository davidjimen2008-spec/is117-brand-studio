"use strict";

(() => {
  const form = document.querySelector("#product-form");
  if (!form) return;

  const sizeError = document.querySelector("#size-error");
  const bagCount = document.querySelector("#bag-count");
  const bagStatus = document.querySelector("#bag-status");
  const bagItems = document.querySelector("#bag-items");
  const clearBag = document.querySelector("#clear-bag");
  const sizes = ["S", "M", "L", "XL"];
  const bag = [];

  const renderBag = () => {
    bagCount.textContent = String(bag.length);
    clearBag.disabled = bag.length === 0;
    bagItems.replaceChildren();
    sizes.forEach((size) => {
      const quantity = bag.filter((item) => item === size).length;
      if (!quantity) return;
      const item = document.createElement("li");
      item.textContent = `White T-shirt · Size ${size} · Quantity ${quantity}`;
      bagItems.append(item);
    });
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const selected = form.querySelector('input[name="size"]:checked');
    if (!selected || !sizes.includes(selected.value)) {
      sizeError.hidden = false;
      form.querySelectorAll('input[name="size"]').forEach((input) => {
        input.setAttribute("aria-invalid", "true");
      });
      form.querySelector('input[name="size"]').focus();
      return;
    }

    sizeError.hidden = true;
    bag.push(selected.value);
    renderBag();
    const itemWord = bag.length === 1 ? "item" : "items";
    bagStatus.textContent = `Added a white T-shirt in size ${selected.value}. Your demo bag has ${bag.length} ${itemWord}.`;
  });

  form.addEventListener("change", () => {
    sizeError.hidden = true;
    form.querySelectorAll('input[name="size"]').forEach((input) => {
      input.removeAttribute("aria-invalid");
    });
  });

  const checkout = document.createElement("section");
  checkout.setAttribute("aria-label", "Simulated checkout");
  const checkoutTitle = document.createElement("h3");
  checkoutTitle.textContent = "Simulated checkout — no payment or shipment";
  const checkoutButton = document.createElement("button");
  checkoutButton.type = "button";
  checkoutButton.textContent = "Place demo order (no charge)";
  const checkoutStatus = document.createElement("p");
  checkoutStatus.setAttribute("role", "status");
  checkout.append(checkoutTitle, checkoutButton, checkoutStatus);
  bagItems.parentElement.append(checkout);
  checkoutButton.addEventListener("click", async () => {
    if (!bag.length) {
      checkoutStatus.textContent = "Add a size to the demo bag first.";
      return;
    }
    if (!bag.every((size) => size === bag[0])) {
      checkoutStatus.textContent = "For this demo, use one size per checkout. Clear the bag and choose one size.";
      return;
    }
    checkoutButton.disabled = true;
    try {
      const response = await fetch("/api/demo-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ size: bag[0], quantity: bag.length }),
      });
      if (!response.ok) throw new Error("The local checkout server is unavailable or rejected the order.");
      const order = await response.json();
      checkoutStatus.textContent = `Demo order saved. Confirmation: ${order.id}. Size ${order.size}, quantity ${order.quantity}. No payment or shipment.`;
      const confirmation = document.createElement("a");
      confirmation.href = `/api/demo-orders/${encodeURIComponent(order.id)}`;
      confirmation.textContent = "Reopen saved demo confirmation";
      checkoutStatus.append(" ", confirmation);
    } catch (error) {
      checkoutStatus.textContent = `${error.message} GitHub Pages is static; run npm start locally for SQLite checkout.`;
    } finally {
      checkoutButton.disabled = false;
    }
  });

  clearBag.addEventListener("click", () => {
    bag.length = 0;
    renderBag();
    bagStatus.textContent =
      "Your demo bag is empty. Choose a size to try it again.";
    form.querySelector('input[name="size"]:checked')?.focus();
  });
})();
