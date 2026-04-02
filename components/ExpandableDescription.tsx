import React, { useEffect, useRef, useState } from 'react';
import { Typography, Button, Box } from '@mui/material';

interface ExpandableDescriptionProps {
  text: string;
  collapsedLines?: number;
  fontSize?: string;
}

export const ExpandableDescription: React.FC<ExpandableDescriptionProps> = ({
  text,
  collapsedLines = 3,
  fontSize = '0.875rem',
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showExpand, setShowExpand] = useState(false);
  const textRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const element = textRef.current;

    if (!element) {
      return;
    }

    const checkOverflow = () => {
      setShowExpand(element.scrollHeight > element.clientHeight + 1);
    };

    checkOverflow();

    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    const resizeObserver = new ResizeObserver(() => {
      if (!expanded) {
        checkOverflow();
      }
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [collapsedLines, expanded, fontSize, text]);

  return (
    <Box>
      <Typography
        ref={textRef}
        variant="body2"
        color="text.secondary"
        sx={{
          display: '-webkit-box',
          WebkitLineClamp: !expanded ? collapsedLines : 'unset',
          WebkitBoxOrient: 'vertical',
          overflow: !expanded ? 'hidden' : 'visible',
          textOverflow: 'ellipsis',
          lineHeight: 1.4,
          fontSize,
        }}
        data-testid="expandable-description-text">
        {text}
      </Typography>
      {showExpand && (
        <Button
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setExpanded((prev) => !prev);
          }}
          sx={{ mt: 0.5, textTransform: 'none', fontSize: '0.8rem', pl: 0 }}>
          {expanded ? 'Show less' : 'Show more'}
        </Button>
      )}
    </Box>
  );
};
