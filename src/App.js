function App() {
  const containerClick = () => {
    console.log("containerClick ");
  };

  const parentClick = () => {
    console.log("parentClick ");
  };

  const childClick = (e) => {
    console.log("childClick");
    e.stopPropagation();
  };

  return (
    <div onClick={containerClick}>
      containerClick
      <div className="parent" onClick={parentClick}>
        this is a parent
        <div className="child" onClick={childClick}>
          this is a child
        </div>
      </div>
    </div>
  );
}

export default App;
