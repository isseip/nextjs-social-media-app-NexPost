import { generateState, generateCodeVerifier } from "arctic";
import { google } from "@/auth";
import { cookies } from "next/headers";

export async function GET() {
	const state = generateState();
	const codeVerifier = generateCodeVerifier();
	const url = google.createAuthorizationURL(state, codeVerifier, ["profile", "email"]);

	const cookieStore = await cookies();
	cookieStore.set("state", state, {
		path: "/",
		secure: process.env.NODE_ENV === "production",
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: "lax",
	  });
	
	  cookieStore.set("code_verifier", codeVerifier, {
		path: "/",
		secure: process.env.NODE_ENV === "production",
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: "lax",
	  });
	
	  return Response.redirect(url);
	}