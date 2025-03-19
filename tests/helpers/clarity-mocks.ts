// This is a simplified mock implementation for testing Clarity contracts with Vitest
// In a real implementation, you would use a proper testing framework for Clarity

export function mockClaritySimnet() {
	let contracts = {}
	let dataVars = {}
	let dataMaps = {}
	let mockReturns = {
		publicFn: {},
		readOnlyFn: {},
	}
	let mockTransfers = []
	
	return {
		reset() {
			contracts = {}
			dataVars = {}
			dataMaps = {}
			mockReturns = {
				publicFn: {},
				readOnlyFn: {},
			}
			mockTransfers = []
			return Promise.resolve()
		},
		
		deployContract({ contractName, senderAddress, path }) {
			contracts[contractName] = { owner: senderAddress, path }
			return Promise.resolve({ success: true })
		},
		
		callPublicFn({ contractName, functionName, senderAddress, args }) {
			const mockKey = `${contractName}.${functionName}`
			if (mockReturns.publicFn[mockKey]) {
				return Promise.resolve({
					success: true,
					result: mockReturns.publicFn[mockKey],
				})
			}
			
			return Promise.resolve({
				success: true,
				result: this.okCV(this.boolCV(true)),
			})
		},
		
		callReadOnlyFn({ contractName, functionName, senderAddress, args }) {
			const mockKey = `${contractName}.${functionName}.${JSON.stringify(args)}`
			if (mockReturns.readOnlyFn[mockKey]) {
				return Promise.resolve({
					success: true,
					result: mockReturns.readOnlyFn[mockKey],
				})
			}
			
			return Promise.resolve({
				success: true,
				result: this.someCV({}),
			})
		},
		
		mockPublicFnReturns({ contractName, functionName, returns }) {
			const key = `${contractName}.${functionName}`
			mockReturns.publicFn[key] = returns
		},
		
		mockReadOnlyFnReturns({ contractName, functionName, args, returns }) {
			const key = `${contractName}.${functionName}.${JSON.stringify(args)}`
			mockReturns.readOnlyFn[key] = returns
		},
		
		mockStxTransfer({ sender, recipient, amount, success }) {
			mockTransfers.push({ sender, recipient, amount, success })
		},
		
		// Clarity value constructors
		uintCV(value) {
			return value
		},
		
		boolCV(value) {
			return value
		},
		
		stringUtf8CV(value) {
			return value
		},
		
		stringUtf8(value) {
			return value
		},
		
		listCV(values) {
			return values
		},
		
		principalCV(value) {
			return value
		},
		
		someCV(value) {
			return { type: "some", value }
		},
		
		noneCV() {
			return { type: "none" }
		},
		
		okCV(value) {
			return { type: "ok", value }
		},
		
		errCV(value) {
			return { type: "err", value }
		},
	}
}

export function mockClarityBitcoin() {
	return {
		// Bitcoin-related mock functions would go here
	}
}

