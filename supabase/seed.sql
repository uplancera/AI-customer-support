insert into public.knowledge_documents (id, title, source_type, content)
values
  ('11111111-1111-1111-1111-111111111111', 'Refund Policy', 'seed', 'Refund requests can be approved within 14 days when the account has duplicate billing or failed service delivery.'),
  ('22222222-2222-2222-2222-222222222222', 'Account Access Runbook', 'seed', 'If a customer cannot access their account, verify reset email delivery, confirm workspace domain, and check whether SSO has been enabled.'),
  ('33333333-3333-3333-3333-333333333333', 'Webhook Reliability Guide', 'seed', 'Webhook delays may be caused by upstream retries, incorrect endpoint acknowledgements, or rate limiting. Start with request logs and last successful delivery timestamp.')
on conflict do nothing;
