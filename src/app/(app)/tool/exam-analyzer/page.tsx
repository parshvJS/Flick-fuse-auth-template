'use client'
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

import { useSession } from 'next-auth/react';
import React, { useState, ChangeEvent } from 'react';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import examSchema from '@/schemas/examSchema';
import { z } from 'zod';

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"


import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ArchiveRestore, CloudUploadIcon, Download, FilePen, FileUp, Loader2, X, } from 'lucide-react';
import upload from '@/assets/upload.svg'
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

function formatBytes(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  if (bytes === 0) return '0 Byte';

  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}
function Page() {
  const { data: session, status } = useSession();


  // form
  const form = useForm<z.infer<typeof examSchema>>({
    resolver: zodResolver(examSchema),
  })

  // Use File[] to maintain an array of files
  const [files, setFiles] = useState<File[]>([]);
  const [examName, setExamName] = useState<string>("test");
  const [totalSize, setTotalSize] = useState(0);
  const [isFileError, setIsFileError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter()
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (files.length >= 10) {
      console.log("Maximum files reached");
      return;
    }
    let newFiles: File[] = [];
    let newSize = 0;
    acceptedFiles.forEach(file => {
      if (files.length + newFiles.length > 10) {
        console.log("Maximum files exceeded, only adding up to 10 files");
        const remainingSpace = 10 - files.length;
        newFiles.splice(remainingSpace); // Keep only the files that fit in the remaining space
      }
      if (totalSize + file.size <= 50 * 1024 * 1024) { // Convert MB to bytes
        newFiles.push(file);
        newSize += file.size;
      }
    });
    setFiles([...files, ...newFiles]);
    setTotalSize(totalSize + newSize);
  }, [files, totalSize]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const filesLeft = files.slice(0, 5);
  const filesRight = files.slice(5, 10);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (files.length >= 10) {
      console.log("Maximum files reached");
      return;
    }


    const newFiles = Array.from(e.target.files ?? []); // Convert FileList to array

    if (files.length + newFiles.length > 10) {
      console.log("Maximum files exceeded, only adding up to 10 files");
      const remainingSpace = 10 - files.length;
      newFiles.splice(remainingSpace); // Keep only the files that fit in the remaining space
    }
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };


  // function onSubmit(values: z.infer<typeof examSchema>) {
  //   // Do something with the form values.
  //   // ✅ This will be type-safe and validated.
  //   console.log(values)
  // }


  const deleteFile = (index: number) => {
    const newFiles = [...files];
    const deletedFile = newFiles.splice(index, 1)[0];
    setFiles(newFiles);
    setTotalSize(totalSize - deletedFile.size);
  };

  const onSubmit = async (e: z.infer<typeof examSchema>) => {
    setLoading(true)
    const form = new FormData();

    // Add each file to the FormData
    files.forEach((file, index) => {
      form.append( `file-${index+1}`, file); // Use unique keys for each file
    });

    console.log("Session:", session); // Check the session data
    console.log("Adding username to form data:", session?.user?.username); // Check username

    form.append('name', e.examName); // Add a name to form data
    form.append('username', session?.user?.username || ""); // Ensure this doesn't throw if undefined

    // Loop through FormData to confirm data has been appended correctly
    console.log("FormData contents:");
    for (const pair of form.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const res = await fetch('/api/exam-analyzer', {
        method: 'POST',
        body: form,
      });

      const result = await res.json();
      console.log('Response:', result.data);
      router.replace(`/exam/${session?.user?.username}/${e.examName.replaceAll(" ", "+")}`)
    } catch (error) {
      console.error('Error submitting files:', error);
    }
    finally {
      setLoading(false)
    }
  };

  const uploadRules = [
    "Upload Only Valid Exam Paper PDFs",
    "Only 10 files Allowed Per Submission",
    "Total size can’t be up to 10 Mb",
    "Provide Authorized and Error Free PDF",
    "Photo Clicked Exam Papers can't be processed"
  ]

  return (

    <div className='p-4'>
      {/* heading */}
      <div>
        <p className='text-lg md:text-md font-bold text-blue-600'>Exam Analyzer</p>
      </div>

      {/* content box */}
      <div className='bg-blue-600 rounded-md h-full mt-5 flex justify-between items-center p-5 md:p-10 w-full'>

        {/* content */}
        <div className='w-full md:w-[75%] h-full flex flex-col gap-4 leading-[10px]'>
          {
            uploadRules.map((rule, index) => (
              <p key={index} className='text-white font-extralight'>{rule}</p>
            ))
          }
        </div>

        {/* illustration */}
        <div className='w-[20%] hidden md:block'>
          <Image src={upload} alt="upload illustration" />
        </div>

      </div>

      <div className='mt-5 flex flex-col gap-4'>

        {/* upload File label */}
        <div className='flex gap-4'>
          <Download />
          <p className='text-black font-semibold'>Upload File</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8  h-full w-full">


            <FormField
              control={form.control}
              name="files"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex flex-col md:flex-row items-start h-full gap-4">
                      <div
                        {...getRootProps()}
                        className={`w-96 h-72 md:h-[340px] bg-gray-200 flex flex-col justify-center items-center rounded-md border-2 ${isDragActive ? "border-dashed border-blue-500" : "border-gray-300"
                          }`}
                      >
                        <input {...getInputProps()} multiple type='file' onChange={(e) => {
                          onFileChange(e)
                        }} />
                        <CloudUploadIcon className="text-blue-500 text-4xl mb-4 transition-all" size={isDragActive ? 45 : 25} />
                        <p className="text-blue-500 text-lg mb-2">
                          {isDragActive ? "Upload file here ..." : "Drag or upload file"}
                        </p>
                        <p className="text-gray-600">
                          {isDragActive
                            ? "Release to upload"
                            : "Upload valid exam paper"}
                        </p>
                      </div>


                      {/* file show */}
                      <div className="flex justify-between gap-5 flex-col md:flex-row ">
                        {/* Render the left side */}
                        <div className=" w-full flex flex-col gap-4 justify-start items-start">
                          {filesLeft.map((file, index) => (
                            <div
                              className="h-14 w-96 md:w-80 border-2 flex justify-between items-center gap-2 bg-gray-100 rounded-md p-4"
                              key={index}
                            >
                              <div className='flex justify-center items-center gap-4'>
                                <ArchiveRestore className="text-blue-600" />
                                <div>
                                  <p>{file.name ? (file.name.length > 15 ? (file.name.slice(0, 15) + "...") : (file.name)) : ("")}</p>
                                  <p className="text-gray-500 text-sm">{formatBytes(file.size)}</p>
                                </div>
                              </div>
                              <Button variant={"ghost"} onClick={() => deleteFile(index)}>
                                <X />
                              </Button>
                            </div>

                          ))}
                        </div>

                        {/* Render the right side */}
                        <div className=" w-full flex flex-col gap-4 justify-start items-start">
                          {filesRight.map((file, index) => (
                            <div
                              className="h-14 w-96 md:w-80 border-2 flex justify-between items-center gap-2 bg-gray-100 rounded-md p-4"
                              key={index}
                            >
                              <div className='flex justify-center items-center gap-4'>
                                <ArchiveRestore className="text-blue-600" />
                                <div>
                                  <p>{file.name ? (file.name.length > 15 ? (file.name.slice(0, 15) + "...") : (file.name)) : ("")}</p>
                                  <p className="text-gray-500 text-sm">{formatBytes(file.size)}</p>
                                </div>
                              </div>
                              <Button variant={"ghost"} onClick={() => deleteFile(index)}>
                                <X />
                              </Button>
                            </div>

                          ))}
                        </div>
                      </div>
                    </div>
                  </FormControl>


                  <FormMessage />
                  {
                    isFileError ? <div>
                      <Alert variant="destructive">
                        <div className="h-4 w-4" />
                        <AlertDescription>
                          You must Upload Atleast One Image !
                        </AlertDescription>
                      </Alert>

                    </div> : ""
                  }
                </FormItem>
              )}
            />
            {/* upload File label */}
            <div className='flex gap-4'>
              <FilePen />
              <p className='text-black font-semibold'>Exam Name</p>
            </div>
            <FormField
              control={form.control}
              name="examName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exam Name </FormLabel>
                  <FormControl>
                    <Input className='w-[50%]' placeholder="Enter You full Exam Name  (e.g. Python Programming 2024-2025)" {...field} />
                  </FormControl>
                  <FormDescription>
                    Must Be Specific And Meaning full
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />


            <Button
              type="submit"

            >
              {loading ? (
                <div className="flex justify-center items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Please Wait...
                </div>
              ) : (
                'Start Analysis'
              )}
            </Button>          </form>
        </Form>
      </div>
    </div>





    // testing api






    // <div>
    //   <form onSubmit={onSubmit}>
    //     <input type="file" onChange={onFileChange} multiple />
    //     <button type="submit">Submit</button>
    //   </form>
    //   <div>
    //     <h3>Files to be uploaded:</h3>
    //     <ul>
    //       {files.map((file, index) => (
    //         <li key={index}>{file.name}</li>
    //       ))}
    //     </ul>
    //   </div>
    // </div>
  );
};

export default Page;
