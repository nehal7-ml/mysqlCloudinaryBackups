import { v2 as cloudinary } from "cloudinary";
import env from "./config";
import yn from "yn";

cloudinary.config({
    cloud_name: env.CLOUDINARY.CLOUD_NAME,
    api_key: env.CLOUDINARY.API_KEY,
    api_secret: env.CLOUDINARY.API_SECRET,
  });
  
const uploadToCloudinary = async ({ name, path, tag }: { name: string, path: string, tag:string }) => {
    console.log("Uploading backup to Cloudinary...");
   try {
     const date = new Date();
   
     await cloudinary.uploader.upload(path, {
       public_id: name,
       type: tag,       
       resource_type: 'auto',
       folder:`databaseBackups/${date.getFullYear()}-Month-${date.getMonth() + 1 }` ,
     });
   } catch (error) {
      console.log("error uploading backup to Cloudinary...", error);
   }
  
    console.log("Backup uploaded to Cloudinary...");
  };


  // Function to list assets
async function listAssets(tag:string) {
  try {
    // List the latest 100 assets for simplicity; adjust as needed
    // You can also use options like prefix to filter specific files
    const result = await cloudinary.api.resources({
      type: tag,
      max_results: 100,
    });

    return result.resources;
  } catch (error) {
    console.error('Error listing assets:', error);
    return [];
  }
}
  // Function to delete assets
async function deleteAssets(publicIds: string[]) {
  try {
    const result = await cloudinary.api.delete_resources(publicIds);
    console.log('Deleted assets:', result);
  } catch (error) {
    console.error('Error deleting assets:', error);
  }
}
  const deleteFromCloudinary = async ({ name }: { name: string}) => {
    console.log("deleting old backup to Cloudinary...");
    try {
     await cloudinary.uploader.destroy(name, {
       resource_type: 'auto'
     });
   } catch (error) {
        console.log("error deleting old backup from Cloudinary...", error);
   }
  
    console.log("deleted old backup from Cloudinary...");
  };
  

export  async function cleanupOldAssets(tag:string) {
    const assets = await listAssets('backup');

    if(assets.length === 0) return 
    // Sort assets by created_at date (ascending order)
    const sortedAssets = assets.sort((a: { created_at: string | number | Date; }, b: { created_at: string | number | Date; }) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  
    // Identify assets to delete, e.g., all but the most recent two
    const assetsToDelete = sortedAssets.slice(0, -2); // Adjust as needed
  
    // Extract public IDs of assets to delete
    const publicIdsToDelete = assetsToDelete.map((asset: { public_id: string; }) => asset.public_id);
  
    // Delete the identified assets
    if (publicIdsToDelete.length > 0) {
      await deleteAssets(publicIdsToDelete);
    } else {
      console.log('No assets to delete.');
    }
  }
  

  export { uploadToCloudinary, deleteFromCloudinary }