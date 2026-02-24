
-- Deals table
CREATE TABLE public.deals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_by UUID NOT NULL,
  name TEXT NOT NULL,
  sector TEXT NOT NULL,
  stage TEXT NOT NULL DEFAULT 'Series A',
  target_irr TEXT NOT NULL DEFAULT '20-25%',
  target_amount BIGINT NOT NULL DEFAULT 0,
  raised_amount BIGINT NOT NULL DEFAULT 0,
  minimum_investment BIGINT NOT NULL DEFAULT 100000,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('open', 'closed', 'upcoming')),
  closing_date DATE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;

-- Fund managers can CRUD their own deals
CREATE POLICY "Fund managers can create deals"
ON public.deals FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'fund_manager') AND auth.uid() = created_by);

CREATE POLICY "Fund managers can update own deals"
ON public.deals FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'fund_manager') AND auth.uid() = created_by);

CREATE POLICY "Fund managers can delete own deals"
ON public.deals FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'fund_manager') AND auth.uid() = created_by);

-- Everyone authenticated can view deals
CREATE POLICY "Authenticated users can view deals"
ON public.deals FOR SELECT TO authenticated
USING (true);

CREATE TRIGGER update_deals_updated_at
BEFORE UPDATE ON public.deals
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Investments table
CREATE TABLE public.investments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  deal_id UUID NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
  investor_id UUID NOT NULL,
  amount BIGINT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'committed', 'funded', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;

-- Investors can view own investments
CREATE POLICY "Investors can view own investments"
ON public.investments FOR SELECT TO authenticated
USING (auth.uid() = investor_id);

-- Fund managers can view investments in their deals
CREATE POLICY "Fund managers can view deal investments"
ON public.investments FOR SELECT TO authenticated
USING (
  public.has_role(auth.uid(), 'fund_manager')
  AND deal_id IN (SELECT id FROM public.deals WHERE created_by = auth.uid())
);

-- Investors can create investments
CREATE POLICY "Investors can create investments"
ON public.investments FOR INSERT TO authenticated
WITH CHECK (auth.uid() = investor_id);

-- Fund managers can update investment status
CREATE POLICY "Fund managers can update investment status"
ON public.investments FOR UPDATE TO authenticated
USING (
  public.has_role(auth.uid(), 'fund_manager')
  AND deal_id IN (SELECT id FROM public.deals WHERE created_by = auth.uid())
);

CREATE TRIGGER update_investments_updated_at
BEFORE UPDATE ON public.investments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Capital calls table
CREATE TABLE public.capital_calls (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  deal_id UUID NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
  created_by UUID NOT NULL,
  call_number INT NOT NULL DEFAULT 1,
  amount BIGINT NOT NULL,
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.capital_calls ENABLE ROW LEVEL SECURITY;

-- Fund managers can CRUD capital calls for their deals
CREATE POLICY "Fund managers can manage capital calls"
ON public.capital_calls FOR ALL TO authenticated
USING (
  public.has_role(auth.uid(), 'fund_manager')
  AND deal_id IN (SELECT id FROM public.deals WHERE created_by = auth.uid())
)
WITH CHECK (
  public.has_role(auth.uid(), 'fund_manager')
  AND deal_id IN (SELECT id FROM public.deals WHERE created_by = auth.uid())
  AND auth.uid() = created_by
);

-- Investors can view capital calls for deals they've invested in
CREATE POLICY "Investors can view their capital calls"
ON public.capital_calls FOR SELECT TO authenticated
USING (
  deal_id IN (SELECT deal_id FROM public.investments WHERE investor_id = auth.uid())
);

CREATE TRIGGER update_capital_calls_updated_at
BEFORE UPDATE ON public.capital_calls
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
