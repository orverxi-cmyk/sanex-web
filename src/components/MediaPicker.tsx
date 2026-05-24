"use client";

import React from "react";
import { useStorage } from "@/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, Upload, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface MediaPickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: string;
  accept?: string;
}

export function MediaPicker({ value, onChange, label, folder = "uploads", accept = "image/*,video/*" }: MediaPickerProps) {
  const storage = useStorage();
  const [uploadProgress, setUploadProgress] = React.useState<number | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !storage) return;

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (err) => {
        setError(err.message);
        setIsUploading(false);
        setUploadProgress(null);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        onChange(downloadURL);
        setIsUploading(false);
        setUploadProgress(null);
      }
    );
  };

  return (
    <div className="space-y-2">
      {label && <Label className="text-xs font-bold uppercase text-muted-foreground">{label}</Label>}
      <Tabs defaultValue={value?.includes("firebasestorage") ? "upload" : "url"} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-2">
          <TabsTrigger value="url" className="gap-2 text-xs"><Link className="h-3 w-3" /> Online URL</TabsTrigger>
          <TabsTrigger value="upload" className="gap-2 text-xs"><Upload className="h-3 w-3" /> Upload File</TabsTrigger>
        </TabsList>

        <TabsContent value="url" className="mt-0">
          <Input 
            placeholder="https://..." 
            value={value} 
            onChange={(e) => onChange(e.target.value)} 
          />
        </TabsContent>

        <TabsContent value="upload" className="mt-0 space-y-4">
          <div className="relative group cursor-pointer border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors">
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              onChange={handleUpload}
              disabled={isUploading}
              accept={accept}
            />
            <div className="flex flex-col items-center justify-center gap-2">
              {isUploading ? (
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              ) : value?.includes("firebasestorage") ? (
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              ) : (
                <Upload className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
              )}
              <div className="text-sm font-medium">
                {isUploading ? "Uploading..." : value?.includes("firebasestorage") ? "File Uploaded" : "Click to select or drag & drop"}
              </div>
              {value && value.includes("firebasestorage") && !isUploading && (
                <div className="text-[10px] text-muted-foreground truncate max-w-[200px]">{value}</div>
              )}
            </div>
          </div>

          {uploadProgress !== null && (
            <div className="space-y-1">
              <Progress value={uploadProgress} className="h-1" />
              <div className="text-[10px] text-right text-muted-foreground">{Math.round(uploadProgress)}% complete</div>
            </div>
          )}

          {error && (
            <div className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> {error}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
