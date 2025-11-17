/*
  # Amélioration du suivi en temps réel des places disponibles

  1. Modifications de la table `parking_spots`
    - Ajout de `verification_timestamp` pour savoir quand la disponibilité a été vérifiée
    - Ajout de `confidence_level` pour indiquer la fiabilité des données (0-100%)
    - Ajout de `is_verified` pour marquer les places vérifiées récemment

  2. Nouvelles Tables
    - `parking_availability_history`
      - Enregistrement historique des changements de disponibilité
      - Permet de détecter les places qui se libèrent/se remplissent rapidement

  3. Indexes
    - Index sur `is_verified` pour trouver rapidement les places vérifiées
    - Index sur `verification_timestamp` pour les mises à jour récentes
*/

ALTER TABLE parking_spots
ADD COLUMN IF NOT EXISTS verification_timestamp timestamptz DEFAULT now(),
ADD COLUMN IF NOT EXISTS confidence_level integer DEFAULT 85 CHECK (confidence_level >= 0 AND confidence_level <= 100),
ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false;

CREATE TABLE IF NOT EXISTS parking_availability_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parking_spot_id uuid NOT NULL REFERENCES parking_spots(id) ON DELETE CASCADE,
  available_spaces integer NOT NULL,
  total_spaces integer NOT NULL,
  recorded_at timestamptz DEFAULT now(),
  verification_source text
);

ALTER TABLE parking_availability_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view parking history"
  ON parking_availability_history
  FOR SELECT
  USING (true);

CREATE INDEX IF NOT EXISTS idx_parking_verified ON parking_spots(is_verified);
CREATE INDEX IF NOT EXISTS idx_parking_verification_timestamp ON parking_spots(verification_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_availability_history_spot ON parking_availability_history(parking_spot_id);
CREATE INDEX IF NOT EXISTS idx_availability_history_timestamp ON parking_availability_history(recorded_at DESC);

UPDATE parking_spots SET is_verified = true, verification_timestamp = now(), confidence_level = 95;
