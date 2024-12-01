
import React, { useState } from 'react';
import Uppy from '@uppy/core';
import { Dashboard } from '@uppy/react';
import ImageEditor from '@uppy/image-editor';
import Tus from '@uppy/tus';  // Changed to Tus for better upload support
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import '@uppy/image-editor/dist/style.css';
import { uploadToS3 } from '@/lib/aws-sdk';
import Button from '../button';
import { Toaster } from 'sonner';
import showToast from '@/helper/show-toaster';

interface ImageUploaderProps {
  onUploadSuccess?: (_result: { url1: string; url2: string,url3:string,url4:string }) => void;
  onUploadError?: (_error: Error) => void;
  maxFileSize?: number;
  allowedFileTypes?: string[];
  endpoint: string;
  className?: string;
  imageBoxHeight?: string;
  imageBoxWidth?: string;
  previewImageHeight?: string;
  previewImageWidth?: string;
  fileNamePositionTop?: string;
  fileNamePositionLeft?: string;
  onCancelAll?: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onUploadSuccess,
  onUploadError,
  maxFileSize = 10 * 1024 * 1024,
  allowedFileTypes = ['image/*'],
  endpoint,
  // className = '',
  imageBoxHeight = '220px',
  imageBoxWidth = '100%',
  previewImageHeight = '100px',
  previewImageWidth = '100px',
  fileNamePositionTop = '30px',
  fileNamePositionLeft = '5px',
  onCancelAll,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uppy] = useState(() =>
    new Uppy({
      id: 'imageUploader',
      autoProceed: false,
      restrictions: {
        maxFileSize,
        allowedFileTypes,
        maxNumberOfFiles: 1,
      },
      meta: {
        uploaderType: 'local',
      },
    })
      .use(ImageEditor, {
        cropperOptions: {
          aspectRatio: 1,
          viewMode: 1,
        },
        actions: {
          revert: true,
          rotate: true,
          granularRotate: false,
          flip: true,
          zoomIn: true,
          zoomOut: true,
          cropSquare: true,
          cropWidescreen: true,
          cropWidescreenVertical: true,
        },
      })
      .use(Tus, {
        endpoint,
        retryDelays: [0, 1000, 3000, 5000],
        limit: 1,
      })
  );

  React.useEffect(() => {
    // uppy.on('upload', async(file) => {
    //   const files = uppy.getFiles();
    //   if(files.length > 0){
    //     setIsUploaded(true);
    //   }
    //   console.log(file,'uppy on upload', files[0].data);
    // const uploadResult = await uploadToS3(files[0].data);
    // console.log(uploadResult, 'upload result');

    // });
    // uppy.on('upload-success', (file: any, response: any) => {
    //   console.log(file,response, 'uppy on upload success');
      
    //   // if (onUploadSuccess) {
    //   //   onUploadSuccess({
    //   //     url: response.uploadURL || response.body?.url,
    //   //     fileId: file.id,
    //   //   });
    //   // }
    // });
    // uppy.on('upload-progress', (file: any, progress: any) => {
    //   console.log(file,progress, 'uppy on upload progress');
    // });

    // uppy.on('upload-error', (file: any, error: Error) => {
    //   console.log(file,error, 'uppy on upload error');
    //   if (onUploadError) {
    //     onUploadError(error);
    //   }
    // });

    uppy.on('file-removed', (file) => {
      console.log('file-removed', file);
      onCancelAll?.();
    });

    uppy.on('cancel-all', () => {
      console.log('cancel-all');
      onCancelAll?.();
    });

    // return () => {
    //   uppy.close();
    // };
    // return () => {
    //   // Instead of close(), use removeAllFiles() and reset()
    //   uppy.removeAllFiles();
    //   uppy.reset();
    // };
  }, [uppy, onUploadSuccess, onUploadError, onCancelAll]);


  const updateButtonHandler = async() => {
    console.log('update button clicked');
    if (uppy) {
      const files = uppy.getFiles();
      if (files.length > 0) {
        try {
          setIsUploading(true);
          console.log('Uploading file:', files[0]);
          const uploadResult = await uploadToS3(files[0].data);
          showToast({ message: 'Image uploaded successfully', messageType: 'success'});
          onUploadSuccess?.(uploadResult);
          console.log(uploadResult, 'upload result');
        } catch (error) {
          showToast({ message: 'Something went wrong please try after sometime', messageType: 'error'});
        }
        finally {
          setIsUploading(false);
        }
      }
      else {
        showToast({ message: 'Please select an image', messageType: 'error'});
      }
    }

  };

  return (
    <>
      <style>{`
        .uppy-Dashboard {  /* image selection box */
          height: ${imageBoxHeight} !important;
          width: ${imageBoxWidth} !important;
        }
        .uppy-Dashboard-inner {
          height: 100% !important;
          width: 100% !important;
        }
          .uppy-Dashboard-Item {
          border: 0px  !important;
          }
        .uppy-Dashboard-innerWrap {
          height: 100% !important;
          width: 100% !important;
        }
        .uppy-Dashboard--modal {
          z-index: 9999;
        }
        .uppy-Dashboard-files {
          height: calc(100% - 100px) !important;
          overflow-y: auto;
        }
          .uppy-Dashboard-Item-previewInnerWrap{   /* preview image box */
          height: ${previewImageHeight} !important;
          width: ${previewImageWidth} !important;
          }
          .uppy-Dashboard-Item-name{  /* file name text */
             position: absolute; 
           bottom: ${fileNamePositionTop};
           left: ${fileNamePositionLeft};
          }
      `}</style>
      <Toaster />
      <div className='h-full w-full flex flex-col'>
        <Dashboard
          style={{flex:1}}
          uppy={uppy}
          plugins={['ImageEditor']}
          width="100%"
          height="100%"
          showProgressDetails={false}
          note="Images only, up to 10 MB"
          proudlyDisplayPoweredByUppy={false}
          hideUploadButton
          hideCancelButton
        // showProgressDetails={false} 
        />
        <Button disabled={isUploading} isLoading={isUploading} onClick={updateButtonHandler} buttonType="primary">
          Update
        </Button>
      </div>
    </>
  );
};

export default ImageUploader;