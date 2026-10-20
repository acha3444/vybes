import { Resend } from "resend"

const resendApiKey = process.env.RESEND_API_KEY
const adminEmail = process.env.ADMIN_EMAIL || "achraf.boulali@icloud.com"
const defaultFrom = process.env.EMAIL_FROM || "Vybe <onboarding@resend.dev>"

export const resend = resendApiKey ? new Resend(resendApiKey) : null

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
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>Nouveau freelance inscrit sur Vybe</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0c10; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0b0c10; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 560px; background-color: #14161f; border: 1px solid #232738; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.4);">
          <!-- Header Branding -->
          <tr>
            <td style="padding: 32px 32px 24px; border-bottom: 1px solid #232738; background: linear-gradient(180deg, rgba(91,75,255,0.15) 0%, rgba(20,22,31,0) 100%);">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="display: inline-block; padding: 6px 14px; background: rgba(91, 75, 255, 0.2); border: 1px solid rgba(91, 75, 255, 0.4); border-radius: 100px; font-size: 12px; font-weight: 700; color: #a89fff; letter-spacing: 0.5px; text-transform: uppercase;">
                      ⚡️ Vybe Notifications
                    </div>
                    <h1 style="margin: 16px 0 0; font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                      🎉 Nouvelle inscription !
                    </h1>
                    <p style="margin: 6px 0 0; font-size: 14px; color: #94a3b8;">
                      Un nouveau freelance vient de rejoindre la plateforme.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Informations Utilisateur -->
          <tr>
            <td style="padding: 28px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0d0e15; border: 1px solid #1f2333; border-radius: 14px; padding: 20px;">
                <tr>
                  <td style="padding: 8px 12px; border-bottom: 1px solid #1f2333;">
                    <span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Nom complet</span>
                    <div style="font-size: 16px; font-weight: 700; color: #ffffff; margin-top: 4px;">${displayName}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 12px; border-bottom: 1px solid #1f2333;">
                    <span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Adresse Email</span>
                    <div style="font-size: 15px; font-weight: 600; color: #5b4bff; margin-top: 4px;">
                      <a href="mailto:${email}" style="color: #7b6dff; text-decoration: none;">${email}</a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 12px; border-bottom: 1px solid #1f2333;">
                    <span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Méthode de connexion</span>
                    <div style="font-size: 14px; font-weight: 600; color: #e2e8f0; margin-top: 4px;">${providerLabel}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 12px; border-bottom: 1px solid #1f2333;">
                    <span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Statut abonnement</span>
                    <div style="font-size: 14px; font-weight: 600; color: #34d399; margin-top: 4px;">
                      ✅ Essai gratuit 7 jours activé
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 12px;">
                    <span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Date d'inscription</span>
                    <div style="font-size: 13px; color: #94a3b8; margin-top: 4px;">${formattedDate}</div>
                  </td>
                </tr>
                ${
                  userId
                    ? `<tr>
                        <td style="padding: 8px 12px; border-top: 1px solid #1f2333;">
                          <span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">User ID</span>
                          <div style="font-size: 11px; color: #64748b; font-family: monospace; margin-top: 2px;">${userId}</div>
                        </td>
                      </tr>`
                    : ""
                }
              </table>

              <!-- Bouton d'action -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 24px;">
                <tr>
                  <td align="center">
                    <a href="https://supabase.com/dashboard/project/jgvddxtpeqapipglxauj/editor" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #5b4bff 0%, #4333ea 100%); color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; padding: 13px 28px; border-radius: 12px; box-shadow: 0 4px 14px rgba(91,75,255,0.4);">
                      Voir dans Supabase &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; background-color: #0f1017; border-top: 1px solid #1f2333; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #64748b;">
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
<head><meta charset="utf-8"></head>
<body style="background-color: #0b0c10; font-family: -apple-system, BlinkMacSystemFont, sans-serif; color: #ffffff; padding: 40px 16px;">
  <table role="presentation" width="100%" style="max-width: 520px; margin: 0 auto; background-color: #14161f; border: 1px solid #232738; border-radius: 20px; overflow: hidden;">
    <tr>
      <td style="padding: 32px; text-align: center; background: linear-gradient(180deg, rgba(52,211,153,0.15) 0%, rgba(20,22,31,0) 100%);">
        <div style="font-size: 40px; margin-bottom: 8px;">💰</div>
        <h1 style="font-size: 22px; font-weight: 800; color: #ffffff; margin: 0;">Nouveau paiement Stripe reçu !</h1>
        <p style="font-size: 14px; color: #34d399; font-weight: 700; margin-top: 8px;">${amountFormatted} — ${planName}</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px 32px; color: #cbd5e1; font-size: 14px;">
        <p><strong>Client :</strong> ${customerEmail}</p>
        <p><strong>Date :</strong> ${new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" })}</p>
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
 * Note : nécessite un domaine vérifié sur Resend pour envoyer vers un email externe.
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
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vybe-saas.vercel.app"

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"></head>
<body style="background-color: #0b0c10; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff; margin: 0; padding: 40px 16px;">
  <table role="presentation" width="100%" style="max-width: 560px; margin: 0 auto; background-color: #14161f; border: 1px solid #232738; border-radius: 20px; overflow: hidden;">
    <tr>
      <td style="padding: 32px; background: linear-gradient(180deg, rgba(91,75,255,0.2) 0%, rgba(20,22,31,0) 100%);">
        <h1 style="font-size: 24px; font-weight: 800; color: #ffffff; margin: 0 0 10px;">
          Bienvenue sur Vybe, ${firstName} ! 🚀
        </h1>
        <p style="font-size: 15px; color: #cbd5e1; line-height: 1.6; margin: 0;">
          Ton essai gratuit de 7 jours est officiellement actif. Voici comment signer ton premier client commerçant dès aujourd'hui :
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px 32px;">
        <ol style="font-size: 14px; color: #cbd5e1; line-height: 1.8; padding-left: 20px; margin: 0 0 24px;">
          <li><strong style="color: #ffffff;">Cherche un commerce :</strong> Tape un restaurant, barbier ou institut sur ta ville.</li>
          <li><strong style="color: #ffffff;">Génère sa démo en 60s :</strong> Vybe importe ses infos Google, son logo et adapte les couleurs.</li>
          <li><strong style="color: #ffffff;">Envoie son lien :</strong> Le commerçant découvre son site interactif, et tu reçois une alerte dès qu'il clique.</li>
        </ol>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center">
              <a href="${appUrl}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #5b4bff 0%, #4333ea 100%); color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 700; padding: 14px 32px; border-radius: 12px; box-shadow: 0 4px 14px rgba(91,75,255,0.4);">
                Créer ma première démo &rarr;
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px 32px; background-color: #0f1017; border-top: 1px solid #1f2333; text-align: center;">
        <p style="margin: 0; font-size: 12px; color: #64748b;">
          Une question ? Réponds simplement à cet email, nous sommes là pour t'aider.
        </p>
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
    // Dans le sandbox gratuit sans domaine propre, Resend bloque les envois vers d'autres emails.
    // On capture sans faire crasher l'app.
    console.warn("[Email] Bienvenue utilisateur non délivrée (domaine personnalisé requis sur Resend) :", err?.message)
    return { success: false, error: err?.message }
  }
}
