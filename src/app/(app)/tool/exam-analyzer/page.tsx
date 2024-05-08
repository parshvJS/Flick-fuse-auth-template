'use client';
import React, { useState, ChangeEvent } from 'react';

const Page = () => {
  // Use File[] to maintain an array of files
  const [files, setFiles] = useState<File[]>([]);
    const [text,setText] = useState('')
  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files ?? []); // Convert FileList to array
    // Append new files to the existing state
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData();

    // Add each file to the FormData
    files.forEach((file, index) => {
      form.append(`file${index + 1}`, file); // Use unique keys for each file
    });

    try {
      const res = await fetch('/api/exam-analyzer', {
        method: 'POST',
        body: form,
      });

      console.log(res)

      const result = await res.json();
      console.log('Response:', result.data);
    } catch (error) {
      console.error('Error submitting files:', error);
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input type="file" onChange={onFileChange} multiple />
        <button type="submit">Submit</button>
      </form>
      <div>
        <h3>Files to be uploaded:</h3>
        <ul>
          {files.map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Page;
