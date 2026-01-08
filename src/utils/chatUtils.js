export const sendMessage = async (input, history, sessionId, email, name) => {
    // console.log("Sending message to API:", { input, history, sessionId, email, name });

    const payload = {
        sessionId: sessionId,
        chatInput: input,
        email: email,
        name: name,
        history: history
    };

    try {
        const response = await fetch("/webhook/2dc73040-0711-495b-807e-b735e192b687", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return {
            success: true,
            data: data
        };
    } catch (error) {
        console.error("Error sending message:", error);
        return {
            success: false,
            error: error.message
        };
    }
};
