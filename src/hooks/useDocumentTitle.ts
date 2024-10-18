import { useEffect } from 'react';

export function useDocumentTitle(title: string) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = `\u00A0\u00A0\u00A0\u00A0${title}`;
    
    const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    link.href = '/logo.svg';
    
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
}
