import '@testing-library/jest-dom';

// Clear sessionStorage and localStorage between tests
beforeEach(() => {
  sessionStorage.clear();
  localStorage.clear();
});

afterEach(() => {
  sessionStorage.clear();
  localStorage.clear();
});
