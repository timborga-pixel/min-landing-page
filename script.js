const form = document.getElementById("contact-form");
const formMessage = document.getElementById("form-message");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const data = new FormData(form);

    formMessage.textContent = "Skickar...";

    try {
        const response = await fetch("https://formspree.io/f/mljdaelb", {
            method: "POST",
            body: data,
            headers: { "Accept": "application/json" }
        });

        if (response.ok) {
            formMessage.textContent = "Tack " + name + "! Vi hör av oss snart. ✅";
            form.reset();
        } else {
            formMessage.textContent = "Något gick fel. Försök igen.";
        }
    } catch (error) {
        formMessage.textContent = "Kunde inte skicka. Kontrollera din uppkoppling.";
    }
});