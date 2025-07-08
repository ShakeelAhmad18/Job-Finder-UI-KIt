// lib/GeminiAPI.jsx

/**
 * Sends a text prompt and optional image data to the Gemini API (gemini-2.0-flash model)
 * to generate a natural language response, optionally with a structured JSON format.
 *
 * This function is designed for real-time text generation and includes:
 * - Asynchronous execution using async/await.
 * - Robust error handling for network issues and API-specific errors.
 * - Standard JSON payload construction.
 * - Parsing of the API's JSON response, handling both plain text and structured JSON.
 * - Support for sending inline image data for multimodal understanding.
 *
 * @param {string} prompt The user's input text prompt for the AI model.
 * @param {object} [options] Optional configuration for the API call.
 * @param {object} [options.responseSchema] A JSON schema defining the expected structure of the AI's response.
 * If provided, responseMimeType will be set to "application/json".
 * @param {object} [options.inlineData] An object containing image data for multimodal prompts.
 * Should have `mimeType` (e.g., "image/jpeg") and `data` (base64 string).
 * @param {number} [options.temperature=0.7] Controls the randomness of the output.
 * @param {number} [options.topK=40] Considers the top K most likely tokens.
 * @param {number} [options.topP=0.95] Considers the smallest set of tokens whose cumulative probability exceeds topP.
 * @returns {Promise<string|object|Array>} A promise that resolves with the generated content.
 * This can be a string (for plain text) or an object/array (for JSON).
 * If the API call fails or the response is malformed,
 * the promise will reject with an error message.
 * @throws {Error} If the API request fails (e.g., network error, API returns non-OK status)
 * or if the response structure is unexpected.
 */
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

  // The API key is left as an empty string; Canvas will automatically provide it at runtime.
  // The user's provided API key was "AIzaSyCE-b8i85hZ-ZPUaS0ZR3hFIzDFHIrDvgg"
  const apiKey = "AIzaSyAR5K_OSIXUvAns_VRjZiiuj3v1AKEJYd4"; // Leave empty for Canvas auto-injection
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

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
