import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/server/db";
import { v4 as uuidv4 } from "uuid";
import { verifyPassword, sanitizeEmail } from "./utils";
import NextAuth from "next-auth";
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
const useSecureCookies =
  process.env.NEXTAUTH_URL?.startsWith("https://") ?? false;

export const { handlers, signIn, signOut, auth } = NextAuth({
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
        console.log("🚀 ~ authorize ~ existingUser:", existingUser);

        if (existingUser && password) {
          // daca emailul si parola sunt corect introduse se returneaza userul
          const isAnValidPassword: boolean = await verifyPassword(
            // se verifica parola cu parola criptata
            existingUser.password,
            password as string,
          );
          console.log("🚀 ~ authorize ~ isAnValidPassword:", isAnValidPassword);
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
  secret: process.env.AUTH_SECRET ?? uuidv4(), // AUTH_SECRET > o gasesti in env. acolo ai cheia
  pages: {
    signIn: "/login",
    newUser: "/register",
  },
  cookies: {
    sessionToken: {
      name: `${useSecureCookies ? "__Secure-" : ""}authjs.session-token`,
      options: {
        httpOnly: false,
        sameSite: "lax",
        path: "/",
        secure: true,
      },
    },
    csrfToken: {
      name: `${useSecureCookies ? "__Host-" : ""}authjs.csrf-token`,
      options: {
        httpOnly: false,
        sameSite: "lax",
        path: "/",
        secure: true,
      },
    },
  },

  callbacks: {
    session: async ({ session, token }) => {
      console.log("🚀 ~ session: ~ token:", token);
      console.log("🚀 ~ session: ~ session:", session);
      // aici sesiunea primeste tokenul dupa ce l-ai implementat
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name!;
        session.user.email = token.email!;
        session.user.image = (token.image as string) ?? null;
        session.user.role = token.role as "WRITER" | "EDITOR" | "ADMIN";
      }

      console.log(
        "🚀 ~ session: ~ session: =>>>>>>>>>>>>>>>>>>>>>>>>>>> final",
        session,
      );

      return session;
    },
    jwt: async ({ token, user }) => {
      console.log("🚀 ~ jwt: ~ token:", token);
      console.log("🚀 ~ jwt: ~ user:", user);
      const userFromDB = await db.user.findFirst({
        // functie care cauta in baza de date userul cu emailul introdus
        where: {
          email: token.email!,
        },
      });
      console.log("🚀 ~ jwt: ~ userFromDB:", userFromDB);
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
      console.log("🚀 ~ jwt: ~ token: =>>>>>>>>>>>>>>> final", token);
      return token; // intotdeauna returnam tokenu
    },
  },
});
