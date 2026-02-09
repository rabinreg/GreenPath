# Immigration Tracker

## Overview
The Immigration Tracker application is designed to help users manage and track their immigration status through various visa stages. It provides a user-friendly interface to view current visa information, understand the timeline of immigration processes, and receive AI-generated explanations based on the user's status.

## Features
- Track current visa status, including visa type and start date.
- Manage timelines for various immigration stages such as H1B, PERM, and I-140.
- Calculate average durations for each stage of the immigration process.
- AI agent integration for providing explanations and insights based on the current status.

## Project Structure
```
immigration-tracker
├── src
│   ├── app.ts                # Entry point of the application
│   ├── data
│   │   └── visas.json        # JSON file containing visa information
│   ├── types
│   │   ├── visa.ts           # Type definitions for visa objects
│   │   └── timeline.ts       # Type definitions for timeline stages
│   ├── services
│   │   ├── visaService.ts     # Service for managing visa information
│   │   ├── timelineService.ts  # Service for managing timeline stages
│   │   └── aiAgent.ts         # AI agent for generating explanations
│   ├── utils
│   │   └── dateCalculator.ts   # Utility functions for date calculations
│   └── config
│       └── stageConfig.ts     # Configuration for immigration stages
├── tests
│   ├── visaService.test.ts     # Unit tests for VisaService
│   └── timelineService.test.ts  # Unit tests for TimelineService
├── package.json                # npm configuration file
├── tsconfig.json               # TypeScript configuration file
└── README.md                   # Project documentation
```

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd immigration-tracker
   ```
3. Install the dependencies:
   ```
   npm install
   ```
4. Run the application:
   ```
   npm start
   ```

## Usage Guidelines
- After starting the application, users can view their current visa status and timeline.
- Users can navigate through different stages of the immigration process and receive insights from the AI agent.
- Ensure to keep the `visas.json` file updated with the latest visa information for accurate tracking.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.