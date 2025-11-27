'use client';

import { useState, useRef, useEffect, useLayoutEffect, KeyboardEvent, forwardRef, useImperativeHandle } from 'react';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// Singleton canvas for text measurement to avoid repeated creation
let measurementCanvas: HTMLCanvasElement | null = null;
let measurementContext: CanvasRenderingContext2D | null = null;

function getMeasurementContext(): CanvasRenderingContext2D | null {
  if (typeof window === 'undefined') return null;

  if (!measurementCanvas) {
    measurementCanvas = document.createElement('canvas');
    measurementContext = measurementCanvas.getContext('2d');
  }
  return measurementContext;
}

interface TerminalInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  accentColor?: string;
  showMobileSendButton?: boolean;
}

export interface TerminalInputRef {
  focus: () => void;
  setSelectionRange: (start: number, end: number) => void;
}

export const TerminalInput = forwardRef<TerminalInputRef, TerminalInputProps>(({
  value,
  onChange,
  onSubmit,
  placeholder = 'Type your question...',
  disabled = false,
  className,
  accentColor = 'oklch(0.72 0.12 185)',
  showMobileSendButton = true,
}, ref) => {
  const [cursorPosition, setCursorPosition] = useState(0);
  const [selectionStart, setSelectionStart] = useState<number | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<number | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const textDisplayRef = useRef<HTMLDivElement>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStartPos, setSelectionStartPos] = useState<number | null>(null);
  const mouseDownPosRef = useRef<number | null>(null);
  const hasMovedRef = useRef(false);
  const touchStartXRef = useRef<number | null>(null);
  const isTouchRef = useRef(false);

  // Expose focus and setSelectionRange methods to parent
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
    setSelectionRange: (start: number, end: number) => {
      inputRef.current?.setSelectionRange(start, end);
    },
  }));

  // Sync cursor position and selection from input element
  const updateCursorPosition = () => {
    if (inputRef.current) {
      const start = inputRef.current.selectionStart || 0;
      const end = inputRef.current.selectionEnd || 0;

      setCursorPosition(start);

      // Track selection if there's a selection (start !== end)
      if (start !== end) {
        setSelectionStart(start);
        setSelectionEnd(end);
      } else {
        setSelectionStart(null);
        setSelectionEnd(null);
      }
    }
  };

  // Scroll cursor into view when position changes
  useEffect(() => {
    if (scrollContainerRef.current && isFocused && cursorPosition >= 0) {
      // Use requestAnimationFrame to ensure DOM has updated with new cursor position
      requestAnimationFrame(() => {
        const cursorElement = scrollContainerRef.current?.querySelector('[data-cursor-block]');
        if (cursorElement && scrollContainerRef.current) {
          const container = scrollContainerRef.current;
          const cursorRect = cursorElement.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();

          // Check if cursor is outside visible area
          if (cursorRect.left < containerRect.left || cursorRect.right > containerRect.right) {
            cursorElement.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest',
              inline: 'nearest'
            });
          }
        }
      });
    }
  }, [cursorPosition, isFocused]);

  // Update cursor position on value change
  useLayoutEffect(() => {
    updateCursorPosition();
  }, [value]);

  // Update selection when input changes (typing, pasting, etc.)
  useEffect(() => {
    // Small delay to ensure browser has updated selection
    const timeoutId = setTimeout(() => {
      updateCursorPosition();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [value]);

  // Auto-focus on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Handle keyboard events
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && onSubmit) {
      e.preventDefault();
      if (value.trim()) {
        onSubmit();
      }
    }
    // Update selection on keyboard navigation (arrows, shift+arrows, ctrl+a, etc.)
    // We'll update after the key event completes
    setTimeout(updateCursorPosition, 0);
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  // Calculate character position from click coordinates
  const getCharPositionFromClick = (clientX: number): number => {
    if (!textDisplayRef.current || !inputRef.current || !scrollContainerRef.current) return 0;

    const textContainer = textDisplayRef.current;
    const scrollContainer = scrollContainerRef.current;

    // Get the text content div (the one with flex items-center that contains the actual text)
    const textContentDiv = textContainer.querySelector('div.flex.items-center') as HTMLElement;
    if (!textContentDiv) return 0;

    // Get bounding rect of the text content div
    const textRect = textContentDiv.getBoundingClientRect();
    const scrollLeft = scrollContainer.scrollLeft;

    // Calculate click position relative to the text content div (accounting for scroll)
    const clickX = clientX - textRect.left + scrollLeft;

    // Get computed styles for accurate measurement
    const style = window.getComputedStyle(textContainer);
    const fontSize = style.fontSize;
    const fontFamily = style.fontFamily;
    const font = `${fontSize} ${fontFamily}`;

    // Use canvas to measure text width accurately
    const context = getMeasurementContext();
    if (!context) return 0;

    context.font = font;

    const text = value || '';
    if (text.length === 0) return 0;

    // Binary search for character position with more precision
    let left = 0;
    let right = text.length;
    let position = 0;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const textBefore = text.slice(0, mid);
      const width = context.measureText(textBefore).width;

      if (width <= clickX) {
        position = mid;
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    // Fine-tune position: check if we're closer to current or next character
    if (position < text.length) {
      const currentWidth = context.measureText(text.slice(0, position)).width;
      const nextWidth = context.measureText(text.slice(0, position + 1)).width;
      const midpoint = currentWidth + (nextWidth - currentWidth) / 2;

      if (clickX > midpoint) {
        position = Math.min(position + 1, text.length);
      }
    }

    return Math.max(0, Math.min(position, text.length));
  };

  // Handle click on visible text to position cursor (only if no drag occurred)
  const handleTextClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!inputRef.current || disabled) return;

    // Only handle click if it wasn't a drag
    if (hasMovedRef.current) {
      hasMovedRef.current = false;
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    const position = getCharPositionFromClick(e.clientX);
    inputRef.current.focus();
    inputRef.current.setSelectionRange(position, position);
    updateCursorPosition();
  };

  // Handle mouse down for selection start
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!inputRef.current || disabled) return;

    e.preventDefault();
    const position = getCharPositionFromClick(e.clientX);
    mouseDownPosRef.current = e.clientX;
    hasMovedRef.current = false;
    setIsSelecting(true);
    setSelectionStartPos(position);
    inputRef.current.focus();
    inputRef.current.setSelectionRange(position, position);
    updateCursorPosition();
  };

  // Handle mouse move during selection - use global mouse move for better tracking
  useEffect(() => {
    if (!isSelecting) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!inputRef.current || disabled) return;

      // Check if mouse has moved significantly (more than 3px) to consider it a drag
      if (mouseDownPosRef.current !== null) {
        const moveDistance = Math.abs(e.clientX - mouseDownPosRef.current);
        if (moveDistance > 3) {
          hasMovedRef.current = true;
        }
      }

      const position = getCharPositionFromClick(e.clientX);
      const start = selectionStartPos ?? position;

      // Always pass smaller value as start, larger as end (setSelectionRange requirement)
      const selectionStart = Math.min(start, position);
      const selectionEnd = Math.max(start, position);

      inputRef.current.setSelectionRange(selectionStart, selectionEnd);
      updateCursorPosition();
    };

    const handleGlobalMouseUp = () => {
      setIsSelecting(false);
      setSelectionStartPos(null);
      mouseDownPosRef.current = null;
      // Reset move flag after a short delay to allow click handler to check it
      setTimeout(() => {
        hasMovedRef.current = false;
      }, 0);
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isSelecting, selectionStartPos, disabled]);

  // Handle mouse up to end selection
  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!inputRef.current || disabled || isTouchRef.current) return;

    if (isSelecting && hasMovedRef.current) {
      e.preventDefault();
      const position = getCharPositionFromClick(e.clientX);
      const start = selectionStartPos ?? position;

      // Always pass smaller value as start, larger as end (setSelectionRange requirement)
      const selectionStart = Math.min(start, position);
      const selectionEnd = Math.max(start, position);

      inputRef.current.setSelectionRange(selectionStart, selectionEnd);
      updateCursorPosition();
    }

    setIsSelecting(false);
    setSelectionStartPos(null);
    mouseDownPosRef.current = null;
    // Reset move flag after a short delay to allow click handler to check it
    setTimeout(() => {
      hasMovedRef.current = false;
    }, 0);
  };

  // Touch event handlers for mobile support
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!inputRef.current || disabled) return;

    isTouchRef.current = true;
    const touch = e.touches[0];
    const position = getCharPositionFromClick(touch.clientX);
    touchStartXRef.current = touch.clientX;
    hasMovedRef.current = false;
    setIsSelecting(true);
    setSelectionStartPos(position);
    inputRef.current.focus();
    inputRef.current.setSelectionRange(position, position);
    updateCursorPosition();
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!inputRef.current || disabled || !isSelecting) return;

    const touch = e.touches[0];

    // Check if touch has moved significantly
    if (touchStartXRef.current !== null) {
      const moveDistance = Math.abs(touch.clientX - touchStartXRef.current);
      if (moveDistance > 3) {
        hasMovedRef.current = true;
      }
    }

    const position = getCharPositionFromClick(touch.clientX);
    const start = selectionStartPos ?? position;

    const selectionStart = Math.min(start, position);
    const selectionEnd = Math.max(start, position);

    inputRef.current.setSelectionRange(selectionStart, selectionEnd);
    updateCursorPosition();
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!inputRef.current || disabled) return;

    setIsSelecting(false);
    setSelectionStartPos(null);
    touchStartXRef.current = null;

    setTimeout(() => {
      hasMovedRef.current = false;
      isTouchRef.current = false;
    }, 0);
  };

  // Check if there's an active selection
  const hasSelection = selectionStart !== null && selectionEnd !== null && selectionStart !== selectionEnd;
  const selectionStartPosCalculated = hasSelection ? Math.min(selectionStart!, selectionEnd!) : null;
  const selectionEndPosCalculated = hasSelection ? Math.max(selectionStart!, selectionEnd!) : null;

  // Split text for rendering (considering selection)
  const leftText = value.slice(0, cursorPosition);
  const cursorChar = value.charAt(cursorPosition) || ' ';
  const rightText = value.slice(cursorPosition + 1);

  // Show placeholder when empty and not focused
  const showPlaceholder = !value && !isFocused;

  return (
    <div
      className={cn('relative group', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated border gradient on hover - subtle glow */}
      <div
        className={cn(
          'absolute -inset-[2px] rounded-[14px] opacity-0 transition-opacity duration-500',
          isHovered && !isFocused && 'opacity-100'
        )}
        style={{
          backgroundImage: `linear-gradient(90deg, ${accentColor}, transparent, ${accentColor})`,
          backgroundSize: '200% 100%',
          animation: isHovered && !isFocused ? 'borderSlide 3s linear infinite' : 'none',
          filter: 'blur(8px)',
        }}
      />

      {/* Focused state - smooth pulsing glow */}
      <div
        className={cn(
          'absolute -inset-[3px] rounded-[16px] opacity-0 transition-opacity duration-300',
          isFocused && 'opacity-100'
        )}
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, ${accentColor}40, transparent 70%)`,
          animation: isFocused ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none',
        }}
      />

      {/* Terminal panel */}
      <div
        className={cn(
          'relative rounded-xl overflow-hidden',
          'bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800',
          'dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-800',
          'border transition-all duration-500 ease-out',
          'shadow-2xl',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        style={{
          borderColor: isFocused
            ? accentColor
            : isHovered
              ? `${accentColor}60`
              : 'rgb(63 63 70 / 0.5)',
          boxShadow: isFocused
            ? `0 0 0 1px ${accentColor}, 0 0 40px ${accentColor}40, 0 25px 50px -12px rgba(0, 0, 0, 0.6)`
            : isHovered
              ? `0 0 20px ${accentColor}20, 0 25px 50px -12px rgba(0, 0, 0, 0.5)`
              : '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          transform: isFocused ? 'scale(1.005)' : 'scale(1)',
        }}
      >
        {/* Subtle terminal texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.3'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Terminal content */}
        <div className="relative flex items-center gap-3 px-5 py-4">
          {/* Terminal prompt with glow effect */}
          <span
            className="text-base font-mono font-semibold select-none flex-shrink-0 transition-all duration-300"
            style={{
              color: accentColor,
              textShadow: isFocused
                ? `0 0 20px ${accentColor}80, 0 0 10px ${accentColor}60`
                : isHovered
                  ? `0 0 10px ${accentColor}40`
                  : 'none',
              transform: isFocused ? 'scale(1.05)' : 'scale(1)',
            }}
          >
            $
          </span>

          {/* Input area - with overflow scroll */}
          <div
            ref={scrollContainerRef}
            className="flex-1 relative min-h-[24px] overflow-x-auto overflow-y-hidden scrollbar-hide"
          >
            {/* Hidden real input */}
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={handleChange}
              onKeyUp={updateCursorPosition}
              onKeyDown={handleKeyDown}
              onClick={updateCursorPosition}
              onSelect={updateCursorPosition}
              onMouseUp={updateCursorPosition}
              onFocus={() => {
                setIsFocused(true);
                updateCursorPosition();
              }}
              onBlur={() => setIsFocused(false)}
              disabled={disabled}
              className="absolute inset-0 w-full h-full opacity-0 cursor-text"
              style={{
                caretColor: 'transparent',
                WebkitTextFillColor: 'transparent',
                color: 'transparent',
                fontSize: '16px', // Prevent iOS zoom on focus
              }}
              aria-label="Terminal input"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />

            {/* Visible text display */}
            <div
              ref={textDisplayRef}
              className="relative flex items-center text-base font-mono cursor-text min-h-[24px] w-max min-w-full touch-manipulation"
              onClick={handleTextClick}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{ userSelect: 'none', WebkitUserSelect: 'none', touchAction: 'pan-y' }}
            >
              {showPlaceholder ? (
                <span className="text-zinc-500 dark:text-zinc-600">
                  {placeholder}
                </span>
              ) : (
                <div className="flex items-center">
                  {hasSelection && selectionStartPosCalculated !== null && selectionEndPosCalculated !== null ? (
                    // Render with selection highlighting
                    <>
                      {/* Text before selection */}
                      {selectionStartPosCalculated > 0 && (
                        <span className="text-zinc-100 dark:text-zinc-200 whitespace-pre">
                          {value.slice(0, selectionStartPosCalculated)}
                        </span>
                      )}

                      {/* Selected text */}
                      <span
                        className="text-zinc-900 dark:text-zinc-900 whitespace-pre"
                        style={{
                          backgroundColor: accentColor,
                          padding: '0 1px',
                          borderRadius: '2px',
                        }}
                      >
                        {value.slice(selectionStartPosCalculated, selectionEndPosCalculated)}
                      </span>

                      {/* Text after selection */}
                      {selectionEndPosCalculated < value.length && (
                        <span className="text-zinc-100 dark:text-zinc-200 whitespace-pre">
                          {value.slice(selectionEndPosCalculated)}
                        </span>
                      )}
                    </>
                  ) : (
                    // Normal rendering without selection
                    <>
                      {/* Text before cursor */}
                      {leftText && (
                        <span className="text-zinc-100 dark:text-zinc-200 whitespace-pre">
                          {leftText}
                        </span>
                      )}

                      {/* Block cursor with character - always show when focused */}
                      {isFocused && (
                        <span
                          data-cursor-block
                          className="inline-block transition-all duration-150"
                          style={{
                            backgroundColor: accentColor,
                            color: '#000000',
                            minWidth: '0.65em',
                            height: '1.3em',
                            lineHeight: '1.3em',
                            boxShadow: `0 0 10px ${accentColor}60, 0 0 5px ${accentColor}40`,
                            flexShrink: 0,
                          }}
                        >
                          {cursorChar}
                        </span>
                      )}

                      {/* Character at cursor position when not focused */}
                      {!isFocused && cursorChar !== ' ' && (
                        <span className="text-zinc-100 dark:text-zinc-200">
                          {cursorChar}
                        </span>
                      )}

                      {/* Text after cursor */}
                      {rightText && (
                        <span className="text-zinc-100 dark:text-zinc-200 whitespace-pre">
                          {rightText}
                        </span>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Send button - fixed position */}
          {showMobileSendButton && (
            <Button
              type="button"
              onClick={() => {
                if (value.trim() && !disabled && onSubmit) {
                  onSubmit();
                }
              }}
              disabled={!value.trim() || disabled}
              size="icon"
              className={cn(
                'h-9 w-9 rounded-lg flex-shrink-0 flex-grow-0 transition-all duration-300',
                'hover:scale-105 active:scale-95',
                !value.trim() && 'opacity-50'
              )}
              style={{
                backgroundColor: value.trim() && !disabled ? accentColor : 'rgb(63 63 70)',
                borderColor: value.trim() && !disabled ? 'transparent' : 'rgb(82 82 91)',
                borderWidth: '1px',
                boxShadow: value.trim() && !disabled ? `0 0 15px ${accentColor}40` : '0 1px 2px rgba(0,0,0,0.3)',
                color: value.trim() && !disabled ? '#ffffff' : 'rgb(161 161 170)',
              }}
            >
              <Send className="h-4 w-4" style={{ color: 'inherit' }} />
            </Button>
          )}
        </div>

        {/* Enter hint (desktop only) with fade animation */}
        {isFocused && !showMobileSendButton && (
          <div
            className="hidden lg:block absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono select-none pointer-events-none transition-all duration-300 animate-pulse"
            style={{
              color: `${accentColor}60`,
              opacity: 0.7,
            }}
          >
            Press Enter ↵
          </div>
        )}
      </div>
    </div>
  );
});

TerminalInput.displayName = 'TerminalInput';
