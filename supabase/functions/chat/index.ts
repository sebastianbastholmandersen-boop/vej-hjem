import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, session_id } = await req.json();
    
    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OPENAI_API_KEY is not set');
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get or create conversation
    let conversationId;
    if (session_id) {
      const { data: existingConv } = await supabase
        .from('chat_conversations')
        .select('id')
        .eq('session_id', session_id)
        .single();
      
      if (existingConv) {
        conversationId = existingConv.id;
      }
    }

    if (!conversationId) {
      const { data: newConv, error: convError } = await supabase
        .from('chat_conversations')
        .insert({
          session_id: session_id || crypto.randomUUID(),
          user_id: null // Allow anonymous users
        })
        .select('id')
        .single();

      if (convError) {
        console.error('Error creating conversation:', convError);
        return new Response(JSON.stringify({ error: 'Failed to create conversation' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      conversationId = newConv.id;
    }

    // Save user message
    await supabase
      .from('chat_messages')
      .insert({
        conversation_id: conversationId,
        role: 'user',
        content: message
      });

    // Get conversation history for context
    const { data: messages } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(10); // Last 10 messages for context

    // Build messages array for OpenAI
    const openAIMessages = [
      {
        role: 'system',
        content: `Du er en hjælpsom, empatisk og rolig AI-assistent, der hjælper mennesker med gæld og inkasso på en enkel måde. 

🔑 Regler for din kommunikation:
- Tal altid i et venligt, støttende og respektfuldt sprog.
- Forklar alt i korte, enkle sætninger uden jurasprog.
- Oversæt svære ord (som "debitor", "inkassovarsel", "rykkergebyr") til letforståelig dagligdags tale.
- Giv brugeren ro: Ingen moralprædikener, ingen skyldfølelse.
- Fokusér altid på: "Hvad betyder dette for brugeren?"
- Hvis muligt, opmuntre til små skridt frem for intet ("Selv 50 kr. er bedre end 0 kr.").
- Vær neutral mægler: hjælp både bruger og kreditor, men med brugerens forståelse i centrum.
- Hvis brugeren virker bange, stresset eller opgivende → svar med ekstra ro og empati.

🎯 Eksempler på tone:
- Bruger: "Jeg forstår ikke, hvad et inkassobrev er?"
- AI: "Et inkassobrev betyder bare, at et firma minder dig om, at du skylder penge. Det ser alvorligt ud, men du kan stadig finde en løsning."

- Bruger: "Jeg har ikke betalt i 3 måneder."
- AI: "Så kan sagen være sendt til inkasso. Det betyder ekstra gebyrer, men du kan stadig lave en aftale. Vil du høre om små afdrag?"

- Bruger: "Jeg kan kun betale lidt."
- AI: "Det er helt i orden. Selv små beløb er bedre end ingenting. Skal jeg vise dig, hvordan man laver en plan med små afdrag?"

Kort sagt: Du er en "mægler med samvittighed" – du forstår brugerens følelser, oversætter det svære og hjælper med konkrete, menneskelige løsninger.`
      },
      ...(messages || []).map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }))
    ];

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-mini-2025-08-07',
        messages: openAIMessages,
        max_completion_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      return new Response(JSON.stringify({ error: 'Failed to get AI response' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Save AI response
    await supabase
      .from('chat_messages')
      .insert({
        conversation_id: conversationId,
        role: 'assistant',
        content: aiResponse
      });

    return new Response(JSON.stringify({ 
      response: aiResponse,
      session_id: session_id || conversationId
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chat function:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});