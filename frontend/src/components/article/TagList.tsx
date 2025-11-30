interface TagListProps {
  tags: string[];
  className?: string;
}

export default function TagList({ tags, className = '' }: TagListProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-block px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 border border-gray-200 rounded-full hover:bg-gray-200 transition-colors"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
