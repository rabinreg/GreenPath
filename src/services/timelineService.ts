import { TimelineStage } from '../types/timeline';
import stageConfig from '../config/stageConfig';

export class TimelineService {
    private stages: TimelineStage[];

    constructor() {
        this.stages = stageConfig.stages;
    }

    public getStages(): TimelineStage[] {
        return this.stages;
    }

    public getAverageDays(stageName: string): number | null {
        const stage = this.stages.find(s => s.stageName === stageName);
        return stage ? stage.averageDays : null;
    }

    public getStageDetails(stageName: string): TimelineStage | null {
        return this.stages.find(s => s.stageName === stageName) || null;
    }

    public calculateTotalDuration(): number {
        return this.stages.reduce((total, stage) => total + stage.averageDays, 0);
    }
}