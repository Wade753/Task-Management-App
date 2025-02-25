import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { encode as defaultEncode } from "next-auth/jwt";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/server/db";
import { sanitizeEmail, verifyPassword } from "./utils";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string;
      email: string;
      password: string;
      image: string | null;
      role: "WRITER" | "EDITOR" | "ADMIN";
    } & DefaultSession["user"];
  }
}
type Role = "WRITER" | "EDITOR" | "ADMIN";

const useSecureCookies =
  process.env.NEXTAUTH_URL?.startsWith("https://") ?? false;

const adapter = PrismaAdapter(db);

interface SessionWithRole {
  sessionToken: string;
  userId: string;
  expires: Date;
  role?: Role;
}

adapter.createSession = async function (session: SessionWithRole) {
  return db.session.create({
    data: {
      sessionToken: session.sessionToken,
      userId: session.userId,
      expires: session.expires,
      role: session.role ?? "WRITER",
    },
  });
};

export const authConfig = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { lable: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("🚀 ~ authorize ~ credentials:", credentials);

        if (!credentials) {
          throw new Error("No credentials provider");
        }
        const { email, password } = credentials;
        const existingUser = await db.user.findFirst({
          where: {
            email: sanitizeEmail(email as string),
          },
        });
        if (existingUser && password) {
          const isAnValidPassword: boolean = await verifyPassword(
            existingUser?.password,
            password as string,
          );

          if (isAnValidPassword) {
            return existingUser;
          } else {
            throw new Error("Invalid User");
          }
        }
        return existingUser;
      },
    }),
  ],
  adapter,
  secret: process.env.AUTH_SECRET ?? uuidv4(),
  cookies: {
    sessionToken: {
      name: `${useSecureCookies ? "__Secure-" : ""}authjs.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
      },
    },
    csrfToken: {
      name: `${useSecureCookies ? "__Host-" : ""}authjs.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
      },
    },
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider === "credentials") {
        token.credentials = true;
      }
      return token;
    },
    async session({ session }) {
      return session;
    },
  },
  jwt: {
    encode: async function (params) {
      if (params.token?.credentials) {
        const sessionToken = uuidv4();
        if (!params.token.sub) {
          throw new Error("No user ID found in token");
        }
        const user = await db.user.findUnique({
          where: { id: params.token.sub },
        });
        if (!user) {
          throw new Error("User not found");
        }
        if (!adapter?.createSession) {
          throw new Error("createSession method is not defined on adapter");
        }
        const createdSession = await adapter.createSession({
          sessionToken: sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          role: user.role as Role,
        } as SessionWithRole);

        if (!createdSession) {
          throw new Error("Failed to create session");
        }

        return sessionToken;
      }
      return defaultEncode(params);
    },
  },
} satisfies NextAuthConfig;
