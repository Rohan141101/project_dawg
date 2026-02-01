document.addEventListener("DOMContentLoaded", () => {

    const yesBtn = document.getElementById("yesBtn");
    const noBtn = document.getElementById("noBtn");
    const card = document.querySelector(".card");

    const plane = document.getElementById("plane");
    const bomb = document.getElementById("bomb");
    const explosion = document.getElementById("explosion");

    const heartsContainer = document.getElementById("heartsContainer");
    const finalScreen = document.getElementById("finalScreen");

    let isAnimating = false;

    // =====================
    // YES → Heart + Salute rain THEN Respect screen
    // =====================

    yesBtn.onclick = () => {

        // Clear any old hearts
        heartsContainer.innerHTML = "";

        const emojis = ["💗", "🫡"];

        const rainInterval = setInterval(() => {

            const emoji = document.createElement("div");
            emoji.className = "heart";

            // Random heart or salute
            emoji.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];

            emoji.style.left = Math.random() * 100 + "vw";
            emoji.style.fontSize = 22 + Math.random() * 18 + "px";

            heartsContainer.appendChild(emoji);

            setTimeout(() => emoji.remove(), 3000);

        }, 120);

        // After rain → go to respect screen
        setTimeout(() => {

            clearInterval(rainInterval);
            heartsContainer.innerHTML = "";

            finalScreen.classList.remove("hidden");

        }, 2200);
    };

    // =====================
    // NO → Plane Bomb
    // =====================

    noBtn.onclick = () => {

        if (isAnimating || noBtn.classList.contains("destroyed")) return;
        isAnimating = true;

        plane.classList.remove("hidden");
        bomb.classList.add("hidden");
        explosion.classList.add("hidden");

        const noRect = noBtn.getBoundingClientRect();

        const targetX = noRect.left + noRect.width / 2;
        const targetY = noRect.top + noRect.height / 2;

        let planeX = window.innerWidth + 150;
        const baseY = window.innerHeight * 0.15;

        const speed = -6;
        let bombDropped = false;

        function animatePlane() {

            planeX += speed;

            plane.style.left = planeX + "px";
            plane.style.top = baseY + "px";
            plane.style.transform = "rotate(0deg)";

            const planeRect = plane.getBoundingClientRect();
            const planeCenterX = planeRect.left + planeRect.width / 2;

            if (!bombDropped && planeCenterX <= targetX) {
                bombDropped = true;
                dropBomb(planeCenterX, planeRect.bottom, targetX, targetY);
            }

            if (planeX > -400) {
                requestAnimationFrame(animatePlane);
            } else {
                plane.classList.add("hidden");
            }
        }

        requestAnimationFrame(animatePlane);
    };

    // =====================
    // Bomb Drop
    // =====================

    function dropBomb(startX, startY, targetX, targetY) {

        bomb.classList.remove("hidden");

        bomb.style.left = startX + "px";
        bomb.style.top = startY + "px";
        bomb.style.transform = "translate(-50%,0)";

        let bombY = startY;
        let velocity = 2;
        const gravity = 0.8;

        function fall() {

            velocity += gravity;
            bombY += velocity;
            bomb.style.top = bombY + "px";

            if (bombY < targetY - 40) {
                requestAnimationFrame(fall);
            } else {
                explode(targetX, targetY);
            }
        }

        requestAnimationFrame(fall);
    }

    // =====================
    // Explosion (NO disappears)
    // =====================

    function explode(x, y) {

        bomb.classList.add("hidden");

        explosion.classList.remove("hidden");
        explosion.style.left = x + "px";
        explosion.style.top = y + "px";

        card.classList.add("shake-card");

        // NO button gone forever
        noBtn.style.display = "none";
        noBtn.classList.add("destroyed");

        setTimeout(() => {

            explosion.classList.add("hidden");
            card.classList.remove("shake-card");

            isAnimating = false;

        }, 1000);
    }

});