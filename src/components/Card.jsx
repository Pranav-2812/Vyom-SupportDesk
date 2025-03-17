// components/Card.js
const Card = ({ children }) => {
    return (
      <div className="bg-white w-full  shadow-md rounded-lg border border-gray-200 p-4">
        {children}
      </div>
    );
  };
  
  const CardContent = ({ children }) => {
    return <div className="p-2">{children}</div>;
  };
  
  export { Card, CardContent };
  