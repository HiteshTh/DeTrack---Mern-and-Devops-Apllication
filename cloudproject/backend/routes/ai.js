const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

function getLocalInsights(tasks) {
  return tasks.map(task => {
    const titleLower = task.title ? task.title.toLowerCase() : '';
    const descLower = task.description ? task.description.toLowerCase() : '';
    const combined = titleLower + " " + descLower;
    let storyPoints = 3, riskLevel = 'Low', riskReason = 'Standard implementation expected.', estimatedDays = 1;
    
    if (combined.includes('kubernetes') || combined.includes('k8s') || combined.includes('docker') || combined.includes('pipeline')) {
      storyPoints = 8; riskLevel = 'High'; riskReason = 'Complex infrastructure changes can lead to deployment failures.'; estimatedDays = 4;
    } else if (combined.includes('auth') || combined.includes('security') || combined.includes('login')) {
      storyPoints = 5; riskLevel = 'Medium'; riskReason = 'Requires careful handling of secure tokens and session states.'; estimatedDays = 2;
    } else if (combined.includes('ui') || combined.includes('frontend') || combined.includes('component')) {
      storyPoints = 2; riskLevel = 'Low'; riskReason = 'Straightforward UI updates. Watch out for responsive design edge cases.'; estimatedDays = 1;
    }
    
    return { taskId: task._id, storyPoints, riskLevel, riskReason, estimatedDays };
  });
}

router.post('/plan-sprint', async (req, res) => {
  try {
    const { tasks } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      console.log('No GEMINI_API_KEY found, using fallback simulator');
      await new Promise(r => setTimeout(r, 1500));
      return res.json({ insights: getLocalInsights(tasks) });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    let model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `
You are an expert Agile Scrum Master and Technical Project Manager.
Analyze the following list of pending tasks and provide sprint planning insights.
For each task, estimate story points (fibonacci: 1, 2, 3, 5, 8, 13), risk level (Low, Medium, High), risk reason (1 short sentence), and estimated days to complete.
Respond ONLY with a valid JSON array of objects. Do not include any markdown formatting like \`\`\`json or \`\`\`.
The objects MUST have this exact format:
[
  {
    "taskId": "the exact _id from the task",
    "storyPoints": 5,
    "riskLevel": "Medium",
    "riskReason": "A brief explanation of why this risk level was chosen.",
    "estimatedDays": 2
  }
]

Tasks:
${JSON.stringify(tasks.map(t => ({ _id: t._id, title: t.title, description: t.description })))}
`;

    let result;
    try {
      result = await model.generateContent(prompt);
    } catch (modelErr) {
      console.warn("Primary model failed, falling back to gemini-pro-latest. Error:", modelErr.message);
      model = genAI.getGenerativeModel({ model: "gemini-pro-latest" });
      try {
        result = await model.generateContent(prompt);
      } catch (fallbackErr) {
        console.warn("Fallback model also failed. Using local simulator. Error:", fallbackErr.message);
        await new Promise(r => setTimeout(r, 1000));
        return res.json({ insights: getLocalInsights(tasks) });
      }
    }

    const normalizeResponseText = async (result) => {
      if (!result) return '';
      if (typeof result === 'string') return result;
      if (result.response) {
        if (typeof result.response.text === 'function') {
          return await result.response.text();
        }
        if (typeof result.response.text === 'string') {
          return result.response.text;
        }
      }
      if (typeof result.outputText === 'string') return result.outputText;
      if (typeof result.text === 'string') return result.text;
      return JSON.stringify(result);
    };

    const responseText = await normalizeResponseText(result);
    
    let jsonStr = responseText.replace(/```json/gi, '').replace(/```/gi, '').trim();
    
    const startIdx = jsonStr.indexOf('[');
    const endIdx = jsonStr.lastIndexOf(']');
    if (startIdx !== -1 && endIdx !== -1) {
      jsonStr = jsonStr.substring(startIdx, endIdx + 1);
    }

    const insights = JSON.parse(jsonStr);
    res.json({ insights });
  } catch (err) {
    console.error("AI Sprint Planner Error:", err);
    res.status(500).json({ error: "Failed to generate AI insights." });
  }
});

module.exports = router;
