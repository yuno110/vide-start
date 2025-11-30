import { useParams } from 'react-router-dom';

export default function Profile() {
  const { username } = useParams<{ username: string }>();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Profile</h1>
      <p className="text-gray-600">User: {username}</p>
    </div>
  );
}
