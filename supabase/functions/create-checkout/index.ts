import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2023-10-16' });
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get user from JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { type, roundId } = await req.json();

    // Determine product based on type
    let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[];
    let metadata: Record<string, string> = { userId: user.id, type };

    if (type === 'premium') {
      // Check if already premium
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_premium')
        .eq('id', user.id)
        .single();

      if (profile?.is_premium) {
        return new Response(JSON.stringify({ error: 'Already premium' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      lineItems = [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'PinTheWorld Premium',
            description: 'Unlimited plays forever — one-time purchase',
          },
          unit_amount: 399, // $3.99
        },
        quantity: 1,
      }];
    } else if (type === 'promo_people') {
      metadata.roundId = roundId;
      lineItems = [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'PinTheWorld Promo — Cupido',
            description: 'Your profile appears when players guess your location',
          },
          unit_amount: 699, // $6.99
        },
        quantity: 1,
      }];
    } else if (type === 'promo_business') {
      metadata.roundId = roundId;
      lineItems = [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'PinTheWorld Promo — Business',
            description: 'Your business ad appears when players guess this location',
          },
          unit_amount: 2999, // $29.99
        },
        quantity: 1,
      }];
    } else {
      return new Response(JSON.stringify({ error: 'Invalid type' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get origin for redirect URLs
    const origin = req.headers.get('origin') || 'https://pintheworld.com';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: user.email,
      metadata,
      success_url: `${origin}?payment=success&type=${type}`,
      cancel_url: `${origin}?payment=cancelled`,
    });

    // Record transaction
    if (type !== 'premium') {
      await supabase.from('pending_rounds').update({
        stripe_session_id: session.id,
        status: 'pending_payment',
      }).eq('id', roundId);
    }

    await supabase.from('transactions').insert({
      user_id: user.id,
      stripe_session_id: session.id,
      round_id: type !== 'premium' ? roundId : null,
      amount: lineItems[0].price_data!.unit_amount,
      currency: 'usd',
      status: 'pending',
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('Checkout error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
