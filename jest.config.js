const localStorageMock = (function() {
    let store = {};
    return {
      getItem: function(key) {
        return store[key] || null;
      },
      setItem: function(key, value) {
        store[key] = value.toString();
      },
      clear: function() {
        store = {};
      },
    };
  })();
  
  if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
    });
  }
  
  module.exports = {
    transform: {
      "^.+\\.[t|j]sx?$": "babel-jest",
    },
    transformIgnorePatterns: ["/node_modules/(?!axios).+\\.js$"],
    testEnvironment: "jsdom",
    moduleNameMapper: {
      "\\.(css|less|sass|scss)$": "<rootDir>/__mocks__/styleMock.js", 
      "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js"
    },
  };
  