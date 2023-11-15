import { DEFAULT_SYSTEM_PROMPT } from '@/utils/app/const';
import { BitAPAIConversation, BitAPAIError } from '@/utils/server';

import { ChatBody, Message } from '@/types/chat';

export const config = {
  runtime: 'edge',
};

const handler = async (req: Request): Promise<Response> => {
  try {
    const { messages, key, prompt } = (await req.json()) as ChatBody;

    let promptToSend = prompt;
    if (!promptToSend) {
      promptToSend = DEFAULT_SYSTEM_PROMPT;
    }

    let messagesToSend: Message[] = [];

    // for (let i = messages.length - 1; i >= 0; i--) {
    //   const message = messages[i];
    //   messagesToSend = [message, ...messagesToSend];
    // }
    messagesToSend = [messages[messages.length-1]];

    const response = await BitAPAIConversation(
      key,
      messages,
      promptToSend,
    );

    return new Response(response);
  } catch (error) {
    if (error instanceof BitAPAIError) {
      return new Response('Error', { status: 500, statusText: error.message });
    } else {
      return new Response('Error', { status: 500 });
    }
  }
};

export default handler;
