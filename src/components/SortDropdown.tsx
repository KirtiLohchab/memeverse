"use client";

interface SortDropdownProps {
  onSortChange: (sortBy: string) => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ onSortChange }) => {
  return (
    <select
      className="w-full text-black p-2 mb-4 border rounded"
      onChange={(e) => onSortChange(e.target.value)}
    >
      <option value="date">Sort by Date</option>
      <option value="likes">Sort by Likes</option>
      <option value="comments">Sort by Comments</option>
    </select>
  );
};

export default SortDropdown;
