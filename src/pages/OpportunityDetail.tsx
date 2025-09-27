import { useParams } from "react-router-dom";

export default function OpportunityDetail() {
  const { id } = useParams();
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Opportunity Detail</h1>
      <p className="text-gray-600">Showing details for opportunity #{id}</p>
    </div>
  );
}
