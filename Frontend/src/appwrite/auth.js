import { Client, Account, ID } from "appwrite";
import conf from "../conf/conf";

import axios from "axios"
const API_URL = "http://localhost:8000/api/v1/users"

export class AuthService {

    async createAccount(formData){
        try {
            const response = await axios.post(`${API_URL}/register`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || "Registration failed";
        }
    }

    async  getLoggedInUser() {
        try {
          const response = await axios.get(`${API_URL}/current-user`, { withCredentials: true });
          return response.data
        } catch (error) { 
            throw error.response?.data || "Failed to get the current user";
        }
      }

    async login ({email, username, password}){
         try {
            const response = await axios.post(`${API_URL}/login`, 
                {email, username, password},
                {withCredentials:true}
            )
            return response.data.data
         } catch (error) {
            throw error.response?.data || "Failed to login"
         }
      }
 
    async logout (){
        try {
            const token = localStorage.getItem("token");

        // Only send the Authorization header if a valid token exists
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const response = await axios.post(`${API_URL}/logout`, {}, {
            withCredentials: true,
            headers
        });
    
            localStorage.removeItem("token"); 
            localStorage.removeItem("user");
            return response.data
        } catch (error) {
            throw error.response?.data || "Failed to logout"
        }
    }

    //---------------------
     client = new Client();
     account;

     constructor(){
        this.client.setEndpoint(conf.appwriteUrl).setProject(conf.appwriteProjectId)
        this.account = new Account(this.client);
     }

     /*async createAccount ({email, password, name})  // this is the funcation that needs to be called at the time signup
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
*/
     /*async login ({email, password})
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
    */

    /*async logout (){
        try {
             await this.account.deleteSessions( );
            
        } catch (error) {
            throw(error);
        }
    }*/
}

const authService = new AuthService(); //so that we can simply use each services as authService.login(...) etc.

export default authService;