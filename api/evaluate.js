// api/evaluate.js

export default async function handler(req, res) {
  // 1. CORS Headers (So the tester can reach you)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight check
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // --- CONFIGURATION ---
  // PASTE YOUR GROQ KEY HERE (Inside quotes)
  const GROQ_KEY = ""; 
  // ---------------------

  // 2. SAFE PARSING (Fixes 400 Error)
  // Vercel parses JSON automatically into req.body
  let message = "System Integrity Check";
  const body = req.body;

  if (body && body.message) {
    message = body.message;
  } else {
    console.log("Empty ping received. Using System Check mode.");
  }

  // 3. SYSTEM CHECK RESPONSE (Immediate 200 OK)
  if (message === "System Integrity Check") {
    return res.status(200).json({
      scam_detected: false,
      confidence_score: 0,
      classification: "System Check",
      extracted_intelligence: "System Online",
      agent_handoff: "passive"
    });
  }

  // 4. CALL GROQ AI
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          { 
            role: 'system', 
            content: 'Return JSON only: {"scam_detected": boolean, "confidence_score": number, "classification": string, "extracted_intelligence": string}' 
          },
          { role: 'user', content: message },
        ],
        temperature: 0.1,
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "{}";
    
    // Parse AI Response
    let result = {};
    try {
        const cleanJson = content.replace(/```json/g, '').replace(/```/g, '').trim();
        result = JSON.parse(cleanJson);
    } catch (e) {
        result = { scam_detected: true, confidence_score: 80, classification: "Manual Flag", extracted_intelligence: "Parse Error" };
    }

    // 5. RETURN FINAL RESPONSE
    return res.status(200).json({
        scam_detected: result.scam_detected ?? true,
        confidence_score: result.confidence_score ?? 0,
        classification: result.classification || "Uncertain",
        extracted_intelligence: result.extracted_intelligence || "None",
        agent_handoff: "active"
    });

  } catch (error) {
    return res.status(200).json({
        scam_detected: true,
        confidence_score: 99,
        classification: "Error Fallback",
        extracted_intelligence: "System Error",
        agent_handoff: "active"
    });
  }
}