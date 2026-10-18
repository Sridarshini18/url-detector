const urlForm = document.getElementById("urlForm");
const urlInput = document.getElementById("urlInput");
const result = document.getElementById("result");
const loading = document.getElementById("loading");
const clearBtn = document.getElementById("clearBtn");

urlForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const input = urlInput.value.trim();

    result.className = "result hidden";
    result.textContent = "";

    if (!input) {
        showResult("Please enter a URL.", "warning");
        return;
    }

    let url;

    try {
        url = new URL(
            /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(input)
                ? input
                : "https://" + input
        );
    } catch {
        showResult("Invalid URL. Please enter a valid website address.", "danger");
        return;
    }

    if (!["http:", "https:"].includes(url.protocol)) {
        showResult("Suspicious URL: Unsupported protocol detected.", "danger");
        return;
    }

    loading.classList.remove("hidden");

    setTimeout(function () {
        loading.classList.add("hidden");

        const issues = [];
        const hostname = url.hostname.toLowerCase();
        const fullURL = url.href.toLowerCase();

        if (url.protocol !== "https:") {
            issues.push("The URL does not use HTTPS.");
        }

        if (url.href.length > 100) {
            issues.push("The URL is unusually long.");
        }

        if (hostname.includes("@") || url.username || url.password) {
            issues.push("The URL contains suspicious login information.");
        }

        if (/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) {
            issues.push("The website uses an IP address instead of a domain name.");
        }

        if (hostname.includes("xn--")) {
            issues.push("The domain uses encoded characters that may require inspection.");
        }

        if (hostname.split(".").length > 4) {
            issues.push("The domain has an unusually large number of subdomains.");
        }

        const suspiciousWords = [
            "login-verify",
            "account-verify",
            "secure-update",
            "password-reset",
            "free-gift",
            "claim-prize"
        ];

        if (suspiciousWords.some(word => fullURL.includes(word))) {
            issues.push("The URL contains a suspicious keyword or phrase.");
        }

        if (issues.length > 0) {
            showResult(
                "⚠️ SUSPICIOUS SIGNS DETECTED\n\n" +
                issues.map((issue, index) => `${index + 1}. ${issue}`).join("\n") +
                "\n\nThis is a warning, not proof that the website is malicious.",
                "warning"
            );
        } else {
            showResult(
                "✅ No suspicious indicators found by these basic checks.\n\n" +
                "This does NOT guarantee that the website is safe. " +
                "The detector does not check a live phishing database.",
                "safe"
            );
        }
    }, 600);
});

function showResult(message, type) {
    result.className = "result " + type;
    result.style.whiteSpace = "pre-line";
    result.textContent = message;
}

clearBtn.addEventListener("click", function () {
    urlInput.value = "";
    result.textContent = "";
    result.className = "result hidden";
    loading.classList.add("hidden");
    urlInput.focus();
});