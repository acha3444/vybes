import { Resend } from "resend"

const resendApiKey = process.env.RESEND_API_KEY
const adminEmail = process.env.ADMIN_EMAIL || "achraf.boulali@icloud.com"
const defaultFrom = process.env.EMAIL_FROM || "Vybe <onboarding@resend.dev>"

export const resend = resendApiKey ? new Resend(resendApiKey) : null

/**
 * Retourne l'URL publique absolue de l'application en ligne.
 * Évite scrupuleusement localhost dans les emails reçus sur smartphone ou client externe.
 */
export function getBaseAppUrl(): string {
  // 1. Si NEXT_PUBLIC_APP_URL est défini et n'est pas un localhost
  if (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes("localhost")) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")
  }
  // 2. Si déployé sur Vercel avec domaine officiel
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  // 3. Domaine Vercel de production par défaut de l'application Vybe
  return "https://vybes-lilac.vercel.app"
}

/**
 * CSS commun forçant le Dark Mode à 100% sur Apple Mail, Gmail, Outlook et mobile.
 * Empêche l'inversion automatique en blanc quand le téléphone/ordinateur est en Mode Clair.
 */
const DARK_MODE_HEAD_STYLES = `
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <style type="text/css">
    :root {
      color-scheme: light dark;
      supported-color-schemes: light dark;
    }
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      background-color: #0b0c10 !important;
      background: #0b0c10 !important;
      color: #ffffff !important;
    }
    /* Force le fond sombre même si le client mail est en mode clair */
    @media (prefers-color-scheme: light) {
      .body-bg, table.body-bg, td.body-bg {
        background-color: #0b0c10 !important;
        background: #0b0c10 !important;
      }
      .card-bg, table.card-bg, td.card-bg {
        background-color: #14161f !important;
        background: #14161f !important;
      }
      .inner-bg, table.inner-bg, td.inner-bg {
        background-color: #0d0e15 !important;
        background: #0d0e15 !important;
      }
      .force-white {
        color: #ffffff !important;
      }
      .force-light {
        color: #cbd5e1 !important;
      }
      .force-muted {
        color: #94a3b8 !important;
      }
    }
    @media (prefers-color-scheme: dark) {
      .body-bg, table.body-bg, td.body-bg {
        background-color: #0b0c10 !important;
        background: #0b0c10 !important;
      }
      .card-bg, table.card-bg, td.card-bg {
        background-color: #14161f !important;
        background: #14161f !important;
      }
      .inner-bg, table.inner-bg, td.inner-bg {
        background-color: #0d0e15 !important;
        background: #0d0e15 !important;
      }
    }
    /* Fix pour l'application Gmail mobile (Android / iOS) */
    [data-ogsc] .body-bg { background-color: #0b0c10 !important; }
    [data-ogsc] .card-bg { background-color: #14161f !important; }
    [data-ogsc] .inner-bg { background-color: #0d0e15 !important; }
    [data-ogsc] .force-white { color: #ffffff !important; }
  </style>
`

interface SignupNotificationParams {
  email: string
  fullName?: string | null
  provider?: "email" | "google" | string
  userId?: string
}

/**
 * Envoie un email d'alerte à l'administrateur lorsqu'un nouvel utilisateur s'inscrit sur Vybe.
 */
export async function sendAdminSignupNotification({
  email,
  fullName,
  provider = "email",
  userId,
}: SignupNotificationParams) {
  if (!resend) {
    console.warn("[Email] RESEND_API_KEY manquant, notification administrateur ignorée.")
    return { success: false, error: "RESEND_API_KEY missing" }
  }

  const displayName = fullName && fullName.trim().length > 0 ? fullName : "Nouveau freelance"
  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Europe/Paris",
  }).format(new Date())

  const providerLabel =
    provider === "google"
      ? "Google (OAuth)"
      : "Email & Mot de passe"

  const html = `
<!DOCTYPE html>
<html lang="fr" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nouveau freelance inscrit sur Vybe</title>
  ${DARK_MODE_HEAD_STYLES}
</head>
<body bgcolor="#0b0c10" class="body-bg" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; background-color: #0b0c10 !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff !important;">
  <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#0b0c10" class="body-bg" style="width: 100% !important; background-color: #0b0c10 !important; margin: 0; padding: 40px 16px;">
    <tr>
      <td align="center" bgcolor="#0b0c10" class="body-bg" style="background-color: #0b0c10 !important;">
        <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#14161f" class="card-bg" style="max-width: 580px; width: 100% !important; background-color: #14161f !important; border: 1px solid #232738; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
          <!-- Header Branding -->
          <tr>
            <td bgcolor="#1c1a36" style="padding: 36px 32px 26px; border-bottom: 1px solid #232738; background-color: #1c1a36 !important; background: linear-gradient(180deg, #241e4d 0%, #14161f 100%) !important;">
              <div style="display: inline-block; padding: 6px 14px; background-color: #241e4d !important; border: 1px solid rgba(91, 75, 255, 0.4); border-radius: 100px; font-size: 12px; font-weight: 700; color: #a89fff !important; letter-spacing: 0.5px; text-transform: uppercase;">
                ⚡️ Vybe Notifications
              </div>
              <h1 class="force-white" style="margin: 18px 0 0; font-size: 24px; font-weight: 800; color: #ffffff !important; letter-spacing: -0.5px;">
                🎉 Nouvelle inscription !
              </h1>
              <p class="force-muted" style="margin: 6px 0 0; font-size: 14px; color: #94a3b8 !important;">
                Un nouveau freelance vient de rejoindre la plateforme.
              </p>
            </td>
          </tr>

          <!-- Informations Utilisateur -->
          <tr>
            <td bgcolor="#14161f" class="card-bg" style="padding: 28px 32px; background-color: #14161f !important;">
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#0d0e15" class="inner-bg" style="background-color: #0d0e15 !important; border: 1px solid #1f2333; border-radius: 14px;">
                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #1f2333;">
                    <div style="font-size: 11px; font-weight: 700; color: #64748b !important; text-transform: uppercase; letter-spacing: 0.5px;">Nom complet</div>
                    <div class="force-white" style="font-size: 16px; font-weight: 700; color: #ffffff !important; margin-top: 4px;">${displayName}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #1f2333;">
                    <div style="font-size: 11px; font-weight: 700; color: #64748b !important; text-transform: uppercase; letter-spacing: 0.5px;">Adresse Email</div>
                    <div style="font-size: 15px; font-weight: 600; margin-top: 4px;">
                      <a href="mailto:${email}" style="color: #a89fff !important; text-decoration: none;">${email}</a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #1f2333;">
                    <div style="font-size: 11px; font-weight: 700; color: #64748b !important; text-transform: uppercase; letter-spacing: 0.5px;">Méthode d'inscription</div>
                    <div class="force-light" style="font-size: 14px; font-weight: 600; color: #e2e8f0 !important; margin-top: 4px;">${providerLabel}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #1f2333;">
                    <div style="font-size: 11px; font-weight: 700; color: #64748b !important; text-transform: uppercase; letter-spacing: 0.5px;">Statut abonnement</div>
                    <div style="font-size: 14px; font-weight: 600; color: #34d399 !important; margin-top: 4px;">
                      ✅ Essai gratuit 7 jours activé
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 14px 18px;">
                    <div style="font-size: 11px; font-weight: 700; color: #64748b !important; text-transform: uppercase; letter-spacing: 0.5px;">Date d'inscription</div>
                    <div class="force-muted" style="font-size: 13px; color: #94a3b8 !important; margin-top: 4px;">${formattedDate}</div>
                  </td>
                </tr>
                ${
                  userId
                    ? `<tr>
                        <td style="padding: 10px 18px; border-top: 1px solid #1f2333;">
                          <div style="font-size: 11px; font-weight: 700; color: #64748b !important; text-transform: uppercase; letter-spacing: 0.5px;">User ID</div>
                          <div style="font-size: 11px; color: #64748b !important; font-family: monospace; margin-top: 2px;">${userId}</div>
                        </td>
                      </tr>`
                    : ""
                }
              </table>

              <!-- Bouton d'action -->
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-top: 26px;">
                <tr>
                  <td align="center">
                    <a href="https://supabase.com/dashboard/project/jgvddxtpeqapipglxauj/editor" target="_blank" style="display: inline-block; background-color: #5b4bff !important; background: linear-gradient(135deg, #5b4bff 0%, #4333ea 100%) !important; color: #ffffff !important; text-decoration: none; font-size: 14px; font-weight: 700; padding: 13px 30px; border-radius: 12px; box-shadow: 0 4px 14px rgba(91,75,255,0.4);">
                      Voir dans Supabase &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td bgcolor="#0f1017" style="padding: 20px 32px; background-color: #0f1017 !important; border-top: 1px solid #1f2333; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #64748b !important;">
                Vybe — SaaS de prospection commerciale pour freelances web.<br/>
                Notification automatique générée par le système d'authentification.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `

  try {
    const result = await resend.emails.send({
      from: defaultFrom,
      to: adminEmail,
      subject: `🎉 Nouveau freelance inscrit sur Vybe : ${displayName} (${email})`,
      html,
    })

    if (result.error) {
      console.error("[Email] Erreur Resend lors de l'envoi admin :", result.error)
      return { success: false, error: result.error.message }
    }

    console.log(`[Email] Notification envoyée avec succès à ${adminEmail} (ID: ${result.data?.id})`)
    return { success: true, id: result.data?.id }
  } catch (err: any) {
    console.error("[Email] Exception lors de l'envoi admin :", err)
    return { success: false, error: err?.message || "Unknown error" }
  }
}

/**
 * Envoie un email d'alerte lors d'un nouveau paiement Stripe.
 */
export async function sendAdminPaymentNotification({
  customerEmail,
  amountFormatted,
  planName = "Abonnement Pro (29€/mois)",
}: {
  customerEmail: string
  amountFormatted: string
  planName?: string
}) {
  if (!resend) return { success: false, error: "RESEND_API_KEY missing" }

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nouveau paiement Stripe</title>
  ${DARK_MODE_HEAD_STYLES}
</head>
<body bgcolor="#0b0c10" class="body-bg" style="margin: 0; padding: 0; background-color: #0b0c10 !important; font-family: -apple-system, BlinkMacSystemFont, sans-serif; color: #ffffff !important;">
  <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#0b0c10" class="body-bg" style="width: 100% !important; background-color: #0b0c10 !important; padding: 40px 16px;">
    <tr>
      <td align="center" bgcolor="#0b0c10" class="body-bg" style="background-color: #0b0c10 !important;">
        <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#14161f" class="card-bg" style="max-width: 520px; background-color: #14161f !important; border: 1px solid #232738; border-radius: 20px; overflow: hidden;">
          <tr>
            <td bgcolor="#0f291e" style="padding: 34px 28px; text-align: center; background-color: #0f291e !important; background: linear-gradient(180deg, #133a2a 0%, #14161f 100%) !important;">
              <div style="font-size: 42px; margin-bottom: 8px;">💰</div>
              <h1 class="force-white" style="font-size: 22px; font-weight: 800; color: #ffffff !important; margin: 0;">Nouveau paiement Stripe reçu !</h1>
              <p style="font-size: 15px; color: #34d399 !important; font-weight: 700; margin-top: 8px;">${amountFormatted} — ${planName}</p>
            </td>
          </tr>
          <tr>
            <td bgcolor="#14161f" class="card-bg" style="padding: 24px 32px; background-color: #14161f !important;">
              <p class="force-light" style="color: #cbd5e1 !important; font-size: 14px; margin: 0 0 10px;">
                <strong>Client :</strong> ${customerEmail}
              </p>
              <p class="force-muted" style="color: #94a3b8 !important; font-size: 13px; margin: 0;">
                <strong>Date :</strong> ${new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" })}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `

  try {
    const result = await resend.emails.send({
      from: defaultFrom,
      to: adminEmail,
      subject: `💰 Nouveau paiement Vybe : ${amountFormatted} (${customerEmail})`,
      html,
    })
    return { success: true, id: result.data?.id }
  } catch (err: any) {
    console.error("[Email] Exception paiement :", err)
    return { success: false, error: err?.message }
  }
}

/**
 * Envoie un email de bienvenue à l'utilisateur qui s'inscrit.
 * 100% Dark Mode forcé (ne devient JAMAIS blanc sur iPhone/Mac en mode clair).
 * Le lien pointe vers l'application de production réelle.
 */
export async function sendUserWelcomeEmail({
  email,
  fullName,
}: {
  email: string
  fullName?: string | null
}) {
  if (!resend) return { success: false, error: "RESEND_API_KEY missing" }

  const firstName = fullName ? fullName.split(" ")[0] : "Freelance"
  const appUrl = getBaseAppUrl()

  const html = `
<!DOCTYPE html>
<html lang="fr" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenue sur Vybe ! 🚀</title>
  ${DARK_MODE_HEAD_STYLES}
</head>
<body bgcolor="#0b0c10" class="body-bg" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; background-color: #0b0c10 !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff !important;">
  <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#0b0c10" class="body-bg" style="width: 100% !important; background-color: #0b0c10 !important; margin: 0; padding: 40px 14px; table-layout: fixed;">
    <tr>
      <td align="center" bgcolor="#0b0c10" class="body-bg" style="background-color: #0b0c10 !important;">
        <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#14161f" class="card-bg" style="max-width: 580px; width: 100% !important; background-color: #14161f !important; border: 1px solid #232738; border-radius: 22px; overflow: hidden; box-shadow: 0 24px 48px rgba(0,0,0,0.6);">
          
          <!-- Header Banner -->
          <tr>
            <td bgcolor="#1c1a36" style="padding: 38px 32px 28px; background-color: #1c1a36 !important; background: linear-gradient(180deg, #241e4d 0%, #14161f 100%) !important; border-bottom: 1px solid #232738;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 6px 14px; background-color: #241e4d !important; border: 1px solid rgba(91, 75, 255, 0.45); border-radius: 100px;">
                    <span style="font-size: 12px; font-weight: 700; color: #a89fff !important; letter-spacing: 0.5px; text-transform: uppercase;">
                      ⚡️ vybe • Démarrage rapide
                    </span>
                  </td>
                </tr>
              </table>
              <h1 class="force-white" style="font-size: 26px; font-weight: 800; color: #ffffff !important; margin: 18px 0 10px; letter-spacing: -0.5px; line-height: 1.25;">
                Bienvenue sur Vybe, ${firstName} ! 🚀
              </h1>
              <p class="force-light" style="font-size: 15px; color: #cbd5e1 !important; line-height: 1.6; margin: 0;">
                Ton essai gratuit de 7 jours est officiellement actif. Décroche ton premier client commerçant dès aujourd'hui en suivant ces 3 étapes simples :
              </p>
            </td>
          </tr>

          <!-- 3 Étapes claires -->
          <tr>
            <td bgcolor="#14161f" class="card-bg" style="padding: 28px 32px; background-color: #14161f !important;">
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#0d0e15" class="inner-bg" style="background-color: #0d0e15 !important; border: 1px solid #1f2333; border-radius: 16px; margin-bottom: 26px;">
                
                <!-- Étape 1 -->
                <tr>
                  <td style="padding: 18px 20px 14px;">
                    <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td valign="top" style="width: 38px;">
                          <div style="width: 28px; height: 28px; line-height: 28px; text-align: center; border-radius: 50%; background-color: #5b4bff !important; color: #ffffff !important; font-weight: 800; font-size: 13px;">1</div>
                        </td>
                        <td valign="top">
                          <div class="force-white" style="color: #ffffff !important; font-size: 15px; font-weight: 700;">Trouve un commerce local</div>
                          <div class="force-muted" style="color: #94a3b8 !important; font-size: 13px; margin-top: 4px; line-height: 1.5;">Va dans l'onglet <em>Trouver</em> et recherche un restaurant, barbier ou institut qui n'a pas de site moderne.</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Étape 2 -->
                <tr>
                  <td style="padding: 10px 20px 14px; border-top: 1px solid #171926;">
                    <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td valign="top" style="width: 38px;">
                          <div style="width: 28px; height: 28px; line-height: 28px; text-align: center; border-radius: 50%; background-color: #5b4bff !important; color: #ffffff !important; font-weight: 800; font-size: 13px;">2</div>
                        </td>
                        <td valign="top">
                          <div class="force-white" style="color: #ffffff !important; font-size: 15px; font-weight: 700;">Génère sa démo en 60 secondes</div>
                          <div class="force-muted" style="color: #94a3b8 !important; font-size: 13px; margin-top: 4px; line-height: 1.5;">Vybe extrait automatiquement ses avis réels, ses coordonnées et crée un site mobile ultra immersif.</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Étape 3 -->
                <tr>
                  <td style="padding: 10px 20px 18px; border-top: 1px solid #171926;">
                    <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td valign="top" style="width: 38px;">
                          <div style="width: 28px; height: 28px; line-height: 28px; text-align: center; border-radius: 50%; background-color: #5b4bff !important; color: #ffffff !important; font-weight: 800; font-size: 13px;">3</div>
                        </td>
                        <td valign="top">
                          <div class="force-white" style="color: #ffffff !important; font-size: 15px; font-weight: 700;">Envoie le lien personnalisé</div>
                          <div class="force-muted" style="color: #94a3b8 !important; font-size: 13px; margin-top: 4px; line-height: 1.5;">Partage le lien par SMS, WhatsApp ou Instagram. Dès qu'il l'ouvre, le compteur de visites grimpe en direct sur ton dashboard.</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>

              <!-- Bouton CTA vers Dashboard Réel -->
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${appUrl}/dashboard" target="_blank" style="display: inline-block; background-color: #5b4bff !important; background: linear-gradient(135deg, #5b4bff 0%, #4333ea 100%) !important; color: #ffffff !important; text-decoration: none; font-size: 15px; font-weight: 700; padding: 15px 36px; border-radius: 14px; box-shadow: 0 4px 18px rgba(91,75,255,0.45); text-align: center;">
                      Lancer mon dashboard &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td bgcolor="#0f1017" style="padding: 22px 32px; background-color: #0f1017 !important; border-top: 1px solid #1f2333; text-align: center;">
              <p class="force-muted" style="margin: 0; font-size: 12px; color: #64748b !important; line-height: 1.5;">
                Besoin d'un coup de main pour contacter tes premiers commerçants ?<br/>
                Réponds simplement à cet email, nous sommes là pour t'aider.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `

  try {
    const result = await resend.emails.send({
      from: defaultFrom,
      to: email,
      subject: `Bienvenue sur Vybe ! 🚀 Prêt à générer ta 1ère démo ?`,
      html,
    })

    if (result.error) {
      console.warn("[Email] Warning envoi bienvenue utilisateur :", result.error.message)
      return { success: false, error: result.error.message }
    }

    return { success: true, id: result.data?.id }
  } catch (err: any) {
    console.warn("[Email] Bienvenue utilisateur non délivrée (domaine personnalisé requis sur Resend) :", err?.message)
    return { success: false, error: err?.message }
  }
}
