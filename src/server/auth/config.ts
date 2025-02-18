import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/server/db";
import { randomUUID } from "crypto";
import { verifyPassword, sanitizeEmail } from "./utils";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string; //Aici definesti user-ul. Adica cel pe care il ai in schmea din Prisma
      email: string;
      password: string;
      image: string | null;
      role: "WRITER" | "EDITOR" | "ADMIN";
    } & DefaultSession["user"];
  }
}
export const useSecureCookies =
  process.env.NEXTAUTH_URL?.startsWith("https://") ?? false;

export const authConfig = {
  // Definesti credentialele pentru log in, aici cu email si password, insa le poti folosi pentru orice autentificare ai nevoie
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { lable: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("No credentials provider");
        }
        const { email, password } = credentials;
        const existingUser = await db.user.findFirst({
          // se cauta in baza de date userul cu emailul introdus in Ui login
          where: {
            email: sanitizeEmail(email as string),
          },
        });

        if (existingUser && password) {
          // daca emailul si parola sunt corect introduse se returneaza userul
          const isAnValidPassword: boolean = await verifyPassword(
            // se verifica parola cu parola criptata
            existingUser.password,
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
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" }, // JWT > json web tooken > ce face? > codifica toate datele introduse in Dumnezeu stie ce..
  secret: process.env.AUTH_SECRET ?? randomUUID(), // AUTH_SECRET > o gasesti in env. acolo ai cheia
  pages: {
    signIn: "/login",
    newUser: "/register",
  },
  cookies: {
    sessionToken: {
      name: `${useSecureCookies ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
    csrfToken: {
      name: `${useSecureCookies ? "__Host-" : ""}next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
  },
  callbacks: {
    session: async ({ session, token }) => {
      // aici sesiunea primeste tokenul dupa ce l-ai implementat
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name!;
        session.user.email = token.email!;
        session.user.image = (token.image as string) ?? null;
        session.user.role = token.role as "WRITER" | "EDITOR" | "ADMIN";
      }
      return session;
    },
    jwt: async ({ token, user }) => {
      console.log("🚀 ~ jwt: ~ user:", user);
      const userFromDB = await db.user.findFirst({
        // functie care cauta in baza de date userul cu emailul introdus
        where: {
          email: token.emil!,
        },
      });
      if (!userFromDB) {
        throw new Error("User not found");
      }
      if (user) {
        // daca este gasit adaugam in tooken toate infomatiile despre user cum a fost definit in schema
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
        token.role = userFromDB.role;
      } else {
        token.id = userFromDB.id;
        token.name = userFromDB.name;
        token.email = userFromDB.email;
        token.image = userFromDB.image;
        token.role = userFromDB.role;
      }

      return token; // intotdeauna returnam tokenu
    },
  },
} satisfies NextAuthConfig;
