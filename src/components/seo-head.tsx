import { useEffect } from "react";

interface SEOHeadProps {
  title?: string;
  description?: string;
}

export function SEOHead({
  title = "Parthkumar Patel - Software Developer | Full-Stack Engineer",
  description = "Passionate software developer with expertise in web development, full-stack solutions, and modern web technologies.",
}: SEOHeadProps) {
  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    }
  }, [title, description]);

  return null;
}
