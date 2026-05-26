import React, { useState } from 'react';

interface InlineEditableTextProps {
  as?: 'p' | 'span' | 'h2' | 'h3' | 'div';
  text: string;
  canEdit: boolean;
  multiline?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onCommit: (value: string) => void;
}

const InlineEditableText: React.FC<InlineEditableTextProps> = ({
  as = 'p',
  text,
  canEdit,
  multiline = true,
  className,
  style,
  onCommit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const Tag: React.ElementType = as;

  const commit = (value: string) => {
    setIsEditing(false);
    onCommit(value);
  };

  return React.createElement(
    Tag,
    {
      className,
      style: {
        ...style,
        cursor: canEdit ? (isEditing ? 'text' : 'pointer') : undefined,
        outline: isEditing ? '1px dashed #6366f1' : 'none',
        outlineOffset: isEditing ? '2px' : undefined,
      },
      title: canEdit ? 'Double-click to edit on canvas' : undefined,
      contentEditable: canEdit && isEditing,
      suppressContentEditableWarning: true,
      onDoubleClick: (e: React.MouseEvent<HTMLElement>) => {
        if (!canEdit) return;
        e.stopPropagation();
        setIsEditing(true);
      },
      onBlur: (e: React.FocusEvent<HTMLElement>) => commit(e.currentTarget.innerText),
      onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          setIsEditing(false);
          return;
        }
        if (!multiline && e.key === 'Enter') {
          e.preventDefault();
          commit(e.currentTarget.innerText);
        }
      },
    },
    text
  );
};

export default InlineEditableText;
