import fs from "fs"
import path from "path"

// Lecture manuelle des variables d'environnement depuis .env.local
const envPath = path.resolve(process.cwd(), ".env.local")
const envVars = {}
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8")
  content.split("\n").forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) return
    const eqIdx = trimmed.indexOf("=")
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim()
      let val = trimmed.slice(eqIdx + 1).trim()
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1)
      }
      envVars[key] = val
    }
  })
}

const apiKey = process.env.GOOGLE_PLACES_API_KEY || envVars.GOOGLE_PLACES_API_KEY
const hasValidApiKey = apiKey && !apiKey.startsWith("AIzaSy...") && apiKey.length > 20

console.log("==================================================================")
console.log("TEST DE RECHERCHE RÉELLE : 'coiffeur Lyon'")
console.log("==================================================================")
console.log(`Clé GOOGLE_PLACES_API_KEY détectée : ${apiKey ? (hasValidApiKey ? "Valide (clé réelle)" : "Factice/Placeholder (" + apiKey.slice(0, 8) + "...)") : "Non définie"}`)

if (hasValidApiKey) {
  console.log("\n[1] Interrogation de l'API Google Places (New) endpoint searchText...")
  try {
    const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.rating,places.userRatingCount,places.websiteUri,places.types",
      },
      body: JSON.stringify({
        textQuery: "coiffeur à Lyon",
        languageCode: "fr",
        maxResultCount: 15,
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error(`Erreur Google Places HTTP ${res.status}:`, errText)
    } else {
      const data = await res.json()
      const places = data.places || []
      console.log(`\nSuccès Google Places : ${places.length} résultats bruts reçus de Google :`)
      console.log("------------------------------------------------------------------")
      places.forEach((p, i) => {
        const name = p.displayName?.text || "Sans nom"
        const phone = p.nationalPhoneNumber || "Non renseigné"
        const website = p.websiteUri || "ABSENT (Sans site web)"
        const rating = p.rating ? `${p.rating} (${p.userRatingCount || 0} avis)` : "Non renseigné"
        console.log(`#${i + 1} | Nom: "${name}" | Tél: ${phone} | Site: ${website} | Note: ${rating}`)
      })
      console.log("------------------------------------------------------------------")
    }
  } catch (err) {
    console.error("Erreur requête Google Places:", err)
  }
} else {
  console.log("\n[INFO] La clé GOOGLE_PLACES_API_KEY dans .env.local est 'AIzaSy...' (placeholder).")
  console.log("L'application bascule donc sur la source alternative ouverte : Base Entreprises (INSEE / SIRENE).")
  console.log("Interrogation de l'API Recherche d'entreprises pour 'coiffure Lyon'...")

  try {
    const res = await fetch(
      `https://recherche-entreprises.api.gouv.fr/search?q=${encodeURIComponent("coiffure Lyon")}&activite_principale=96.02A&etat_administratif=A&per_page=10`,
      { headers: { Accept: "application/json", "User-Agent": "Vybe-Audit/1.0" } }
    )
    if (res.ok) {
      const data = await res.json()
      const results = data.results || []
      console.log(`\nSuccès API Entreprises (INSEE) : ${results.length} établissements trouvés :`)
      console.log("------------------------------------------------------------------")
      results.forEach((item, i) => {
        const siege = item.siege || {}
        const name = siege.nom_commercial || item.nom_commercial || item.nom_complet || item.nom_raison_sociale
        console.log(`#${i + 1} | Nom: "${name}" | SIRET: ${siege.siret} | Ville: ${siege.libelle_commune} | Tél: Non renseigné (source INSEE) | Site: Non renseigné (source INSEE)`)
      })
      console.log("------------------------------------------------------------------")
      console.log("\n>> Règle absolue respectée : aucun faux téléphone ni fausse note n'est généré !")
    }
  } catch (err) {
    console.error("Erreur API Entreprises:", err)
  }
}
console.log("==================================================================\n")
