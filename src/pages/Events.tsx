import { Link } from "react-router-dom";
export default function Events() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Events</h1>
      <ul className="space-y-3">
        {[1,2,3].map(id => (
          <li key={id} className="p-4 rounded-md border">
            <div className="font-medium">Sample Event #{id}</div>
            <Link to={`/events/${id}`} className="text-blue-600 hover:underline">
              View details
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
