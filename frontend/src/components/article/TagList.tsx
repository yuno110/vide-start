interface TagListProps {
  tags: string[];
  className?: string;
  onTagClick?: (tag: string) => void;
}

export default function TagList({ tags, className = '', onTagClick }: TagListProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag) => (
        <span
          key={tag}
          onClick={() => onTagClick?.(tag)}
          className={`inline-block px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 border border-gray-200 rounded-full transition-colors ${
            onTagClick ? 'cursor-pointer hover:bg-gray-200' : ''
          }`}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
