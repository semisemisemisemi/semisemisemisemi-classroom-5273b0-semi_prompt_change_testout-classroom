import fs from 'fs';
import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';

// .env 파일을 읽어 환경 변수를 설정합니다.
dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error('API key not found');
}

const configuration = new Configuration({
  apiKey: apiKey,
});

const openai = new OpenAIApi(configuration);

async function analyzeTestResults() {
  const testResults = fs.readFileSync('build/result.log', 'utf8');
  const prompt = `코드의 잘못된 부분을 지적하고, 어떻게 고치면 좋을지와 그 이유를 제공해 주세요. 예를 들어, 잘못된 결과를 반환하는 경우 올바른 논리와 구현 방법을 설명해 주세요.`;

  const response = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are a highly experienced software engineer and provide a thorough code review." },
      { role: "user", content: prompt }
    ]
  });

  const feedback = response.data.choices[0].message.content.trim();
  fs.writeFileSync('feedback.log', feedback);
}

analyzeTestResults().catch(error => {
  console.error(error);
  process.exit(1);
});
