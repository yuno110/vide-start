import { useParams } from 'react-router-dom';

export default function Article() {
  const { slug } = useParams<{ slug: string }>();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Article</h1>
      <p className="text-gray-600">Article: {slug}</p>
    </div>
  );
}
