
export async function generateAIResponse(prompt, options = {}) {
  let parts = [];

  // Add text part if prompt is not empty
  if (prompt && prompt.trim().length > 0) {
    parts.push({ text: prompt });
  }

  // Add inline image data if provided in options, with defensive check for options
  if (options && options.inlineData) {
    parts.push({ inlineData: options.inlineData });
  }

  // If no text or image parts, throw an error or handle as empty request
  if (parts.length === 0) {
    throw new Error(
      "No content provided for Gemini API request (empty prompt and no image)."
    );
  }

  const generationConfig = {
    // Add defensive checks for options when accessing its properties
    temperature:
      options && options.temperature !== undefined ? options.temperature : 0.7,
    topK: options && options.topK !== undefined ? options.topK : 40,
    topP: options && options.topP !== undefined ? options.topP : 0.95,
  };

  // If a responseSchema is provided, configure for JSON output, with defensive check for options
  if (options && options.responseSchema) {
    generationConfig.responseMimeType = "application/json";
    generationConfig.responseSchema = options.responseSchema;
  }

  const payload = {
    contents: [{ role: "user", parts: parts }],
    generationConfig: generationConfig,
  };


 
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.API_KEY}`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error response:", errorData);
      throw new Error(
        `Gemini API request failed with status ${
          response.status
        }: ${JSON.stringify(errorData)}`
      );
    }

    const result = await response.json();

    if (
      result.candidates &&
      result.candidates.length > 0 &&
      result.candidates[0].content &&
      result.candidates[0].content.parts &&
      result.candidates[0].content.parts.length > 0
    ) {
      const rawContent = result.candidates[0].content.parts[0].text;

      // If a schema was requested, attempt to parse as JSON, with defensive check for options
      if (options && options.responseSchema) {
        try {
          return JSON.parse(rawContent);
        } catch (jsonError) {
          console.error(
            "Failed to parse AI response as JSON:",
            rawContent,
            jsonError
          );
          throw new Error("AI response was not valid JSON as expected.");
        }
      } else {
        // Otherwise, return as plain text
        return rawContent;
      }
    } else {
      console.warn(
        "Gemini API response structure unexpected or empty:",
        result
      );
      // Return an empty object or string based on whether a schema was expected
      return options && options.responseSchema
        ? {}
        : "No AI response could be generated at this time.";
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error(`Failed to get AI response: ${error.message}`);
  }
}
