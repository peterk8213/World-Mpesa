import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    userId: string;
    worldId: string;
    isAdmin: boolean;

    isnewUser: boolean;
  }
}
