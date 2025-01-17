import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: true,
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) { // User is available during sign-in
        token.username = user.username;
        token.token = user.token;
      }
      console.log("fuck1:" + token);
      return token
    },
    session({ session, token }) {
      console.log("fuck2:" + token);
      session.user.username = token.username;
      session.user.token = token.token;
      console.log("fuck3:" + session);
      return session
    },
  },
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        username: {},
        password: {}
      },
      authorize: async (credentials) => {
        let user = null;

        // logic to salt and hash password
        // const pwHash = saltAndHashPassword(credentials.password)

        // logic to verify if the user exists
        user = await fetch('http://106.75.218.120:25565/login', {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: {
            'Content-Type': 'application/json; charset=UTF-8'
          }
        }).then((data) => data.json());

        if (user.code === -1) {
          // No user found, so this is their first attempt to login
          // Optionally, this is also the place you could do a user registration
          return null;
        }

        // return user object with their profile data
        const result : any = {
          "username": credentials.username,
          "token": user.data
        }
        return result;
      }
    })
  ]
});
