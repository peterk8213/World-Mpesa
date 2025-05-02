import NextAuth, {
  NextAuthOptions,
  Profile as NextAuthProfile,
} from "next-auth";

import { User } from "@/models/User";
import dbConnect from "@/lib/mongodb";
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;

export const authOptions: NextAuthOptions = {
  secret: NEXTAUTH_SECRET,

  providers: [
    {
      id: "worldcoin",
      name: "Worldcoin",
      type: "oauth",
      wellKnown: "https://id.worldcoin.org/.well-known/openid-configuration",
      authorization: { params: { scope: "openid" } },
      clientId: process.env.WLD_CLIENT_ID,
      clientSecret: process.env.WLD_CLIENT_SECRET,
      idToken: true,
      checks: ["state", "nonce", "pkce"],
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.sub,
          verificationLevel:
            profile["https://id.worldcoin.org/v1"].verification_level,
        };
      },
    },
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        const { id, name, verificationLevel, email } = user;
        await dbConnect();
        const existingUser = await User.findOne({ worldId: id });

        if (!existingUser) {
          const newUser = await User.addNewUser({
            worldId: id,
            name,
            email,
            verificationLevel,
          });

          if (newUser) {
            console.log("✅ New user signed in and created:", newUser._id);
          } else {
            console.error("❌ Failed to create new user during sign-in");
          }
        } else {
          console.log("✅ Existing user signed in:", existingUser._id);
        }
      } catch (error) {
        console.error("❌ Error during sign-in callback:", error);
      }
      return true;
    },
    async jwt({ token, account, profile }) {
      try {
        if (account && profile) {
          await dbConnect();
          const existingUser = await User.findOne({ worldId: profile.sub });

          if (existingUser) {
            token.isnewUser = false;
            token.userId = existingUser._id;
          } else {
            token.isnewUser = true;
          }
          token.isAdmin = existingUser?.isAdmin || false;
        }
      } catch (error) {
        console.error("❌ Error during JWT callback:", error);
      }
      return token;
    },
    async session({ session, token }) {
      Object.assign(
        session,
        { isnewUser: token.isnewUser },
        { worldId: token.sub },
        { userId: token.userId },
        { isAdmin: token.isAdmin }
      );

      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
