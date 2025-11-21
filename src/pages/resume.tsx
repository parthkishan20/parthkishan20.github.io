import { motion } from "framer-motion";
import siteData from "@/data/siteData.json";
import { Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Resume() {
  const handleDownload = () => {
    // Convert Google Drive view link to download link
    const fileId = siteData.resume.pdfPath.match(/\/d\/(.+?)\//)?.[1];
    if (fileId) {
      window.open(`https://drive.google.com/uc?export=download&id=${fileId}`, "_blank");
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center py-12 px-4 md:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="container max-w-5xl mx-auto space-y-6"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">Resume</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Last updated: {siteData.resume.lastUpdated}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild className="gap-2">
              <a href={siteData.resume.pdfPath} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                View in Drive
              </a>
            </Button>
            <Button onClick={handleDownload} className="gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>
        
        <div className="w-full mx-auto rounded-lg overflow-hidden bg-muted flex items-center justify-center shadow-lg" style={{ aspectRatio: '8.5/11', maxHeight: '75vh' }}>
          <iframe
            src={siteData.resume.pdfPath.replace("/view", "/preview")}
            title="Resume Preview"
            className="w-full h-full border-none"
            allow="autoplay"
          />
        </div>
      </motion.div>
    </div>
  );
}