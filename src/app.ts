import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import { VisaService } from './services/visaService';
import { TimelineService } from './services/timelineService';
import { AIAgent } from './services/aiAgent';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Disable caching for development
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

const visaService = new VisaService();
const timelineService = new TimelineService();
let aiAgent: AIAgent | null = null;

// Initialize AI Agent with OpenAI
try {
    aiAgent = new AIAgent();
} catch (error) {
    console.warn('Warning: AI Agent not initialized. Make sure GOOGLE_API_KEY is set in .env file.');
}

app.get('/visa', (req: Request, res: Response) => {
    try {
        const visaInfo = visaService.getVisaInfo();
        res.json(visaInfo);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve visa information' });
    }
});

app.get('/visa-bulletin', (req: Request, res: Response) => {
    try {
        const bulletinData = require('./data/visaBulletin.json');
        res.json(bulletinData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve visa bulletin data' });
    }
});

app.put('/visa', (req: Request, res: Response) => {
    try {
        const { visaType, country, startDate, expirationDate } = req.body;
        
        if (!startDate || !expirationDate) {
            return res.status(400).json({ error: 'Both startDate and expirationDate are required' });
        }
        
        // Update the visa information
        const visaData = visaService.getVisaInfo();
        const currentVisa = visaData.currentVisa;
        if (visaType) {
            currentVisa.visaType = visaType;
        }
        if (country !== undefined) {
            currentVisa.country = country;
        }
        currentVisa.startDate = startDate;
        currentVisa.expirationDate = expirationDate;
        
        // Calculate status based on expiration date
        const now = new Date();
        const expiry = new Date(expirationDate);
        const daysRemaining = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysRemaining < 0) {
            currentVisa.status = 'EXPIRED';
        } else if (daysRemaining <= 90) {
            currentVisa.status = 'EXPIRING SOON';
        } else {
            currentVisa.status = 'ACTIVE';
        }
        
        visaService.updateVisaInfo(visaData);
        
        res.json({ message: 'Visa information updated successfully', currentVisa });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update visa information' });
    }
});

app.get('/timeline', (req: Request, res: Response) => {
    try {
        const stages = timelineService.getStages();
        const totalDays = timelineService.calculateTotalDuration();
        res.json({ stages, totalDays });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve timeline information' });
    }
});

app.get('/timeline/stage/:stageName', (req: Request, res: Response) => {
    try {
        const stageName = Array.isArray(req.params.stageName) ? req.params.stageName[0] : req.params.stageName;
        const stageDetails = timelineService.getStageDetails(stageName);
        if (stageDetails) {
            res.json(stageDetails);
        } else {
            res.status(404).json({ error: 'Stage not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve stage information' });
    }
});

app.post('/explain', async (req: Request, res: Response) => {
    try {
        if (!aiAgent) {
            return res.status(503).json({ error: 'AI Agent is not available. Make sure OPENAI_API_KEY is set in .env file.' });
        }
        
        const visaInfo = visaService.getVisaInfo();
        const currentStage = req.body.currentStage || { stageName: 'H1B', averageDays: 180, minDays: 120, maxDays: 240 };
        
        const explanation = await aiAgent.generateExplanation(visaInfo.currentVisa, currentStage);
        res.json({ explanation });
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to generate explanation' });
    }
});

app.post('/next-steps', async (req: Request, res: Response) => {
    try {
        if (!aiAgent) {
            return res.status(503).json({ error: 'AI Agent is not available. Make sure GOOGLE_API_KEY is set in .env file.' });
        }
        
        const visaInfo = visaService.getVisaInfo();
        const currentStage = req.body.currentStage || { stageName: 'H1B', averageDays: 180, minDays: 120, maxDays: 240 };
        const nextStages = visaInfo.nextStages || ['PERM', 'I-140', 'I-485'];
        
        const nextSteps = await aiAgent.getNextSteps(currentStage, nextStages);
        res.json({ nextSteps });
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to generate next steps' });
    }
});

app.listen(port, () => {
    console.log(`Immigration Tracker app listening at http://localhost:${port}`);
    if (aiAgent) {
        console.log('✓ AI Agent (Google Gemini) is ready');
    } else {
        console.log('⚠ AI features disabled - set GOOGLE_API_KEY in .env file');
    }
});