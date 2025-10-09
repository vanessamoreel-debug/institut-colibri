// /app/api/admin/settings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "../../../../lib/firebaseAdmin";

export const dynamic = "force-dynamic";

// Auth cookie
function isAuthed(req: NextRequest) {
  return req.cookies.get("colibri_admin")?.value === "1";
}

// Util: lit les settings depuis "global", sinon "general" (compat)
async function readSettings(db: FirebaseFirestore.Firestore) {
  const refGlobal = db.collection("settings").doc("global");
  const snapGlobal = await refGlobal.get();

  if (snapGlobal.exists) {
    return { ref: refGlobal, data: (snapGlobal.data() as any) ?? {} };
  }

  const refGeneral = db.collection("settings").doc("general");
  const snapGeneral = await refGeneral.get();

  if (snapGeneral.exists) {
    return { ref: refGeneral, data: (snapGeneral.data() as any) ?? {} };
  }

  // Si rien n’existe, on travaillera sur "global"
  return { ref: refGlobal, data: {} as any };
}

// Normalise pour renvoyer un format stable aux UIs
function toOutput(data: any) {
  // compat promoBanner -> promoActive/promoText
  const bannerEnabled = !!data?.promoBanner?.enabled;
  const bannerMessage = data?.promoBanner?.message ?? "";

  const promoActive =
    typeof data?.promoActive === "boolean" ? data.promoActive : bannerEnabled;

  const promoText =
    typeof data?.promoText === "string" ? data.promoText : bannerMessage;

  // fermeture (tu utilises déjà closed/message)
  const closed = !!data?.closed;
  const message = typeof data?.message === "string" ? data.message : "";

  return {
    closed,
    message,
    promoActive,
    promoText,
    // On renvoie aussi les objets complets pour compat/évolution
    promoBanner: {
      enabled: promoActive,
      message: promoText
    },
    closedBanner: {
      enabled: closed,
      message
    }
  };
}

// GET — lire réglages
export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const db = getAdminDb();
    const { data } = await readSettings(db);
    return NextResponse.json(toOutput(data));
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}

// PUT — enregistrer réglages
// Accepte: closed, message, promoActive, promoText
// (facultatif) promoBanner: { enabled, message }
// (facultatif) closedBanner: { enabled, message }
export async function PUT(req: NextRequest) {
  if (!isAuthed(req)) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const body = await req.json().catch(() => ({}));
    const db = getAdminDb();

    // On lit l’existant sur global/general
    const { ref, data: current } = await readSettings(db);

    // Construire un patch minimal pour merge
    const patch: Record<string, any> = {};

    // --- Bannière fermeture (schéma simple) ---
    if (typeof body.closed === "boolean") patch.closed = body.closed;
    if (typeof body.message === "string") patch.message = body.message;

    // --- Bannière promo (schéma simple) ---
    if (typeof body.promoActive === "boolean") patch.promoActive = body.promoActive;
    if (typeof body.promoText === "string") patch.promoText = body.promoText;

    // --- Compat: closedBanner / promoBanner (si fournis) ---
    if (body.closedBanner && typeof body.closedBanner === "object") {
      patch.closedBanner = {
        enabled: !!body.closedBanner.enabled,
        message: String(body.closedBanner.message ?? "")
      };
      // synchroniser aussi le schéma simple
      patch.closed = patch.closedBanner.enabled;
      patch.message = patch.closedBanner.message;
    }

    if (body.promoBanner && typeof body.promoBanner === "object") {
      patch.promoBanner = {
        enabled: !!body.promoBanner.enabled,
        message: String(body.promoBanner.message ?? "")
      };
      // synchroniser aussi le schéma simple
      patch.promoActive = patch.promoBanner.enabled;
      patch.promoText = patch.promoBanner.message;
    }

    // Si l’appelant n’envoie que le schéma simple, on garde les objets compat en phase
    // (sans écraser si non concernés)
    const willSyncClosed =
      "closed" in patch || "message" in patch || "closedBanner" in patch;
    const willSyncPromo =
      "promoActive" in patch || "promoText" in patch || "promoBanner" in patch;

    if (willSyncClosed && !("closedBanner" in patch)) {
      const currentClosedBanner = current.closedBanner || {};
      patch.closedBanner = {
        enabled: "closed" in patch ? !!patch.closed : !!currentClosedBanner.enabled,
        message:
          "message" in patch ? String(patch.message ?? "") : String(currentClosedBanner.message ?? "")
      };
    }

    if (willSyncPromo && !("promoBanner" in patch)) {
      const currentPromoBanner = current.promoBanner || {};
      patch.promoBanner = {
        enabled:
          "promoActive" in patch ? !!patch.promoActive : !!currentPromoBanner.enabled,
        message:
          "promoText" in patch ? String(patch.promoText ?? "") : String(currentPromoBanner.message ?? "")
      };
    }

    await ref.set(patch, { merge: true });

    // Retourne la version normalisée
    const updated = (await ref.get()).data() || {};
    return NextResponse.json(toOutput(updated));
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}
