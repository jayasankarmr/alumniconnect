// src/pages/AlumniProfile.tsx
import { useParams, Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function AlumniProfile() {
  const { id } = useParams();
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link to="/alumni">
        <Button variant="ghost">← Back to Directory</Button>
      </Link>
      <h1 className="text-2xl font-bold mt-4">Alumni Profile</h1>
      <p className="text-gray-600 mt-2">ID: {id}</p>
      {/* TODO: fetch and render alumni details */}
    </div>
  );
}
