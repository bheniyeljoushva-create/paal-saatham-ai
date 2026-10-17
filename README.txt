PAAL SAATHAM — NETLIFY UPLOAD

Included:
- index.html: chat UI with Tanglish demo fallbacks, voice input/playback, theme toggle, demo friends and passcode gate
- netlify/functions/chat.mjs: secure server-side OpenAI API call
- netlify.toml: Netlify publish and function settings

IMPORTANT: the real AI connection will NOT work until you add an API key privately in Netlify.
Never paste an API key into index.html or share it in chat.

UPLOAD STEPS
1. Extract this ZIP on your computer.
2. Open Netlify and choose Add new site / Deploy manually (or drag the extracted folder contents into the deploy area, if your Netlify screen supports it).
3. For functions to deploy reliably, connect the extracted project folder through a Git repository or use Netlify CLI; a simple static drag-and-drop may not build/deploy functions on every Netlify workflow.
4. In the Netlify site dashboard, open Site configuration / Environment variables.
5. Add variable name: OPENAI_API_KEY
   Value: your NEW API key (keep it private; do not send it to anyone).
6. Redeploy the site after adding the variable.
7. Open the deployed site and test a message such as: "Paal, epdi irukka?"

BILLING NOTE
OpenAI API usage may be billed separately from a ChatGPT subscription. Ask a parent/guardian to review billing and limits before enabling paid API usage.

LIMITATIONS
- Demo Friends are local simulations, not real messaging accounts.
- The browser passcode is only a convenience lock, not strong security or encryption.
- Speech features depend on browser support and microphone permissions.
