// test-runner.js
import handler from './api/evaluate.js';

// MOCK RESPONSE OBJECT
const res = {
    setHeader: (key, value) => console.log(`[Header] ${key}: ${value}`),
    status: (code) => {
        return {
            json: (data) => {
                console.log(`\n--- FINAL RESPONSE (Status: ${code}) ---`);
                console.log('BODY:', JSON.stringify(data, null, 2));
                console.log('------------------------------------\n');
            },
            end: () => console.log(`STATUS: ${code} (Response Ended)`)
        };
    }
};

const API_KEY = "guvi-secure-pass-2026";

// 🔴 TEST 1: INTRUDER (No Password)
console.log('🔴 TEST 1: Simulating Intruder (No Password)...');
const reqIntruder = {
    method: 'POST',
    headers: {}, // Empty headers
    body: { message: "Hello" }
};
await handler(reqIntruder, res);

// 🟢 TEST 2: JUDGE (Correct Password + Empty Ping)
console.log('🟢 TEST 2: Simulating Judge Ping (With Password)...');
const reqJudge = {
    method: 'POST',
    headers: { 'apikey': API_KEY }, // Correct Key
    body: {}
};
await handler(reqJudge, res);

// 🟢 TEST 3: REAL USE (Correct Password + Scam)
console.log('🟢 TEST 3: Simulating Real Scam (With Password)...');
const reqScam = {
    method: 'POST',
    headers: { 'authorization': `Bearer ${API_KEY}` }, // Correct Key via Auth header
    body: { message: "URGENT: Your account is blocked. Click bit.ly/fake now." }
};
await handler(reqScam, res);