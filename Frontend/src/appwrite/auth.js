import { Client, Account, ID } from "appwrite";
import conf from "../conf/conf";
export class AuthService {
     client = new Client();
     account;

     constructor(){
        this.client.setEndpoint(conf.appwriteUrl).setProject(conf.appwriteProjectId)
        this.account = new Account(this.client);
     }

     async createAccount ({email, password, name})  // this is the funcation that needs to be called at the time signup
     {
        try {
            const user = await this.account.create(
                ID.unique(), 
                email, 
                password,
                name
            );
            
            if(user) //the user might not be able to complete auth due to some reason
            {
                //if the user has signed in, we will automatically log him
                return this.login({email, password})
            }
            else
            {
               return user 
            }
            
            
        } catch (error) {
            throw(error)
        }
     }

     async login ({email, password})
     {
        try {
            const session = await this.account.createEmailPasswordSession(
                email, 
                password
            );
            return session;
            
        } catch (error) {
            throw(error)
        }
     }

     //we also need to check if the user is logged in or not for uses in various components or pages. "This function will be used in our components and routes to check if a user is logged in, and access the user's details".
    async  getLoggedInUser() {
        try {
          
          return await this.account.get();
        } catch (error) { //catch is executed if we are not able to reach out to a service
          throw(error);
        }
        return null; //if try doesnot give us anything
      }

    async logout (){
        try {
             await this.account.deleteSessions( );
            
        } catch (error) {
            throw(error);
        }
    }
}

const authService = new AuthService(); //so that we can simply use each services as authService.login(...) etc.

export default authService;