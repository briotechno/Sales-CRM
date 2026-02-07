import React from "react";

const GenericGridView = ({ data, renderItem, columns = 4, emptyMessage = "No items found." }) => {
  if (!data || data.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="flex flex-col items-center gap-3">
          <p className="text-gray-500 font-medium">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-4`}>
      {data.map((item, index) => (
        <React.Fragment key={item.id || index}>
          {renderItem(item, index)}
        </React.Fragment>
      ))}
    </div>
  );
};

export default GenericGridView;
