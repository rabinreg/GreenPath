import * as fs from 'fs';
import * as path from 'path';

export class VisaService {
    private visas: any;
    private filePath: string;
    private historyFilePath: string;

    constructor() {
        this.filePath = path.join(__dirname, '../data/visas.json');
        this.historyFilePath = path.join(__dirname, '../data/visaHistory.json');
        this.visas = require('../data/visas.json');
    }

    getVisaInfo() {
        // Always read from file to ensure reset on browser refresh
        this.visas = JSON.parse(fs.readFileSync(this.filePath, 'utf-8'));
        return this.visas;
    }

    updateVisaInfo(updatedVisa: any) {
        // Save to memory
        this.visas = updatedVisa;
        
        // Save to visas.json for current session (will be reset manually when needed)
        fs.writeFileSync(this.filePath, JSON.stringify(updatedVisa, null, 2), 'utf-8');
        
        // Save to history file for developer analysis
        const historyEntry = {
            timestamp: new Date().toISOString(),
            data: updatedVisa
        };
        
        let history = [];
        if (fs.existsSync(this.historyFilePath)) {
            const historyContent = fs.readFileSync(this.historyFilePath, 'utf-8');
            history = JSON.parse(historyContent);
        }
        
        history.push(historyEntry);
        fs.writeFileSync(this.historyFilePath, JSON.stringify(history, null, 2), 'utf-8');
    }
}

export default VisaService;