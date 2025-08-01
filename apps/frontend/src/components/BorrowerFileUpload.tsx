import { Upload, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

interface UploadedFile {
  name: string;
  size: string;
  progress: number;
}

interface FileUploadProps {
  label: string;
  optional?: boolean;
  uploadedFile?: UploadedFile | null;
  onFileSelect?: (file: File) => void;
}

const FileUpload = ({ label, optional = false, uploadedFile, onFileSelect }: FileUploadProps) => {
  const handleClick = () => {
    // File upload logic would go here
    if (onFileSelect) {
      // Simulate file selection
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.pdf,.png,.jpg,.jpeg';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          onFileSelect(file);
        }
      };
      input.click();
    }
  };

  return (
    <div>
      <Label className="text-base font-medium">
        {label} {optional && "(optional)"}
      </Label>
      
      {uploadedFile ? (
        <Card className="mt-3 p-4 border border-gray-200 bg-white">
          <CardContent className="flex items-center justify-between p-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                <Upload className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-sm">{uploadedFile.name}</p>
                <p className="text-xs text-gray-500">{uploadedFile.size}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 min-w-[80px]">
                <Progress value={uploadedFile.progress} className="h-2 flex-1" />
                <span className="text-xs font-medium">{uploadedFile.progress}%</span>
              </div>
              {uploadedFile.progress === 100 && (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card 
          className="mt-3 p-8 border-2 border-dashed border-gray-300 text-center hover:border-gray-400 transition-colors cursor-pointer"
          onClick={handleClick}
        >
          <CardContent className="space-y-2">
            <Upload className="w-8 h-8 text-gray-400 mx-auto" />
            <p className="text-gray-600">Click to upload or drag and drop</p>
            <p className="text-sm text-gray-500">PDF, PNG or JPG (max. 10mb)</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FileUpload;