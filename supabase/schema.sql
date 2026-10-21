-- ==============================================================================
-- SCHEMA SUPABASE POUR SAAS VYBE (V1 + PRÉPARATION V2)
-- ==============================================================================

-- Active l'extension uuid
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. TABLE PROFILES (Liée à auth.users)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    stripe_customer_id TEXT UNIQUE,
    stripe_subscription_id TEXT,
    subscription_status TEXT DEFAULT 'trialing' CHECK (subscription_status IN ('trialing', 'active', 'past_due', 'canceled', 'incomplete', 'unpaid')),
    trial_ends_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '7 days'),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Index pour recherche rapide par Stripe Customer ID
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON public.profiles(stripe_customer_id);

-- Sécurité RLS sur profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update only their own full_name"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- TRIGGER DE SÉCURITÉ : Empêche un utilisateur authentifié de modifier les colonnes Stripe et statut
-- NOTA BENE : Ce trigger s'applique STRICTEMENT sur "BEFORE UPDATE". Il ne bloque pas l'INSERT initial par handle_new_user.
CREATE OR REPLACE FUNCTION public.protect_profile_subscription_fields()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Si l'appel provient d'un utilisateur standard (rôle 'authenticated')
    IF (auth.role() = 'authenticated') THEN
        IF (OLD.stripe_customer_id IS DISTINCT FROM NEW.stripe_customer_id) OR
           (OLD.stripe_subscription_id IS DISTINCT FROM NEW.stripe_subscription_id) OR
           (OLD.subscription_status IS DISTINCT FROM NEW.subscription_status) OR
           (OLD.trial_ends_at IS DISTINCT FROM NEW.trial_ends_at) THEN
            RAISE EXCEPTION 'Viol de sécurité : Les champs Stripe et abonnement ne peuvent être modifiés que par le système.';
        END IF;
    END IF;
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_protect_profile_subscription ON public.profiles;
CREATE TRIGGER trg_protect_profile_subscription
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.protect_profile_subscription_fields();

-- Trigger automatique à la création d'un utilisateur dans auth.users
-- Crée automatiquement le profil avec subscription_status = 'trialing' et trial_ends_at = now() + 7 jours
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, subscription_status, trial_ends_at)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        'trialing',
        now() + INTERVAL '7 days'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 2. TABLE PROSPECTS (Commerces sauvegardés par le freelance)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.prospects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    google_place_id TEXT,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('restaurant', 'barber', 'beauty')),
    address TEXT,
    city TEXT,
    phone TEXT,
    rating NUMERIC(2, 1),
    user_ratings_total INTEGER DEFAULT 0,
    status TEXT DEFAULT 'a_contacter' CHECK (status IN ('a_contacter', 'demo_envoyee', 'interesse', 'signe', 'perdu')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_prospects_user_id ON public.prospects(user_id);
CREATE INDEX IF NOT EXISTS idx_prospects_status ON public.prospects(user_id, status);

ALTER TABLE public.prospects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Freelances manage their own prospects"
    ON public.prospects FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 3. TABLE DEMOS (Sites de démo générés)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.demos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prospect_id UUID NOT NULL REFERENCES public.prospects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    slug VARCHAR(10) UNIQUE NOT NULL, -- Nanoid 10 caractères
    template_type TEXT NOT NULL CHECK (template_type IN ('restaurant', 'barber', 'beauty')),
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    views_count INTEGER DEFAULT 0 NOT NULL,
    sent_at TIMESTAMPTZ DEFAULT NULL,
    expires_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '14 days') NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_demos_slug ON public.demos(slug);
CREATE INDEX IF NOT EXISTS idx_demos_user_id ON public.demos(user_id);
CREATE INDEX IF NOT EXISTS idx_demos_prospect_id ON public.demos(prospect_id);

ALTER TABLE public.demos ENABLE ROW LEVEL SECURITY;

-- Lecture des démos par le propriétaire
CREATE POLICY "Freelances view their own demos"
    ON public.demos FOR SELECT
    USING (auth.uid() = user_id);

-- RÈGLE DE SÉCURITÉ INSERT DEMOS :
-- 1. auth.uid() = user_id
-- 2. Le prospect_id appartient STRICTEMENT à auth.uid()
-- 3. Le freelance possède un abonnement actif OU un essai (trialing) valide
CREATE POLICY "Active or trialing subscribers can create demos"
    ON public.demos FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
        AND EXISTS (
            SELECT 1 FROM public.prospects
            WHERE prospects.id = demos.prospect_id
            AND prospects.user_id = auth.uid()
        )
        AND EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND (
                profiles.subscription_status = 'active'
                OR (
                    profiles.subscription_status = 'trialing'
                    AND (profiles.trial_ends_at IS NULL OR profiles.trial_ends_at > now())
                )
            )
        )
    );

-- Mise à jour du contenu par le propriétaire (prospect_id vérifié également)
CREATE POLICY "Freelances update their own demos"
    ON public.demos FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (
        auth.uid() = user_id
        AND EXISTS (
            SELECT 1 FROM public.prospects
            WHERE prospects.id = demos.prospect_id
            AND prospects.user_id = auth.uid()
        )
    );

-- Suppression par le propriétaire
CREATE POLICY "Freelances delete their own demos"
    ON public.demos FOR DELETE
    USING (auth.uid() = user_id);

-- RÈGLE IMMUTABILITÉ : Bloque toute altération directe des champs critiques (expires_at, is_active, views_count, slug, prospect_id)
CREATE OR REPLACE FUNCTION public.protect_demo_immutable_fields()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF (auth.role() = 'authenticated') THEN
        IF (OLD.expires_at IS DISTINCT FROM NEW.expires_at) OR
           (OLD.views_count IS DISTINCT FROM NEW.views_count) OR
           (OLD.slug IS DISTINCT FROM NEW.slug) OR
           (OLD.is_active IS DISTINCT FROM NEW.is_active) OR
           (OLD.prospect_id IS DISTINCT FROM NEW.prospect_id) THEN
            RAISE EXCEPTION 'Viol de sécurité : expires_at, is_active, slug, views_count et prospect_id ne peuvent être modifiés directement.';
        END IF;
    END IF;
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_protect_demo_immutable ON public.demos;
CREATE TRIGGER trg_protect_demo_immutable
    BEFORE UPDATE ON public.demos
    FOR EACH ROW
    EXECUTE FUNCTION public.protect_demo_immutable_fields();

-- RPC : Prolonger la démo de 14 jours (Sécurisé côté serveur)
CREATE OR REPLACE FUNCTION public.extend_demo_14_days(p_demo_id UUID)
RETURNS JSONB 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_demo RECORD;
    v_profile RECORD;
    v_new_expires_at TIMESTAMPTZ;
BEGIN
    -- Récupère la démo du freelance
    SELECT * INTO v_demo FROM public.demos WHERE id = p_demo_id AND user_id = auth.uid();
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Démo non trouvée ou accès refusé.';
    END IF;

    -- Vérifie l'abonnement du freelance
    SELECT * INTO v_profile FROM public.profiles WHERE id = auth.uid();
    IF NOT (v_profile.subscription_status = 'active' OR (v_profile.subscription_status = 'trialing' AND v_profile.trial_ends_at > now())) THEN
        RAISE EXCEPTION 'Abonnement actif requis pour prolonger la démo.';
    END IF;

    v_new_expires_at := GREATEST(v_demo.expires_at, now()) + INTERVAL '14 days';

    UPDATE public.demos
    SET expires_at = v_new_expires_at,
        is_active = true,
        updated_at = now()
    WHERE id = p_demo_id;

    RETURN jsonb_build_object('success', true, 'expires_at', v_new_expires_at);
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------------------------
-- 4. TABLE DEMO_VIEWS (Historique et déduplication des vues)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.demo_views (
    id BIGSERIAL PRIMARY KEY,
    demo_id UUID NOT NULL REFERENCES public.demos(id) ON DELETE CASCADE,
    ip_hash TEXT NOT NULL,
    user_agent TEXT,
    viewed_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_demo_views_demo_hash ON public.demo_views(demo_id, ip_hash, viewed_at);

ALTER TABLE public.demo_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Freelances view their demo analytics"
    ON public.demo_views FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.demos
        WHERE demos.id = demo_views.demo_id
        AND demos.user_id = auth.uid()
    ));

-- RPC : Enregistrement de vue publique (Anti-triche + exclusion du créateur)
CREATE OR REPLACE FUNCTION public.track_demo_view(
    p_slug TEXT,
    p_ip_hash TEXT,
    p_user_agent TEXT,
    p_is_owner BOOLEAN
)
RETURNS BOOLEAN 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_demo_id UUID;
    v_is_expired BOOLEAN;
    v_already_viewed BOOLEAN;
BEGIN
    -- Si c'est le freelance propriétaire qui visite la démo, on ignore le décompte
    IF p_is_owner THEN
        RETURN FALSE;
    END IF;

    -- Vérifie l'existence et la validité de la démo
    SELECT id, (expires_at < now() OR NOT is_active)
    INTO v_demo_id, v_is_expired
    FROM public.demos
    WHERE slug = p_slug;

    IF v_demo_id IS NULL OR v_is_expired THEN
        RETURN FALSE;
    END IF;

    -- Anti-spam : pas de double comptage si même hash dans les 2 dernières heures
    SELECT EXISTS (
        SELECT 1 FROM public.demo_views
        WHERE demo_id = v_demo_id
        AND ip_hash = p_ip_hash
        AND viewed_at > (now() - INTERVAL '2 hours')
    ) INTO v_already_viewed;

    IF v_already_viewed THEN
        RETURN FALSE;
    END IF;

    -- Enregistre la vue et incrémente le compteur atomiquement
    INSERT INTO public.demo_views (demo_id, ip_hash, user_agent)
    VALUES (v_demo_id, p_ip_hash, p_user_agent);

    UPDATE public.demos
    SET views_count = views_count + 1
    WHERE id = v_demo_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- RPC : Lecture publique sécurisée d'une démo
CREATE OR REPLACE FUNCTION public.get_public_demo(p_slug TEXT)
RETURNS TABLE (
    id UUID,
    template_type TEXT,
    content JSONB,
    views_count INTEGER,
    expires_at TIMESTAMPTZ,
    is_expired BOOLEAN
) 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.id,
        d.template_type,
        d.content,
        d.views_count,
        d.expires_at,
        (d.expires_at <= now() OR NOT d.is_active) AS is_expired
    FROM public.demos d
    WHERE d.slug = p_slug;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------------------------
-- 5. STOCKAGE SUPABASE (Storage Bucket 'demo-photos')
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('demo-photos', 'demo-photos', true)
ON CONFLICT (id) DO NOTHING;

-- RÈGLE STORAGE : Isolation au dossier de chaque freelance auth.uid()
CREATE POLICY "Freelances upload in their own folder"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'demo-photos'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Freelances update their own photos"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'demo-photos'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Freelances delete their own photos"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'demo-photos'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Public read for demo photos"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'demo-photos');

-- ------------------------------------------------------------------------------
-- 6. ANTICIPATION V2 : TABLE CLIENT_SITES (Sites hébergés et Stripe Connect)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.client_sites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prospect_id UUID REFERENCES public.prospects(id) ON DELETE SET NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    custom_domain TEXT UNIQUE,
    stripe_connect_account_id TEXT,
    stripe_subscription_id TEXT,
    monthly_price_cents INTEGER DEFAULT 4900,
    platform_fee_percent NUMERIC(4,2) DEFAULT 15.00,
    status TEXT DEFAULT 'pending_dns' CHECK (status IN ('pending_dns', 'active', 'suspended', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.client_sites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Freelances view their client sites"
    ON public.client_sites FOR SELECT
    USING (auth.uid() = user_id);

-- Vérifie l'appartenance du prospect_id à auth.uid() pour client_sites
CREATE POLICY "Freelances create their client sites"
    ON public.client_sites FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
        AND (
            prospect_id IS NULL
            OR EXISTS (
                SELECT 1 FROM public.prospects
                WHERE prospects.id = client_sites.prospect_id
                AND prospects.user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Freelances update their client sites"
    ON public.client_sites FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (
        auth.uid() = user_id
        AND (
            prospect_id IS NULL
            OR EXISTS (
                SELECT 1 FROM public.prospects
                WHERE prospects.id = client_sites.prospect_id
                AND prospects.user_id = auth.uid()
            )
        )
    );
