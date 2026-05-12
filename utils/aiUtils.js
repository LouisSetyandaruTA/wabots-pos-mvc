exports.extractJsonFromAI = (text) => {

    try {

        // HAPUS ```json
        let cleaned = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        return JSON.parse(cleaned);

    } catch (err) {

        console.error("AI JSON PARSE ERROR:", err);

        return null;
    }
};