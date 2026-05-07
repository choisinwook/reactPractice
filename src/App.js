import React from 'react';

function App() {
    const handleClick = () => {
        alert('팝업창이 떴어요!'); // Popup appeared!
    };

    return (
        <div>
            <h1>Welcome to My React App</h1>
            <p>This is the main application component.</p>
            <button onClick={handleClick}>클릭하세요</button>
        </div>
    );
}

export default App;