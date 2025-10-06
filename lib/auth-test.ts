import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || 'test-secret-key-for-development',
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Utilisateur de test avec tous les accès
        if (credentials?.email === "admin@test.com" && credentials?.password === "admin123") {
          return {
            id: "1",
            email: "admin@test.com",
            name: "Administrateur Test",
            organizations: [
              {
                id: "1",
                organizationId: "1",
                role: "OWNER",
                organization: {
                  id: "1",
                  name: "Organisation Test",
                  legalName: "Organisation Test SARL",
                  description: "Organisation de test",
                  address: "123 Rue de Test",
                  city: "Paris",
                  postalCode: "75001",
                  country: "France",
                  phone: "+33123456789",
                  email: "contact@test.com",
                  website: "https://test.com",
                  logo: null,
                  siret: "12345678901234",
                  apeCode: "9001Z",
                  vatNumber: "FR12345678901",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              },
            ],
          };
        }
        
        // Acceptons aussi n'importe quel autre email/mot de passe pour les tests
        if (credentials?.email && credentials?.password) {
          return {
            id: "2",
            email: credentials.email,
            name: "Utilisateur Test",
            organizations: [
              {
                id: "2",
                organizationId: "1",
                role: "ADMIN",
                organization: {
                  id: "1",
                  name: "Organisation Test",
                  legalName: "Organisation Test SARL",
                  description: "Organisation de test",
                  address: "123 Rue de Test",
                  city: "Paris",
                  postalCode: "75001",
                  country: "France",
                  phone: "+33123456789",
                  email: "contact@test.com",
                  website: "https://test.com",
                  logo: null,
                  siret: "12345678901234",
                  apeCode: "9001Z",
                  vatNumber: "FR12345678901",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              },
            ],
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
        token.id = user.id;
        token.organizations = (user as any).organizations || [];
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.organizations = token.organizations as any[];
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
