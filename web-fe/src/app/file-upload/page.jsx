"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

export default function Page() {
  const [file, setFile] = useState("");
  const { handleSubmit, register, watch } = useForm();
  const onSubmit = async (data) => {
    const file = data.file?.[0];
    console.log({ file });
    const fileMetaData = {
      file: {
        type: file.type,
        size: file.size,
        name: file.name,
      },
    };

    const { url } = await http().post(
      endpoints.files.preSignedUrl,
      fileMetaData,
    );
    const resp = await axios.put(url, file, {
      onUploadProgress: (progress) => {
        console.log({ progress });
      },
    });
    if (resp.statusText === "OK") {
      const filePath = url.split("?")[0];
      setFile(filePath);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-lg">
        <div>
          <Label>Select file</Label>
          <Input
            type="file"
            {...register("file", { required: "required*" })}
            multiple
          />
        </div>

        {file && <video src={file} autoPlay controls></video>}

        <Button>Submit</Button>
      </form>
    </div>
  );
}
