"use client";

import { useState } from "react";
import { IKContext, IKUpload } from "imagekitio-react";

export default function ImageKitUpload({ onUploadSuccess }) {
  const [uploading, setUploading] = useState(false);
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

  const authenticator = async () => {
    const res = await fetch("/api/auth/imagekit");
    return res.json();
  };

  return (
    <IKContext publicKey={publicKey} urlEndpoint={urlEndpoint} authenticator={authenticator}>
      <div className="mb-2">
        <IKUpload
          fileName="product.jpg"
          useUniqueFileName={true}
          onUploadStart={() => setUploading(true)}
          onError={(err) => {
            setUploading(false);
            console.error("Upload error", err);
          }}
          onSuccess={(res) => {
            setUploading(false);
            console.log("✅ Uploaded:", res.url);
            onUploadSuccess(res.url); // Send URL to parent
          }}
        />
        {uploading && <p className="text-sm text-blue-500 mt-1">Uploading image...</p>}
      </div>
    </IKContext>
  );
}
