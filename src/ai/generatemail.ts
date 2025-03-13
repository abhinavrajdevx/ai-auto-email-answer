import Groq from "groq-sdk";
import { config } from "dotenv";

config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export async function generateEmail(
  user_ptompt: string,
  org_data: string,
  email_data: string,
  model_id: string,
  max_completion_tokens: number,
  groq_api_key: string
) {
  const groq = new Groq({
    apiKey: groq_api_key,
  });

  const system_prompt = `
  User requirement = ${user_ptompt}
  organisatio/Company/Business data = ${org_data}
  Email : ${email_data}

  Analyze the user requirements and organization data, and the recieved email, and write a reply for that email, and output evrythin in a json format as below :

  {
    email : {
        sybject : "",
        body : ""
    }
  }

  `;

  const llm_res = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: system_prompt,
      },
    ],
    model: model_id,
    max_completion_tokens: max_completion_tokens,
    temperature: 0,
    stream: false,
    response_format: { type: "json_object" },
  });

  const json_res = JSON.parse(llm_res.choices[0].message.content as string);
  return json_res;
}
