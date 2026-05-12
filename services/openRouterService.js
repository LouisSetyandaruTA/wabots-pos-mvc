const axios = require("axios");

exports.askDeepSeek = async (prompt) => {

    try {

        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: process.env.OPENROUTER_MODEL,

                temperature: 0.1,

                response_format: {
                    type: "json_object"
                },

                messages: [
                    {
                        role: "system",
                        content:
                            "Anda hanya boleh menjawab JSON valid."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            },
            {
                headers: {
                    Authorization:
                        `Bearer ${process.env.OPENROUTER_API_KEY}`,

                    "Content-Type":
                        "application/json"
                }
            }
        );

        return response.data
            .choices[0]
            .message
            .content;

    } catch (err) {

        console.error(
            "OPENROUTER ERROR:",
            err.response?.data || err.message
        );

        return null;
    }
};