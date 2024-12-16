import React, { useRef, useState } from "react";
import { Camera, X } from "lucide-react";
import { createWorker } from "tesseract.js";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

interface OCRCameraProps {
  onTextDetected: (text: string) => void;
}

export const OCRCamera = ({ onTextDetected }: OCRCameraProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível acessar a câmera",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  };

  const captureImage = async () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        
        try {
          const worker = await createWorker();
          await worker.loadLanguage("eng");
          await worker.initialize("eng");
          
          const { data: { text } } = await worker.recognize(canvasRef.current);
          await worker.terminate();
          
          if (text.trim()) {
            onTextDetected(text);
            stopCamera();
          } else {
            toast({
              title: "Aviso",
              description: "Nenhum texto detectado na imagem",
            });
          }
        } catch (error) {
          toast({
            title: "Erro",
            description: "Erro ao processar a imagem",
            variant: "destructive",
          });
          console.error("Erro OCR:", error);
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed inset-x-4 top-[50%] translate-y-[-50%] space-y-4 rounded-lg bg-card p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Câmera OCR</h2>
          <Button variant="ghost" size="icon" onClick={stopCamera}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="h-full w-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="flex justify-center gap-4">
          {!isStreaming ? (
            <Button onClick={startCamera}>
              <Camera className="mr-2 h-4 w-4" />
              Iniciar Câmera
            </Button>
          ) : (
            <Button onClick={captureImage}>Capturar e Reconhecer</Button>
          )}
        </div>
      </div>
    </div>
  );
};