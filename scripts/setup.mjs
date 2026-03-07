const URL = process.env.AUTHENTIK_URL;
const TOKEN = process.env.AUTHENTIK_ADMIN_TOKEN;

if (!URL || !TOKEN) {
  console.error(
    "Please set AUTHENTIK_URL and AUTHENTIK_ADMIN_TOKEN environment variables.",
  );
  process.exit(1);
}
const H = {
  Authorization: `Bearer ${TOKEN}`,
  "Content-Type": "application/json",
};

const post = async (path, body) => {
  const r = await fetch(`${URL}/api/v3${path}`, {
    method: "POST",
    headers: H,
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`${path}: ${await r.text()}`);
  return r.json();
};
const get = async (path) => {
  const r = await fetch(`${URL}/api/v3${path}`, { headers: H });
  return r.json();
};

const adminGroup = await post("/core/groups/", {
  name: "admin",
  is_superuser: true,
  attributes: { role: "admin" },
});
const studentGroup = await post("/core/groups/", {
  name: "student",
  is_superuser: false,
  attributes: { role: "student" },
});
const alumniGroup = await post("/core/groups/", {
  name: "alumni",
  is_superuser: false,
  attributes: { role: "alumni" },
});
console.log("Groups:", adminGroup.pk, studentGroup.pk, alumniGroup.pk);

const cert = await post("/crypto/certificatekeypairs/generate/", {
  common_name: "nextjs-cert",
  validity_days: 3650,
});
console.log("Cert:", cert.kp_uuid);

const roleScope = await post("/propertymappings/provider/scope/", {
  name: "nextjs-role-scope",
  scope_name: "role",
  expression: `groups = [g.name for g in request.user.ak_groups.all()]
if "admin" in groups: return {"role": "admin", "groups": groups}
elif "alumni" in groups: return {"role": "alumni", "groups": groups}
elif "student" in groups: return {"role": "student", "groups": groups}
return {"role": "user", "groups": groups}`,
});

const scopes = (await get("/propertymappings/provider/scope/")).results;
const openid = scopes.find((s) => s.scope_name === "openid").pm_uuid;
const email = scopes.find((s) => s.scope_name === "email").pm_uuid;
const profile = scopes.find((s) => s.scope_name === "profile").pm_uuid;

const provider = await post("/providers/oauth2/", {
  name: "nextjs-provider",
  client_type: "confidential",
  client_id: "nextjs-client",
  client_secret: "CHANGE-THIS-SECRET",
  authorization_grant_type: "authorization-code",
  redirect_uris: "http://localhost:3000/api/auth/callback/authentik",
  sub_mode: "hashed_user_id",
  include_claims_in_id_token: true,
  signing_key: cert.kp_uuid,
  property_mappings: [openid, email, profile, roleScope.pm_uuid],
  access_token_validity: "hours=1",
  refresh_token_validity: "days=30",
});
console.log("Provider:", provider.pk);

const app = await post("/core/applications/", {
  name: "Next.js App",
  slug: "nextjs-app",
  provider: provider.pk,
  policy_engine_mode: "any",
});
console.log("App:", app.slug);
console.log("\n✅ Done! Copy these to .env.local:");
console.log(`AUTHENTIK_CLIENT_ID=nextjs-client`);
console.log(`AUTHENTIK_CLIENT_SECRET=CHANGE-THIS-SECRET`);
