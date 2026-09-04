import { useEffect, useState } from 'react';
import { useDropzone, type FileRejection } from 'react-dropzone';
import { Card, CardContent } from './card';
import { Button } from './button';
import { ImageIcon, Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value: string;
  onChange: (base64: string) => void;
  disabled?: boolean;

  variant?: 'avatar' | 'banner';
}

const MAX_SIZE_BYTES = 10_000_000;

const ImageUpload = ({ value, onChange, disabled, variant = 'avatar' }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPreview(value || null);
  }, [value]);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxSize: MAX_SIZE_BYTES,
    maxFiles: 1,
    disabled,
    onDrop: async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      setError(null);

      if (fileRejections.length > 0) {
        const rejection = fileRejections[0];
        if (rejection.errors.some((e) => e.code === 'file-too-large')) {
          setError('Image must be smaller than 10MB.');
        } else if (rejection.errors.some((e) => e.code === 'file-invalid-type')) {
          setError('Please upload a JPG, PNG, or WEBP image.');
        } else {
          setError('That file could not be uploaded.');
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        try {
          const base64 = await convertToBase64(acceptedFiles[0]);
          onChange(base64);
          setPreview(base64);
        } catch (err) {
          console.error('Error converting file to base64:', err);
          setError('Failed to read that image. Please try again.');
        }
      }
    },
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setPreview(null);
    setError(null);
  };

  const isBanner = variant === 'banner';

  return (
    <div className="space-y-2">
      <Card className="border-dashed overflow-hidden">
        <CardContent className="p-0">
          <div
            {...getRootProps({
              className: cn(
                'flex flex-col items-center justify-center gap-3 p-6 cursor-pointer transition-colors',
                isDragActive && 'bg-muted/50',
                disabled && 'cursor-not-allowed opacity-60'
              ),
            })}
          >
            <input {...getInputProps()} />

            {preview ? (
              <>
                <div
                  className={cn(
                    'relative shrink-0',
                    isBanner ? 'w-full aspect-[16/6]' : 'h-28 w-28'
                  )}
                >
                  <img
                    src={preview}
                    alt="Upload preview"
                    className={cn(
                      'h-full w-full object-cover shadow-sm ring-1 ring-border',
                      isBanner ? 'rounded-md' : 'rounded-full'
                    )}
                  />
                  {!disabled && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      onClick={handleRemove}
                      className={cn(
                        'absolute h-6 w-6 rounded-full shadow-sm',
                        isBanner ? '-top-2 -right-2' : '-top-1 -right-1'
                      )}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  {isDragActive ? 'Drop to replace' : 'Click or drag a new image to replace'}
                </p>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 h-[160px] w-full border border-dashed border-muted-foreground/50 rounded-md text-center px-4">
                {isDragActive ? (
                  <Upload className="h-10 w-10 text-muted-foreground" />
                ) : (
                  <ImageIcon className="h-10 w-10 text-muted-foreground" />
                )}
                <p className="text-sm text-muted-foreground">
                  {isDragActive ? (
                    'Drop the image here'
                  ) : (
                    <>
                      <span className="font-medium text-foreground">Click to upload</span> or drag and
                      drop
                    </>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isBanner ? 'Wide images work best. ' : ''}JPG, PNG, or WEBP up to 10MB
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default ImageUpload;