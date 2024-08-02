// // import {supabase} from

// import supabase from "@/utils/supabase/client"

// const chunkContent = (content: string, chunkSize: number) => {
//     const chunks = [];
//     for (let i = 0; i < content.length; i += chunkSize) {
//         chunks.push(content.slice(i, i + chunkSize));
//     }
//     return chunks;
// };

// export const createContent = async(title:string, 
//     content:string, coverUrl?:string) =>{

//         const chunkSize = 10000; // Adjust chunk size as needed
//         const chunks = chunkContent(content, chunkSize);

//     const {data, error} = await supabase
//     .from('posts')
//     .insert([
//         {title, content, cover_url: coverUrl}]);


//     if(error){
//         console.error('Error creating content:', error);
//         throw new Error(error.message);
//     };
//     return data;
// }
// export const getContent = async (id:string) =>{
//     const { data, error } = await supabase
//     .from('posts')
//     .select('*')
//     .eq('id',id)
//     .single();

//     if (error) {
//         console.error('Error creating content:', error);
//         throw new Error(error.message);
//     }
//     return data;

// };

// export const getAllContent = async() =>{
// const {data, error} = await supabase
// .from('posts')
// .select('*');

// if (error){
//     console.error('Error creating content:', error);
//     throw new Error(error.message);   
// }
// return data
// };