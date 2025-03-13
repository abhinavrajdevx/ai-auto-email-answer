"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEmail = generateEmail;
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const GROQ_API_KEY = process.env.GROQ_API_KEY;
function generateEmail(user_ptompt, org_data, email_data, model_id, max_completion_tokens, groq_api_key) {
    return __awaiter(this, void 0, void 0, function* () {
        const groq = new groq_sdk_1.default({
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
        const llm_res = yield groq.chat.completions.create({
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
        const json_res = JSON.parse(llm_res.choices[0].message.content);
        return json_res;
    });
}
