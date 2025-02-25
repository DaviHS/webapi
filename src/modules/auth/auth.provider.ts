export interface AuthProvider {
    authenticate(data: any): Promise<any>;
}