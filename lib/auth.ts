import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
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

        try {
          // Rechercher l'utilisateur dans la base de données
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
            include: {
              organizations: {
                include: {
                  organization: true,
                },
              },
            },
          });

          if (!user) {
            return null;
          }

          // Pour l'instant, on accepte n'importe quel mot de passe
          // TODO: Implémenter le hachage des mots de passe
          // const isValidPassword = await bcrypt.compare(credentials.password, user.password);
          // if (!isValidPassword) {
          //   return null;
          // }

          // Si l'utilisateur n'a pas d'organisation, en créer une par défaut
          if (!user.organizations || user.organizations.length === 0) {
            const defaultOrg = await prisma.organization.create({
              data: {
                name: `${user.name || user.email}'s Organization`,
                email: user.email,
                description: "Organisation par défaut",
              },
            });

            await prisma.organizationUser.create({
              data: {
                organizationId: defaultOrg.id,
                userId: user.id,
                role: UserRole.OWNER,
              },
            });

            // Recharger l'utilisateur avec la nouvelle organisation
            const updatedUser = await prisma.user.findUnique({
              where: { id: user.id },
              include: {
                organizations: {
                  include: {
                    organization: true,
                  },
                },
              },
            });

            return {
              id: updatedUser!.id,
              email: updatedUser!.email,
              name: updatedUser!.name,
              organizations: updatedUser!.organizations.map(org => ({
                id: org.id,
                organizationId: org.organizationId,
                role: org.role,
                organization: org.organization,
              })),
            };
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            organizations: user.organizations.map(org => ({
              id: org.id,
              organizationId: org.organizationId,
              role: org.role,
              organization: org.organization,
            })),
          };
        } catch (error) {
          console.error("Erreur d'authentification:", error);
          return null;
        }
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
