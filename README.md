# Decentralized Shared Mobility Infrastructure

A blockchain-powered platform for managing and optimizing electric vehicle charging networks through decentralized infrastructure sharing, usage tracking, and automated maintenance.

## Overview

This system creates a decentralized network of EV charging infrastructure that can be shared across multiple service providers, municipalities, and private owners. By leveraging blockchain technology, we enable transparent operation, efficient utilization, and fair revenue distribution for all participants in the mobility ecosystem.

## Core Smart Contracts

### Charging Station Registration Contract

The foundation of our network, recording essential details about EV charging locations:

- Station location data with precise geolocation coordinates
- Ownership information (public, private, or hybrid)
- Technical specifications (charging types, power output, connector types)
- Operational hours and availability settings
- Certification and compliance status
- Accessibility features and restrictions

### Usage Tracking Contract

Monitors and records charging station utilization in real-time:

- Session start/end timestamps and duration
- Energy consumption measurements
- User identification (anonymized)
- Payment processing and transaction records
- Peak usage periods and demand patterns
- Idle time tracking and optimization
- Carbon offset calculations

### Maintenance Scheduling Contract

Manages preventative and reactive maintenance based on usage patterns:

- Predictive maintenance scheduling based on usage metrics
- Maintenance history and documentation
- Service provider assignment and qualification verification
- Parts inventory and replacement tracking
- Diagnostic data collection and analysis
- Uptime performance metrics and SLA compliance
- Emergency maintenance request handling

### Revenue Distribution Contract

Automatically allocates income to infrastructure owners and service providers:

- Dynamic pricing model implementation
- Revenue sharing calculations based on predefined agreements
- Automatic payment distribution to stakeholders
- Tax reporting and compliance documentation
- Incentive mechanisms for optimal station placement
- Subsidy management for underserved areas
- Tokenized rewards for infrastructure investors

## Key Features

- **Permissionless Participation**: Any qualified entity can register and operate charging infrastructure
- **Real-time Availability Updates**: Immediate synchronization of station status across all platforms
- **Dynamic Pricing**: Demand-based pricing to optimize utilization and revenue
- **Cross-platform Compatibility**: Integration with multiple mobility service providers
- **Transparent Governance**: Community-driven decision making for network parameters
- **Data Analytics**: Comprehensive insights into usage patterns and infrastructure needs
- **Carbon Impact Tracking**: Measurement and reporting of environmental benefits

## Benefits

- **For Infrastructure Owners**: Maximized ROI through increased utilization and fair revenue sharing
- **For EV Users**: Improved access to charging stations with reliable availability information
- **For Municipalities**: Optimized urban mobility planning based on usage data
- **For Service Providers**: Reduced capital expenditure through shared infrastructure
- **For Grid Operators**: Better load management and integration with renewable energy sources

## Getting Started

### Prerequisites

- Ethereum wallet with test ETH (for development)
- Node.js (v14.x or higher) and npm installed
- Truffle or Hardhat for smart contract development
- MetaMask or similar wallet extension for browser interaction

### Installation

```bash
# Clone the repository
git clone https://github.com/your-organization/decentralized-mobility.git

# Install dependencies
cd decentralized-mobility
npm install

# Compile smart contracts
npx hardhat compile

# Deploy to local test network
npx hardhat run scripts/deploy.js --network localhost
```

### Configuration

1. Create a `.env` file based on the provided `.env.example`
2. Configure your preferred Ethereum network in `hardhat.config.js`
3. Set up your station registration parameters in `config/stationConfig.js`

## Usage Examples

### Registering a New Charging Station

```javascript
const ChargingStationRegistry = await ethers.getContractFactory("ChargingStationRegistry");
const registry = await ChargingStationRegistry.attach("DEPLOYED_CONTRACT_ADDRESS");

const stationData = {
  location: "123 Main Street, Metropolis",
  geoCoordinates: "40.7128,-74.0060",
  chargingTypes: ["Level 2", "DC Fast"],
  powerOutput: 150,
  connectorTypes: ["CCS", "CHAdeMO", "Type 2"],
  operationalHours: "24/7",
  ownerAddress: "0xYourEthereumAddress"
};

await registry.registerStation(
  stationData.location,
  stationData.geoCoordinates,
  stationData.chargingTypes,
  stationData.powerOutput,
  stationData.connectorTypes,
  stationData.operationalHours,
  { from: stationData.ownerAddress }
);
```

### Recording a Charging Session

```javascript
const UsageTrackingContract = await ethers.getContractFactory("UsageTrackingContract");
const usageTracker = await UsageTrackingContract.attach("DEPLOYED_CONTRACT_ADDRESS");

await usageTracker.startChargingSession(
  stationId,
  userWalletAddress,
  Date.now(),
  { from: userWalletAddress }
);

// After charging completes
await usageTracker.endChargingSession(
  sessionId,
  energyConsumed, // in kWh
  Date.now(),
  { from: userWalletAddress }
);
```

### Scheduling Maintenance

```javascript
const MaintenanceContract = await ethers.getContractFactory("MaintenanceSchedulingContract");
const maintenance = await MaintenanceContract.attach("DEPLOYED_CONTRACT_ADDRESS");

await maintenance.scheduleRoutineMaintenance(
  stationId,
  "Connector check and cleaning",
  1677628800, // Unix timestamp for scheduled date
  { from: serviceProviderAddress }
);
```

## System Architecture

```
┌─────────────────────────────┐      ┌────────────────────────┐
│   Charging Station Registry │◄─────┤ Station Owner Interface │
└───────────────┬─────────────┘      └────────────────────────┘
                │
                ▼
┌─────────────────────────────┐      ┌────────────────────────┐
│      Usage Tracking         │◄─────┤ EV User Mobile App     │
└───────────────┬─────────────┘      └────────────────────────┘
                │
                ▼
┌─────────────────────────────┐      ┌────────────────────────┐
│   Maintenance Scheduling    │◄─────┤ Service Provider Portal│
└───────────────┬─────────────┘      └────────────────────────┘
                │
                ▼
┌─────────────────────────────┐      ┌────────────────────────┐
│    Revenue Distribution     │◄─────┤ Stakeholder Dashboard  │
└─────────────────────────────┘      └────────────────────────┘
```

## API Documentation

Our system provides a RESTful API for integration with existing mobility platforms:

- `GET /api/stations` - List all registered charging stations
- `GET /api/stations/{id}` - Get details for a specific station
- `GET /api/stations/{id}/availability` - Check real-time availability
- `POST /api/sessions` - Start a new charging session
- `PUT /api/sessions/{id}` - Update an existing session
- `GET /api/revenue/{ownerAddress}` - Get revenue reports for station owner

## Contributing

We welcome contributions from developers, mobility service providers, and EV infrastructure experts. Please see our [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [OpenZeppelin](https://openzeppelin.com/) for secure smart contract libraries
- [Energy Web Foundation](https://www.energyweb.org/) for decentralized energy concepts
- [Open Charge Alliance](https://www.openchargealliance.org/) for OCPP standards inspiration
- [IOTA Foundation](https://www.iota.org/) for concepts on feeless microtransactions
