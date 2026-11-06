(() => {
    "use strict";

    /* =====================================
       DEVELOPER INFORMATION
       EDIT HERE IN VS CODE
    ===================================== */

    const ADMIN_INFO = {
        appName: "QR Code Generator",
        developer: "Dhrubo Basumatary",
        role: "Developer",
        description: "Create custom QR codes for websites, phone numbers  notes with beautiful designs and personalized posters. 100 % Free to use — Customize, generate, and download your QR codes anytime without any restrictions.",
        email: "lubos8999@gmail.com",
        website: "https://lubolabao.vercel.app/",
        copyright: "© 2026 QR Code Generator"
    };

    /* =====================================
       APPLICATION STATE
    ===================================== */

    const $ = id => document.getElementById(id);

    const state = {
        type: "website",
        logoData: null,
        qrData: ""
    };

    const themes = {
        pink: { bg: "#efd3da", fg: "#211b1e" },
        dark: { bg: "#252633", fg: "#ffffff" },
        purple: { bg: "#d9c9ff", fg: "#29213d" },
        green: { bg: "#dce9d9", fg: "#263b2b" }
    };

    /* =====================================
       ABOUT
    ===================================== */

    function showAbout() {
        $("aboutName").textContent = ADMIN_INFO.appName;
        $("aboutDescription").textContent = ADMIN_INFO.description;
        $("aboutDeveloper").textContent = "Developer: " + ADMIN_INFO.developer;
        $("aboutEmail").textContent = "Email: " + ADMIN_INFO.email;
        $("aboutWebsite").textContent = "Website: " + ADMIN_INFO.website;
        $("aboutCopyright").textContent = ADMIN_INFO.copyright;
    }

    /* =====================================
       NAVIGATION
    ===================================== */

    document.querySelectorAll(".nav-btn").forEach(button => {
        button.addEventListener("click", () => {

            document.querySelectorAll(".nav-btn").forEach(item => {
                item.classList.toggle("active", item === button);
            });

            $("generatorPage").classList.toggle(
                "hidden", button.dataset.page !== "generator"
            );

            $("aboutPage").classList.toggle(
                "hidden", button.dataset.page !== "about"
            );
        });
    });

    /* =====================================
       QR CONTENT
    ===================================== */

    function getPayload() {

        if (state.type === "website") {

            let value = $("website").value.trim();

            if (!value) throw Error("Enter a website URL.");

            if (!/^https?:\/\//i.test(value)) {
                value = "https://" + value;
            }

            let url;

            try {
                url = new URL(value);
            } catch {
                throw Error("Enter a valid URL.");
            }

            if (!url.hostname.includes(".")) {
                throw Error("Enter a complete website URL.");
            }

            return value;
        }

        if (state.type === "phone") {

            const value = $("phone").value.trim();

            if (!/^\+?[0-9\s().-]{9,10}$/.test(value)) {
                throw Error("Enter a valid phone number.");
            }

            return "tel:" + value.replace(/[^\d+]/g, "");
        }

        if (state.type === "notes") {

            const value = $("notes").value.trim();

            if (!value) throw Error("Enter your notes.");

            return value;
        }

        if (state.type === "images") {

            const urls = [
                ...document.querySelectorAll(".image-url")
            ].map(input => input.value.trim()).filter(Boolean);

            if (!urls.length) throw Error("Add at least one image URL.");

            if (urls.length > 4) throw Error("Maximum 4 images allowed.");

            urls.forEach(value => {
                try {
                    const url = new URL(value);
                    if (!["http:", "https:"].includes(url.protocol)) throw Error();
                } catch {
                    throw Error("Enter valid public image URLs.");
                }
            });

            return urls.map((url, index) =>
                `Image ${index + 1}: ${url}`
            ).join("\n");
        }
    }

    /* =====================================
       QR GENERATION
    ===================================== */

    function renderQR() {

        if (typeof QRCode === "undefined") {
            throw Error("QR library failed to load. Connect to the internet.");
        }

        const data = getPayload();
        const size = Number($("qrSize").value);
        const target = $("qrTarget");

        target.replaceChildren();

        target.style.width = size + "px";
        target.style.height = size + "px";

        new QRCode(target, {
            text: data,
            width: size,
            height: size,
            colorDark: "#111111",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.M
        });

        state.qrData = data;
        $("status").textContent = "";
    }

    function refreshQR() {
        try {
            renderQR();
        } catch (error) {
            $("status").style.color = "#bd4545";
            $("status").textContent = error.message;
        }
    }

    /* =====================================
       LIVE PREVIEW
    ===================================== */

    function updatePreview() {

        $("previewHeading").textContent = $("heading").value.trim();

        $("previewCaption").textContent = $("caption").value.trim();

        $("previewHeading").style.display =
            $("heading").value.trim() ? "" : "none";

        $("previewCaption").style.display =
            $("caption").value.trim() ? "" : "none";

        $("poster").style.background = $("bgColor").value;
        $("poster").style.color = $("textColor").value;

        $("qrFrame").style.borderColor = $("textColor").value;

        $("logoCircle").style.display =
            $("showLogo").checked ? "flex" : "none";

        $("previewFooter").style.display =
            $("showFooter").checked ? "" : "none";

        $("sizeValue").textContent = $("qrSize").value + " px";

        /* LOGO PREVIEW */

        const circle = $("logoCircle");

        if (state.logoData) {

            let img = circle.querySelector("img");

            if (!img) {
                circle.replaceChildren();

                img = document.createElement("img");
                img.alt = "Uploaded logo";

                circle.appendChild(img);
            }

            if (img.src !== state.logoData) {
                img.src = state.logoData;
            }

        } else {

            circle.textContent = "YOUR\nLOGO\nHERE";
            circle.style.whiteSpace = "pre-line";
        }
    }

    /* =====================================
       CONTENT TYPE
    ===================================== */

    function setType(type) {

        state.type = type;

        document.querySelectorAll(".type").forEach(button => {
            button.classList.toggle(
                "active", button.dataset.type === type
            );
        });

        ["website", "phone", "notes", "images"].forEach(name => {
            $(name + "Fields").classList.toggle(
                "hidden", name !== type
            );
        });

        $("previewSubheading").textContent = {
            website: "OPEN WEBSITE",
            phone: "SCAN TO CALL",
            notes: "READ MESSAGE",
            images: "IMAGE LINKS"
        }[type];

        refreshQR();
    }

    document.querySelectorAll(".type").forEach(button => {
        button.addEventListener("click", () => {
            setType(button.dataset.type);
        });
    });

    /* =====================================
       TEMPLATES
    ===================================== */

    function applyTheme(name) {

        const theme = themes[name];

        $("bgColor").value = theme.bg;
        $("textColor").value = theme.fg;

        document.querySelectorAll(".template").forEach(button => {
            button.classList.toggle(
                "active", button.dataset.template === name
            );
        });

        updatePreview();
    }

    document.querySelectorAll(".template").forEach(button => {
        button.addEventListener("click", () => {
            applyTheme(button.dataset.template);
        });
    });

    /* =====================================
       LIVE INPUT EVENTS
    ===================================== */

    ["website", "phone", "notes"].forEach(id => {

        $(id).addEventListener("input", () => {
            if (state.type === id) refreshQR();
        });

    });

    $("imageInputs").addEventListener("input", () => {
        if (state.type === "images") refreshQR();
    });

    ["heading", "caption", "bgColor", "textColor", "showLogo", "showFooter"]
        .forEach(id => {
            $(id).addEventListener("input", updatePreview);
        });

    $("qrSize").addEventListener("input", () => {
        updatePreview();
        refreshQR();
    });

    /* =====================================
       MULTIPLE IMAGE URLS
    ===================================== */

    $("addImage").addEventListener("click", () => {

        const count = document.querySelectorAll(".image-url").length;

        if (count >= 4) {
            $("status").textContent = "Maximum 4 images allowed.";
            return;
        }

        const input = document.createElement("input");

        input.type = "url";
        input.className = "image-url";
        input.placeholder = `https://example.com/image${count + 1}.jpg`;

        $("imageInputs").appendChild(input);
    });

    /* =====================================
       LOGO UPLOAD
    ===================================== */

    $("logo").addEventListener("change", event => {

        const file = event.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            $("status").textContent = "Please select an image.";
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {

            state.logoData = reader.result;

            updatePreview();

            $("status").textContent = "";
        };

        reader.onerror = () => {
            $("status").textContent = "Could not read this image.";
        };

        reader.readAsDataURL(file);
    });

    /* =====================================
       GENERATE BUTTON
    ===================================== */

    $("generate").addEventListener("click", refreshQR);

    /* =====================================
       RESET
    ===================================== */

    $("reset").addEventListener("click", () => {

        $("website").value = "https://lubolabao.vercel.app/";
        $("phone").value = "";
        $("notes").value = "";

        $("imageInputs").innerHTML =
            '<input class="image-url" type="url" placeholder="https://example.com/image1.jpg">';

        $("heading").value = "Scan me";
        $("caption").value = "Thank you!";

        $("logo").value = "";
        state.logoData = null;

        $("showLogo").checked = true;
        $("showFooter").checked = true;

        $("qrSize").value = 164;

        applyTheme("pink");
        setType("website");
        updatePreview();
    });

    /* =====================================
       CANVAS HELPERS
    ===================================== */

    function roundedRect(ctx, x, y, w, h, r, fill) {

        ctx.beginPath();
        ctx.roundRect(x, y, w, h, r);

        ctx.fillStyle = fill;
        ctx.fill();
    }

    function loadImage(src) {

        return new Promise((resolve, reject) => {

            const img = new Image();

            img.onload = () => resolve(img);

            img.onerror = () => {
                reject(Error("Could not load an image for the poster."));
            };

            img.src = src;
        });
    }

    /* =====================================
       DOWNLOAD POSTER PNG
    ===================================== */

    $("download").addEventListener("click", async () => {

        try {

            /* Always generate the latest QR before download */
            renderQR();

            const qrNode = $("qrTarget").querySelector("canvas, img");

            if (!qrNode) throw Error("QR code is not ready.");

            const qrSource = qrNode.tagName === "CANVAS"
                ? qrNode.toDataURL("image/png")
                : qrNode.src;

            const qrImage = await loadImage(qrSource);

            if (document.fonts?.ready) {
                await document.fonts.ready;
            }

            const canvas = document.createElement("canvas");

            canvas.width = 1020;
            canvas.height = 1350;

            const ctx = canvas.getContext("2d");

            const bg = $("bgColor").value;
            const fg = $("textColor").value;

            ctx.fillStyle = "#eeeeef";
            ctx.fillRect(0, 0, 1020, 1350);

            ctx.shadowColor = "#00000030";
            ctx.shadowBlur = 35;
            ctx.shadowOffsetY = 20;

            roundedRect(ctx, 150, 45, 720, 1260, 34, bg);

            ctx.shadowColor = "transparent";
            ctx.fillStyle = fg;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            let cursor = 155;

            /* LOGO */

            if ($("showLogo").checked) {

                ctx.lineWidth = 5;
                ctx.strokeStyle = fg;

                ctx.beginPath();
                ctx.arc(510, cursor + 65, 98, 0, Math.PI * 2);
                ctx.stroke();

                ctx.lineWidth = 2;

                ctx.beginPath();
                ctx.arc(510, cursor + 65, 90, 0, Math.PI * 2);
                ctx.stroke();

                if (state.logoData) {

                    const logo = await loadImage(state.logoData);

                    const diameter = 174;

                    /* COVER: fills the entire circular area */

                    const scale = Math.max(
                        diameter / logo.width,
                        diameter / logo.height
                    );

                    const drawWidth = logo.width * scale;
                    const drawHeight = logo.height * scale;

                    ctx.save();

                    ctx.beginPath();
                    ctx.arc(510, cursor + 65, 84, 0, Math.PI * 2);
                    ctx.clip();

                    ctx.drawImage(
                        logo,
                        510 - drawWidth / 2,
                        cursor + 65 - drawHeight / 2,
                        drawWidth,
                        drawHeight
                    );

                    ctx.restore();

                } else {

                    ctx.font = '500 38px -apple-system, BlinkMacSystemFont, sans-serif';

                    ctx.fillText("YOUR", 510, cursor + 37);
                    ctx.fillText("LOGO", 510, cursor + 78);
                    ctx.fillText("HERE", 510, cursor + 119);
                }

                cursor += 205;
            }

            /* HANDWRITTEN HEADING */

            const heading = $("heading").value.trim();

            if (heading) {

                ctx.font = '700 92px "Dancing Script", cursive';

                ctx.fillText(heading, 510, cursor + 15, 650);

                cursor += 105;
            }

            /* SUBHEADING */

            const sub = $("previewSubheading").textContent;

            if (sub) {

                ctx.globalAlpha = .65;

                ctx.font = '600 22px -apple-system, BlinkMacSystemFont, sans-serif';

                ctx.fillText(sub, 510, cursor);

                ctx.globalAlpha = 1;

                cursor += 42;
            }

            /* QR */

            const qrSize = Number($("qrSize").value) * 2.5;

            const frame = qrSize + 50;

            const qx = (1020 - frame) / 2;
            const qy = cursor + 18;

            roundedRect(ctx, qx, qy, frame, frame, 32, "#ffffff");

            ctx.imageSmoothingEnabled = false;

            ctx.drawImage(
                qrImage,
                510 - qrSize / 2,
                qy + 25,
                qrSize,
                qrSize
            );

            cursor = qy + frame + 62;

            /* CAPTION */

            const caption = $("caption").value.trim();

            if (caption) {

                ctx.font = '800 58px "Quicksand", sans-serif';

                ctx.fillText(caption, 510, cursor, 650);

                cursor += 65;
            }

            /* FOOTER */

            if ($("showFooter").checked) {

                ctx.globalAlpha = .65;

                ctx.font = '500 21px -apple-system, BlinkMacSystemFont, sans-serif';

                ctx.fillText(
                    "SCAN TO OPEN",
                    510,
                    Math.min(cursor + 20, 1270)
                );

                ctx.globalAlpha = 1;
            }

            /* SAVE PNG */

            const link = document.createElement("a");

            link.download = "qr-code-lubo.png";
            link.href = canvas.toDataURL("image/png");

            link.click();

            $("status").style.color = "#398b5c";
            $("status").textContent = "Poster downloaded.";

        } catch (error) {

            $("status").style.color = "#bd4545";
            $("status").textContent =
                error.message || "Could not download poster.";
        }
    });

    /* =====================================
       INITIALIZATION
    ===================================== */

    showAbout();
    applyTheme("pink");
    updatePreview();
    refreshQR();

})();