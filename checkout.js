const cartStorageKey = "blazehouse-cart";
const cart = new Map(JSON.parse(localStorage.getItem(cartStorageKey) || "[]"));
const orderItems = document.getElementById("orderItems");
const emptyOrder = document.getElementById("emptyOrder");
const orderTotals = document.getElementById("orderTotals");
const checkoutForm = document.getElementById("checkoutForm");
const checkoutNotice = document.getElementById("checkoutNotice");
const placeOrderButton = document.getElementById("placeOrderButton");

function formatPrice(amount) {
    return `$${amount.toFixed(2)}`;
}

function renderOrder() {
    orderItems.replaceChildren();
    let itemCount = 0;
    let subtotal = 0;

    cart.forEach((item, name) => {
        itemCount += item.quantity;
        subtotal += item.price * item.quantity;

        const row = document.createElement("div");
        row.className = "order-item";

        const image = document.createElement("img");
        image.src = item.image;
        image.alt = "";

        const details = document.createElement("div");
        details.className = "order-item-details";

        const productName = document.createElement("strong");
        productName.textContent = name;

        const quantity = document.createElement("span");
        quantity.textContent = `Qty ${item.quantity} · ${formatPrice(item.price)} each`;

        const price = document.createElement("strong");
        price.className = "order-item-price";
        price.textContent = formatPrice(item.price * item.quantity);

        details.append(productName, quantity);
        row.append(image, details, price);
        orderItems.append(row);
    });

    const hasItems = itemCount > 0;
    const delivery = subtotal > 150 || !hasItems ? 0 : 9.95;
    emptyOrder.hidden = hasItems;
    orderTotals.hidden = !hasItems;
    checkoutForm.hidden = !hasItems;
    document.getElementById("subtotalAmount").textContent = formatPrice(subtotal);
    document.getElementById("deliveryAmount").textContent = delivery === 0 && hasItems ? "Free" : formatPrice(delivery);
    document.getElementById("totalAmount").textContent = formatPrice(subtotal + delivery);
}

checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (cart.size === 0 || !checkoutForm.reportValidity()) return;

    const customerName = new FormData(checkoutForm).get("name").trim();
    checkoutNotice.textContent = `Thanks, ${customerName}. Your details are ready to review. This demo doesn’t send your order, save card details, or process payment.`;
    checkoutNotice.hidden = false;
    checkoutNotice.focus();
    ["cardName", "cardNumber", "cardExpiry", "cardSecurityCode"].forEach((fieldName) => {
        checkoutForm.elements.namedItem(fieldName).value = "";
    });
    placeOrderButton.disabled = true;
    placeOrderButton.textContent = "Details reviewed";
});

renderOrder();
