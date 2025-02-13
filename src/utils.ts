import "dotenv/config";

const secret = process.env.TURNSTILE_SECRET_KEY;
if (secret === undefined) {
    console.error("missing TURNSTILE_SECRET_KEY from env");
}

export async function validateTurnstileToken(turnstileToken: any) {
    if (!turnstileToken) {
        return false;
    }
    if (typeof turnstileToken !== "string") {
        return false;
    }
    if (secret === undefined) {
        console.error("missing TURNSTILE_SECRET_KEY from env");
        return false;
    }

    const outcome = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                secret,
                response: turnstileToken,
            }),
        }
    ).then((res) => res.json());

    console.log(outcome);
    if (outcome.success) {
        return true;
    }

    return false;
}
