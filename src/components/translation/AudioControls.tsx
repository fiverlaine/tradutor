import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface AudioControlsProps {
  isRecording: boolean;
  onMicClick: () => void;
}

export const AudioControls = ({ isRecording, onMicClick }: AudioControlsProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("icon-button relative", isRecording && "text-red-500")}
      onClick={onMicClick}
    >
      {isRecording ? (
        <>
          <div className="recording-pulse" />
          <MicOff className="w-5 h-5" />
        </>
      ) : (
        <Mic className="w-5 h-5" />
      )}
    </Button>
  );
};