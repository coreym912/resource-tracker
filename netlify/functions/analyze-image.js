exports.handler = async (event) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { image } = JSON.parse(event.body);

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAPIKEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [{
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "Analyze this resource image and extract the following as JSON with these exact keys: resourceType (string: equipment type), description (string: detailed description), condition (string: must be Excellent, Good, Fair, or Poor), quantity (string: number visible), serialNumber (string: any visible serial/model number or empty string), notes (string: any observations). Return ONLY valid JSON, no other text."
                        },
                        {
                            type: "image_url",
                            image_url: { url: image }
                        }
                    ]
                }],
                max_tokens: 500
            })
        });

        const data = await response.json();

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
