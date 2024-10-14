import { useEffect, useRef, useState } from 'react';
import { UseOutsideClickResult } from '../types/interfaces';

function useOutsideClick<T extends HTMLElement = HTMLDivElement>(initialIsVisible: boolean): UseOutsideClickResult<T> {
  const [isVisible, setIsVisible] = useState<boolean>(initialIsVisible);
  const ref = useRef<T>(null);

  const handleClickOutside = (event: MouseEvent): void => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return { ref, isVisible, setIsVisible };
}

export default useOutsideClick;
