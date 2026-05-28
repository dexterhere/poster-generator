import React, { useEffect, useId, useState } from 'react';

interface InlineEditableTextProps {
  as?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'div';
  text: string;
  canEdit: boolean;
  multiline?: boolean;
  editOnClick?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onCommit: (value: string) => void;
}

const InlineEditableText: React.FC<InlineEditableTextProps> = ({
  as = 'p',
  text,
  canEdit,
  multiline = true,
  editOnClick = false,
  className,
  style,
  onCommit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const editableId = useId();
  const Tag: React.ElementType = as;

  useEffect(() => {
    if (!isEditing) return;
    const node = document.getElementById(editableId);
    if (!node) return;
    node.focus();
    const range = document.createRange();
    range.selectNodeContents(node);
    range.collapse(false);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }, [editableId, isEditing]);

  const commit = (value: string) => {
    setIsEditing(false);
    onCommit(value);
  };

  return React.createElement(
    Tag,
    {
      id: editableId,
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
      onClick: (e: React.MouseEvent<HTMLElement>) => {
        if (!canEdit || !editOnClick) return;
        e.stopPropagation();
        setIsEditing(true);
      },
      onDoubleClick: (e: React.MouseEvent<HTMLElement>) => {
        if (!canEdit) return;
        e.stopPropagation();
        setIsEditing(true);
      },
      onMouseDown: (e: React.MouseEvent<HTMLElement>) => {
        if (isEditing) e.stopPropagation();
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
