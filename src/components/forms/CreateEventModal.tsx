import React, { useState } from 'react';
import FormModal from '../ui/FormModal';
import { pendingRequestService, EventRequestData } from '../../lib/api/pendingRequestService';
import toast from 'react-hot-toast';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const eventData: EventRequestData = {
        title: data.title,
        description: data.description,
        category: data.category,
        startDate: data.startDate,
        endDate: data.endDate,
        venue: data.venue || undefined,
        virtualLink: data.virtualLink || undefined,
        maxSeats: data.maxSeats ? parseInt(data.maxSeats) : undefined,
        tags: data.tags ? data.tags.split(',').map((tag: string) => tag.trim()) : []
      };

      await pendingRequestService.submitRequest({
        type: 'event',
        data: eventData
      });

      toast.success('Your event request has been submitted for review!');
      onClose();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit event request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Create Event"
      submitText="Submit for Review"
      isLoading={isLoading}
      className="max-w-2xl"
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Event Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter event title"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe the event details"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              id="category"
              name="category"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select category</option>
              <option value="networking">Networking</option>
              <option value="workshop">Workshop</option>
              <option value="seminar">Seminar</option>
              <option value="conference">Conference</option>
              <option value="social">Social</option>
              <option value="career">Career</option>
              <option value="technical">Technical</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="maxSeats" className="block text-sm font-medium text-gray-700 mb-1">
              Max Seats
            </label>
            <input
              type="number"
              id="maxSeats"
              name="maxSeats"
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Leave empty for unlimited"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date & Time *
            </label>
            <input
              type="datetime-local"
              id="startDate"
              name="startDate"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              End Date & Time *
            </label>
            <input
              type="datetime-local"
              id="endDate"
              name="endDate"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label htmlFor="venue" className="block text-sm font-medium text-gray-700 mb-1">
            Venue
          </label>
          <input
            type="text"
            id="venue"
            name="venue"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter venue address (for in-person events)"
          />
        </div>

        <div>
          <label htmlFor="virtualLink" className="block text-sm font-medium text-gray-700 mb-1">
            Virtual Link
          </label>
          <input
            type="url"
            id="virtualLink"
            name="virtualLink"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://meet.google.com/xxx-xxxx-xxx (for virtual events)"
          />
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
            Tags
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter tags separated by commas (e.g., networking, career, tech)"
          />
          <p className="text-xs text-gray-500 mt-1">Separate multiple tags with commas</p>
        </div>
      </div>
    </FormModal>
  );
};

export default CreateEventModal;
