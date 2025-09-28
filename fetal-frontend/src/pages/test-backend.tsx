import { useEffect } from "react";

export default function TestBackend() {
  useEffect(() => {
    fetch("http://127.0.0.1:5000/ping")  // Make sure /ping exists in Flask
      .then(res => res.json())
      .then(data => console.log("Backend response:", data))
      .catch(err => console.error(err));
  }, []);

  return <div>Check console for backend response</div>;
}
