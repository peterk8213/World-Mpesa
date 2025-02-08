import NextAuth, {
  NextAuthOptions,
  Profile as NextAuthProfile,
} from "next-auth";

import { User } from "@/models/User";
import dbConnect from "@/lib/mongodb";
import getRedisClient from "@/lib/redis";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

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
        const redisKey = `user:${id}`;

        const redis = await getRedisClient();
        const cachedData = await redis.hGet(redisKey, "userInfo");
        if (!cachedData) {
          await dbConnect();
          const existingUser = await User.findOne({ worldId: id });

          if (existingUser) {
            // Store data in cache with a TTL (e.g., 3600 seconds)
            await redis
              .multi()
              .hSet(redisKey, "userInfo", JSON.stringify(existingUser))
              // Set TTL for the entire key (in seconds)
              // Expires after 10 hours
              .expire(redisKey, 36000)
              .exec();

            console.log("existing User signed in redis set", existingUser);
          }

          if (!existingUser) {
            const newuser = await User.addNewUser({
              worldId: id,
              name,
              email,
              verificationLevel,
            });

            // Store data in cache with a TTL (e.g., 3600 seconds)

            if (newuser) {
              await redis
                .multi()
                .hSet(redisKey, "userInfo", JSON.stringify(newuser))
                // Set TTL for the entire key (in seconds)
                // Expires after 10 hours
                .expire(redisKey, 36000)
                .exec();

              console.log("new User signed in  ", newuser);
            }
          }
        }
      } catch (error) {
        console.log("error", error);
      }
      return true;
    },
    async jwt({ token, account, profile }) {
      try {
        if (account && profile) {
          const redis = await getRedisClient();
          const redisKey = `user:${profile?.sub}`;
          const cachedData = await redis.hGet(redisKey, "userInfo");

          if (!cachedData) {
            await dbConnect();
            const existingUser = await User.findOne({
              worldId: profile?.sub,
            });
            if (existingUser) {
              token.isnewUser = false;
              token.userId = existingUser._id;
            }
          } else if (cachedData) {
            token.userId = JSON.parse(cachedData)._id;
            token.isnewUser = false;
          } else {
            token.isnewUser = true;
          }
        }
      } catch (error) {
        console.log("error", error);
      }

      return token;
    },
    async session({ session, token }) {
      Object.assign(
        session,
        { isnewUser: token.isnewUser },
        { worldId: token.sub },
        { userId: token.userId }
      );
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
