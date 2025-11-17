/*
  # Schéma de gestion des places de stationnement

  1. Nouvelles Tables
    - `parking_spots`
      - `id` (uuid, clé primaire) - Identifiant unique de la place
      - `name` (text) - Nom ou description de la zone de stationnement
      - `address` (text) - Adresse complète
      - `latitude` (numeric) - Coordonnée latitude
      - `longitude` (numeric) - Coordonnée longitude
      - `is_paid` (boolean) - Indique si le stationnement est payant
      - `total_spaces` (integer) - Nombre total de places dans cette zone
      - `available_spaces` (integer) - Nombre de places disponibles actuellement
      - `zone_type` (text) - Type de zone (rue, parking, etc.)
      - `arrondissement` (text) - Arrondissement de Paris ou ville d'Île-de-France
      - `last_updated` (timestamptz) - Dernière mise à jour des disponibilités
      - `created_at` (timestamptz) - Date de création de l'enregistrement

  2. Sécurité
    - Activation de RLS sur la table `parking_spots`
    - Politique permettant à tous (authentifiés et anonymes) de lire les données
    - Seuls les administrateurs peuvent modifier les données (via service_role)

  3. Indexes
    - Index sur latitude/longitude pour recherche géographique rapide
    - Index sur arrondissement pour filtrage par zone
    - Index sur is_paid pour filtrage payant/gratuit

  4. Notes importantes
    - Les coordonnées utilisent le format décimal (WGS84)
    - available_spaces doit toujours être <= total_spaces
    - last_updated permet de suivre la fraîcheur des données
*/

CREATE TABLE IF NOT EXISTS parking_spots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  latitude numeric(10, 8) NOT NULL,
  longitude numeric(11, 8) NOT NULL,
  is_paid boolean DEFAULT true,
  total_spaces integer DEFAULT 0,
  available_spaces integer DEFAULT 0,
  zone_type text DEFAULT 'street',
  arrondissement text,
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_available_spaces CHECK (available_spaces >= 0 AND available_spaces <= total_spaces)
);

ALTER TABLE parking_spots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view parking spots"
  ON parking_spots
  FOR SELECT
  USING (true);

CREATE INDEX IF NOT EXISTS idx_parking_lat_lng ON parking_spots(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_parking_arrondissement ON parking_spots(arrondissement);
CREATE INDEX IF NOT EXISTS idx_parking_is_paid ON parking_spots(is_paid);
CREATE INDEX IF NOT EXISTS idx_parking_last_updated ON parking_spots(last_updated DESC);

INSERT INTO parking_spots (name, address, latitude, longitude, is_paid, total_spaces, available_spaces, zone_type, arrondissement) VALUES
  ('Place de la Concorde', '75008 Paris, Place de la Concorde', 48.8656330, 2.3212357, true, 50, 12, 'parking', '8ème'),
  ('Rue de Rivoli', '75001 Paris, Rue de Rivoli', 48.8606111, 2.3376310, true, 30, 5, 'street', '1er'),
  ('Montmartre - Rue Lepic', '75018 Paris, Rue Lepic', 48.8867321, 2.3344320, false, 20, 8, 'street', '18ème'),
  ('Parking Tour Eiffel', '75007 Paris, Avenue de la Bourdonnais', 48.8583701, 2.2944813, true, 100, 45, 'parking', '7ème'),
  ('Boulevard Saint-Germain', '75006 Paris, Boulevard Saint-Germain', 48.8534100, 2.3352200, true, 25, 3, 'street', '6ème'),
  ('Place de la République', '75011 Paris, Place de la République', 48.8676190, 2.3633097, false, 15, 7, 'street', '11ème'),
  ('Parking Gare de Lyon', '75012 Paris, Place Louis Armand', 48.8443623, 2.3736847, true, 200, 89, 'parking', '12ème'),
  ('Rue Mouffetard', '75005 Paris, Rue Mouffetard', 48.8418975, 2.3496525, false, 10, 2, 'street', '5ème'),
  ('Parking Les Halles', '75001 Paris, Forum des Halles', 48.8619692, 2.3467014, true, 150, 67, 'parking', '1er'),
  ('Avenue des Champs-Élysées', '75008 Paris, Avenue des Champs-Élysées', 48.8698679, 2.3077950, true, 40, 1, 'street', '8ème')
ON CONFLICT DO NOTHING;