import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, session_id } = await req.json();

    if (!message) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // --- API KEY ---
    const openAIApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openAIApiKey) {
      console.error("OPENAI_API_KEY is not set");
      return new Response(JSON.stringify({ error: "OpenAI API key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // --- Init Supabase ---
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // --- Get or create conversation ---
    let conversationId: string | null = null;
    let activeSessionId = session_id;

    if (activeSessionId) {
      const { data: existingConv, error: convErr } = await supabase
        .from("chat_conversations")
        .select("id")
        .eq("session_id", activeSessionId)
        .single();

      if (convErr) {
        console.error("Error fetching conversation:", convErr);
      }
      if (existingConv) {
        conversationId = existingConv.id;
      }
    }

    if (!conversationId) {
      activeSessionId = activeSessionId || crypto.randomUUID();
      const { data: newConv, error: convError } = await supabase
        .from("chat_conversations")
        .insert({
          session_id: activeSessionId,
          user_id: null, // Allow anonymous users
        })
        .select("id")
        .single();

      if (convError) {
        console.error("Error creating conversation:", convError);
        return new Response(JSON.stringify({ error: "Failed to create conversation" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      conversationId = newConv.id;
    }

    // --- Save user message ---
    const { error: userMsgErr } = await supabase.from("chat_messages").insert({
      conversation_id: conversationId,
      role: "user",
      content: message,
    });
    if (userMsgErr) console.error("Error saving user message:", userMsgErr);

    // --- Get conversation history ---
    const { data: messages } = await supabase
      .from("chat_messages")
      .select("role, content")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .limit(10);

    // --- Build OpenAI prompt ---
    const openAIMessages = [
      {
        role: "system",
        content: `Du er en hjælpsom, empatisk og rolig AI-assistent, der hjælper mennesker med gæld og inkasso på en enkel måde. 

🔑 Regler:
- Venligt, støttende og respektfuldt sprog.
- Korte, enkle forklaringer uden jurasprog.
- Oversæt svære ord (fx "debitor", "inkassovarsel").
- Ingen moralprædikener – kun løsninger og ro.
- Små skridt er bedre end ingen skridt ("Selv 50 kr. er bedre end 0 kr.").
- Vær neutral mægler, men med brugerens forståelse i centrum.
- Ekstra ro hvis bruger virker bange eller stresset.
`,
      },
      ...(messages || []).map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
    ];

    // --- Call OpenAI ---
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // skift til "gpt-5" når klar
        messages: openAIMessages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", response.status, errorText);
      return new Response(JSON.stringify({ 
        error: "Failed to get AI response",
        details: `OpenAI API error: ${response.status} ${response.statusText}`,
        apiError: errorText
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // --- Save AI response ---
    const { error: aiMsgErr } = await supabase.from("chat_messages").insert({
      conversation_id: conversationId,
      role: "assistant",
      content: aiResponse,
    });
    if (aiMsgErr) console.error("Error saving AI message:", aiMsgErr);

    return new Response(JSON.stringify({ 
      response: aiResponse,
      session_id: activeSessionId
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in chat function:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});