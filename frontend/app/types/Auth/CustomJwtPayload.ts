export interface CustomJwtPayload {
  sub: string;
  email: string;
  FirstName: string;
  LastName: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string[];
}
