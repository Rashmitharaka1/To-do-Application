import { betterAuth } from "better-auth"
import { admin } from "better-auth/plugins"
import { Pool } from "@neondatabase/serverless"

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        input: false,
      },
    },
  },
  plugins: [
    admin({
      defaultRole: "user",
    }),
  ],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
})

export type Session = typeof auth.$Infer.Session
