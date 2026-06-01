import OpenAI from 'openai';

const client = new OpenAI({ baseURL: 'https://api.gapgpt.app/v1', apiKey: 'sk-U2pYN0uEx7uVjR0xA2CfO8PJEPgdgI9G2l5b6485eX6XzT3v' });

const response = await client.chat.completions.create({
  model: 'gpt-5.3-codex-spark',
  messages: [{ role: 'user', content: 'سلام!' }]
});
console.log(response.choices[0].message.content);