import { useParams, Link } from "react-router-dom";
export default function EventDetail() {
  const { id } = useParams();
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link to="/events" className="text-blue-600 hover:underline">← Back to Events</Link>
      <h1 className="text-2xl font-bold mt-4">Event Detail #{id}</h1>
      <p className="text-gray-600 mt-2">Event info goes here.</p>
    </div>
  );
}
