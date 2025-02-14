export interface AuthProvider{
    authenticate(userLogin: string, password: string): Promise<any>;
}
  