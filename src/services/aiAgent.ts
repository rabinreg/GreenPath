import { GoogleGenerativeAI } from '@google/generative-ai';

export class AIAgent {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor() {
        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            throw new Error('GOOGLE_API_KEY not found in environment variables');
        }
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    }

    async generateExplanation(currentVisa: any, currentStage: any): Promise<string> {
        const visaType = currentVisa.visaType;
        const startDate = currentVisa.startDate;
        const expirationDate = currentVisa.expirationDate;
        const status = currentVisa.status;
        const stageName = currentStage.stageName;
        const averageDays = currentStage.averageDays;
        const minDays = currentStage.minDays;
        const maxDays = currentStage.maxDays;

        const prompt = `You are an immigration expert. Analyze the following immigration status and provide a helpful explanation:

Current Visa Type: ${visaType}
Visa Start Date: ${startDate}
Visa Expiration Date: ${expirationDate}
Current Status: ${status}
Current Stage: ${stageName}
Average Duration for this Stage: ${averageDays} days
Min Duration: ${minDays} days
Max Duration: ${maxDays} days

Please provide:
1. A summary of the current immigration status
2. What typically happens at the ${stageName} stage
3. Key documents or steps that may be needed
4. Expected timeline for the next stage
5. Any important considerations or tips

Be concise and helpful.`;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text() || 'Unable to generate explanation';
        } catch (error: any) {
            console.error('Error calling Google AI:', error.message);
            throw new Error(`Failed to generate explanation: ${error.message}`);
        }
    }

    async getNextSteps(currentStage: any, nextStages: string[]): Promise<string> {
        const stageName = currentStage.stageName;
        const nextStageIndex = nextStages.indexOf(stageName) + 1;
        
        if (nextStageIndex < nextStages.length) {
            const nextStageName = nextStages[nextStageIndex];
            
            const prompt = `You are an immigration expert. The user is currently at the ${stageName} stage and is preparing for the next stage: ${nextStageName}.

Please provide:
1. Key milestones to complete before moving to ${nextStageName}
2. Documents and evidence to prepare
3. Timeline expectations
4. Common pitfalls to avoid
5. Recommended action items

Be specific and practical.`;

            try {
                const result = await this.model.generateContent(prompt);
                const response = await result.response;
                return response.text() || `Prepare for the ${nextStageName} stage.`;
            } catch (error: any) {
                console.error('Error calling Google AI:', error.message);
                throw new Error(`Failed to generate next steps: ${error.message}`);
            }
        }
        return 'You have reached the final stage of your immigration process.';
    }
} 