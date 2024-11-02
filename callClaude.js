import Anthropic from "@anthropic-ai/sdk";

async function callClaude(prompt, content) {
  try {
    const anthropic = new Anthropic({
      // defaults to process.env["ANTHROPIC_API_KEY"]
    });

    const msg = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1000,
      temperature: 0,
      messages: [
        {
          "role": "user",
          "content": [
            {
              "type": "text",
              "text": prompt + content
            }
          ]
        }
      ]
    });

    return msg;
  } catch (error) {
    console.error("Error calling Claude:", error);
    throw error;
  }
}

// Example usage:
// const response = await callClaude("Hello", " how are you?");
// console.log(response);

export default callClaude;
