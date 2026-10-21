-- ==============================================================================
-- MIGRATION : P3 — DONNÉES ET COHÉRENCE
-- ==============================================================================

-- 1. Ajout de la colonne sent_at sur demos si elle n'existe pas
ALTER TABLE public.demos 
ADD COLUMN IF NOT EXISTS sent_at TIMESTAMPTZ DEFAULT NULL;

-- 2. Index pour accélérer le filtrage et calcul des KPIs sur sent_at
CREATE INDEX IF NOT EXISTS idx_demos_sent_at ON public.demos(sent_at);

-- 3. Rétro-remplissage de sent_at pour les démos existantes dont le prospect a dépassé le premier contact
UPDATE public.demos d
SET sent_at = COALESCE(d.sent_at, d.updated_at, d.created_at)
FROM public.prospects p
WHERE d.prospect_id = p.id
  AND p.status IN ('demo_envoyee', 'interesse', 'signe')
  AND d.sent_at IS NULL;

-- 4. Suppression des données de test résiduelles
DELETE FROM public.prospects
WHERE name ILIKE '%Le Bistro Gourmand%'
   OR name ILIKE '%Bistro Gourmand%'
   OR name ILIKE '%Test Commerce%'
   OR name ILIKE '%Demo Test%';

-- 5. Normalisation des villes existantes dans prospects (casse propre, pas de TOUT MAJUSCULES)
UPDATE public.prospects
SET city = INITCAP(LOWER(TRIM(city)))
WHERE city IS NOT NULL AND city = UPPER(city);

-- Rétablissement des accents et tirets français pour les communes courantes
UPDATE public.prospects SET city = 'Vénissieux' WHERE LOWER(city) IN ('venissieux', 'vénissieux');
UPDATE public.prospects SET city = 'Villefranche-sur-Saône' WHERE LOWER(city) IN ('villefranche sur saone', 'villefranche-sur-saone', 'villefranche sur saône', 'villefranche-sur-saône');
UPDATE public.prospects SET city = 'Saint-Étienne' WHERE LOWER(city) IN ('saint etienne', 'saint-etienne', 'saint-étienne');
UPDATE public.prospects SET city = 'Saint-Denis' WHERE LOWER(city) IN ('saint denis', 'saint-denis');
UPDATE public.prospects SET city = 'Bourg-en-Bresse' WHERE LOWER(city) IN ('bourg en bresse', 'bourg-en-bresse');
UPDATE public.prospects SET city = 'Clermont-Ferrand' WHERE LOWER(city) IN ('clermont ferrand', 'clermont-ferrand');
UPDATE public.prospects SET city = 'Aix-en-Provence' WHERE LOWER(city) IN ('aix en provence', 'aix-en-provence');
UPDATE public.prospects SET city = 'Boulogne-Billancourt' WHERE LOWER(city) IN ('boulogne billancourt', 'boulogne-billancourt');
UPDATE public.prospects SET city = 'Asnières-sur-Seine' WHERE LOWER(city) IN ('asnieres sur seine', 'asnieres-sur-seine', 'asnières-sur-seine');
UPDATE public.prospects SET city = 'Nîmes' WHERE LOWER(city) = 'nimes';
UPDATE public.prospects SET city = 'Béziers' WHERE LOWER(city) = 'beziers';
UPDATE public.prospects SET city = 'Orléans' WHERE LOWER(city) = 'orleans';
