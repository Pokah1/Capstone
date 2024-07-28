import React from "react";
import Image from "next/image";
import { UploadButton } from "@/utils/uploadthing";

interface CoverProps {
    url?: string;
    setUrl: (_: string) => void;
}

const Cover: React.FC<CoverProps> = ({ url, setUrl }) => {
    return (
        <div className={`relative w-full h-[60svh] bg-neutral-300 ${!url ? 'hidden' : ''}`}>
            {!!url && (
                <>
                    <Image 
                        src={url} 
                        alt="Image Cover" 
                        fill 
                        className="w-[10%] object-cover bg-cover bg-center bg-no-repeat mb-1"
                        sizes="100vw" 
                  
                    />

                    <div className="absolute w-[20%] h-[20%] right-0 bottom-0 flex justify-center items-center">
                        <UploadButton 
                            className="your-custom-upload-button-class"  
                            endpoint="imageUploader"
                            onClientUploadComplete={(res) =>{
                                setUrl(res[0].url);
                            }}
                        />
                    </div>
                </>
            )}
        </div>
    );
}

export default Cover;
