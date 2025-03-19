import { describe, it, expect, beforeEach } from "vitest"
import { mockClarityBitcoin, mockClaritySimnet } from "./helpers/clarity-mocks"

// Mock the Clarity environment
const simnet = mockClaritySimnet()
const bitcoin = mockClarityBitcoin()

describe("Charging Station Registry Contract", () => {
  const owner = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"
  const user = "ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG"
  
  beforeEach(async () => {
    // Reset the simnet before each test
    await simnet.reset()
    
    // Deploy the contract
    await simnet.deployContract({
      contractName: "charging-station-registry",
      senderAddress: owner,
      path: "./contracts/charging-station-registry.clar",
    })
  })
  
  it("should register a new charging station", async () => {
    const location = "San Francisco Downtown"
    const powerCapacity = 50 // kW
    const connectorTypes = ["CCS", "CHAdeMO", "Type 2"]
    
    const result = await simnet.callPublicFn({
      contractName: "charging-station-registry",
      functionName: "register-station",
      senderAddress: owner,
      args: [
        simnet.stringUtf8(location),
        simnet.uintCV(powerCapacity),
        simnet.listCV(connectorTypes.map((type) => simnet.stringUtf8CV(type))),
      ],
    })
    
    expect(result.success).toBe(true)
    expect(result.result).toEqual(simnet.okCV(simnet.uintCV(1)))
    
    // Verify station was registered
    const stationResult = await simnet.callReadOnlyFn({
      contractName: "charging-station-registry",
      functionName: "get-station",
      senderAddress: owner,
      args: [simnet.uintCV(1)],
    })
    
    const stationData = stationResult.result.value
    expect(stationData.owner).toEqual(owner)
    expect(stationData.location).toEqual(location)
    expect(stationData.powerCapacity).toEqual(powerCapacity)
    expect(stationData.active).toEqual(true)
  })
  
  it("should update station status", async () => {
    // First register a station
    await simnet.callPublicFn({
      contractName: "charging-station-registry",
      functionName: "register-station",
      senderAddress: owner,
      args: [simnet.stringUtf8("Test Location"), simnet.uintCV(100), simnet.listCV([simnet.stringUtf8CV("CCS")])],
    })
    
    // Update status to inactive
    const result = await simnet.callPublicFn({
      contractName: "charging-station-registry",
      functionName: "update-station-status",
      senderAddress: owner,
      args: [simnet.uintCV(1), simnet.boolCV(false)],
    })
    
    expect(result.success).toBe(true)
    expect(result.result).toEqual(simnet.okCV(simnet.boolCV(true)))
    
    // Verify status was updated
    const stationResult = await simnet.callReadOnlyFn({
      contractName: "charging-station-registry",
      functionName: "get-station",
      senderAddress: owner,
      args: [simnet.uintCV(1)],
    })
    
    const stationData = stationResult.result.value
    expect(stationData.active).toEqual(false)
  })
  
  it("should not allow non-owners to update station status", async () => {
    // First register a station
    await simnet.callPublicFn({
      contractName: "charging-station-registry",
      functionName: "register-station",
      senderAddress: owner,
      args: [simnet.stringUtf8("Test Location"), simnet.uintCV(100), simnet.listCV([simnet.stringUtf8CV("CCS")])],
    })
    
    // Try to update status as non-owner
    const result = await simnet.callPublicFn({
      contractName: "charging-station-registry",
      functionName: "update-station-status",
      senderAddress: user,
      args: [simnet.uintCV(1), simnet.boolCV(false)],
    })
    
    expect(result.success).toBe(false)
    expect(result.result).toEqual(simnet.errCV(simnet.uintCV(2))) // Error code 2: Not the owner
  })
  
  it("should return the correct station count", async () => {
    // Register multiple stations
    for (let i = 0; i < 3; i++) {
      await simnet.callPublicFn({
        contractName: "charging-station-registry",
        functionName: "register-station",
        senderAddress: owner,
        args: [simnet.stringUtf8(`Location ${i}`), simnet.uintCV(100), simnet.listCV([simnet.stringUtf8CV("CCS")])],
      })
    }
    
    // Check station count
    const result = await simnet.callReadOnlyFn({
      contractName: "charging-station-registry",
      functionName: "get-station-count",
      senderAddress: owner,
      args: [],
    })
    
    expect(result.result).toEqual(simnet.uintCV(3))
  })
})

