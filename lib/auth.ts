import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './db'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await prisma.user.findUnique({ where: { email: credentials.email } })
        if (!user) return null
        const valid = await bcrypt.compare(credentials.password, user.password)
        if (!valid) return null
        return user as any
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id
        token.username = (user as any).username
        token.displayName = (user as any).displayName
        token.avatarEmoji = (user as any).avatarEmoji
        token.favoriteTeam = (user as any).favoriteTeam
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id
        ;(session.user as any).username = token.username
        ;(session.user as any).displayName = token.displayName
        ;(session.user as any).avatarEmoji = token.avatarEmoji
        ;(session.user as any).favoriteTeam = token.favoriteTeam
        ;(session.user as any).role = token.role
      }
      return session
    },
  },
  pages: { signIn: '/login' },
}
