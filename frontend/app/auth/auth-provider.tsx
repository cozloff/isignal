import {
  type AuthenticationResult,
  EventType,
  PublicClientApplication,
  type Configuration,
} from "@azure/msal-browser";
import { type ReactNode, useMemo } from "react";
import { MsalProvider } from "@azure/msal-react";

interface AuthProviderProps {
  children: ReactNode;
  clientId: string;
  tenantId: string;
}

export const AuthProvider = ({
  children,
  clientId,
  tenantId,
}: AuthProviderProps) => {
  const msalConfig: Configuration = useMemo(
    () => ({
      auth: {
        clientId,
        authority: `https://login.microsoftonline.com/${tenantId}/`,
        redirectUri: "/",
        postLogoutRedirectUri: "/",
        navigateToLoginRequestUrl: false,
      },
      cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
      },
      system: {
        loggerOptions: {
          loggerCallback: (level, message, containsPii) => {
            if (containsPii) return;
            switch (level) {
              case 0:
                console.error(message);
                break;
              case 1:
                console.warn(message);
                break;
              case 2:
                console.info(message);
                break;
              case 3:
                console.debug(message);
                break;
            }
          },
        },
      },
    }),
    [clientId, tenantId],
  );

  const msalInstance = useMemo(
    () => new PublicClientApplication(msalConfig),
    [msalConfig],
  );

  if (
    !msalInstance.getActiveAccount() &&
    msalInstance.getAllAccounts().length > 0
  ) {
    msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
  }

  msalInstance.addEventCallback((event) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
      const authResult = event.payload as AuthenticationResult;
      msalInstance.setActiveAccount(authResult.account);
    }
  });

  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
};

export function useAuthProvider() {
  return { AuthProvider };
}
