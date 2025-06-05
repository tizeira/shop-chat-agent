/**
 * ElevenLabs Service
 * Basic placeholder implementation for streaming conversations
 */
import AppConfig from './config.server';

/**
 * Creates an ElevenLabs service instance
 * @param {string} apiKey - ElevenLabs API key
 * @param {string} agentId - ElevenLabs Agent ID
 * @returns {Object} service with methods for interacting with the ElevenLabs API
 */
export function createElevenLabsService(
  apiKey = process.env.ELEVENLABS_API_KEY,
  agentId = process.env.ELEVENLABS_AGENT_ID
) {
  const baseUrl = 'https://api.elevenlabs.io';

  /**
   * Streams a conversation with ElevenLabs
   * NOTE: This is a placeholder using the REST API. Replace with
   *       WebSocket implementation for real-time audio.
   */
  const streamConversation = async (
    { messages, promptType = AppConfig.api.defaultPromptType },
    streamHandlers
  ) => {
    const body = {
      messages,
      prompt: promptType,
      agent_id: agentId
    };

    const response = await fetch(`${baseUrl}/v1/convai/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const data = await response.json();

    if (streamHandlers.onText) {
      streamHandlers.onText(data.completion);
    }
    if (streamHandlers.onMessage) {
      streamHandlers.onMessage({ role: 'assistant', content: data.completion });
    }

    return { role: 'assistant', content: data.completion, stop_reason: 'end_turn' };
  };

  const getSystemPrompt = (promptType) => {
    return promptType;
  };

  return {
    streamConversation,
    getSystemPrompt
  };
}

export default {
  createElevenLabsService
};
