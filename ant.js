import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  // defaults to process.env["ANTHROPIC_API_KEY"]
});

// We can keep changing the prompt. But this is a starting point.
var prompt = "You are an expert Summarizer. Here is a transcript of a long youtube video.\n\nPlease divide this content into 4-5 high level topics.\n\nEach topic can have 4-5 sub-topics.\n\nShow these topics and sub-topics as a table of contents.\n\nHere is the full transcript below.";

// This is the content text from the transcription service.
var content = `some long text that is the output of the transcription service.`;

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
console.log(msg);
