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
import { CloudUploadIcon, Download, FileUp, X, } from 'lucide-react';
import upload from '@/assets/upload.svg'
import Image from 'next/image';
import { Card } from '@/components/ui/card';
const Page = () => {
  const { data: session, status } = useSession();

  // form
  const form = useForm<z.infer<typeof examSchema>>({
    resolver: zodResolver(examSchema),
  })

  // Use File[] to maintain an array of files
  const [files, setFiles] = useState<File[]>([]);
  const [examName, setExamName] = useState<string>("test");
  const [totalSize, setTotalSize] = useState(0);
  const [isFileError, setIsFileError] = useState(false)


  const onDrop = useCallback((acceptedFiles: File[]) => {
    let newFiles: File[] = [];
    let newSize = 0;
    acceptedFiles.forEach(file => {
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
    const newFiles = Array.from(e.target.files ?? []); // Convert FileList to array
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };


  function onSubmit(values: z.infer<typeof examSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }


  const deleteFile = (index: number) => {
    const newFiles = [...files];
    const deletedFile = newFiles.splice(index, 1)[0];
    setFiles(newFiles);
    setTotalSize(totalSize - deletedFile.size);
  };

  // const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   const form = new FormData();

  //   // Add each file to the FormData
  //   files.forEach((file, index) => {
  //     form.append(`file${index + 1}`, file); // Use unique keys for each file
  //   });

  //   console.log("Session:", session); // Check the session data
  //   console.log("Adding username to form data:", session?.user?.username); // Check username

  //   form.append('name', examName); // Add a name to form data
  //   form.append('username', session?.user?.username || ""); // Ensure this doesn't throw if undefined

  //   // Loop through FormData to confirm data has been appended correctly
  //   console.log("FormData contents:");
  //   for (const pair of form.entries()) {
  //     console.log(pair[0], pair[1]);
  //   }

  //   try {
  //     const res = await fetch('/api/exam-analyzer', {
  //       method: 'POST',
  //       body: form,
  //     });

  //     const result = await res.json();
  //     console.log('Response:', result.data);
  //   } catch (error) {
  //     console.error('Error submitting files:', error);
  //   }
  // };

  const uploadRules = [
    "Upload Only Valid Exam Paper PDFs",
    "Only 10 files Allowed Per Submission",
    "Total size can’t be up to 10 Mb",
    "Provide Authorized and Error Free PDF",
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
                    <div className="flex items-center h-full">
                      <div
                        {...getRootProps()}
                        className={`w-96 h-72 flex flex-col justify-center items-center rounded-md border-2 ${isDragActive ? "border-dashed border-blue-500" : "border-gray-300"
                          }`}
                      >
                        <input {...getInputProps()} on className="hidden" />
                        <CloudUploadIcon className="text-blue-500 text-4xl mb-4" />
                        <p className="text-blue-500 text-lg mb-2">
                          {isDragActive ? "Upload file here ..." : "Drag or upload file"}
                        </p>
                        <p className="text-gray-600">
                          {isDragActive
                            ? "Release to upload"
                            : "Upload valid exam paper"}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        {/* Render the left side */}
                        <div className="flex flex-col gap-4">
                          {filesLeft.map((file, index) => (
                            <Card>
                            <div
                              className="flex justify-center items-center gap-2 bg-gray-100 rounded-md p-4"
                              key={index}
                            >
                              <FileUp className="text-blue-600" />
                              <div>
                                <p>{file.name}</p>
                                <p className="text-gray-500 text-sm">{file.size} bytes</p>
                              </div>
                              <Button onClick={() => deleteFile(index)}>
                                <X/>
                              </Button>
                            </div>
                            </Card>

                          ))}
                        </div>

                        {/* Render the right side */}
                        <div className="flex flex-col gap-4">
                          {filesRight.map((file, index) => (
                            <div
                              className="flex justify-center items-center gap-2 bg-gray-100 rounded-md p-4"
                              key={index}
                            >
                              <FileUp className="text-blue-500" />
                              <div>
                                <p>{file.name}</p>
                                <p className="text-gray-500 text-sm">{file.size} bytes</p>
                              </div>
                              <button onClick={() => deleteFile(index + 5)}>
                                <X className="text-red-500" />
                              </button>
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
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>





    // testing api


    // <FormField
    //           control={form.control}
    //           name="examName"
    //           render={({ field }) => (
    //             <FormItem>
    //               <FormLabel>Exam Name</FormLabel>
    //               <FormControl>
    //                 <Input placeholder="shadcn" {...field} />
    //               </FormControl>
    //               <FormDescription>
    //                 Enter Full Name Of Exam
    //               </FormDescription>
    //               <FormMessage />
    //             </FormItem>
    //           )}
    //         />



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
