# Troubleshooting Guide

## Common Issues and Solutions

### 500 Internal Server Error

**Symptom**: Getting a 500 error when clicking "Generate Meal Plan"

**Possible Causes and Solutions**:

1. **Invalid API Key**
   - Error message: "Invalid API key" or "Unauthorized"
   - Solution: Check your OpenRouter API key
     - Go to Settings
     - Verify the API key starts with `sk-or-v1-`
     - Get a new key from https://openrouter.ai/keys

2. **Insufficient Credits**
   - Error message: "Insufficient credits"
   - Solution: Add credits to your OpenRouter account
     - Visit https://openrouter.ai/credits
     - Add credits or use free tier models

3. **Rate Limiting**
   - Error message: "Rate limit exceeded"
   - Solution: Wait 1-2 minutes and try again
     - OpenRouter has rate limits per API key
     - Consider upgrading your plan for higher limits

4. **Model Availability**
   - Error message: Model-specific errors
   - Solution: The app uses `anthropic/claude-sonnet-4.5`
     - Ensure this model is available in your region
     - Check OpenRouter's model availability page

### Development Server Issues

**Port Already in Use**
```
⚠ Port 3000 is in use
```
- The app will automatically use port 3001
- Access at http://localhost:3001 instead

**Stop the dev server**:
```bash
# Find the process
lsof -i :3000

# Kill it
kill -9 <PID>
```

### Settings Not Saving

**Symptom**: Settings disappear after refresh

**Solution**:
- Check browser console for localStorage errors
- Ensure you're not in incognito/private mode
- Clear browser cache and try again
- Check browser localStorage quota

### Recipes Not Displaying

**Check Console Logs**:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for errors or warnings
4. Check Network tab for failed API calls

**Common Issues**:
- API returned invalid JSON
- Recipe data missing required fields
- Frontend state not updating

### API Key Validation Failing

**Symptom**: "Invalid API key" even with correct key

**Solutions**:
1. Check for extra spaces in the API key
2. Ensure the key is from OpenRouter (not Anthropic directly)
3. Verify the key hasn't expired
4. Test the key directly:
   ```bash
   curl https://openrouter.ai/api/v1/models \
     -H "Authorization: Bearer YOUR_KEY"
   ```

### JSON Parse Errors

**Symptom**: "Failed to parse meal plan response"

**Possible Causes**:
- AI returned text instead of JSON
- Response was truncated
- Malformed JSON from API

**Solutions**:
1. Try generating again (AI responses vary)
2. Check server logs for the actual response
3. Reduce `numberOfMeals` if response is too large
4. Increase `max_tokens` in openrouter.ts if needed

### Network Errors

**Symptom**: Request fails completely

**Check**:
- Internet connection
- Firewall/proxy settings
- OpenRouter API status: https://status.openrouter.ai
- Browser network tab for CORS errors

### Debugging Tips

**Enable Verbose Logging**:

Check browser console and terminal where `npm run dev` is running for detailed logs.

**Test API Directly**:
```bash
curl http://localhost:3000/api/test
```

Should return:
```json
{
  "status": "ok",
  "message": "API is working",
  "timestamp": "2025-..."
}
```

**Test OpenRouter Connection**:
```bash
curl http://localhost:3000/api/meal-plans \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "apiKey": "your-key-here",
    "preferences": {
      "dietType": "balanced",
      "location": "Seattle, WA",
      "servingSize": 4,
      "preferredStores": ["walmart"]
    },
    "numberOfMeals": 3
  }'
```

### Build Errors

**TypeScript Errors**:
```bash
npm run typecheck
```

**Linting Errors**:
```bash
npm run lint
```

**Clean Build**:
```bash
rm -rf .next node_modules
npm install
npm run build
```

## Still Having Issues?

1. Check the browser console (F12 → Console tab)
2. Check the terminal where `npm run dev` is running
3. Review the error messages carefully
4. Check OpenRouter API status
5. Verify your API key and credits

## Getting Help

Include these details when reporting issues:
- Error message (exact text)
- Browser console logs
- Server terminal output
- Steps to reproduce
- Your setup (OS, Node version, browser)