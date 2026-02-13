
import { AIService } from './src/ai/ai.service';
import { ConfigService } from '@nestjs/config';

async function testAI() {
    const config = new ConfigService({
        OLLAMA_HOST: 'http://127.0.0.1:11434',
        OLLAMA_MODEL: 'qwen2.5-coder:1.5b'
    });

    const ai = new AIService(config);
    console.log('--- Testing Ollama connection ---');
    await ai.onModuleInit();

    console.log('--- Testing Quiz Generation ---');
    try {
        const questions = await ai.generateQuiz('Python - это язык программирования. Он очень популярен.');
        console.log('SUCCESS!');
        console.log(JSON.stringify(questions, null, 2));
    } catch (err) {
        console.error('FAILED TO GENERATE QUIZ:');
        console.error(err);
    }
}

testAI();
