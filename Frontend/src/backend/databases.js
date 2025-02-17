import { Client, Databases, Storage, ID } from "appwrite";
import conf from "../conf/conf";
import axios from "axios"
const API_URL = import.meta.env.VITE_BACKEND_URL

export class DatabaseService{
    client = new Client();
    databases;
    storage;

    async newPost (formData){ //to create a new post
        
        try {
            const response = await axios.post(`${API_URL}/posts/upload-post`,
                formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true 
                }
            )
            console.log("new post", response);
            return response.data;
        } catch (error) {
            throw error.response?.data || "Post could not be uploaded";
        }
    }

    async getPost (id){ //to get a post based upon id
        try {
            const response = await axios.get(`${API_URL}/posts/${id}`, {withCredentials:true})
            return response.data.data
        } catch (error) {
            throw error.response?.data || "Could not get the post";
        }
    }

    async deletePost(id){ //to delete a post
        try {
            const response = await axios.delete(`${API_URL}/posts/${id}/delete-post`, {withCredentials:true})
            console.log("delete post    ", response);
            return response.data.data
        } catch (error) {
            throw error.response?.data || "Could not delete the post";
        }
    }

    async editPost (id, {title, content, purchaseLink}){ //to edit a post
        try {
            const response = await axios.patch(`${API_URL}/posts/${id}/edit-post`, {title, content, purchaseLink}, {withCredentials: true })
            return response.data
        } catch (error) {
            throw error.response?.data || "Could not edit the post";
        }
    }
    
    async getAllPost (owner){ //send the owner id as getAllPost(here)
        try {
            const response = await axios.get(`${API_URL}/posts/view-posts`, {
                params: owner ? {owner} : {},
                withCredentials: true
            })
            
            return response.data.data
        } catch (error) {
           throw error.response?.data || "Could not get posts";
        }
    }

    //--------
    
    constructor()
    {
        this.client.setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId);

        this.databases = new Databases(this.client);
        this.storage = new Storage(this.client);
    }

    
    /*async editPost (slug, {title, content, image}){ //to edit a post
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,// databaseId
                conf.appwriteCollectionId, // collectionId
                slug, // documentId
                {
                    title,
                    content,
                    image,
                }, // data (optional)
                
            );
        } catch (error) {
            throw(error);
        }
    }

    async deletePost(slug){ //to delete a post
        try {
            return await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            );
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async getPost (slug){ //to get a post based upon a slug value
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId, // databaseId
                conf.appwriteCollectionId, // collectionId
                slug, // documentId
                
            );
        } catch (error) {
            console.log("The post cannot get");
            return false;
        }
    }

    async getAllPost (){ //we may use query to filter out which posts we may want
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId, // databaseId
                conf.appwriteCollectionId,// collectionId
                
            );
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async uploadFile(file){
        try {
            return await this.storage.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            );
        } catch (error) {
            console.log("error in file upload");
            return false;
        }
    }

    async deleteFile(fileId){
        try {
            return await this.storage.deleteFile(
                conf.appwriteBucketId, // bucketId
                fileId
            );
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    filePreview(fileId){
        // we do not need this as a promise since we are not passing or retrieving a big file or something, its just the url or say preview of the file
        
            return this.storage.getFilePreview(conf.appwriteBucketId, fileId);
         
    }*/

}

const dbService = new DatabaseService()
export default dbService;