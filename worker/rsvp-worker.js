export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    // GET /rsvps - List all RSVPs (for admin viewing)
    if (request.method === 'GET' && url.pathname === '/rsvps') {
      try {
        const { results } = await env.DB.prepare(
          'SELECT * FROM rsvps ORDER BY submitted_at DESC'
        ).all();
        
        return new Response(JSON.stringify(results), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch RSVPs' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }
    }

    // POST /rsvps - Submit new RSVP
    if (request.method === 'POST') {
      try {
        const data = await request.json();

        // Validate required fields
        if (!data.name || !data.guests || !data.events || data.events.length === 0) {
          return new Response(JSON.stringify({ error: 'Missing required fields' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        }

        const submittedAt = new Date().toISOString();
        const eventsJson = JSON.stringify(data.events);

        // Insert into D1 database
        const result = await env.DB.prepare(
          `INSERT INTO rsvps (name, email, phone, guests, events, message, submitted_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          data.name,
          data.email || 'Not provided',
          data.phone || 'Not provided',
          data.guests,
          eventsJson,
          data.message || 'No message',
          submittedAt
        ).run();

        return new Response(JSON.stringify({ success: true, id: result.meta.last_row_id }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });

      } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to submit RSVP' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }
    }

    return new Response('Not found', { status: 404, headers: corsHeaders });
  },
};
