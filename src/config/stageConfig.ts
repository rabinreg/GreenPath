const stageConfig = {
    stages: [
        {
            stageName: "H1B",
            averageDays: 180,
            minDays: 120,
            maxDays: 240,
            notes: "Initial work visa, can be extended."
        },
        {
            stageName: "PERM",
            averageDays: 180,
            minDays: 150,
            maxDays: 210,
            notes: "Labor certification process."
        },
        {
            stageName: "I-140",
            averageDays: 120,
            minDays: 90,
            maxDays: 150,
            notes: "Immigrant petition for alien worker."
        },
        {
            stageName: "I-485",
            averageDays: 180,
            minDays: 150,
            maxDays: 210,
            notes: "Application to register permanent residence or adjust status."
        }
    ]
};

export default stageConfig;