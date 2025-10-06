import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Authentification simple pour le développement
        // En production, vous devrez utiliser la vraie base de données
        if (credentials.email === "admin@plannitech.com" && credentials.password === "admin123") {
          return {
            id: "1",
            email: "admin@plannitech.com",
            name: "Administrateur",
            role: "ADMIN",
            organizationId: "1",
            organizationName: "Plannitech",
          };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.organizationId = user.organizationId;
        token.organizationName = user.organizationName;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.organizationId = token.organizationId as string;
        session.user.organizationName = token.organizationName as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/fr/auth/signin",
    error: "/fr/auth/error",
  },
};

// Export pour compatibilité avec les API routes
export { authOptions as auth };