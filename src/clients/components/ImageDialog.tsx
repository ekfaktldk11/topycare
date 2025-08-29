import { Dialog, DialogContent, IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

type ImageDialogProps = {
  src: string | null;
  onClose: () => void;
};

export default function ImageDialog({ src, onClose }: ImageDialogProps) {
  return (
    <Dialog open={!!src} onClose={onClose} fullWidth maxWidth="md">
      <IconButton
        onClick={onClose}
        sx={{ position: "absolute", right: 8, top: 8, zIndex: 1 }}
        aria-label="닫기"
      >
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ p: 0 }}>
        {src && (
          <img
            src={src}
            alt="확대 이미지"
            style={{ display: "block", width: "100%", height: "auto" }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
