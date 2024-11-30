const RatingBar = ({ count, total, label, color }) => {
    const percentage = (count / total) * 100;
  
    return (
      <div className="flex items-center mb-2">
        <div className="w- font-bold flex items-center">
          <span>{label}</span>
          <span className="text-primary text-xs">[{count}]</span>
        </div>
        <div className="w-full h-4 bg-gray-200 rounded ml-2">
          <div
            className="h-full rounded"
            style={{ width: `${percentage}%`, backgroundColor: color }}
          ></div>
        </div>
      </div>
    );
  };
export default RatingBar