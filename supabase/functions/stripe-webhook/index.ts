import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2023-10-16' });
const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return new Response('No signature', { status: 400 });
  }

  try {
    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const { userId, type, roundId } = session.metadata || {};

      if (!userId || !type) {
        console.error('Missing metadata', session.metadata);
        return new Response('Missing metadata', { status: 400 });
      }

      // Update transaction
      await supabase.from('transactions').update({
        status: 'completed',
        stripe_payment_intent: session.payment_intent as string,
      }).eq('stripe_session_id', session.id);

      if (type === 'premium') {
        // Mark user as premium
        await supabase.from('profiles').upsert({
          id: userId,
          is_premium: true,
          premium_at: new Date().toISOString(),
          stripe_customer_id: session.customer as string,
        }, { onConflict: 'id' });

      } else if (type === 'promo_people' || type === 'promo_business') {
        // Mark round as paid and approved
        if (roundId) {
          await supabase.from('pending_rounds').update({
            status: 'approved',
            paid: true,
            amount_paid: session.amount_total,
            currency: session.currency,
          }).eq('id', roundId);
        }
      }
    }

    if (event.type === 'checkout.session.expired') {
      const session = event.data.object as Stripe.Checkout.Session;
      await supabase.from('transactions').update({
        status: 'failed',
      }).eq('stripe_session_id', session.id);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('Webhook error:', err);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
});
