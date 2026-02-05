// test-runner.js
import handler from './api/evaluate.js';

// 1. MOCK THE RESPONSE OBJECT
// This catches the data that would normally go to the Vercel server
const res = {
    setHeader: (key, value) => console.log(`[Header] ${key}: ${value}`),
    status: (code) => {
        return {
            json: (data) => {
                console.log('\n--- FINAL RESPONSE ---');
                console.log(`STATUS: ${code}`);
                console.log('BODY:', JSON.stringify(data, null, 2));
                console.log('----------------------\n');
            },
            end: () => console.log(`STATUS: ${code} (Response Ended)`)
        };
    }
};

// 2. SCENARIO A: The "Empty Ping" (Simulating the Hackathon Judge)
console.log('🔵 TEST 1: Simulating Empty Ping...');
const reqPing = {
    method: 'POST',
    body: {} // Empty body
};
await handler(reqPing, res);

// 3. SCENARIO B: The "Real Scam" (Simulating a User)
console.log('🔵 TEST 2: Simulating Real Scam Message...');
const reqScam = {
    method: 'POST',
    body: { message: "URGENT: Your account is blocked. Click here to verify: bit.ly/scam" }
};
await handler(reqScam, res);