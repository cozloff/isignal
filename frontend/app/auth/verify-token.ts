import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

const client = jwksClient({
  jwksUri: `https://login.microsoftonline.com/af296343-dd0e-48e2-84a5-b4f2cb9196a7/discovery/v2.0/keys`,
});

function getKey(header: any, callback: any) {
  client.getSigningKey(header.kid, function (err, key) {
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
}

export async function verifyIdToken(idToken: string): Promise<any> {
  return new Promise((resolve, reject) => {
    jwt.verify(
      idToken,
      getKey,
      {
        audience: "0900a8d1-0753-47d1-b4a8-4fe847b5552f",
        issuer:
          "https://login.microsoftonline.com/af296343-dd0e-48e2-84a5-b4f2cb9196a7/v2.0",
        algorithms: ["RS256"],
      },
      (err: any, decoded: any) => {
        if (err) reject(err);
        else resolve(decoded);
      },
    );
  });
}
